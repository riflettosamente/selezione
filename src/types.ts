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

export interface DigestArticle {
  id: string;
  title: string;
  subtitle?: string;
  topicRef?: string;
  priority?: number;
  readTime?: string;
  badge?: string;
  content: string;
  keyTakeaway?: string;
  sourceContext?: string;
}

export interface DigestSection {
  category: string;
  iconSuggestion?: string;
  articles: DigestArticle[];
}

export interface DigestEditorial {
  title: string;
  author: string;
  role: string;
  content: string;
  quote?: string;
}

export interface SpecialFeature {
  title: string;
  rubricName: string;
  story: string;
  whyItMatters: string;
  triviaFact: string;
}

export interface DigestEdition {
  id: string;
  issueNumber: number;
  editionTitle: string;
  editionSubtitle: string;
  publicationDate: string;
  readingTimeMinutes: number;
  editorial: DigestEditorial;
  sections: DigestSection[];
  specialFeature: SpecialFeature;
  htmlContent: string;
  generatedAt: string;
  topicsUsedCount: number;
  themeStyle?: "classic-digest" | "editorial-serif" | "modern-clean" | "warm-sepia";
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
  timestamp: number;
}

export interface EditorialLedgerState {
  version: number;
  currentIssueNumber: number;
  articles: StoredArticleRecord[];
  masterpieces: StoredMasterpieceRecord[];
  books: StoredBookRecord[];
  words: StoredWordRecord[];
  issues: StoredIssueRecord[];
  lastUpdated: number;
}

