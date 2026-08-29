import {
  Article,
  ArtMasterpiece,
  RecommendedBook,
  DailyWord,
  EditorialLedgerState,
  StoredArticleRecord,
  StoredMasterpieceRecord,
  StoredBookRecord,
  StoredWordRecord,
  StoredIssueRecord,
} from "../types";

const LEDGER_STORAGE_KEY = "personal_digest_editorial_ledger_v1";
const LEGACY_STORAGE_KEY = "personal_digest_sommario_articles_db_v1";

export const MAX_LEDGER_RECORDS = 500; // Archivio storico ad alta capienza per garantire unicità nel tempo

/**
 * Normalizza una stringa per confronti robusti anti-duplicati:
 * rimuove accenti, punteggiatura, spazi multipli e converte in minuscolo.
 */
export function normalizeLedgerText(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Rimuove accenti
    .replace(/[^a-z0-9\s]/g, " ") // Punteggiatura -> spazio
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Calcola l'indice di somiglianza Jaccard tra due testi.
 */
export function calculateSimilarity(textA: string, textB: string): number {
  const normA = normalizeLedgerText(textA);
  const normB = normalizeLedgerText(textB);

  if (normA === normB) return 1.0;
  if (!normA || !normB) return 0;

  const wordsA = new Set(normA.split(" ").filter((w) => w.length >= 3));
  const wordsB = new Set(normB.split(" ").filter((w) => w.length >= 3));

  if (wordsA.size === 0 || wordsB.size === 0) return 0;

  let intersectionCount = 0;
  wordsA.forEach((w) => {
    if (wordsB.has(w)) intersectionCount++;
  });

  const unionSize = new Set([...wordsA, ...wordsB]).size;
  return unionSize > 0 ? intersectionCount / unionSize : 0;
}

/**
 * Legge l'intero Registro Storico Editoriale dal localStorage (con migrazione automatica dal legacy DB).
 */
export function getEditorialLedger(): EditorialLedgerState {
  try {
    const raw = localStorage.getItem(LEDGER_STORAGE_KEY);
    if (raw) {
      const parsed: EditorialLedgerState = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.articles)) {
        return {
          version: parsed.version || 1,
          currentIssueNumber: parsed.currentIssueNumber || parsed.issues?.length || 1,
          articles: parsed.articles.slice(-MAX_LEDGER_RECORDS),
          masterpieces: Array.isArray(parsed.masterpieces) ? parsed.masterpieces.slice(-MAX_LEDGER_RECORDS) : [],
          books: Array.isArray(parsed.books) ? parsed.books.slice(-MAX_LEDGER_RECORDS) : [],
          words: Array.isArray(parsed.words) ? parsed.words.slice(-MAX_LEDGER_RECORDS) : [],
          issues: Array.isArray(parsed.issues) ? parsed.issues.slice(-MAX_LEDGER_RECORDS) : [],
          lastUpdated: parsed.lastUpdated || Date.now(),
        };
      }
    }

    // Migrazione da archivio precedente se presente
    const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacyRaw) {
      const legacy = JSON.parse(legacyRaw);
      if (legacy && Array.isArray(legacy.records)) {
        const migratedArticles: StoredArticleRecord[] = legacy.records.map((r: any, idx: number) => ({
          id: r.id || `legacy-${idx}`,
          title: r.title || "",
          normalizedTitle: normalizeLedgerText(r.title || ""),
          category: r.category || "Generale",
          topicRef: r.topicRef,
          date: r.date || "Archivio",
          issueNumber: 1,
          timestamp: r.timestamp || Date.now(),
        }));

        const initialLedger: EditorialLedgerState = {
          version: 1,
          currentIssueNumber: 1,
          articles: migratedArticles,
          masterpieces: [],
          books: [],
          words: [],
          issues: [],
          lastUpdated: Date.now(),
        };
        saveEditorialLedger(initialLedger);
        return initialLedger;
      }
    }
  } catch (err) {
    console.warn("Lettura Registro Editoriale:", err);
  }

  return {
    version: 1,
    currentIssueNumber: 1,
    articles: [],
    masterpieces: [],
    books: [],
    words: [],
    issues: [],
    lastUpdated: Date.now(),
  };
}

