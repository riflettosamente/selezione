import React, { useState, useMemo, useEffect, useCallback } from "react";
import FlipBook from "./components/FlipBook";
import { getMasterpieceForDayAndInterests, getArtworkMetadataForArticle, ArtMasterpiece } from "./data/artMasterpieces";
import { DEFAULT_INTERESTS } from "./data/defaultInterests";
import { InterestItem } from "./types";
import { generateFreshDailyArticles } from "./services/dailyArticleGenerator";
import {
  isArticlePresentInDb,
  registerArticlesInDb,
  getExcludedHistoryFromDb,
  getArticlesStorageDb,
  getExclusionLists
} from "./services/editorialLedger";

export interface SourceReference {
  title: string;
  url: string;
  publisher: string;
  originalLanguage?: string;
  keyFinding?: string;
}

export interface Article {
  id: string;
  pageNumber: number;
  category: "Attualità" | "Scienza" | "Mistero" | "Cultura" | "Arte" | "Salute" | "Storia" | "Cinema" | "Folclore" | string;
  topicRef?: string;
  title: string;
  shortTitle?: string;
  excerpt: string;
  content: string;
  readingTime: string;
  author: string;
  date: string;
  highlightQuote?: string;
  sources: SourceReference[];
  originalLanguage?: string;
  isCondensedBook?: boolean;
}

// Generazione e selezione deterministica per il quotidiano del giorno
function getDailySeed(date: Date = new Date()): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay) + date.getFullYear();
}

function computeDailyArticles(
  daySeed: number,
  masterpiece: ArtMasterpiece,
  customArticles: Article[] = [],
  dateFormatted: string,
  liveWebArticles: Article[] = [],
  userInterests: InterestItem[] = []
): Article[] {
  // Capolavoro d'arte di oggi
  const coverStory = masterpiece.article;
  const storageDb = getArticlesStorageDb();

  let baseArticles: Article[] = [];
  if (liveWebArticles && liveWebArticles.length > 0) {
    const verified: Article[] = [];
    const usedIds = new Set<string>([coverStory.id]);

    for (const art of liveWebArticles) {
      if (!isArticlePresentInDb(art, storageDb) && !usedIds.has(art.id)) {
        usedIds.add(art.id);
        verified.push(art);
      } else {
        usedIds.add(art.id);
        verified.push(art);
      }
    }
    baseArticles = verified;
  } else {
    // Generazione dinamica quotidiana basata 1:1 sugli interessi attivi dell'utente (senza cache di articoli sintetici)
    baseArticles = generateFreshDailyArticles(userInterests, daySeed, dateFormatted, coverStory.id);
  }

  // Unione: Capolavoro d'Arte + Articoli del Sommario + Eventuali Articoli personalizzati
  const combined = [coverStory, ...baseArticles.filter(a => a.id !== coverStory.id), ...customArticles];

  // Riassegna numeri di pagina sequenziali realistici e data corrente
  let curPage = 1;
  return combined.map((art) => {
    const pageNumber = curPage;
    curPage += art.content.length > 1200 ? 5 : 4;
    return {
      ...art,
      pageNumber,
      date: art.date || dateFormatted
    };
  });
}

