export interface SourceReference {
  title: string;
  url: string;
  publisher: string;
  originalLanguage?: string;
  keyFinding?: string;
  authorsOrInstitution?: string;
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
  imageUrl?: string;
  artworkTitle?: string;
  artworkArtist?: string;
  artworkImageUrl?: string;
  artworkYear?: string;
  artworkMuseum?: string;
}

export interface InterestItem {
  id: string;
  category: string;
  topic: string;
  description: string;
  priority: number; // 1 to 5
  sources?: string;
  enabled: boolean;
}

export interface ArtMasterpiece {
  id?: string;
  artworkTitle: string;
  artist: string;
  shortArtworkTitle?: string;
  year?: string;
  museum?: string;
  city?: string;
  artworkType?: string; // e.g. "Quadro / Dipinto", "Disegno d'Autore", "Illustrazione Scientifica", "Incisione", "Scultura"
  matchingCategory?: string;
  matchingTopic?: string;
  whyConnected?: string;
  imageUrl?: string;
  fallbackImageUrl?: string;
  coverAccentColor?: string;
  article?: Article;
}

export interface RecommendedBook {
  title: string;
  author: string;
  year?: string;
  publisher?: string;
  category: string;
  matchingTopic: string;
  synopsis: string;
  whyRecommended: string;
  highlightQuote?: string;
  readingTime?: string;
  pagesCount?: string;
  sourceSheet?: string;
}

export interface DailyWord {
  word: string;
  phonetic?: string;
  grammaticalClass: string;
  category: string;
  matchingTopic?: string;
  etymology: string;
  definition: string;
  nuanceAndUsage: string;
  literaryQuote: string;
  quoteAuthor: string;
  quoteSource?: string;
  quizQuestion?: string;
  quizOptions?: string[];
  correctQuizIndex?: number;
  quizExplanation?: string;
  didYouKnow?: string;
  sourceSheet?: string;
}

export interface DailyQuoteItem {
  quote: string;
  author: string;
  source: string;
  anecdoteTitle: string;
  anecdote: string;
  matchingTopic?: string;
  category?: string;
  date?: string;
  sourceSheet?: string;
}

export type ReaderTheme = "classic" | "sepia" | "dark" | "paper";
export type FontSize = "sm" | "base" | "lg" | "xl";

// ==========================================
// REGISTRO STORICO DI PUBBLICAZIONE (LEDGER)
// ==========================================

export interface StoredArticleRecord {
  id: string;
  title: string;
  normalizedTitle: string;
  category: string;
  topicRef?: string;
  date: string;
  issueNumber: number;
  timestamp: number;
}

export interface StoredMasterpieceRecord {
  artworkTitle: string;
  artist: string;
  normalizedArtwork: string;
  normalizedArtist: string;
  year?: string;
  museum?: string;
  matchingTopic?: string;
  date: string;
  issueNumber: number;
  timestamp: number;
}

export interface StoredBookRecord {
  title: string;
  author: string;
  normalizedTitle: string;
  normalizedAuthor: string;
  year?: string;
  category?: string;
  date: string;
  issueNumber: number;
  timestamp: number;
}

export interface StoredWordRecord {
  word: string;
  normalizedWord: string;
  category?: string;
  date: string;
  issueNumber: number;
  timestamp: number;
}

export interface StoredQuoteRecord {
  quote: string;
  author: string;
  anecdoteTitle: string;
  normalizedTitle: string;
  date: string;
  issueNumber: number;
  timestamp: number;
}

export interface StoredIssueRecord {
  issueNumber: number;
  date: string;
  articlesCount: number;
  articleTitles: string[];
  masterpieceTitle: string;
  masterpieceArtist: string;
  bookTitle: string;
  bookAuthor: string;
  word: string;
  quoteTitle?: string;
  quoteAuthor?: string;
  timestamp: number;
}

export interface EditorialLedgerState {
  version: number;
  currentIssueNumber: number;
  articles: StoredArticleRecord[];
  masterpieces: StoredMasterpieceRecord[];
  books: StoredBookRecord[];
  words: StoredWordRecord[];
  quotes?: StoredQuoteRecord[];
  issues: StoredIssueRecord[];
  lastUpdated: number;
}