/**
 * Salva lo stato del Registro Storico Editoriale.
 */
export function saveEditorialLedger(state: EditorialLedgerState): void {
  try {
    const updatedState: EditorialLedgerState = {
      ...state,
      articles: state.articles.slice(-MAX_LEDGER_RECORDS),
      masterpieces: state.masterpieces.slice(-MAX_LEDGER_RECORDS),
      books: state.books.slice(-MAX_LEDGER_RECORDS),
      words: state.words.slice(-MAX_LEDGER_RECORDS),
      issues: state.issues.slice(-MAX_LEDGER_RECORDS),
      lastUpdated: Date.now(),
    };
    localStorage.setItem(LEDGER_STORAGE_KEY, JSON.stringify(updatedState));
  } catch (err) {
    console.warn("Salvataggio Registro Editoriale:", err);
  }
}

/**
 * Restituisce il numero del fascicolo corrente (incrementale per ogni nuovo numero unico generato).
 */
export function getCurrentIssueNumber(): number {
  const ledger = getEditorialLedger();
  return ledger.currentIssueNumber || (ledger.issues.length > 0 ? ledger.issues.length + 1 : 1);
}

/**
 * Incrementa il contatore del fascicolo quando si genera una nuova edizione.
 */
export function incrementIssueNumber(): number {
  const ledger = getEditorialLedger();
  const nextNum = (ledger.currentIssueNumber || 1) + 1;
  saveEditorialLedger({
    ...ledger,
    currentIssueNumber: nextNum,
  });
  return nextNum;
}

/**
 * Restituisce tutte le liste di esclusione per le API di generazione:
 * garantisce che articoli, opere d'arte, libri e parole già usati non vengano mai ripetuti.
 */
export function getExclusionLists(): {
  excludeArticleIds: string[];
  excludeArticleTitles: string[];
  excludeArtworks: string[];
  excludeArtists: string[];
  excludeBooks: string[];
  excludeAuthors: string[];
  excludeWords: string[];
  currentIssueNumber: number;
  totalPublishedIssues: number;
} {
  const ledger = getEditorialLedger();
  return {
    excludeArticleIds: ledger.articles.map((a) => a.id),
    excludeArticleTitles: ledger.articles.map((a) => a.title),
    excludeArtworks: ledger.masterpieces.map((m) => m.artworkTitle),
    excludeArtists: ledger.masterpieces.map((m) => m.artist),
    excludeBooks: ledger.books.map((b) => b.title),
    excludeAuthors: ledger.books.map((b) => b.author),
    excludeWords: ledger.words.map((w) => w.word),
    currentIssueNumber: ledger.currentIssueNumber || 1,
    totalPublishedIssues: ledger.issues.length,
  };
}

/**
 * Verifica se un articolo è già presente nel registro storico (anti-duplicato).
 */
export function isArticleDuplicate(
  article: Partial<Article>,
  ledgerOrState?: EditorialLedgerState | { records: StoredArticleRecord[] } | any
): boolean {
  if (!article || !article.title) return false;
  const currentArticles: StoredArticleRecord[] = ledgerOrState
    ? ('articles' in ledgerOrState ? ledgerOrState.articles : ledgerOrState.records || [])
    : getEditorialLedger().articles;
  const normalizedCandidate = normalizeLedgerText(article.title);
  const articleId = (article.id || "").toLowerCase();

  return currentArticles.some((record) => {
    if (articleId && record.id && record.id.toLowerCase() === articleId) return true;
    if (normalizedCandidate && record.normalizedTitle === normalizedCandidate) return true;
    if (normalizedCandidate && record.normalizedTitle) {
      if (calculateSimilarity(normalizedCandidate, record.normalizedTitle) >= 0.70) return true;
    }
    return false;
  });
}

/**
 * Verifica se un'opera d'arte è già presente nel registro storico (anti-duplicato).
 */
