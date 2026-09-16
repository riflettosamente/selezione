import { Article } from "../types";

export interface ShortStoryMetadata {
  id: string;
  storyWorkTitle: string;
  storyAuthor: string;
  storyYear: string;
  storyCulture: string;
  storyOriginalCollection: string;
  title: string;
  shortTitle: string;
  excerpt: string;
  content: string;
  readingTime: string;
  highlightQuote: string;
  sources: { title: string; url: string; publisher: string; originalLanguage?: string; keyFinding?: string }[];
}

export function isShortStoryTopic(topic: string, category: string): boolean {
  if (!topic && !category) return false;
  const t = (topic || "").toLowerCase();
  const c = (category || "").toLowerCase();
  return (
    t.includes("narrativa breve") ||
    t.includes("racconto") ||
    t.includes("racconti") ||
    t.includes("short story") ||
    (c.includes("cultura") && t.includes("narrativa")) ||
    (c.includes("letteratura") && t.includes("racconto"))
  );
}

export function formatStoryAsArticle(
  story: ShortStoryMetadata,
  dateFormatted: string,
  index: number
): Article {
  return {
    id: `story-${story.id || Date.now()}-${index}`,
    pageNumber: index + 2,
    category: "Cultura",
    topicRef: "Narrativa Breve",
    title: story.title,
    shortTitle: story.shortTitle,
    excerpt: story.excerpt,
    content: story.content,
    readingTime: story.readingTime || "7 min",
    author: story.storyAuthor ? `${story.storyAuthor} (${story.storyYear || "Classico"})` : "Tradizione Classica",
    date: dateFormatted || "Oggi",
    highlightQuote: story.highlightQuote,
    originalLanguage: story.storyCulture || "Italiano",
    isCondensedBook: false,
    isShortStory: true,
    storyWorkTitle: story.storyWorkTitle,
    storyAuthor: story.storyAuthor,
    storyYear: story.storyYear,
    storyCulture: story.storyCulture,
    storyOriginalCollection: story.storyOriginalCollection,
    sources: story.sources || []
  };
}