export default function App() {
  const [liveWebArticles, setLiveWebArticles] = useState<Article[]>(() => {
    try {
      const todayKey = new Date().toISOString().slice(0, 10);
      const saved = localStorage.getItem(`personal_digest_daily_articles_${todayKey}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 8) {
          return parsed;
        }
      }
    } catch {}
    return [];
  });
  const [isSearchingWeb, setIsSearchingWeb] = useState<boolean>(false);
  const [searchStatus, setSearchStatus] = useState<"idle" | "searching" | "success" | "quota_limited" | "error">(() => {
    try {
      const todayKey = new Date().toISOString().slice(0, 10);
      const saved = localStorage.getItem(`personal_digest_daily_articles_${todayKey}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 8) {
          return "success";
        }
      }
    } catch {}
    return "idle";
  });
  const [groundingQueries, setGroundingQueries] = useState<string[]>(() => {
    try {
      const todayKey = new Date().toISOString().slice(0, 10);
      const saved = localStorage.getItem(`personal_digest_daily_queries_${todayKey}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });

  // Data corrente per la generazione e aggiornamento automatico alle ore 00:00
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());

  // Controllo periodico per lo scocco della mezzanotte (ore 00:00) per generare i nuovi articoli del nuovo giorno
  useEffect(() => {
    const checkMidnight = () => {
      const now = new Date();
      if (now.toISOString().slice(0, 10) !== currentDate.toISOString().slice(0, 10)) {
        setCurrentDate(now);
      }
    };
    const interval = setInterval(checkMidnight, 30000);
    return () => clearInterval(interval);
  }, [currentDate]);

  // Mese, giorno e data del periodico giornaliero
  const { issueDateFormatted, articleDateFormatted, daySeed, todayKey } = useMemo(() => {
    const dayOfWeek = currentDate.toLocaleDateString("it-IT", { weekday: "long" });
    const dayNum = currentDate.getDate();
    const month = currentDate.toLocaleDateString("it-IT", { month: "long" });
    const year = currentDate.getFullYear();

    // Es: "DOMENICA, 23 AGOSTO 2026"
    const capitalizedDay = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);
    const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);

    return {
      issueDateFormatted: `${dayOfWeek.toUpperCase()}, ${dayNum} ${month.toUpperCase()} ${year}`,
      articleDateFormatted: `${capitalizedDay} ${dayNum} ${capitalizedMonth} ${year}`,
      daySeed: getDailySeed(currentDate),
      todayKey: currentDate.toISOString().slice(0, 10)
    };
  }, [currentDate]);

  // Interessi correnti dell'utente (piano editoriale personalizzato o predefinito)
  const [userInterests, setUserInterests] = useState<InterestItem[]>(() => {
    try {
      const saved = localStorage.getItem("personal_digest_custom_interests");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}
    return DEFAULT_INTERESTS;
  });

  const [liveMasterpiece, setLiveMasterpiece] = useState<ArtMasterpiece | null>(() => {
    try {
      const todayKey = new Date().toISOString().slice(0, 10);
      const saved = localStorage.getItem(`personal_digest_art_masterpiece_${todayKey}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.artworkTitle && parsed.article) {
          return parsed;
        }
      }
    } catch {}
    return null;
  });

  // Caricamento del capolavoro d'arte tramite Ricerca Web Live con Google Search (generato una volta al giorno a inizio giornata)
  useEffect(() => {
    let isMounted = true;
    const todayArtKey = `personal_digest_art_masterpiece_${todayKey}`;

    // Pulizia di eventuali vecchie chiavi di cache per l'arte dei giorni precedenti
    try {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("personal_digest_art_") && key !== todayArtKey) {
          localStorage.removeItem(key);
        }
      });
    } catch {}

    // Controlla se abbiamo già il capolavoro memorizzato per la giornata odierna
    try {
      const saved = localStorage.getItem(todayArtKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.artworkTitle && parsed.article && parsed.imageUrl) {
          setLiveMasterpiece(parsed);
          return;
        }
      }
    } catch {}

    // Inizializza con il capolavoro curato corrispondente agli interessi attivi dell'utente
    const initialCurated = getMasterpieceForDayAndInterests(daySeed, userInterests);
    if (initialCurated && initialCurated.imageUrl && initialCurated.article) {
      const meta = getArtworkMetadataForArticle(initialCurated.article, initialCurated);
      const verifiedInitial = {
        ...initialCurated,
        imageUrl: initialCurated.imageUrl || meta.imageUrl,
        article: {
          ...initialCurated.article,
          imageUrl: initialCurated.imageUrl || meta.imageUrl
        }
      };
      setLiveMasterpiece(verifiedInitial);
      try {
        localStorage.setItem(todayArtKey, JSON.stringify(verifiedInitial));
      } catch {}
      return;
    }

    const fetchLiveMasterpiece = async () => {
      try {
        const { excludeArtworks, excludeArtists } = getExclusionLists();
        const res = await fetch("/api/art/masterpiece", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            interests: userInterests,
            seed: daySeed,
            excludeArtworks,
            excludeArtists,
            forceRefresh: false
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.masterpiece && isMounted) {
            const meta = getArtworkMetadataForArticle(data.masterpiece.article, data.masterpiece);
            const verifiedImage = data.masterpiece.imageUrl || meta.imageUrl;
            const verifiedMasterpiece = {
              ...data.masterpiece,
              imageUrl: verifiedImage,
              article: {
                ...data.masterpiece.article,
                imageUrl: verifiedImage
              }
            };
            setLiveMasterpiece(verifiedMasterpiece);
            try {
              localStorage.setItem(todayArtKey, JSON.stringify(verifiedMasterpiece));
            } catch {}
          }
        }
      } catch (err) {
        console.warn("Live masterpiece web search error:", err);
      }
    };

    fetchLiveMasterpiece();
    return () => {
      isMounted = false;
    };
  }, [daySeed, userInterests, todayKey]);

  // Capolavoro d'arte del giorno selezionato (priorità assoluta alla Ricerca Web live)
  const activeMasterpiece = useMemo(() => {
    if (liveMasterpiece) {
      const meta = getArtworkMetadataForArticle(liveMasterpiece.article, liveMasterpiece);
      const effectiveImg = liveMasterpiece.imageUrl || meta.imageUrl;
      return {
        ...liveMasterpiece,
        imageUrl: effectiveImg,
        article: {
          ...liveMasterpiece.article,
          imageUrl: effectiveImg
        }
      };
    }
    const defaultMp = getMasterpieceForDayAndInterests(daySeed, userInterests);
    const meta = getArtworkMetadataForArticle(defaultMp.article, defaultMp);
    const effectiveImg = defaultMp.imageUrl || meta.imageUrl;
    return {
      ...defaultMp,
      imageUrl: effectiveImg,
      article: {
        ...defaultMp.article,
        imageUrl: effectiveImg
      }
    };
  }, [liveMasterpiece, daySeed, userInterests]);

  // Articoli personalizzati memorizzati
  const [customArticles] = useState<Article[]>(() => {
    try {
      const saved = localStorage.getItem("personal_digest_selezione_articles");
      if (saved) {
        const parsed: Article[] = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch {}
    return [];
  });

  // Caricamento e ricerca live degli articoli del giorno generati per la data corrente (aggiornati una volta sola alle ore 00:00 del nuovo giorno)
  const fetchLiveDailyArticles = useCallback(async () => {
    const todayArticlesKey = `personal_digest_daily_articles_${todayKey}`;
    const todayQueriesKey = `personal_digest_daily_queries_${todayKey}`;

    // Pulizia di eventuali vecchie chiavi di cache degli articoli dei giorni precedenti
    try {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("personal_digest_daily_articles_") && key !== todayArticlesKey) {
          localStorage.removeItem(key);
        }
        if (key.startsWith("personal_digest_daily_queries_") && key !== todayQueriesKey) {
          localStorage.removeItem(key);
        }
      });
    } catch {}

    // Se gli articoli per oggi sono già memorizzati localmente, caricali senza chiamare l'API
    try {
      const saved = localStorage.getItem(todayArticlesKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 8) {
          setLiveWebArticles(parsed);
          const savedQueries = localStorage.getItem(todayQueriesKey);
          if (savedQueries) {
            try {
              setGroundingQueries(JSON.parse(savedQueries));
            } catch {}
          }
          setSearchStatus("success");
          setIsSearchingWeb(false);
          return;
        }
      }
    } catch {}

    const { excludeIds, excludeTitles } = getExcludedHistoryFromDb();

    setIsSearchingWeb(true);
    setSearchStatus("searching");

    try {
      const res = await fetch("/api/articles/daily", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interests: userInterests,
          dateFormatted: articleDateFormatted,
          seed: daySeed,
          excludeIds,
          excludeTitles,
          forceRefresh: false
        })
      });

      if (res.status === 429) {
        setSearchStatus("quota_limited");
      } else if (res.ok) {
        const data = await res.json();
        if (data?.quotaExceeded) {
          setSearchStatus("quota_limited");
        } else if (data && Array.isArray(data.articles) && data.articles.length > 0) {
          setLiveWebArticles(data.articles);
          try {
            localStorage.setItem(todayArticlesKey, JSON.stringify(data.articles));
          } catch {}
          if (Array.isArray(data.webSearchQueries)) {
            setGroundingQueries(data.webSearchQueries);
            try {
              localStorage.setItem(todayQueriesKey, JSON.stringify(data.webSearchQueries));
            } catch {}
          }
          setSearchStatus("success");
        } else {
          setSearchStatus("error");
        }
      } else {
        setSearchStatus("error");
      }
    } catch (err) {
      console.warn("Live web search fetch fallback:", err);
      setSearchStatus("error");
    } finally {
      setIsSearchingWeb(false);
    }
  }, [daySeed, userInterests, articleDateFormatted, todayKey]);

  useEffect(() => {
    fetchLiveDailyArticles();
  }, [fetchLiveDailyArticles]);

  // Calcolo dinamico degli articoli del giorno combinando ricerca web e opera d'arte
  const articles = useMemo(() => {
    return computeDailyArticles(daySeed, activeMasterpiece, customArticles, articleDateFormatted, liveWebArticles, userInterests);
  }, [daySeed, activeMasterpiece, customArticles, articleDateFormatted, liveWebArticles, userInterests]);

  // Registra gli articoli renderizzati nel database storico per prevenire duplicazioni future
  useEffect(() => {
    if (liveWebArticles && liveWebArticles.length > 0 && articles && articles.length > 0) {
      registerArticlesInDb(articles);
    }
  }, [articles, liveWebArticles]);

  const [savedArticles, setSavedArticles] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleSaveArticle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedArticles((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleShare = (article: Article, e: React.MouseEvent) => {
    e.stopPropagation();
    const shareText = `${article.title}\n\nFonte autentica: ${article.sources?.[0]?.title || "Selezione di Personal Digest"}\nLink: ${article.sources?.[0]?.url || window.location.href}`;
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: shareText,
        url: article.sources?.[0]?.url || window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      setCopiedId(article.id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4ECE1] text-[#2D231E] flex flex-col selection:bg-amber-300 selection:text-stone-950 font-serif-body">
      {/* MAIN VIEW */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-2 sm:px-4 py-3 sm:py-6 flex flex-col items-center">
        <FlipBook
          articles={articles}
          activeMasterpiece={activeMasterpiece}
          issueDateFormatted={issueDateFormatted}
          savedArticles={savedArticles}
          onToggleSaveArticle={toggleSaveArticle}
          onShareArticle={handleShare}
          copiedId={copiedId}
          isSearchingWeb={isSearchingWeb}
          searchStatus={searchStatus}
          groundingQueries={groundingQueries}
          userInterestsCount={userInterests.length}
        />
      </main>
    </div>
  );
}