export function isMasterpieceDuplicate(
  artworkTitle: string,
  artist?: string,
  ledger?: EditorialLedgerState
): boolean {
  if (!artworkTitle) return false;
  const currentLedger = ledger || getEditorialLedger();
  const normTitle = normalizeLedgerText(artworkTitle);
  const normArtist = artist ? normalizeLedgerText(artist) : "";

  return currentLedger.masterpieces.some((record) => {
    if (record.normalizedArtwork === normTitle) return true;
    if (normArtist && record.normalizedArtist === normArtist && calculateSimilarity(normTitle, record.normalizedArtwork) >= 0.6) {
      return true;
    }
    if (calculateSimilarity(normTitle, record.normalizedArtwork) >= 0.75) return true;
    return false;
  });
}

/**
 * Verifica se un libro consigliato è già presente nel registro storico (anti-duplicato).
 */
export function isBookDuplicate(
  title: string,
  author?: string,
  ledger?: EditorialLedgerState
): boolean {
  if (!title) return false;
  const currentLedger = ledger || getEditorialLedger();
  const normTitle = normalizeLedgerText(title);
  const normAuthor = author ? normalizeLedgerText(author) : "";

  return currentLedger.books.some((record) => {
    if (record.normalizedTitle === normTitle) return true;
    if (normAuthor && record.normalizedAuthor === normAuthor && calculateSimilarity(normTitle, record.normalizedTitle) >= 0.6) {
      return true;
    }
    if (calculateSimilarity(normTitle, record.normalizedTitle) >= 0.75) return true;
    return false;
  });
}

/**
 * Verifica se una parola del giorno è già presente nel registro storico (anti-duplicato).
 */
export function isWordDuplicate(
  word: string,
  ledger?: EditorialLedgerState
): boolean {
  if (!word) return false;
  const currentLedger = ledger || getEditorialLedger();
  const normWord = normalizeLedgerText(word);

  return currentLedger.words.some((record) => {
    return record.normalizedWord === normWord || record.word.toLowerCase() === word.toLowerCase();
  });
}

/**
 * Registra un'intera edizione (fascicolo) nel Registro Storico Editoriale:
 * archivia tutti gli articoli, il capolavoro d'arte, il libro consigliato, la parola del giorno
 * e l'emissione del fascicolo, garantendo che nessuno di essi venga mai riproposto.
 */
