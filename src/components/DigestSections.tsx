import React, { useState } from "react";
import { DigestSection, DigestArticle } from "../types";
import {
  Bookmark,
  Share2,
  Check,
  Compass,
  Atom,
  Telescope,
  Scroll,
  Brain,
  Sparkles,
  Layers,
  Flame,
  Globe,
  Info,
  Clock
} from "lucide-react";

interface DigestSectionsProps {
  sections: DigestSection[];
  fontSize: string;
}

const CATEGORY_ICONS: Record<string, any> = {
  "Archeologia Misteriosa": Scroll,
  "Frontiere della Fisica": Atom,
  "Misteri & Criptografia": Compass,
  "Astronomia & Cosmo": Telescope,
  "Neuroscienze & Mente": Brain,
  "Storia & Biografie Insolite": Layers,
  "Natura & Bizzarrie Evolutive": Globe,
  "Cultura & Visioni": Sparkles,
};

export const DigestSections: React.FC<DigestSectionsProps> = ({
  sections,
  fontSize,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  const handleCopyArticle = (article: DigestArticle) => {
    const textToCopy = `${article.title}\n\n${article.subtitle ? article.subtitle + "\n\n" : ""}${article.content}\n\nSpunto di riflessione: ${article.keyTakeaway || ""}\nFonte: ${article.sourceContext || ""}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(article.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleBookmark = (id: string) => {
    const next = new Set(bookmarkedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setBookmarkedIds(next);
  };

  const getTextSizeClass = () => {
    switch (fontSize) {
      case "sm":
        return "text-base sm:text-base leading-relaxed";
      case "lg":
        return "text-lg sm:text-xl leading-loose";
      case "xl":
        return "text-xl sm:text-2xl leading-loose";
      case "base":
      default:
        return "text-base sm:text-lg leading-relaxed";
    }
  };

  return (
    <div className="space-y-14">
      {sections.map((section, sIdx) => {
        const IconComponent = CATEGORY_ICONS[section.category] || Compass;

        return (
          <section
            key={sIdx}
            id={`section-${sIdx}`}
            className="scroll-mt-24"
          >
            {/* Thematic Category Header */}
            <div className="flex items-center gap-3 border-b-2 border-stone-800 pb-3 mb-8">
              <div className="p-2 rounded bg-stone-900 text-white">
                <IconComponent className="w-5 h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-stone-900 font-sans">
                {section.category}
              </h2>
              <div className="ml-auto text-xs text-stone-500 font-sans font-medium">
                {section.articles.length} {section.articles.length === 1 ? "approfondimento" : "approfondimenti"}
              </div>
            </div>

            {/* Articles in this Category */}
            <div className="space-y-10">
              {section.articles.map((article, aIdx) => {
                const isBookmarked = bookmarkedIds.has(article.id);
                const isCopied = copiedId === article.id;

                return (
                  <article
                    key={article.id || aIdx}
                    className="bg-white border border-stone-200 rounded-sm p-6 sm:p-8 shadow-xs hover:border-stone-300 transition-colors"
                  >
                    {/* Top Metadata Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-stone-500 mb-3 font-sans">
                      <div className="flex items-center gap-2">
                        {article.badge && (
                          <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-[#8b1e1e] font-semibold border border-red-200">
                            {article.badge}
                          </span>
                        )}
                        {article.readTime && (
                          <span className="flex items-center gap-1 text-stone-500">
                            <Clock className="w-3 h-3" />
                            {article.readTime}
                          </span>
                        )}
                        {article.priority && (
                          <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-900 font-medium text-[11px]">
                            Priorità {article.priority}
                          </span>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5 no-print">
                        <button
                          onClick={() => handleCopyArticle(article)}
                          className="p-1.5 rounded-md hover:bg-stone-100 text-stone-600 hover:text-stone-900 transition-colors"
                          title="Copia testo articolo"
                        >
                          {isCopied ? (
                            <Check className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Share2 className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => toggleBookmark(article.id)}
                          className={`p-1.5 rounded-md hover:bg-stone-100 transition-colors ${
                            isBookmarked
                              ? "text-amber-800"
                              : "text-stone-600 hover:text-stone-900"
                          }`}
                          title={isBookmarked ? "Rimuovi dai preferiti" : "Salva tra i preferiti"}
                        >
                          <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
                        </button>
                      </div>
                    </div>

                    {/* Article Headline & Subtitle */}
                    <h3 className="text-2xl sm:text-3xl font-serif-title font-black text-stone-900 leading-tight mb-2">
                      {article.title}
                    </h3>

                    {article.subtitle && (
                      <p className="font-serif-body italic text-stone-600 text-base sm:text-lg mb-6 leading-snug">
                        {article.subtitle}
                      </p>
                    )}

                    {/* Main Narrative Content (1-2 Rich Paragraphs) */}
                    <div className={`font-serif-body text-stone-800 ${getTextSizeClass()} space-y-4`}>
                      {article.content.split("\n\n").map((para, pIdx) => (
                        <p key={pIdx}>{para}</p>
                      ))}
                    </div>

                    {/* Spunto di Riflessione & Key Takeaway Box */}
                    {article.keyTakeaway && (
                      <div className="mt-6 p-4 rounded bg-amber-50/70 border-l-4 border-[#8b1e1e] text-stone-800">
                        <div className="text-xs uppercase font-bold text-[#8b1e1e] tracking-wider mb-1 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" />
                          Spunto di Riflessione
                        </div>
                        <p className="font-serif-body italic text-sm sm:text-base text-stone-800 leading-relaxed">
                          «{article.keyTakeaway}»
                        </p>
                      </div>
                    )}

                    {/* Source & Context Badge */}
                    {article.sourceContext && (
                      <div className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-2 text-xs text-stone-500 italic">
                        <Info className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span>Fonte & Contesto: {article.sourceContext}</span>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
};
