import React, { useState, useEffect, useRef, useMemo } from "react";
import { Article } from "../App";
import { RecommendedBook, DailyWord, InterestItem } from "../types";
import { DEFAULT_INTERESTS } from "../data/defaultInterests";
import {
  ArtMasterpiece,
  getMasterpieceForDayAndInterests,
  getArtworkMetadataForArticle,
  getProxiedImageUrl,
  ArtworkMetadata
} from "../data/artMasterpieces";
import { DEFAULT_DAILY_WORDS } from "../data/dailyWords";
import { getExclusionLists, recordIssueInLedger } from "../services/editorialLedger";
import botticelliImage from "../assets/images/botticelli_magi_1787416919816.jpg";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ExternalLink,
  Globe,
  Share2,
  Bookmark,
  Check,
  Maximize,
  Minimize,
  BookOpen,
  BookMarked,
  Sparkles,
  Lightbulb,
  Sliders,
  ListOrdered,
  Palette
} from "lucide-react";

// Helper per pulire e formattare il testo degli articoli (rimozione ###, sottotitoli e grassetti)
const renderFormattedText = (text: string): React.ReactNode[] => {
  if (!text) return [];
  const clean = text.replace(/^#+\s*/, "").trim();
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(clean)) !== null) {
    if (match.index > lastIndex) {
      parts.push(clean.substring(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith("**") && token.endsWith("**")) {
      parts.push(
        <strong key={match.index} className="font-bold text-[#1F1713]">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("*") && token.endsWith("*")) {
      parts.push(
        <em key={match.index} className="italic">
          {token.slice(1, -1)}
        </em>
      );
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < clean.length) {
    parts.push(clean.substring(lastIndex));
  }

  return parts.length > 0 ? parts : [clean];
};

interface FlipBookProps {
  articles: Article[];
  activeMasterpiece?: ArtMasterpiece;
  issueDateFormatted: string;
  savedArticles: string[];
  onToggleSaveArticle: (id: string, e: React.MouseEvent) => void;
  onShareArticle: (article: Article, e: React.MouseEvent) => void;
  copiedId: string | null;
  isSearchingWeb?: boolean;
  searchStatus?: "idle" | "searching" | "success" | "quota_limited" | "error";
  groundingQueries?: string[];
  onOpenEditorialTopics?: () => void;
  userInterestsCount?: number;
}

const DEFAULT_RECOMMENDED_BOOKS: RecommendedBook[] = [
  {
    title: "L'ordine del tempo",
    author: "Carlo Rovelli",
    year: "2017",
    publisher: "Adelphi (Piccola Biblioteca)",
    category: "Frontiere della Fisica & Cosmo",
    matchingTopic: "Fisica quantistica, multiverso e anomalie nello spaziotempo",
    synopsis: "Il tempo non è una grandezza immutabile e universale che scandisce i secondi allo stesso ritmo in ogni angolo del cosmo: scorre più veloce in cima a una montagna rispetto alla pianura, rallenta in prossimità di grandi masse gravitazionali e, scendendo alla scala infinitesimale di Planck (10⁻³⁵ metri), cessa completamente di esistere. In questo celebre saggio, Carlo Rovelli — tra i fondatori della teoria della gravità quantistica a loop — guida il lettore attraverso una radicale decostruzione del nostro concetto intuitivo di tempo, mostrando come le nozioni di 'presente', 'passato' e 'futuro' siano proprietà puramente locali ed emergenti, legate all'entropia di Boltzmann e alla nostra prospettiva macroscopica approssimata sulla realtà.\n\nAttraverso una prosa di rara eleganza letteraria che intreccia la fisica teorica di Einstein e Dirac con la filosofia classica di Anassimandro e le 'Confessioni' di Agostino, Rovelli smonta il mito del tempo newtoniano come contenitore vuoto. Il mondo non è fatto di sostanze o oggetti statici che permangono immutati nel tempo, ma di 'eventi' e 'relazioni' che accadono e si trasformano reciprocamente. La gravità quantistica descrive lo spazio non come una griglia continua, ma come un reticolo discreto di 'quanti di spazio' intrecciati tra loro in una dinamica senza tempo fondamentale.\n\nL'opera culmina in una toccante riflessione sulla condizione umana e sull'origine della nostra memoria: noi siamo esseri temporali proprio perché la nostra percezione è imperfetta e filtrata dallo scambio termico. Rovelli restituisce alla fisica la sua dimensione profondamente umanistica, ricordandoci che la ricerca delle leggi fondamentali dell'universo non spegne la meraviglia per il mistero dell'esistenza, ma la rende ancora più luminosa e consapevole.",
    whyRecommended: "Rovelli offre una sintesi insuperata tra rigore matematico d'avanguardia e profondità filosofica, rendendo accessibili i concetti più vertiginosi della gravità a loop e della struttura dello spaziotempo.",
    highlightQuote: "«Le cose sono fatte di eventi che accadono. Il mondo non è fatto di sassi, è fatto di baci; o di incontri tra cose.»",
    readingTime: "5 min (estratto)",
    pagesCount: "208 pagine"
  },
  {
    title: "Il mistero di Göbekli Tepe",
    author: "Andrew Collins",
    year: "2015",
    publisher: "Corbaccio / Newton Compton",
    category: "Archeologia Misteriosa",
    matchingTopic: "Megaliti, strutture sommerse e civiltà antiche antidiluviane",
    synopsis: "Nel 9.500 a.C., mentre i ghiacciai dell'era pleistocenica si ritiravano faticosamente dall'Europa e l'umanità viveva ancora dispersa in piccoli gruppi nomadi di cacciatori e raccoglitori, sull'altopiano anatolico di Şanlıurfa sorgeva Göbekli Tepe: un ciclopico santuario composto da oltre venti recinti circolari con pilastri monolitici a T pesanti fino a venti tonnellate, riccamente scolpiti con figure zoomorfe di leoni, serpenti, scorpioni e avvoltoi. Il saggio di Andrew Collins ripercorre la genesi di questa scoperta epocale, guidando il lettore tra gli scavi di Klaus Schmidt e le implicazioni rivoluzionarie che hanno scosso l'intera comunità archeologica internazionale.\n\nIl cuore dell'indagine di Collins si concentra sulle analisi archeoastronomiche del complesso e sul suo orientamento verso la costellazione del Cigno e la stella Deneb, punto nodale che nelle mitologie sciamaniche eurasiatiche rappresentava la 'porta celeste' attraverso cui le anime dei defunti viaggiavano verso l'aldilà. L'autore esplora il ruolo dei misteriosi costruttori del Neolitico Pre-Ceramico, mettendo a confronto i reperti anatolici con le memorie ancestrali dei 'Guardiani' e degli 'Shining Ones' tramandate dai primi testi sumeri e dal Libro di Enoch.\n\nL'opera documenta in modo dettagliato come la nascita dei templi non fu la conseguenza, bensì la vera causa motrice della rivoluzione agricola. La necessità di nutrire e organizzare centinaia di lavoratori e celebranti spinse le comunità nomadi a stabilizzarsi e ad avviare i primi esperimenti di coltivazione cerealicola, trasformando Göbekli Tepe nella culla spirituale da cui germogliò l'intera civiltà moderna prima della sua enigmatica e intenzionale sepoltura avvenuta nell'8.000 a.C.",
    whyRecommended: "Un'analisi approfondita e documentata sulle civiltà perdute, il megalitismo preistorico e l'archeoastronomia dell'altopiano anatolico.",
    highlightQuote: "«Göbekli Tepe ha dimostrato che la scintilla che accese la civiltà non fu il bisogno di coltivare la terra, ma il bisogno sacro di guardare verso il cielo.»",
    readingTime: "6 min (estratto)",
    pagesCount: "432 pagine"
  },
  {
    title: "L'uomo che scambiò sua moglie per un cappello",
    author: "Oliver Sacks",
    year: "1985",
    publisher: "Adelphi",
    category: "Neuroscienze & Mente",
    matchingTopic: "Origine della coscienza, stati alterati e memoria prodigiosa",
    synopsis: "Pubblicato nel 1985 e divenuto una pietra miliare della letteratura medica e scientifica del Novecento, questo volume raccoglie ventiquattro storie cliniche straordinarie in cui Oliver Sacks — neurologo, docente e scrittore di profonda sensibilità — esplora le bizzarrie, le catastrofi e i miracoli della mente umana. Al centro del libro vi sono pazienti affetti da lesioni neurologiche complesse: uomini e donne che hanno perso la memoria recente e vivono intrappolati in un eterno presente del 1945, individui che percepiscono i propri arti come corpi estranei, o il celebre musicista 'Dr. P.' che, colpito da agnosia visiva massiva, non riconosce più i volti umani e arriva a confondere la testa della propria consorte con un copricapo.\n\nLa grandezza dell'approccio di Sacks risiede nel rifiuto di trattare i pazienti come meri cataloghi di anomalie o patologie da diagnosticare. Per ogni caso clinico, l'autore indaga il dramma esistenziale e la prodigiosa capacità di resilienza dell'individuo: quando una funzione neurologica primaria collassa, il cervello umano si riorganizza attraverso vie alternative, facendo leva sulla musica, sull'arte pittorica e sull'intuizione emotiva per preservare l'integrità del proprio 'Sé'.\n\nAttraverso capitoli memorabili dedicati ai gemelli autistici capaci di calcolare istantaneamente numeri primi a sei cifre o a pazienti affetti da sindrome di Tourette dotati di prodigiosi riflessi musicali, Sacks dimostra che la coscienza non è una macchina rigida, ma una sinfonia dinamica. Un'opera fondamentale che interroga le radici stesse dell'identità personale e della percezione della realtà.",
    whyRecommended: "Un classico imprescindibile per esplorare le frontiere delle neuroscienze cliniche, l'origine della coscienza e la resilienza della percezione umana.",
    highlightQuote: "«Per essere noi stessi dobbiamo avere noi stessi: possedere, se necessario ri-possedere, la storia del nostro vissuto.»",
    readingTime: "5 min (estratto)",
    pagesCount: "318 pagine"
  },
  {
    title: "Il manoscritto Voynich: Il libro più misterioso del mondo",
    author: "Gerry Kennedy e Rob Churchill",
    year: "2006",
    publisher: "Bollati Boringhieri",
    category: "Misteri & Criptografia",
    matchingTopic: "Manoscritti indecifrati, manufatti anomali e codici storici",
    synopsis: "Custodito presso la Beinecke Rare Book and Manuscript Library dell'Università di Yale con la segnatura 'MS 408', il Manoscritto Voynich è senza dubbio il codice pergamenaceo più enigmatico e studiato della storia umana. Redatto nei primi decenni del Quattrocento (come confermato dalle datazioni al Carbonio-14 del 2009) e composto da circa duecentoquaranta pagine miniate, il volume è interamente redatto in una lingua sconosciuta o cifrario impenetrabile (denominato 'voynichese'), accompagnato da centinaia di illustrazioni dettagliate raffiguranti piante botaniche inesistenti sulla Terra, complessi diagrammi zodiacali, costellazioni non identificate e figure femminili nude immerse in strani labirinti idraulici.\n\nIl saggio di Gerry Kennedy e Rob Churchill ricostruisce con piglio investigativo la straordinaria odissea storica del manoscritto: dalla sua prima traccia accertata alla corte alchemica dell'imperatore Rodolfo II d'Asburgo a Praga nel XVI secolo, passando per la custodia del dotto gesuita Athanasius Kircher a Roma, fino alla sua riscoperta nel 1912 da parte del mercante di libri rari Wilfrid Voynich nel collegio gesuita di Villa Mondragone a Frascati.\n\nGli autori passano in rassegna i molteplici tentativi di decifrazione intrapresi nel corso di un secolo da celebri crittoanalisti militari (compreso William Friedman, decifratore dei codici segreti della Seconda Guerra Mondiale), linguisti computazionali e moderni algoritmi di intelligenza artificiale. Nessuna ipotesi — dal trattato medico medievale alla lingua artificiale proto-rinascimentale, dall'opera esoterica ermetica alla sofisticata truffa cinquecentesca — è riuscita a violare la coerenza interna della legge di Zipf che regola il testo, lasciando il codice come una sfida aperta all'ingegno umano.",
    whyRecommended: "Un'indagine rigorosa e appassionante sui manoscritti indecifrati, la crittografia storica e i misteri archivistici più impenetrabili del pianeta.",
    highlightQuote: "«Nessun libro sulla Terra è stato interrogato con tanta insistenza e con così tanti strumenti tecnologici continuando a mantenere un silenzio assoluto.»",
    readingTime: "6 min (estratto)",
    pagesCount: "350 pagine"
  },
  {
    title: "L'incredibile viaggio delle piante",
    author: "Stefano Mancuso",
    year: "2018",
    publisher: "Laterza",
    category: "Natura & Botanica",
    matchingTopic: "Adattamenti estremi e intelligenza biologica vegetale",
    synopsis: "Le piante vengono comunemente immaginate come organismi immobili, silenziosi e passivi, legati indissolubilmente al fazzoletto di terra in cui il loro seme ha trovato dimora. In questo saggio luminoso e documentato, Stefano Mancuso — professore all'Università di Firenze e pioniere riconosciuto della neurobiologia vegetale — ribalta questa prospettiva antropocentrica, svelando come il regno vegetale sia composto da esploratori formidabili e instancabili navigatori capaci di colonizzare gli ambienti più estremi del pianeta Terra, dagli atolli corallini dispersi nel Pacifico alle pareti ghiacciate delle Alpi e alle dune incandescenti del deserto sahariano.\n\nMancuso conduce il lettore attraverso storie botaniche straordinarie e verificate: dalle noci di cocco capaci di viaggiare per migliaia di chilometri sulle correnti oceaniche mantenendo intatta la propria capacità germinativa, ai semi di pino silvestre e di acacia che attendono per secoli il passaggio del fuoco per liberare la nuova generazione, fino ai muschi antartici rinvenuti sotto chilometri di calotta glaciale capaci di riprendere la fotosintesi dopo centinaia di migliaia di anni di sonno criogenico.\n\nL'opera approfondisce inoltre le stupefacenti forme di intelligenza biologica distribuita e cooperazione sotterranea: sprovviste di un cervello centrale o di singoli organi vitali la cui perdita risulterebbe letale di fronte all'attacco dei predatori, le piante elaborano informazioni con milioni di apici radicali connessi in una rete neurale vegetale (il cosiddetto 'Wood Wide Web' mediato dai funghi micorrizici). Una lettura appassionante che ci invita a riconsiderare il nostro rapporto con l'ecosistema vivente con profondo rispetto ed umiltà scientifica.",
    whyRecommended: "Un saggio straordinario sulle anomalie biologiche, l'intelligenza distribuita vegetale e gli adattamenti evolutivi più sorprendenti in natura.",
    highlightQuote: "«Senza gli occhi, le orecchie o un cervello centrale, le piante percepiscono il mondo con ogni singola cellula del proprio corpo.»",
    readingTime: "5 min (estratto)",
    pagesCount: "144 pagine"
  }
];

interface DailyPalette {
  coverBg: string;
  leftDarkBg: string;
  sommarioBg: string;
  condensedBg: string;
  footerBg: string;
  backBg: string;
}


const DAILY_PALETTES: DailyPalette[] = [
  // 0: Domenica - Carta da Zucchero / Classic Slate
  {
    coverBg: "bg-[#5B8296]",
    leftDarkBg: "bg-[#2A3B44]",
    sommarioBg: "bg-[#537A8E]/95",
    condensedBg: "bg-[#426477]/80",
    footerBg: "bg-[#1F2F37]",
    backBg: "bg-[#1C2A32]"
  },
  // 1: Lunedì - Rosso Amaranto / Vintage Carmine
  {
    coverBg: "bg-[#8C3A3A]",
    leftDarkBg: "bg-[#421919]",
    sommarioBg: "bg-[#7D3333]/95",
    condensedBg: "bg-[#652828]/80",
    footerBg: "bg-[#2E1010]",
    backBg: "bg-[#2A1212]"
  },
  // 2: Martedì - Verde Bosco Antico / Pine Vintage
  {
    coverBg: "bg-[#486B52]",
    leftDarkBg: "bg-[#223628]",
    sommarioBg: "bg-[#3F5F49]/95",
    condensedBg: "bg-[#324D3A]/80",
    footerBg: "bg-[#17271D]",
    backBg: "bg-[#15231A]"
  },
  // 3: Mercoledì - Ocra Dorata / Warm Antique Ochre
  {
    coverBg: "bg-[#8E6C36]",
    leftDarkBg: "bg-[#473416]",
    sommarioBg: "bg-[#80602F]/95",
    condensedBg: "bg-[#664C23]/80",
    footerBg: "bg-[#2E1F0B]",
    backBg: "bg-[#271908]"
  },
  // 4: Giovedì - Blu Petrolio / Midnight Blue
  {
    coverBg: "bg-[#3E5B75]",
    leftDarkBg: "bg-[#1C2C3A]",
    sommarioBg: "bg-[#365067]/95",
    condensedBg: "bg-[#293F53]/80",
    footerBg: "bg-[#14202B]",
    backBg: "bg-[#121B24]"
  },
  // 5: Venerdì - Terracotta Rustica / Burnt Sienna
  {
    coverBg: "bg-[#965842]",
    leftDarkBg: "bg-[#49281C]",
    sommarioBg: "bg-[#854D39]/95",
    condensedBg: "bg-[#6E3E2D]/80",
    footerBg: "bg-[#311910]",
    backBg: "bg-[#28140C]"
  },
  // 6: Sabato - Prugna Nobile / Royal Aubergine
  {
    coverBg: "bg-[#6E4765]",
    leftDarkBg: "bg-[#361E31]",
    sommarioBg: "bg-[#603D58]/95",
    condensedBg: "bg-[#4C2F46]/80",
    footerBg: "bg-[#241320]",
    backBg: "bg-[#1F0E1B]"
  }
];

// Struttura di ogni pagina sfogliabile
type BookPage =
  | { type: "cover" }
  | {
      type: "article";
      article: Article;
      sheetIndex: number;
      totalSheets: number;
      articleOriginalIndex: number;
      paragraphs: string[];
      hasImage?: boolean;
      hasSources?: boolean;
      highlightQuote?: string;
    }
  | { type: "word"; word: DailyWord }
  | { type: "book"; book: RecommendedBook }
  | { type: "back-cover" };

export default function FlipBook({
  articles,
  activeMasterpiece,
  issueDateFormatted,
  savedArticles,
  onToggleSaveArticle,
  onShareArticle,
  copiedId,
  isSearchingWeb = false,
  searchStatus = "idle",
  groundingQueries = [],
  onOpenEditorialTopics,
  userInterestsCount = 8
}: FlipBookProps) {
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [flipDirection, setFlipDirection] = useState<"forward" | "backward">("forward");
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Calcolo del daySeed per la selezione deterministica
  const now = new Date();
  const baseDaySeed = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const daySeed = baseDaySeed;

  // Capolavoro d'arte attivo (sincronizzato direttamente con le props da App.tsx)
  const currentMasterpiece = useMemo(() => {
    if (activeMasterpiece) return activeMasterpiece;
    let storedInterests: InterestItem[] = [];
    try {
      const raw = localStorage.getItem("personal_digest_custom_interests");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) storedInterests = parsed;
      }
    } catch {}
    return getMasterpieceForDayAndInterests(daySeed, storedInterests.length > 0 ? storedInterests : DEFAULT_INTERESTS);
  }, [activeMasterpiece, daySeed]);

  // Stato per il libro consigliato di oggi basato sugli interessi in Google Fogli
  const [recommendedBook, setRecommendedBook] = useState<RecommendedBook>(() => {
    try {
      // Pulisci vecchie cache obsolete a paragrafo singolo
      const oldKeys = Object.keys(localStorage).filter(k => k.startsWith("personal_digest_book_") && !k.startsWith("personal_digest_book_v4_"));
      oldKeys.forEach(k => localStorage.removeItem(k));

      const todayKey = `personal_digest_book_v4_${new Date().toISOString().slice(0, 10)}`;
      const saved = localStorage.getItem(todayKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.synopsis === "string" && parsed.synopsis.length > 350) {
          return parsed;
        }
      }
    } catch {}
    return DEFAULT_RECOMMENDED_BOOKS[Math.abs(daySeed) % DEFAULT_RECOMMENDED_BOOKS.length];
  });

  // Caricamento del libro consigliato tramite API
  useEffect(() => {
    let isMounted = true;
    const todayKey = `personal_digest_book_v4_${new Date().toISOString().slice(0, 10)}`;
    
    // Se è già salvato per la giornata corrente con la nuova versione approfondita, usalo
    try {
      const saved = localStorage.getItem(todayKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.synopsis === "string" && parsed.synopsis.length > 350) {
          setRecommendedBook(parsed);
          return;
        }
      }
    } catch {}

    const loadRecommendedBook = async () => {
      try {
        let storedInterests: InterestItem[] = [];
        try {
          const raw = localStorage.getItem("personal_digest_custom_interests");
          if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0) {
              storedInterests = parsed;
            }
          }
        } catch {}

        if (storedInterests.length === 0) {
          storedInterests = DEFAULT_INTERESTS;
        }

        const { excludeBooks, excludeAuthors } = getExclusionLists();

        const res = await fetch("/api/book/recommended", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            interests: storedInterests,
            excludeBooks,
            excludeAuthors,
          })
        });

        if (res.ok) {
          const data = await res.json();
          if (data && data.book && isMounted) {
            setRecommendedBook(data.book);
            try {
              localStorage.setItem(todayKey, JSON.stringify(data.book));
            } catch {}
          }
        }
      } catch (err) {
        console.warn("Could not fetch remote book recommendation, keeping curated one:", err);
      }
    };

    loadRecommendedBook();
    return () => {
      isMounted = false;
    };
  }, [daySeed]);

  // Stato per la parola del giorno (Più parole, più idee)
  const [dailyWord, setDailyWord] = useState<DailyWord>(() => {
    try {
      const todayKey = `personal_digest_word_v2_${new Date().toISOString().slice(0, 10)}`;
      const saved = localStorage.getItem(todayKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.word && parsed.definition) {
          return parsed;
        }
      }
    } catch {}
    return DEFAULT_DAILY_WORDS[Math.abs(daySeed) % DEFAULT_DAILY_WORDS.length];
  });

  // Caricamento della parola del giorno tramite API
  useEffect(() => {
    let isMounted = true;
    const todayKey = `personal_digest_word_v2_${new Date().toISOString().slice(0, 10)}`;
    try {
      const saved = localStorage.getItem(todayKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.word && parsed.definition) {
          setDailyWord(parsed);
          return;
        }
      }
    } catch {}

    const loadDailyWord = async () => {
      try {
        let storedInterests: InterestItem[] = [];
        try {
          const raw = localStorage.getItem("personal_digest_custom_interests");
          if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0) storedInterests = parsed;
          }
        } catch {}

        if (storedInterests.length === 0) {
          storedInterests = DEFAULT_INTERESTS;
        }

        const { excludeWords } = getExclusionLists();

        const res = await fetch("/api/word/daily", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            interests: storedInterests,
            excludeWords
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data && data.word && isMounted) {
            setDailyWord(data.word);
            try {
              localStorage.setItem(todayKey, JSON.stringify(data.word));
            } catch {}
          }
        }
      } catch (err) {
        console.warn("Could not fetch remote daily word, using curated default:", err);
      }
    };

    loadDailyWord();
    return () => {
      isMounted = false;
    };
  }, [daySeed]);

  // Registrazione automatica del numero corrente nel Registro Storico Editoriale
  useEffect(() => {
    if (articles && articles.length > 0) {
      recordIssueInLedger({
        date: issueDateFormatted,
        articles,
        masterpiece: currentMasterpiece ? {
          artworkTitle: currentMasterpiece.artworkTitle,
          artist: currentMasterpiece.artist,
          year: currentMasterpiece.year,
          museum: currentMasterpiece.museum,
          matchingTopic: currentMasterpiece.matchingTopic,
        } : undefined,
        book: recommendedBook ? {
          title: recommendedBook.title,
          author: recommendedBook.author,
          year: recommendedBook.year,
          category: recommendedBook.category,
        } : undefined,
        word: dailyWord ? {
          word: dailyWord.word,
          definition: dailyWord.definition,
        } : undefined,
      });
    }
  }, [articles, currentMasterpiece, recommendedBook, dailyWord, issueDateFormatted]);

  // Selezione della palette vintage e massima del giorno con aneddoto
  const { palette, dailyQuote } = useMemo(() => {
    return {
      palette: DAILY_PALETTES[Math.abs(daySeed) % DAILY_PALETTES.length],
      dailyQuote: [
        {
          quote: "«La cultura non è possedere un magazzino ben fornito di notizie, ma è la capacità che la nostra mente ha di comprendere la vita, il posto che vi teniamo, i nostri rapporti con gli altri uomini.»",
          author: "Antonio Gramsci",
          source: "Lettere e Scritti Giovanili",
          anecdoteTitle: "La genesi del 'Reader's Digest' e la rivoluzione del formato tascabile",
          anecdote: "Nel novembre del 1918, durante l'offensiva della Mosa-Argonne nella prima guerra mondiale, un giovane sergente dell'esercito americano di nome DeWitt Wallace fu gravemente ferito da schegge di shrapnel. Durante i lunghi mesi di degenza e convalescenza nell'ospedale militare di Besançon in Francia, Wallace trascorreva le sue giornate leggendo decine di riviste, quotidiani e saggi illustrati. Resosi conto di quanto tempo richiedesse reperire informazioni rilevanti sepolte in articoli prolissi, iniziò a ritagliare e condensare i passaggi chiave su piccoli cartoncini tascabili, annotando per ciascuno l'essenza narrativa e documentale.\n\nRientrato a New York nel 1921 insieme alla moglie e co-fondatrice Lila Bell Acheson, Wallace tentò invano di proporre il progetto di un periodico di 'letture selezionate e condensate' ai grandi editori di Manhattan, venendo respinto con scetticismo. Senza perdersi d'animo, la coppia affittò una stanza nel seminterrato di una taverna clandestina (speakeasy) a Greenwich Village e, con una modesta macchina da scrivere e un capitale iniziale di poche centinaia di dollari raccolti tramite lettere di sottoscrizione postale, pubblicò nel febbraio 1922 il primo numero del 'Reader's Digest'.\n\nLa rivista — stampata nel caratteristico formato compatto tascabile, privo di pubblicità e impreziosito da sommari cromatici ed eleganti massime morali — divenne in pochi decenni un fenomeno editoriale planetario senza precedenti, tradotta in oltre venticinque lingue e letta da più di settanta milioni di lettori in ogni continente, dimostrando il valore universale della sintesi culturale e della divulgazione accessibile."
        },
        {
          quote: "«Considerate la vostra semenza: fatti non foste a viver come bruti, ma per seguir virtute e canoscenza.»",
          author: "Dante Alighieri",
          source: "Divina Commedia, Inferno XXVI (Il Canto di Ulisse)",
          anecdoteTitle: "La scoperta fortuita della penicillina e la nascita degli antibiotici",
          anecdote: "Nel settembre del 1928, il medico e microbiologo scozzese Alexander Fleming fece ritorno nel suo laboratorio al St. Mary's Hospital di Londra dopo una vacanza estiva trascorsa con la famiglia nelle campagne del Suffolk. Prima di partire, Fleming aveva inoculato diverse piastre di Petri con colonie del batterio Staphylococcus aureus, lasciandole disposte su un banco da lavoro vicino a una finestra rimasta socchiusa.\n\nNell'esaminare le colture prima di procedere al lavaggio dei vetrini con disinfettante, lo scienziato notò un dettaglio insolito che avrebbe cambiato il destino della medicina: in una delle piastre, una muffa aerea contaminante di colore verde-azzurrognolo (in seguito identificata come Penicillium notatum) aveva iniziato a proliferare. Intorno al fungo, le colonie batteriche che prima prosperavano apparivano completamente dissolte e trasparenti, come distrutte da una sostanza letale secreta dal microrganismo.\n\nInvece di gettare la piastra contaminata come un banale errore di laboratorio, Fleming isolò il fungo e battezzò il suo principio attivo 'penicillina'. Negli anni Quaranta, grazie agli ulteriori studi di Howard Florey ed Ernst Chain a Oxford, la penicillina fu purificata e prodotta su scala industriale, salvando milioni di vite umane durante e dopo la seconda guerra mondiale e aprendo ufficialmente l'era della terapia antibiotica moderna."
        },
        {
          quote: "«Imparare senza pensare è fatica perduta; pensare senza imparare è pericoloso.»",
          author: "Confucio",
          source: "Dialoghi (Lunyu, Libro II)",
          anecdoteTitle: "Le leggendarie 'Pack Horse Librarians' dei monti Appalachi",
          anecdote: "Nel 1935, durante gli anni più bui della Grande Depressione americana, il presidente Franklin D. Roosevelt e la First Lady Eleanor istituirono all'interno della Works Progress Administration un programma pionieristico e audace: il 'Pack Horse Library Project'. Nelle remote e isolate valli delle montagne del Kentucky orientale, dove l'analfabetismo superava il 30% e non esistevano strade carrabili, decine di coraggiose donne bibliotecarie furono assunte per recapitare libri, riviste e raccolte di racconti a cavallo e a dorso di mulo.\n\nSfidando bufere di neve invernali, torrenti in piena e sentieri rocciosi a strapiombo percorsi per oltre trenta chilometri al giorno con bisacce piene di volumi rilegati a mano con stoffe riciclate, le 'Book Ladies' raggiungevano capanne di boscaioli, villaggi minerari e minuscole scuole rurali arroccate sui monti. Se un libro era logorato o danneggiato, le bibliotecarie ritagliavano illustrazioni, ricette e articoli per assemblare nuovi quaderni di lettura illustrati.\n\nIl progetto, attivo fino al 1943, arrivò a servire oltre centomila residenti montani, creando un legame indissolubile tra comunità isolate e l'amore per la lettura e l'istruzione, e rimanendo nella storia dell'alfabetizzazione come uno dei più straordinari esempi di dedizione civile ed emancipazione culturale."
        },
        {
          quote: "«Sapere è potere. Ma sapere dove trovare la conoscenza quando serve, e avere la curiosità di collegarla, è la vera saggezza.»",
          author: "Albert Einstein",
          source: "Pensieri, Idee e Opinioni",
          anecdoteTitle: "Il violino 'Lina' e le intuizioni matematiche della Relatività",
          anecdote: "Pochi sanno che per tutta la sua vita Albert Einstein considerò la musica non un semplice passatempo ricreativo, ma una componente organica e indispensabile del suo stesso processo creativo e del suo pensiero scientifico. Iniziato allo studio del violino all'età di sei anni dalla madre Pauline Koch, Einstein si innamorò perdutamente delle partiture di Wolfgang Amadeus Mozart e delle sonate di Johann Sebastian Bach, portando sempre con sé la sua preziosa custodia contenente il violino che aveva affettuosamente ribattezzato 'Lina'.\n\nDurante gli anni cruciali di Zurigo e Berlino tra il 1905 e il 1915, quando si trovava di fronte a vicoli ciechi nei complessi calcoli tensoriali necessari per formulare la Relatività Generale, Einstein interrompeva bruscamente il lavoro alla scrivania, prendeva il violino e si ritirava in cucina o nel suo studio a improvvisare accordi per ore. Sua sorella Maja e la seconda moglie Elsa raccontavano che, spesso, nel bel mezzo di una cadenza musicale, il fisico si fermava all'improvviso, esclamando a gran voce: «Adesso ho capito!».\n\nEinstein spiegò più volte ai suoi colleghi che la struttura armonica della musica classica e la bellezza geometrica delle equazioni dell'universo scaturivano dalla medesima sorgente di armonia naturale: «Se non fossi stato un fisico, sarei probabilmente stato un musicista. Penso spesso in termini musicali, vivo i miei sogni a occhi aperti nella musica e vedo la mia vita scandita dalle leggi dell'armonia sonora»."
        },
        {
          quote: "«Non c'è sollievo più grande che trovare in un libro le parole esatte per ciò che sentivamo dentro di noi, ma non sapevamo ancora nominare.»",
          author: "Virginia Woolf",
          source: "Saggi Letterari e Diari Intimi",
          anecdoteTitle: "La tipografia artigianale sul tavolo della 'Hogarth Press'",
          anecdote: "Nel marzo del 1917, desiderosi di conquistare una totale libertà espressiva lontana dai condizionamenti e dalle censure degli editori commerciali londinesi, Virginia Woolf e suo marito Leonard si recarono in una bottega di macchinari usati a Farringdon Street e acquistarono per diciannove sterline una piccola macchina tipografica manuale in ghisa e alcuni cassetti di caratteri mobili in piombo (font Caslon Old Face).\n\nMontata la pressa direttamente sul tavolo della sala da pranzo della loro residenza di Hogarth House a Richmond, la coppia imparò da autodidatta i segreti dell'arte tipografica: comporre a mano riga per riga con il compositoio di metallo, inchiostrare i rulli, stendere la carta umida e girare la leva di pressione a mano. Lavorando ogni pomeriggio tra fumi d'inchiostro e fogli stesi ad asciugare su fili di spago sopra il camino, fondarono la celebre casa editrice indipendente 'Hogarth Press'.\n\nDalla loro modesta bottega domestica uscirono non solo le prime edizioni di capolavori immortali della stessa Virginia (come 'La signora Dalloway' e 'Gita al faro'), ma anche la prima edizione in lingua inglese de 'La terra desolata' (The Waste Land) di T.S. Eliot e le prime traduzioni storiche delle opere psicoanalitiche di Sigmund Freud, dimostrando come l'artigianato editoriale indipendente possa cambiare il corso della letteratura mondiale."
        },
        {
          quote: "«Un giorno senza aver appreso qualcosa di nuovo, o senza aver scrutato la natura con occhi attenti, è un giorno non pienamente vissuto.»",
          author: "Leonardo da Vinci",
          source: "Codice Atlantico (Fogli di Botanica e Meccanica)",
          anecdoteTitle: "I taccuini di pergamena sempre legati alla cintura",
          anecdote: "Nel corso della sua intera esistenza, da giovane apprendista nella bottega fiorentina di Andrea del Verrocchio fino agli ultimi anni trascorsi nel castello di Clos-Lucé ad Amboise alla corte di Francesco I, Leonardo da Vinci non usciva mai di casa senza portare legato alla cintura un piccolo libretto di pergamena rigata, munito di una punta metallica d'argento e di boccette d'inchiostro protette da cuoio.\n\nOgni qualvolta camminava per i mercati o lungo gli argini dell'Arno, Leonardo si arrestava di colpo per immortalare un dettaglio: l'insolita smorfia di un viandante arrabbiato, i vortici spiraliformi creati dall'acqua attorno a un pilastro di ponte, le nervature di una foglia di quercia o il battito asimmetrico delle ali di una libellula in volo. Se il soggetto era in movimento, lo schizzava rapidamente a carboncino, aggiungendo poi ai margini le sue famose annotazioni in scrittura speculare destrorsa (da destra a sinistra).\n\nQuesti quaderni tascabili — confluiti in seguito nei celebri codici manoscritti come il Codice Atlantico, il Codice Arundel e il Codice Leicester — testimoniano che il genio universale di Leonardo non fu un dono passivo, ma il frutto di una disciplina quotidiana e maniacale dell'osservazione visiva e della sete insaziabile di comprendere i meccanismi nascosti della realtà."
        },
        {
          quote: "«La curiosità è una delle forme più certe e generose del coraggio umano: chi è curioso non teme di rimettere in discussione le proprie certezze.»",
          author: "Italo Calvino",
          source: "Lezioni Americane: Sei proposte per il prossimo millennio",
          anecdoteTitle: "I messaggi segreti e l'arte degli inchiostri simpatici nel Rinascimento",
          anecdote: "Nel corso del Cinquecento e del Seicento, durante le turbolente guerre di religione e le fitte trame diplomatiche tra le corti di Venezia, Roma, Londra e Parigi, studiosi, alchimisti e ambasciatori svilupparono raffinate tecniche di steganografia per proteggere trattati scientifici e corrispondenze confidenziali dagli occhi dei censori e delle spie di corte.\n\nUno dei metodi più celebri e diffusi faceva uso degli 'inchiostri simpatici' o invisibili, formulati combinando sostanze naturali apparentemente innocue: succo di limone fresco, allume di rocca, latte di fico o soluzioni di solfato di ferro. Gli scrivani vergavano lettere commerciali di facciata in comune inchiostro nero di noce di galla e, tra le righe o sul retro della pergamena, tracciavano il vero messaggio segreto con una penna d'oca intinta nel liquido trasparente, che una volta asciutto risultava completamente invisibile a occhio nudo.\n\nIl destinatario, informato del codice tramite un canale separato, doveva semplicemente avvicinare con estrema delicatezza il foglio alla fiamma di una candela o strofinarlo con una tintura reattiva di acido tannico: per effetto del calore e dell'ossidazione termica, le parole invisibili riaffioravano miracolosamente sul supporto cartaceo con un nitido colore bruno-dorato, custodendo il segreto fino alla fine del viaggio."
        }
      ][Math.abs(daySeed) % 7]
    };
  }, [daySeed]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      const el = containerRef.current || document.documentElement;
      if (el.requestFullscreen) {
        el.requestFullscreen().catch(() => {});
      } else if ((el as any).webkitRequestFullscreen) {
        (el as any).webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Divide ciascun articolo in singoli fogli discreti se lungo
  const pages: BookPage[] = useMemo(() => {
    const list: BookPage[] = [];

    // Pagina 0: Copertina
    list.push({ type: "cover" });

    // Fogli degli Articoli (escludendo eventuali rubriche speciali che hanno pagina propria)
    const validStoryArticles = articles.filter(
      (art) =>
        !art.id?.toLowerCase().includes("piu-parole") &&
        !art.id?.toLowerCase().includes("parola-giorno") &&
        !art.title?.toLowerCase().includes("più parole, più idee") &&
        !art.title?.toLowerCase().includes("piu parole, piu idee")
    );

    validStoryArticles.forEach((art, artIdx) => {
      const rawContent = art.content || "";
      const normalizedContent = rawContent
        .replace(/([^\n])\n(###?\s+)/g, "$1\n\n$2")
        .replace(/(###?\s+[^\n]+)\n([^\n])/g, "$1\n\n$2");
      const allParagraphs = normalizedContent.split("\n\n").filter((p) => p.trim().length > 0);
      const isMasterpiece =
        art.category === "Arte" ||
        art.category === "Arte & Ispirazione" ||
        art.category?.toLowerCase().includes("arte") ||
        art.category?.toLowerCase().includes("ispirazione") ||
        art.id === currentMasterpiece.id ||
        art.id === currentMasterpiece.article?.id ||
        art.id?.startsWith("arte-ispirazione") ||
        art.id?.startsWith("capolavori-") ||
        artIdx === 0;

      // Calcola quanti paragrafi mettere per foglio affinché ogni foglio stia comodamente al centro
      // Foglio 1 include testata, titolo, autore, eventuale immagine/citazione e 2-3 paragrafi
      // I fogli successivi contengono il continuo dei paragrafi e l'eventuale box fonti
      if (allParagraphs.length <= 3 && !isMasterpiece) {
        // Articolo compatto in un unico foglio
        list.push({
          type: "article",
          article: art,
          sheetIndex: 1,
          totalSheets: 1,
          articleOriginalIndex: artIdx,
          paragraphs: allParagraphs,
          hasImage: false,
          hasSources: true,
          highlightQuote: art.highlightQuote
        });
      } else {
        // Articolo multipagina (2 o più fogli)
        const firstSheetPars = isMasterpiece ? allParagraphs.slice(0, 2) : allParagraphs.slice(0, 3);
        const remainingPars = isMasterpiece ? allParagraphs.slice(2) : allParagraphs.slice(3);

        const subChunks: string[][] = [];
        for (let i = 0; i < remainingPars.length; i += 3) {
          subChunks.push(remainingPars.slice(i, i + 3));
        }

        const totalSheets = 1 + Math.max(1, subChunks.length);

        // Primo foglio
        list.push({
          type: "article",
          article: art,
          sheetIndex: 1,
          totalSheets: totalSheets,
          articleOriginalIndex: artIdx,
          paragraphs: firstSheetPars,
          hasImage: isMasterpiece,
          hasSources: subChunks.length === 0,
          highlightQuote: art.highlightQuote
        });

        // Fogli di continuazione
        if (subChunks.length === 0) {
          list.push({
            type: "article",
            article: art,
            sheetIndex: 2,
            totalSheets: 2,
            articleOriginalIndex: artIdx,
            paragraphs: [],
            hasImage: false,
            hasSources: true
          });
        } else {
          subChunks.forEach((chunk, cIdx) => {
            const isLastChunk = cIdx === subChunks.length - 1;
            list.push({
              type: "article",
              article: art,
              sheetIndex: 2 + cIdx,
              totalSheets: totalSheets,
              articleOriginalIndex: artIdx,
              paragraphs: chunk,
              hasImage: false,
              hasSources: isLastChunk
            });
          });
        }
      }
    });

    // Pagina speciale: Più Parole, Più Idee (La Parola del Giorno)
    list.push({ type: "word", word: dailyWord });

    // Pagina speciale: Il Libro Consigliato di Oggi
    list.push({ type: "book", book: recommendedBook });

    // Pagina finale: Retro Copertina
    list.push({ type: "back-cover" });

    return list;
  }, [articles, currentMasterpiece, dailyWord, recommendedBook]);

  const totalPages = pages.length;

  // Calcolo della pagina della Parola del Giorno
  const wordPageNumber = useMemo(() => {
    const idx = pages.findIndex((p) => p.type === "word");
    return idx !== -1 ? idx : totalPages - 3;
  }, [pages, totalPages]);

  // Calcolo della pagina del libro consigliato
  const bookPageNumber = useMemo(() => {
    const idx = pages.findIndex((p) => p.type === "book");
    return idx !== -1 ? idx : totalPages - 2;
  }, [pages, totalPages]);

  // Calcolo delle pagine effettive per ciascun articolo (Copertina/Sommario = Pagina 0)
  const articlePageMap = useMemo(() => {
    const map: Record<string, number> = {};
    pages.forEach((page, index) => {
      if (page.type === "article" && page.sheetIndex === 1) {
        map[page.article.id] = index;
      }
    });
    return map;
  }, [pages]);

  const masterpiecePageNum = useMemo(() => {
    const artPageIdx = pages.findIndex(
      (p) =>
        p.type === "article" &&
        p.sheetIndex === 1 &&
        (p.article.id === currentMasterpiece.id ||
         p.article.id === currentMasterpiece.article?.id ||
         p.article.id === activeMasterpiece?.id ||
         p.article.id === activeMasterpiece?.article?.id ||
         (currentMasterpiece.artworkTitle &&
          currentMasterpiece.artworkTitle.length > 4 &&
          p.article.title.toLowerCase().includes(currentMasterpiece.artworkTitle.toLowerCase())))
    );
    if (artPageIdx !== -1) return artPageIdx;
    return articlePageMap[currentMasterpiece.id] ?? (articlePageMap[currentMasterpiece.article?.id || ""] ?? 1);
  }, [pages, articlePageMap, currentMasterpiece, activeMasterpiece]);

  const regularArticles = useMemo(
    () =>
      articles.filter(
        (a) =>
          !a.isCondensedBook &&
          a.id !== currentMasterpiece.id &&
          a.id !== currentMasterpiece.article?.id &&
          a.id !== activeMasterpiece?.id &&
          a.id !== activeMasterpiece?.article?.id &&
          !a.id?.toLowerCase().includes("piu-parole") &&
          !a.id?.toLowerCase().includes("parola-giorno") &&
          !a.title?.toLowerCase().includes("più parole, più idee") &&
          !a.title?.toLowerCase().includes("piu parole, piu idee")
      ),
    [articles, currentMasterpiece, activeMasterpiece]
  );
  const condensedArticles = useMemo(
    () =>
      articles.filter(
        (a) =>
          a.isCondensedBook &&
          !a.id?.toLowerCase().includes("piu-parole") &&
          !a.id?.toLowerCase().includes("parola-giorno") &&
          !a.title?.toLowerCase().includes("più parole, più idee") &&
          !a.title?.toLowerCase().includes("piu parole, piu idee")
      ),
    [articles]
  );

  // Cambio pagina fluido
  const goToPage = (targetIndex: number) => {
    if (targetIndex < 0 || targetIndex >= totalPages || targetIndex === currentPageIndex || isFlipping) {
      return;
    }
    const dir = targetIndex > currentPageIndex ? "forward" : "backward";
    setFlipDirection(dir);
    setIsFlipping(true);

    setTimeout(() => {
      setCurrentPageIndex(targetIndex);
      setIsFlipping(false);
    }, 320);
  };

  const nextPage = () => {
    if (currentPageIndex < totalPages - 1 && !isFlipping) {
      goToPage(currentPageIndex + 1);
    }
  };

  const prevPage = () => {
    if (currentPageIndex > 0 && !isFlipping) {
      goToPage(currentPageIndex - 1);
    }
  };

  // Navigazione da tastiera
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        nextPage();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        prevPage();
      } else if (e.key === "Home") {
        e.preventDefault();
        goToPage(0);
      } else if (e.key === "End") {
        e.preventDefault();
        goToPage(totalPages - 1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPageIndex, isFlipping, totalPages]);

  // Touch / Swipe su smartphone e tablet con tolleranza per lo scrolling verticale
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null || touchStartY === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;

    // Triggera il cambio pagina solo se il gesto è prevalentemente orizzontale
    if (Math.abs(diffX) > 60 && Math.abs(diffX) > Math.abs(diffY) * 1.4) {
      if (diffX > 0) {
        nextPage();
      } else {
        prevPage();
      }
    }
    setTouchStartX(null);
    setTouchStartY(null);
  };

  // Gestione trascinamento con mouse (Drag-to-flip)
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [dragStartY, setDragStartY] = useState<number | null>(null);
  const [dragCurrentX, setDragCurrentX] = useState<number | null>(null);
  const [isMouseDragging, setIsMouseDragging] = useState<boolean>(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isFlipping) return;
    const target = e.target as HTMLElement;
    if (
      target.closest("button") ||
      target.closest("a") ||
      target.closest("input") ||
      target.closest("select") ||
      target.closest("textarea")
    ) {
      return;
    }
    setDragStartX(e.clientX);
    setDragStartY(e.clientY);
    setDragCurrentX(e.clientX);
    setIsMouseDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragStartX === null || dragStartY === null) return;
    const currentX = e.clientX;
    const currentY = e.clientY;
    const diffX = currentX - dragStartX;
    const diffY = currentY - dragStartY;

    if (Math.abs(diffX) > 10 && Math.abs(diffX) > Math.abs(diffY)) {
      setIsMouseDragging(true);
      setDragCurrentX(currentX);
    }
  };

  const handleMouseUp = () => {
    if (dragStartX !== null && dragCurrentX !== null && isMouseDragging) {
      const diffX = dragStartX - dragCurrentX; // Positivo = trascinato verso sinistra (pagina successiva)
      if (Math.abs(diffX) > 50) {
        if (diffX > 0) {
          nextPage();
        } else {
          prevPage();
        }
      }
    }
    setDragStartX(null);
    setDragStartY(null);
    setDragCurrentX(null);
    setIsMouseDragging(false);
  };

  // Calcolo spostamento dinamico durante il trascinamento del foglio
  const dragDeltaX = isMouseDragging && dragStartX !== null && dragCurrentX !== null ? dragCurrentX - dragStartX : 0;
  const dragRotation = Math.min(Math.max((dragDeltaX / 600) * 12, -12), 12);
  const dragTranslateX = Math.min(Math.max(dragDeltaX * 0.4, -100), 100);

  // Funzione dedicata infallibile per saltare alla pagina dell'opera d'arte / capolavoro
  const jumpToMasterpiece = () => {
    let pageIdx = pages.findIndex(
      (p) =>
        p.type === "article" &&
        p.sheetIndex === 1 &&
        (p.article.id === currentMasterpiece.id ||
         p.article.id === currentMasterpiece.article?.id ||
         p.article.id === activeMasterpiece?.id ||
         p.article.id === activeMasterpiece?.article?.id ||
         p.article.category === "Arte" ||
         p.articleOriginalIndex === 0)
    );

    if (pageIdx === -1 && masterpiecePageNum > 0 && masterpiecePageNum < totalPages) {
      pageIdx = masterpiecePageNum;
    }

    if (pageIdx === -1) {
      pageIdx = 1;
    }

    goToPage(pageIdx);
  };

  // Funzione per saltare all'articolo dal sommario o dalla copertina
  const jumpToArticle = (artId: string) => {
    if (
      artId === currentMasterpiece.id ||
      artId === currentMasterpiece.article?.id ||
      artId === activeMasterpiece?.id ||
      artId === activeMasterpiece?.article?.id ||
      artId === "arte" ||
      artId === "capolavori"
    ) {
      jumpToMasterpiece();
      return;
    }

    let pageIdx = pages.findIndex(
      (p) => p.type === "article" && p.article.id === artId && p.sheetIndex === 1
    );

    if (pageIdx === -1 && articlePageMap[artId] !== undefined) {
      pageIdx = articlePageMap[artId];
    }

    if (pageIdx === -1) {
      pageIdx = pages.findIndex(
        (p) =>
          p.type === "article" &&
          p.sheetIndex === 1 &&
          (p.article.id.includes(artId) || artId.includes(p.article.id))
      );
    }

    if (pageIdx !== -1) {
      goToPage(pageIdx);
    }
  };

  const currentPage = pages[currentPageIndex] || pages[0];

  return (
    <div
      ref={containerRef}
      className={`w-full flex flex-col items-center py-2 ${
        isFullscreen
          ? "fixed inset-0 z-50 overflow-y-auto h-screen max-h-screen bg-[#1A130E] p-2 sm:p-4 touch-pan-y"
          : "touch-pan-y"
      }`}
    >
      {/* ======================================================== */}
      {/* FOGLIO SINGOLO CENTRALE DELLA RIVISTA */}
      {/* ======================================================== */}
      <div
        className={`w-full max-w-4xl relative ${isFullscreen ? "my-auto py-2 sm:py-4" : ""}`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Frecce laterali di volta-pagina per sfogliare la rivista */}
        {currentPageIndex > 0 && (
          <button
            onClick={prevPage}
            disabled={isFlipping}
            className={`${
              isFullscreen
                ? "fixed left-1.5 sm:left-4 md:left-8"
                : "fixed left-1.5 md:absolute md:-left-12"
            } top-1/2 -translate-y-1/2 z-50 p-2 sm:p-3.5 rounded-full bg-[#2A201A]/90 hover:bg-[#8A2520] text-amber-100 shadow-xl transition-all border border-amber-300/30 hover:scale-105 cursor-pointer backdrop-blur-xs`}
            title="Gira a pagina precedente"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}

        {currentPageIndex < totalPages - 1 && (
          <button
            onClick={nextPage}
            disabled={isFlipping}
            className={`${
              isFullscreen
                ? "fixed right-1.5 sm:right-4 md:right-8"
                : "fixed right-1.5 md:absolute md:-right-12"
            } top-1/2 -translate-y-1/2 z-50 p-2 sm:p-3.5 rounded-full bg-[#2A201A]/90 hover:bg-[#8A2520] text-amber-100 shadow-xl transition-all border border-amber-300/30 hover:scale-105 cursor-pointer backdrop-blur-xs`}
            title="Gira a pagina successiva"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}

        {/* FOGLIO SINGOLO CON TEXTURE E OMBRA REALISTICA DA RIVISTA */}
        <div
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className={`relative rounded-xl border-2 border-[#3A2E26]/40 transition-all duration-300 bg-[#FCFAF5] min-h-[700px] sm:min-h-[800px] lg:min-h-[880px] flex flex-col justify-between overflow-y-auto ${
            isMouseDragging
              ? "cursor-grabbing select-none"
              : "cursor-grab"
          } ${
            isFlipping
              ? flipDirection === "forward"
                ? "translate-x-[-10px] scale-[0.98] rotate-[-1deg] shadow-lg opacity-85"
                : "translate-x-[10px] scale-[0.98] rotate-[1deg] shadow-lg opacity-85"
              : isMouseDragging
              ? ""
              : "scale-100 shadow-2xl"
          }`}
          style={{
            boxShadow: isMouseDragging
              ? "0 30px 50px -5px rgba(0, 0, 0, 0.45), inset 0 0 45px rgba(210, 195, 175, 0.35)"
              : "0 20px 35px -10px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(58, 46, 38, 0.15), inset 0 0 35px rgba(210, 195, 175, 0.25)",
            transform: isMouseDragging
              ? `translateX(${dragTranslateX}px) rotate(${dragRotation}deg) scale(0.985)`
              : undefined,
            transition: isMouseDragging ? "none" : undefined
          }}
        >
          {/* Zona Bordo Sinistro per Voltare Pagina col Mouse */}
          {currentPageIndex > 0 && (
            <div
              onClick={prevPage}
              className="absolute left-0 top-0 bottom-0 w-12 sm:w-16 z-30 cursor-pointer"
              title="Pagina precedente"
            />
          )}

          {/* Zona Bordo Destro per Voltare Pagina col Mouse */}
          {currentPageIndex < totalPages - 1 && (
            <div
              onClick={nextPage}
              className="absolute right-0 top-0 bottom-0 w-12 sm:w-16 z-30 cursor-pointer"
              title="Pagina successiva"
            />
          )}
          {/* ======================================================== */}
          {/* CASO 1: COPERTINA STORICA & SOMMARIO */}
          {/* ======================================================== */}
          {currentPage.type === "cover" && (
            <div className={`${palette.coverBg} text-white flex-1 flex flex-col justify-between animate-in fade-in duration-200 overflow-y-auto`}>
              {/* Intestazione Copertina */}
              <div className="px-6 sm:px-8 pt-6 pb-3 border-b border-white/20">
                <div className="flex justify-between items-center text-xs font-sans tracking-widest uppercase font-bold text-white/90">
                  <div className="flex items-center gap-2.5">
                    {/* Indicatore di stato discreto: verde se funzionante, giallo se in caricamento, rosso in caso di errore */}
                    <span className="relative flex h-2.5 w-2.5" title={
                      isSearchingWeb
                        ? "Ricerca e selezione articoli in corso..."
                        : searchStatus === "error"
                        ? "Errore durante la generazione"
                        : "Sistema operativo e connesso"
                    }>
                      {isSearchingWeb ? (
                        <>
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
                        </>
                      ) : searchStatus === "error" ? (
                        <>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500 shadow-xs"></span>
                        </>
                      ) : (
                        <>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 shadow-xs"></span>
                        </>
                      )}
                    </span>
                    <span className="tracking-widest">{issueDateFormatted}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <button
                      onClick={toggleFullscreen}
                      className="p-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                      title={isFullscreen ? "Esci da tutto schermo" : "Visualizza a tutto schermo"}
                    >
                      {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Testata Storica */}
                <div className="text-center my-3">
                  <h1
                    className="text-5xl sm:text-7xl font-bold tracking-tight text-white drop-shadow-md"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    Selezione
                  </h1>
                  <p className="text-base sm:text-xl italic font-serif text-white/95 tracking-wide mt-[-4px]">
                    nello stile del Reader's Digest
                  </p>
                </div>

                <div className="text-center border-t border-b border-white/30 py-1 my-1">
                  <span className="text-[11px] sm:text-xs font-sans uppercase font-bold tracking-widest text-white/95">
                    EDIZIONE GIORNALIERA &bull; IL MEGLIO DALLE RIVISTE, DAL WEB E DAI GRANDI LIBRI
                  </span>
                </div>
              </div>

              {/* Corpo della Copertina: Sinistra Opera d'Arte, Destra il Sommario */}
              <div className={`relative z-10 grid grid-cols-1 md:grid-cols-12 flex-1 ${palette.coverBg}`}>
                {/* Colonna Sinistra: Dipinto Storico Artistico */}
                <div
                  onClick={jumpToMasterpiece}
                  className={`md:col-span-5 relative ${palette.leftDarkBg} border-b md:border-b-0 md:border-r border-white/20 flex flex-col justify-between p-4 sm:p-5 overflow-hidden group cursor-pointer min-h-[260px] md:min-h-[560px]`}
                  title={isSearchingWeb ? "Selezione opera in corso..." : "Clicca per leggere l'articolo completo su quest'opera d'arte"}
                >
                  {isSearchingWeb ? (
                    /* Fase di Ricerca Live dell'Opera d'Arte: Nessuna cache o opera precedente mostrata */
                    <div className="absolute inset-0 bg-stone-900/95 flex flex-col justify-between p-5 z-20 text-white">
                      <div className="flex items-center justify-between">
                        <span className="bg-black/80 px-2.5 py-1 rounded text-[10px] uppercase tracking-wider font-sans font-bold text-amber-200 border border-amber-300/40 flex items-center gap-1.5">
                          <Palette className="w-3 h-3 text-amber-300 animate-spin" />
                          <span>Arte & Ispirazione</span>
                        </span>
                        <span className="text-[10px] font-sans text-amber-300/80 animate-pulse">
                          Ricerca Live...
                        </span>
                      </div>

                      <div className="my-auto text-center flex flex-col items-center justify-center space-y-3 px-2">
                        <div className="relative flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full border-2 border-amber-300/30 border-t-amber-300 animate-spin" />
                          <Sparkles className="w-4 h-4 text-amber-300 absolute animate-pulse" />
                        </div>
                        <div>
                          <h4 className="font-serif font-bold text-sm sm:text-base text-amber-200">
                            Selezione Opera d'Arte in Copertina...
                          </h4>
                          <p className="text-[11px] text-white/80 font-serif italic mt-1 leading-snug">
                            Ricerca nel Web dell'opera iconica e della scheda critica per l'edizione di oggi.
                          </p>
                        </div>
                      </div>

                      <div className="text-[9px] uppercase tracking-widest text-amber-300/90 font-sans font-bold text-center bg-black/50 py-1 px-2 rounded border border-amber-300/20">
                        &bull; Cache eliminata: nuova opera per oggi &bull;
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Immagine Autentica dell'Opera */}
                      {(() => {
                        const coverMeta = getArtworkMetadataForArticle(currentMasterpiece.article, currentMasterpiece);
                        const proxiedUrl = getProxiedImageUrl(coverMeta.imageUrl, coverMeta.artist, coverMeta.artworkTitle);
                        return (
                          <img
                            src={proxiedUrl}
                            alt={`${coverMeta.artist} - ${coverMeta.artworkTitle}`}
                            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              const target = e.currentTarget as HTMLImageElement;
                              const dynamicSearchProxy = `/api/art/image-proxy?artist=${encodeURIComponent(coverMeta.artist || "")}&title=${encodeURIComponent(coverMeta.artworkTitle || "")}`;
                              if (target.src !== dynamicSearchProxy && !target.src.includes(encodeURIComponent(coverMeta.artist || ""))) {
                                target.src = dynamicSearchProxy;
                              } else if (coverMeta.fallbackImageUrl && target.src !== coverMeta.fallbackImageUrl) {
                                target.src = getProxiedImageUrl(coverMeta.fallbackImageUrl);
                              }
                            }}
                            loading="eager"
                          />
                        );
                      })()}

                      {/* Gradient di contrasto calibrato */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/35 pointer-events-none" />

                      {/* Badge Copertina */}
                      <div className="relative z-10 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            jumpToMasterpiece();
                          }}
                          className="bg-black/75 hover:bg-[#8A2520] backdrop-blur-xs px-2.5 py-1 rounded text-[10px] uppercase tracking-wider font-sans font-bold text-amber-200 hover:text-white border border-amber-300/40 shadow-sm transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
                        >
                          <Palette className="w-3 h-3 text-amber-300" />
                          <span>Arte & Ispirazione</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            jumpToMasterpiece();
                          }}
                          className="text-[10px] font-sans font-bold text-amber-200 hover:text-white bg-black/80 hover:bg-[#8A2520] px-2.5 py-1 rounded border border-amber-300/30 transition-all shadow-sm cursor-pointer flex items-center gap-1 active:scale-95"
                        >
                          <span>Leggi Pag. {masterpiecePageNum}</span>
                          <span>→</span>
                        </button>
                      </div>

                      {/* Didascalia Opera in Basso a Sinistra */}
                      <div className="relative z-10 mt-auto pt-24 md:pt-40 text-[11px] font-sans text-white/95 leading-tight drop-shadow-md">
                        {currentMasterpiece.artworkType && (
                          <span className="inline-block mb-1.5 px-2 py-0.5 rounded bg-black/70 border border-white/20 text-[9px] font-sans font-medium text-amber-200 uppercase tracking-wide">
                            {currentMasterpiece.artworkType}
                          </span>
                        )}
                        <div className="font-bold flex items-center gap-1 text-white group-hover:text-amber-200 transition-colors text-xs sm:text-sm">
                          <span>← {currentMasterpiece.shortArtworkTitle}</span>
                        </div>
                        <div className="text-[10px] text-white/90 italic mt-1 flex items-center justify-between">
                          <span>{currentMasterpiece.museum} &bull; {currentMasterpiece.city}</span>
                          <span className="text-amber-300 font-sans font-bold text-[10px]">Pag. {masterpiecePageNum}</span>
                        </div>
                        {currentMasterpiece.matchingTopic && (
                          <div className="text-[10px] text-amber-200 font-medium mt-1.5 bg-black/60 backdrop-blur-xs px-2 py-1 rounded border border-amber-400/30 flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3 text-amber-300 shrink-0" />
                            <span className="truncate">Ispirato a: <strong>{currentMasterpiece.matchingTopic}</strong></span>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Colonna Destra: Sommario con Puntini e Numeri di Pagina */}
                <div className={`md:col-span-7 p-4 sm:p-6 flex flex-col justify-between ${palette.sommarioBg}`}>
                  <div className="space-y-2">
                    <div className="text-xs font-sans uppercase font-bold tracking-wider text-amber-200 mb-2 pb-1 border-b border-white/20 flex justify-between items-center">
                      <span>Sommario del Giorno</span>
                      <span className="text-[10px] text-white/80 font-normal">
                        {isSearchingWeb ? "Ricerca e Curatela in corso..." : "Clicca per leggere"}
                      </span>
                    </div>

                    {isSearchingWeb ? (
                      /* Fase di Ricerca e Selezione Articoli: Nessuna cache o articolo precedente mostrato */
                      <div className="py-6 px-3 flex flex-col items-center justify-center text-center space-y-4 my-auto">
                        <div className="relative flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full border-2 border-amber-300/30 border-t-amber-300 animate-spin" />
                          <Sparkles className="w-5 h-5 text-amber-300 absolute animate-pulse" />
                        </div>
                        <div>
                          <h3 className="font-serif font-bold text-base sm:text-lg text-amber-200">
                            Ricerca e Selezione Quotidiana in Corso...
                          </h3>
                          <p className="text-xs text-white/90 font-serif italic mt-1 max-w-sm">
                            Generazione in tempo reale dei nuovi articoli dal Web e dai Grandi Libri per l'edizione di oggi.
                          </p>
                        </div>
                        <div className="w-full bg-black/35 rounded-md p-3 border border-white/20 text-[11px] font-sans space-y-2 text-left text-amber-100 shadow-inner">
                          <div className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
                            </span>
                            <span className="font-bold text-amber-200 text-xs">Avanzamento della redazione:</span>
                          </div>
                          <ul className="space-y-1.5 pl-3 text-white/90 text-[10px] list-disc leading-relaxed">
                            <li>Consultazione fonti live e testate internazionali dal Web...</li>
                            <li>Analisi degli argomenti d'interesse definiti nel foglio editoriale...</li>
                            <li>Composizione tipografica dei nuovi articoli (senza uso di cache)...</li>
                          </ul>
                        </div>
                        <div className="text-[10px] uppercase tracking-widest text-amber-300/90 font-sans font-bold bg-black/40 px-3 py-1 rounded border border-amber-300/20">
                          &bull; Cache eliminata: gli articoli precedenti non vengono mostrati &bull;
                        </div>
                      </div>
                    ) : (
                      /* Elenco Articoli e Rubriche del Giorno Generato */
                      <>
                        <div className="space-y-2 font-serif text-sm leading-snug">
                          {/* Voce Capolavoro d'Arte / Opera in Copertina */}
                          <div
                            onClick={jumpToMasterpiece}
                            className="group flex items-baseline justify-between cursor-pointer py-0.5"
                            title={`Vai all'opera in copertina: ${currentMasterpiece.artworkTitle}`}
                          >
                            <span className="font-serif text-sm font-semibold text-white group-hover:text-amber-200 truncate pr-2">
                              {currentMasterpiece.shortArtworkTitle || currentMasterpiece.artworkTitle}
                            </span>
                            <span className="flex-1 border-b-2 border-dotted border-white/40 mx-2 relative top-[-4px] opacity-70 group-hover:border-amber-200" />
                            <span className="font-bold text-amber-300 font-sans text-xs sm:text-sm pl-1 shrink-0">
                              {masterpiecePageNum}
                            </span>
                          </div>

                          {/* Articoli del Giorno */}
                          {regularArticles.map((art) => {
                            const pageNum = articlePageMap[art.id] ?? art.pageNumber;
                            return (
                              <div
                                key={art.id}
                                onClick={() => jumpToArticle(art.id)}
                                className="group flex items-baseline justify-between cursor-pointer py-0.5"
                              >
                                <span className="font-serif text-sm font-semibold text-white group-hover:text-amber-200 truncate pr-2">
                                  {art.shortTitle || art.title}
                                </span>
                                <span className="flex-1 border-b-2 border-dotted border-white/40 mx-2 relative top-[-4px] opacity-70 group-hover:border-amber-200" />
                                <span className="font-bold text-amber-300 font-sans text-xs sm:text-sm pl-1 shrink-0">
                                  {pageNum}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Riquadro Articoli Condensati */}
                        {condensedArticles.length > 0 && (
                          <div className={`mt-2.5 p-2.5 rounded border border-white/30 ${palette.condensedBg} shadow-inner`}>
                            <div className="text-center font-sans font-bold text-[11px] uppercase tracking-widest text-amber-200 mb-1.5">
                              — ARTICOLI CONDENSATI —
                            </div>
                            <div className="space-y-1.5 font-serif text-sm">
                              {condensedArticles.map((art) => {
                                const pageNum = articlePageMap[art.id] ?? art.pageNumber;
                                return (
                                  <div
                                    key={art.id}
                                    onClick={() => jumpToArticle(art.id)}
                                    className="group flex items-baseline justify-between cursor-pointer py-0.5"
                                  >
                                    <span className="font-serif text-sm font-semibold text-white group-hover:text-amber-200 truncate pr-2">
                                      {art.shortTitle || art.title}
                                    </span>
                                    <span className="flex-1 border-b-2 border-dotted border-white/40 mx-2 relative top-[-4px] opacity-70 group-hover:border-amber-200" />
                                    <span className="font-bold text-amber-300 font-sans text-xs sm:text-sm pl-1 shrink-0">
                                      {pageNum}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Rubriche del Giorno */}
                        <div className="space-y-2 font-serif text-sm leading-snug pt-2 border-t border-white/20">
                          {/* Riga Dedicata: Più parole, più idee (La Parola del Giorno) */}
                          <div
                            onClick={() => goToPage(wordPageNumber)}
                            className="group flex items-baseline justify-between cursor-pointer py-0.5"
                            title={`Vai a Più parole, più idee (${dailyWord?.word || "Parola del Giorno"})`}
                          >
                            <span className="font-serif text-sm font-semibold text-white group-hover:text-amber-200 truncate pr-2">
                              Più parole, più idee ({dailyWord?.word || "Parola del Giorno"})
                            </span>
                            <span className="flex-1 border-b-2 border-dotted border-white/40 mx-2 relative top-[-4px] opacity-70 group-hover:border-amber-200" />
                            <span className="font-bold text-amber-300 font-sans text-xs sm:text-sm pl-1 shrink-0">
                              {wordPageNumber}
                            </span>
                          </div>

                          {/* Riga Dedicata: Il Libro Consigliato di Oggi */}
                          <div
                            onClick={() => goToPage(bookPageNumber)}
                            className="group flex items-baseline justify-between cursor-pointer py-0.5"
                            title="Vai a Il Libro Consigliato di Oggi"
                          >
                            <span className="font-serif text-sm font-semibold text-white group-hover:text-amber-200 truncate pr-2">
                              Il Libro Consigliato di Oggi
                            </span>
                            <span className="flex-1 border-b-2 border-dotted border-white/40 mx-2 relative top-[-4px] opacity-70 group-hover:border-amber-200" />
                            <span className="font-bold text-amber-300 font-sans text-xs sm:text-sm pl-1 shrink-0">
                              {bookPageNumber}
                            </span>
                          </div>

                          {/* Riga Dedicata: La Massima del Giorno (Retro Rivista) */}
                          <div
                            onClick={() => goToPage(totalPages - 1)}
                            className="group flex items-baseline justify-between cursor-pointer py-0.5"
                            title="Vai alla Massima del Giorno (Retro Rivista)"
                          >
                            <span className="font-serif text-sm font-semibold text-white group-hover:text-amber-200 truncate pr-2">
                              La Massima del Giorno
                            </span>
                            <span className="flex-1 border-b-2 border-dotted border-white/40 mx-2 relative top-[-4px] opacity-70 group-hover:border-amber-200" />
                            <span className="font-bold text-amber-300 font-sans text-xs sm:text-sm pl-1 shrink-0">
                              {totalPages - 1}
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Piede della Colonna */}
                  <div className="mt-3 pt-2.5 border-t border-white/20 flex items-center justify-between text-xs font-sans text-white/80">
                    <span className="text-[11px] italic">
                      {isSearchingWeb ? "Attendi il completamento della curatela..." : "Clicca su qualsiasi articolo o rubrica per iniziare la lettura"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Piede copertina */}
              <div className={`${palette.footerBg} py-2.5 px-6 text-center text-xs font-sans font-bold uppercase tracking-widest text-white/95 border-t border-white/20`}>
                LA RIVISTA PIÙ LETTA DEL MONDO &bull; EDIZIONE QUOTIDIANA DI LETTURE CONDENSATE
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* CASO 2: FOGLIO SINGOLO DI UN ARTICOLO */}
          {/* ======================================================== */}
          {currentPage.type === "article" && (
            <div className="p-6 sm:p-10 text-[#241B16] bg-[#FCFAF5] flex-1 flex flex-col justify-between animate-in fade-in duration-200 relative overflow-y-auto">
              <div>
                {/* Testatina del Foglio Singolo */}
                <div className="flex items-center justify-between pb-2.5 mb-5 border-b-2 border-[#2A201A] text-xs font-sans uppercase font-bold tracking-widest text-[#786457]">
                  <div className="flex flex-col text-left leading-tight">
                    <span>Selezione</span>
                    <span>Nello stile del Reader's Digest</span>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => goToPage(0)}
                        className="p-1 rounded hover:bg-[#EAE1D2] text-[#2A201A] transition-colors"
                        title="Torna al Sommario"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={toggleFullscreen}
                        className="p-1 rounded hover:bg-[#EAE1D2] text-[#2A201A] transition-colors"
                        title={isFullscreen ? "Esci da tutto schermo" : "Visualizza a tutto schermo"}
                      >
                        {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={(e) => onShareArticle(currentPage.article, e)}
                        className="p-1 rounded hover:bg-[#EAE1D2] text-[#2A201A]"
                        title="Condividi articolo"
                      >
                        {copiedId === currentPage.article.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-700" />
                        ) : (
                          <Share2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={(e) => onToggleSaveArticle(currentPage.article.id, e)}
                        className="p-1 rounded hover:bg-[#EAE1D2] text-[#2A201A]"
                        title="Salva articolo"
                      >
                        <Bookmark
                          className="w-3.5 h-3.5"
                          fill={savedArticles.includes(currentPage.article.id) ? "currentColor" : "none"}
                        />
                      </button>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-[#EFE8DC] text-[#8A2520] border border-[#3A2E26]/20 text-[10px] tracking-wider">
                      {currentPage.article.category}
                    </span>
                  </div>
                </div>

                {/* Se è il Foglio 1 dell'articolo, mostra Titolo, Estratto e Autore */}
                {currentPage.sheetIndex === 1 ? (
                  <>
                    <h1
                      className="font-serif-title text-2xl sm:text-3xl md:text-4xl font-bold text-[#1F1713] text-center leading-tight mb-3"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      {currentPage.article.title}
                    </h1>

                    <p className="text-center italic text-[#57463B] text-sm sm:text-base max-w-xl mx-auto mb-4">
                      "{currentPage.article.excerpt}"
                    </p>

                    {/* Immagine o Scheda Critica dell'opera d'arte se presente */}
                    {currentPage.hasImage && (() => {
                      const artworkMeta = getArtworkMetadataForArticle(currentPage.article, currentMasterpiece);
                      const whyConnectedText = artworkMeta.whyConnected || (currentMasterpiece.id === currentPage.article.id ? currentMasterpiece.whyConnected : "");

                      return (
                        <div className="mb-6 rounded-xl overflow-hidden border-2 border-[#3A2E26] shadow-lg bg-[#181310] text-white">
                          {/* Banner Ispirazione Tematica */}
                          {artworkMeta.matchingTopic && (
                            <div className="bg-[#2A1E17] border-b border-[#4A382C] px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                                <span className="font-sans font-bold text-xs uppercase tracking-wider text-amber-200">
                                  Ispirato ai tuoi Interessi: <strong className="text-white">{artworkMeta.matchingTopic}</strong>
                                </span>
                              </div>
                              {artworkMeta.artworkType && (
                                <span className="px-2.5 py-0.5 rounded-full bg-[#181310] text-amber-300 border border-amber-400/30 text-[10px] font-sans font-medium">
                                  {artworkMeta.artworkType}
                                </span>
                              )}
                            </div>
                          )}

                          {/* Contenitore Immagine ad Alta Risoluzione */}
                          <div className="relative bg-black flex items-center justify-center min-h-[200px] max-h-[380px] overflow-hidden group">
                            <img
                              src={getProxiedImageUrl(artworkMeta.imageUrl, artworkMeta.artist, artworkMeta.artworkTitle)}
                              alt={`${artworkMeta.artist} - ${artworkMeta.artworkTitle}`}
                              className="w-full h-auto max-h-[380px] object-contain mx-auto"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                const target = e.currentTarget as HTMLImageElement;
                                const dynamicSearchProxy = `/api/art/image-proxy?artist=${encodeURIComponent(artworkMeta.artist || "")}&title=${encodeURIComponent(artworkMeta.artworkTitle || "")}`;
                                if (target.src !== dynamicSearchProxy && !target.src.includes(encodeURIComponent(artworkMeta.artist || ""))) {
                                  target.src = dynamicSearchProxy;
                                } else if (artworkMeta.fallbackImageUrl && target.src !== artworkMeta.fallbackImageUrl) {
                                  target.src = getProxiedImageUrl(artworkMeta.fallbackImageUrl);
                                }
                              }}
                            />
                          </div>

                          {/* Didascalia e Cartiglio Museale */}
                          <div className="p-3.5 bg-[#201814] text-white/90 text-xs font-sans border-t border-[#3A2E26] space-y-2">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div>
                                <span className="font-bold text-amber-100 text-[13px]">{artworkMeta.artist}</span>
                                <span className="text-stone-300"> &bull; <em>{artworkMeta.artworkTitle}</em></span>
                                {artworkMeta.year && <span className="text-stone-400"> ({artworkMeta.year})</span>}
                              </div>
                              <div className="text-[11px] text-stone-300 italic bg-black/40 px-2 py-0.5 rounded border border-white/10">
                                📍 {artworkMeta.museum}{artworkMeta.city ? `, ${artworkMeta.city}` : ""}
                              </div>
                            </div>

                            {/* Spiegazione della Connessione Tematica */}
                            {whyConnectedText && (
                              <div className="pt-2 border-t border-white/10 text-[11px] text-amber-200/90 leading-relaxed bg-[#2D221B]/70 p-2 rounded border border-amber-300/20">
                                <span className="font-bold text-amber-300 mr-1">💡 Connessione con il tema:</span>
                                <span>{whyConnectedText}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })()}

                    <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 text-xs font-sans text-[#786457] pb-3 border-b border-[#E3D7C5] mb-5">
                      <span>A cura di: <strong>{currentPage.article.author}</strong></span>
                      <span>&bull;</span>
                      <span>{currentPage.article.date}</span>
                      <span>&bull;</span>
                      <span>{currentPage.article.readingTime} di lettura</span>
                    </div>

                    {/* Citazione Spiccata se presente */}
                    {currentPage.highlightQuote && (
                      <div className="my-4 p-3.5 bg-[#F4EDE2] border-l-4 border-[#8A2520] rounded-r italic text-sm sm:text-base font-serif text-[#2B201A] text-center">
                        "{currentPage.highlightQuote}"
                      </div>
                    )}
                  </>
                ) : (
                  /* Intestazione per fogli di continuazione */
                  <div className="mb-4 pb-2 border-b border-[#E3D7C5] flex justify-between items-center text-xs font-sans text-[#786457]">
                    <span className="italic truncate font-serif font-bold text-[#2A201A]">
                      {currentPage.article.shortTitle || currentPage.article.title}
                    </span>
                    <span className="font-bold text-[#8A2520] shrink-0 italic">
                      (Segue)
                    </span>
                  </div>
                )}

                {/* Paragrafi di questo specifico Foglio */}
                <div
                  className="space-y-3.5 text-base sm:text-lg leading-relaxed text-[#2A201A] text-justify font-serif"
                  style={{ fontFamily: "'Lora', Georgia, serif" }}
                >
                  {(() => {
                    const firstBodyParagraphIndex = currentPage.paragraphs.findIndex(
                      (p) => !/^#+\s*/.test(p.trim())
                    );

                    return currentPage.paragraphs.map((par, pIdx) => {
                      const isLastParagraph = pIdx === currentPage.paragraphs.length - 1;
                      const isContinuing = currentPage.sheetIndex < currentPage.totalSheets;
                      const isHeader = /^#+\s*/.test(par.trim());
                      const isFirstBodyParagraph =
                        currentPage.sheetIndex === 1 && pIdx === firstBodyParagraphIndex;

                      if (isHeader) {
                        return (
                          <h3
                            key={pIdx}
                            className="font-serif-title text-lg sm:text-xl font-bold text-[#8A2520] mt-5 mb-2 leading-snug tracking-tight border-b border-[#8A2520]/20 pb-1 text-left"
                            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                          >
                            {renderFormattedText(par)}
                          </h3>
                        );
                      }

                      return (
                        <p
                          key={pIdx}
                          className={isFirstBodyParagraph ? "digest-drop-cap" : ""}
                        >
                          {renderFormattedText(par)}
                          {isLastParagraph && isContinuing && (
                            <span
                              className="inline-flex items-center align-middle ml-2 text-[#8A2520] select-none"
                              title="L'articolo continua alla pagina successiva"
                            >
                              <ArrowRight className="w-4 h-4 inline-block stroke-[2.5]" />
                            </span>
                          )}
                        </p>
                      );
                    });
                  })()}
                </div>

                {/* Box Fonti Web Ufficiali nell'ultimo foglio dell'articolo */}
                {currentPage.hasSources && currentPage.article.sources && currentPage.article.sources.length > 0 && (
                  <div className="mt-6 p-4 rounded-xl bg-stone-100 border-2 border-[#3A2E26]/30 font-sans shadow-sm">
                    <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-[#D5C7B5]">
                      <div className="flex items-center gap-2 font-bold text-xs text-[#2A201A]">
                        <span className="flex h-2 w-2 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                        </span>
                        <Globe className="w-4 h-4 text-[#8A2520]" />
                        <span className="tracking-wide uppercase font-serif-heading text-[11px] sm:text-xs">
                          Scansione Web & Fonti Originali Accreditate ({currentPage.article.sources.length})
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Verificate
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {currentPage.article.sources.map((src, i) => (
                        <div
                          key={i}
                          className="p-3 bg-white rounded-lg border border-[#D5C7B5] shadow-xs hover:border-[#8A2520]/50 transition-all flex flex-col gap-2"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-1.5 mb-1">
                                <span className="px-2 py-0.5 rounded bg-stone-100 text-[#2A201A] font-bold text-[10px] border border-stone-300">
                                  {src.publisher || "Ente Accreditato"}
                                </span>
                                {src.originalLanguage && (
                                  <span className="text-[10px] text-stone-500 font-medium">
                                    &bull; Lingua: {src.originalLanguage}
                                  </span>
                                )}
                              </div>
                              <h5 className="font-bold text-[#1E1916] text-xs sm:text-[13px] leading-snug">
                                {src.title}
                              </h5>
                            </div>

                            <a
                              href={src.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md bg-[#2A201A] hover:bg-[#8A2520] text-white font-bold transition-colors shrink-0 text-xs shadow-xs group"
                            >
                              <span>Apri Fonte</span>
                              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                            </a>
                          </div>

                          {src.keyFinding && (
                            <div className="p-2 rounded bg-amber-50/70 border-l-2 border-amber-500 text-stone-700 text-[11px] leading-relaxed italic">
                              <span className="font-semibold text-amber-900 not-italic mr-1">Riscontro Chiave:</span>
                              «{src.keyFinding}»
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Numero di Pagina e Piede del Foglio */}
              <div className="mt-6 pt-3 border-t-2 border-[#2A201A] flex items-center justify-between text-xs font-sans">
                <button
                  onClick={prevPage}
                  className="font-bold text-[#2A201A] hover:text-[#8A2520] flex items-center gap-0.5"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Foglio prec.</span>
                </button>

                <div className="font-bold text-xs text-[#8A2520]">
                  — Pag. {currentPageIndex} —
                </div>

                <button
                  onClick={nextPage}
                  className="font-bold text-[#2A201A] hover:text-[#8A2520] flex items-center gap-0.5"
                >
                  <span>Foglio succ.</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* CASO 3: PIÙ PAROLE, PIÙ IDEE (PAROLA DEL GIORNO) */}
          {/* ======================================================== */}
          {currentPage.type === "word" && (
            <div className="p-6 sm:p-10 text-[#241B16] bg-[#FCFAF5] flex-1 flex flex-col justify-between animate-in fade-in duration-200 relative overflow-y-auto">
              <div>
                {/* Testatina del Foglio */}
                <div className="flex items-center justify-between pb-2.5 mb-4 border-b-2 border-[#2A201A] text-xs font-sans uppercase font-bold tracking-widest text-[#786457]">
                  <div className="flex flex-col text-left leading-tight">
                    <span>Selezione</span>
                    <span>Nello stile del Reader's Digest</span>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => goToPage(0)}
                        className="p-1 rounded hover:bg-[#EAE1D2] text-[#2A201A] transition-colors"
                        title="Torna al Sommario"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={toggleFullscreen}
                        className="p-1 rounded hover:bg-[#EAE1D2] text-[#2A201A] transition-colors"
                        title={isFullscreen ? "Esci da tutto schermo" : "Visualizza a tutto schermo"}
                      >
                        {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <span className="px-2.5 py-0.5 rounded bg-[#8A2520] text-amber-100 font-bold border border-[#3A2E26]/20 text-[10px] tracking-wider">
                      Rubrica Lessicale
                    </span>
                  </div>
                </div>

                {/* Intestazione Rubrica */}
                <div className="text-center mb-4">
                  <div className="text-[11px] font-sans uppercase font-bold tracking-widest text-[#8A2520] mb-1">
                    — Rubrica Lessicale Quotidiana —
                  </div>
                  <h1
                    className="font-serif-title text-2xl sm:text-3xl font-bold text-[#1F1713] leading-tight"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    Più parole, più idee
                  </h1>
                  <p className="text-xs font-serif italic text-[#786457] mt-0.5">
                    «Arricchite il vostro vocabolario per nutrire il pensiero e ampliare la comprensione del mondo»
                  </p>
                </div>

                {/* Scheda Principale della Parola */}
                <div className="bg-[#F6EFE5] rounded-xl p-5 sm:p-6 border-2 border-[#D5C7B5] shadow-md my-3 space-y-4">
                  {/* Titolo e Pronuncia */}
                  <div className="border-b border-[#D5C7B5] pb-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-serif text-2xl sm:text-3xl font-bold text-[#8A2520] tracking-wide">
                          «{currentPage.word.word}»
                        </span>
                        {currentPage.word.phonetic && (
                          <span className="text-xs font-sans text-[#786457] italic bg-[#EAE1D2] px-2 py-0.5 rounded">
                            {currentPage.word.phonetic}
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-sans text-[#5A4638] font-semibold mt-1">
                        {currentPage.word.grammaticalClass} &bull; <span className="text-[#8A2520]">{currentPage.word.category}</span>
                      </div>
                    </div>
                  </div>

                  {/* Griglia a 2 colonne: Etimologia & Definizione */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Box Etimologia */}
                    <div className="bg-[#EFE8DC] p-3.5 rounded-lg border border-[#D5C7B5]/80 space-y-1.5 shadow-2xs">
                      <div className="text-[11px] font-sans uppercase font-bold tracking-wider text-[#8A2520] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#8A2520]" />
                        <span>Etimologia & Origine Storica</span>
                      </div>
                      <p className="font-serif text-xs sm:text-[13px] leading-relaxed text-[#2A201A] text-justify">
                        {currentPage.word.etymology}
                      </p>
                    </div>

                    {/* Box Definizione */}
                    <div className="bg-[#EFE8DC] p-3.5 rounded-lg border border-[#D5C7B5]/80 space-y-1.5 shadow-2xs">
                      <div className="text-[11px] font-sans uppercase font-bold tracking-wider text-[#8A2520] flex items-center gap-1.5">
                        <BookMarked className="w-3.5 h-3.5 text-[#8A2520]" />
                        <span>Definizione & Significato</span>
                      </div>
                      <p className="font-serif text-xs sm:text-[13px] leading-relaxed text-[#2A201A] text-justify">
                        {currentPage.word.definition}
                      </p>
                    </div>
                  </div>

                  {/* Sfumature d'uso */}
                  {currentPage.word.nuanceAndUsage && (
                    <div className="p-3.5 rounded-lg bg-amber-50/70 border border-amber-200/80 text-xs sm:text-[13px] font-serif text-[#2A201A] leading-relaxed">
                      <span className="font-sans font-bold text-[#8A2520] uppercase text-[10px] tracking-wider block mb-1">
                        — Come usarla con eleganza —
                      </span>
                      {currentPage.word.nuanceAndUsage}
                    </div>
                  )}

                  {/* Citazione d'autore nel contesto letterario */}
                  {currentPage.word.literaryQuote && (
                    <div className="p-3.5 rounded-lg bg-[#2A201A] text-amber-100 shadow-inner">
                      <div className="text-[10px] font-sans uppercase tracking-wider text-amber-300 font-bold mb-1">
                        Nel Contesto Letterario & Saggistico
                      </div>
                      <p className="font-serif italic text-xs sm:text-[13px] leading-relaxed">
                        {currentPage.word.literaryQuote}
                      </p>
                      <div className="text-[10px] font-sans text-amber-200/80 text-right mt-1 font-medium">
                        — {currentPage.word.quoteAuthor} {currentPage.word.quoteSource && `(${currentPage.word.quoteSource})`}
                      </div>
                    </div>
                  )}

                  {/* Curiosità didYouKnow */}
                  {currentPage.word.didYouKnow && (
                    <div className="p-3.5 rounded-lg bg-[#EFE8DC] border border-[#D5C7B5] flex items-start gap-2.5 text-xs font-serif text-[#4A3B2F] italic shadow-2xs">
                      <Lightbulb className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <div className="leading-relaxed">
                        <strong className="font-sans not-italic font-bold text-[#8A2520] text-[11px] block uppercase tracking-wider mb-0.5">
                          Lo sapevate che?
                        </strong>
                        {currentPage.word.didYouKnow}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Numero di Pagina e Piede del Foglio */}
              <div className="mt-4 pt-3 border-t-2 border-[#2A201A] flex items-center justify-between text-xs font-sans">
                <button
                  onClick={prevPage}
                  className="font-bold text-[#2A201A] hover:text-[#8A2520] flex items-center gap-0.5"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Foglio prec.</span>
                </button>

                <div className="font-bold text-xs text-[#8A2520]">
                  — Pag. {currentPageIndex} —
                </div>

                <button
                  onClick={nextPage}
                  className="font-bold text-[#2A201A] hover:text-[#8A2520] flex items-center gap-0.5"
                >
                  <span>Foglio succ.</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* CASO 4: IL LIBRO CONSIGLIATO DI OGGI (DA GOOGLE FOGLI) */}
          {/* ======================================================== */}
          {currentPage.type === "book" && (
            <div className="p-6 sm:p-10 text-[#241B16] bg-[#FCFAF5] flex-1 flex flex-col justify-between animate-in fade-in duration-200 relative overflow-y-auto">
              <div>
                {/* Testatina del Foglio */}
                <div className="flex items-center justify-between pb-2.5 mb-5 border-b-2 border-[#2A201A] text-xs font-sans uppercase font-bold tracking-widest text-[#786457]">
                  <div className="flex flex-col text-left leading-tight">
                    <span>Selezione</span>
                    <span>Nello stile del Reader's Digest</span>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => goToPage(0)}
                        className="p-1 rounded hover:bg-[#EAE1D2] text-[#2A201A] transition-colors"
                        title="Torna al Sommario"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={toggleFullscreen}
                        className="p-1 rounded hover:bg-[#EAE1D2] text-[#2A201A] transition-colors"
                        title={isFullscreen ? "Esci da tutto schermo" : "Visualizza a tutto schermo"}
                      >
                        {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <span className="px-2.5 py-0.5 rounded bg-[#8A2520] text-amber-100 font-bold border border-[#3A2E26]/20 text-[10px] tracking-wider">
                      Il Libro di Oggi
                    </span>
                  </div>
                </div>

                {/* Intestazione Rubrica */}
                <div className="text-center mb-4">
                  <div className="text-[11px] font-sans uppercase font-bold tracking-widest text-[#8A2520] mb-1">
                    — Rubrica Letteraria Quotidiana —
                  </div>
                  <h1
                    className="font-serif-title text-2xl sm:text-3xl font-bold text-[#1F1713] leading-tight"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    Il Libro Consigliato di Oggi
                  </h1>
                </div>

                {/* Scheda del Libro */}
                <div className="bg-[#F6EFE5] rounded-xl p-4 sm:p-6 border-2 border-[#D5C7B5] shadow-md my-3">
                  <div className="flex flex-col sm:flex-row gap-5 items-start">
                    {/* Finto dorso/copertina vintage del libro */}
                    <div className="w-full sm:w-36 h-48 sm:h-52 bg-gradient-to-br from-[#2D3E4E] to-[#16222A] rounded-lg border-2 border-amber-300/40 p-3 flex flex-col justify-between text-white shadow-lg shrink-0 relative overflow-hidden">
                      <div className="text-[9px] uppercase font-sans tracking-widest text-amber-300 font-bold border-b border-amber-300/30 pb-1">
                        {currentPage.book.category}
                      </div>
                      <div className="my-auto text-center">
                        <div className="font-serif text-sm font-bold text-amber-100 leading-snug">
                          «{currentPage.book.title}»
                        </div>
                        <div className="text-[11px] font-sans text-amber-200/90 mt-1.5 italic">
                          {currentPage.book.author}
                        </div>
                      </div>
                      <div className="text-[9px] font-sans text-white/70 text-center border-t border-white/20 pt-1">
                        {currentPage.book.publisher} {currentPage.book.year && `(${currentPage.book.year})`}
                      </div>
                    </div>

                    {/* Dettagli e Contenuti */}
                    <div className="flex-1 space-y-3">
                      <div>
                        <div className="text-xl sm:text-2xl font-serif font-bold text-[#1F1713]">
                          {currentPage.book.title}
                        </div>
                        <div className="text-xs font-sans text-[#786457] font-semibold mt-0.5">
                          di <span className="text-[#1F1713]">{currentPage.book.author}</span> &bull; {currentPage.book.publisher} ({currentPage.book.year}) &bull; {currentPage.book.pagesCount}
                        </div>
                      </div>

                      {/* Sinossi a paragrafi */}
                      <div className="space-y-2.5">
                        {currentPage.book.synopsis.split("\n\n").map((par, pIdx) => (
                          <p key={pIdx} className="font-serif text-sm sm:text-[15px] leading-relaxed text-[#2A201A] text-justify">
                            {par}
                          </p>
                        ))}
                      </div>

                      {/* Citazione Spiccata */}
                      {currentPage.book.highlightQuote && (
                        <div className="text-xs sm:text-sm font-serif italic text-[#6B2824] bg-amber-50/70 p-3 rounded-lg border border-amber-200 shadow-xs">
                          {currentPage.book.highlightQuote}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Numero di Pagina e Piede del Foglio */}
              <div className="mt-4 pt-3 border-t-2 border-[#2A201A] flex items-center justify-between text-xs font-sans">
                <button
                  onClick={prevPage}
                  className="font-bold text-[#2A201A] hover:text-[#8A2520] flex items-center gap-0.5"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Foglio prec.</span>
                </button>

                <div className="font-bold text-xs text-[#8A2520]">
                  — Pag. {currentPageIndex} —
                </div>

                <button
                  onClick={nextPage}
                  className="font-bold text-[#2A201A] hover:text-[#8A2520] flex items-center gap-0.5"
                >
                  <span>Foglio succ.</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* CASO 4: QUARTA DI COPERTINA (RETRO RIVISTA) */}
          {/* ======================================================== */}
          {currentPage.type === "back-cover" && (
            <div className={`p-6 sm:p-10 text-white ${palette.backBg} flex-1 flex flex-col justify-between animate-in fade-in duration-200 overflow-y-auto`}>
              <div className="flex justify-end mb-1">
                <button
                  onClick={toggleFullscreen}
                  className="p-1.5 rounded bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  title={isFullscreen ? "Esci da tutto schermo" : "Visualizza a tutto schermo"}
                >
                  {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                </button>
              </div>
              <div className="space-y-4 my-auto max-w-xl mx-auto text-center">
                <div className="text-xs font-sans uppercase tracking-widest text-amber-300 font-bold">
                  — La Massima del Giorno —
                </div>

                <p className="italic text-base sm:text-lg font-serif text-white/95 leading-relaxed px-2">
                  {dailyQuote.quote}
                </p>

                <div className="text-xs font-sans text-amber-200/90 font-medium">
                  {dailyQuote.author} &bull; {dailyQuote.source}
                </div>

                {/* Aneddoto Storico del Giorno (Approfondito a paragrafi) */}
                {dailyQuote.anecdote && (
                  <div className="mt-4 p-4 sm:p-5 rounded-lg bg-black/30 border border-white/20 text-left shadow-inner">
                    <div className="text-xs font-sans uppercase tracking-wider text-amber-300 font-bold mb-2.5 flex items-center gap-1.5 border-b border-white/15 pb-1.5">
                      <span>L'Aneddoto del Giorno: {dailyQuote.anecdoteTitle}</span>
                    </div>
                    <div className="space-y-2.5">
                      {dailyQuote.anecdote.split("\n\n").map((par, aIdx) => (
                        <p key={aIdx} className="text-xs sm:text-[13px] font-serif text-white/90 leading-relaxed text-justify">
                          {par}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-white/20 flex items-center justify-center">
                  <button
                    onClick={() => goToPage(0)}
                    className="px-6 py-2.5 rounded-lg bg-[#8A2520] hover:bg-[#6E1C18] text-white font-bold font-sans text-xs transition-colors shadow-lg cursor-pointer"
                  >
                    Torna al Sommario
                  </button>
                </div>
              </div>

              <div className="text-center text-[10px] font-sans text-white/60 border-t border-white/10 pt-3">
                Personal Digest &bull; Selezione nello stile del Reader's Digest &bull; Pagina {currentPageIndex}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