export function recordIssueInLedger(params: {
  issueNumber?: number;
  date: string;
  articles: Article[];
  masterpiece?: {
    artworkTitle: string;
    artist: string;
    year?: string;
    museum?: string;
    matchingTopic?: string;
  };
  book?: {
    title: string;
    author: string;
    year?: string;
    category?: string;
  };
  word?: {
    word: string;
    category?: string;
    definition?: string;
  };
}): void {
  const ledger = getEditorialLedger();
  const issueNum = params.issueNumber || ledger.currentIssueNumber || 1;
  const now = Date.now();

  const newArticles: StoredArticleRecord[] = [];
  for (const art of params.articles) {
    if (!art || !art.title) continue;
    const norm = normalizeLedgerText(art.title);
    if (!ledger.articles.some((r) => r.id === art.id || r.normalizedTitle === norm)) {
      newArticles.push({
        id: art.id,
        title: art.title,
        normalizedTitle: norm,
        category: art.category || "Generale",
        topicRef: art.topicRef,
        date: params.date || art.date || new Date().toLocaleDateString("it-IT"),
        issueNumber: issueNum,
        timestamp: now,
      });
    }
  }

  const newMasterpieces: StoredMasterpieceRecord[] = [];
  if (params.masterpiece && params.masterpiece.artworkTitle) {
    const normArt = normalizeLedgerText(params.masterpiece.artworkTitle);
    const normArtist = normalizeLedgerText(params.masterpiece.artist || "");
    if (!ledger.masterpieces.some((m) => m.normalizedArtwork === normArt)) {
      newMasterpieces.push({
        artworkTitle: params.masterpiece.artworkTitle,
        artist: params.masterpiece.artist || "",
        normalizedArtwork: normArt,
        normalizedArtist: normArtist,
        year: params.masterpiece.year,
        museum: params.masterpiece.museum,
        matchingTopic: params.masterpiece.matchingTopic,
        date: params.date,
        issueNumber: issueNum,
        timestamp: now,
      });
    }
  }

  const newBooks: StoredBookRecord[] = [];
  if (params.book && params.book.title) {
    const normBook = normalizeLedgerText(params.book.title);
    const normAuthor = normalizeLedgerText(params.book.author || "");
    if (!ledger.books.some((b) => b.normalizedTitle === normBook)) {
      newBooks.push({
        title: params.book.title,
        author: params.book.author || "",
        normalizedTitle: normBook,
        normalizedAuthor: normAuthor,
        year: params.book.year,
        category: params.book.category,
        date: params.date,
        issueNumber: issueNum,
        timestamp: now,
      });
    }
  }

  const newWords: StoredWordRecord[] = [];
  if (params.word && params.word.word) {
    const normWord = normalizeLedgerText(params.word.word);
    if (!ledger.words.some((w) => w.normalizedWord === normWord)) {
      newWords.push({
        word: params.word.word,
        normalizedWord: normWord,
        category: params.word.category,
        date: params.date,
        issueNumber: issueNum,
        timestamp: now,
      });
    }
  }

  const isIssueRecorded = ledger.issues.some((i) => i.issueNumber === issueNum);
  const newIssues: StoredIssueRecord[] = isIssueRecorded
    ? ledger.issues
    : [
        ...ledger.issues,
        {
          issueNumber: issueNum,
          date: params.date,
          articlesCount: params.articles.length,
          articleTitles: params.articles.map((a) => a.title),
          masterpieceTitle: params.masterpiece?.artworkTitle || "",
          masterpieceArtist: params.masterpiece?.artist || "",
          bookTitle: params.book?.title || "",
          bookAuthor: params.book?.author || "",
          word: params.word?.word || "",
          timestamp: now,
        },
      ];

  const updatedLedger: EditorialLedgerState = {
    version: 1,
    currentIssueNumber: issueNum,
    articles: [...ledger.articles, ...newArticles].slice(-MAX_LEDGER_RECORDS),
    masterpieces: [...ledger.masterpieces, ...newMasterpieces].slice(-MAX_LEDGER_RECORDS),
    books: [...ledger.books, ...newBooks].slice(-MAX_LEDGER_RECORDS),
    words: [...ledger.words, ...newWords].slice(-MAX_LEDGER_RECORDS),
    issues: newIssues.slice(-MAX_LEDGER_RECORDS),
    lastUpdated: now,
  };

  saveEditorialLedger(updatedLedger);
}

/**
 * Resetta l'archivio (se l'utente richiede una tabula rasa).
 */
export function clearEditorialLedger(): void {
  localStorage.removeItem(LEDGER_STORAGE_KEY);
  localStorage.removeItem(LEGACY_STORAGE_KEY);
}

// -------------------------------------------------------------
// Retrocompatibilità per codice preesistente in App.tsx / altri
// -------------------------------------------------------------
export const isArticlePresentInDb = isArticleDuplicate;
export const registerArticlesInDb = (articles: Article[]) =>
  recordIssueInLedger({
    date: new Date().toLocaleDateString("it-IT"),
    articles,
  });
export const getExcludedHistoryFromDb = () => {
  const exclusions = getExclusionLists();
  return {
    excludeIds: exclusions.excludeArticleIds,
    excludeTitles: exclusions.excludeArticleTitles,
    totalStoredCount: exclusions.excludeArticleTitles.length,
  };
};
export const getArticlesStorageDb = () => {
  const ledger = getEditorialLedger();
  return {
    version: ledger.version,
    capacity: MAX_LEDGER_RECORDS,
    records: ledger.articles,
    lastUpdated: ledger.lastUpdated,
  };
};
export const clearArticlesStorageDb = clearEditorialLedger;
