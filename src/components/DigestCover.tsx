import React from "react";
import { DigestEdition } from "../types";
import { Sparkles, Feather, Bookmark, Clock, Share2 } from "lucide-react";

interface DigestCoverProps {
  digest: DigestEdition;
  onScrollToSection: (sectionId: string) => void;
}

export const DigestCover: React.FC<DigestCoverProps> = ({
  digest,
  onScrollToSection,
}) => {
  return (
    <div className="mb-12">
      {/* Magazine Cover Header Frame */}
      <div className="relative border-2 border-stone-800 bg-[#FAF7F2] p-6 sm:p-10 rounded-sm shadow-md overflow-hidden">
        {/* Vintage Top Stamp & Header */}
        <div className="flex flex-wrap items-center justify-between border-b-2 border-stone-800 pb-4 mb-8 text-xs font-semibold uppercase tracking-widest text-stone-700">
          <div className="flex items-center gap-3">
            <span className="bg-[#8b1e1e] text-white px-2.5 py-0.5 rounded-xs font-bold">
              NUMERO {digest.issueNumber || 1}
            </span>
            <span className="text-stone-800">
              {digest.publicationDate || "Edizione Mensile"}
            </span>
          </div>

          <div className="flex items-center gap-4 text-stone-600 mt-2 sm:mt-0">
            <span className="flex items-center gap-1.5 font-sans">
              <Clock className="w-3.5 h-3.5 text-stone-500" />
              Tempo di lettura: {digest.readingTimeMinutes || 12} min
            </span>
            <span className="hidden md:inline font-sans text-stone-400">&bull;</span>
            <span className="hidden md:inline text-stone-700">
              Edizione Curata Esclusiva
            </span>
          </div>
        </div>

        {/* Big Magazine Title Banner */}
        <div className="text-center my-6">
          <div className="inline-block text-[11px] tracking-[0.35em] text-[#8b1e1e] uppercase font-bold mb-2">
            Rassegna Ragionata & Indagini Scelte
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-serif-title tracking-tight text-stone-900 leading-tight mb-4">
            {digest.editionTitle}
          </h1>
          <p className="max-w-3xl mx-auto text-lg sm:text-xl font-serif-body italic text-stone-700 leading-relaxed">
            "{digest.editionSubtitle}"
          </p>
        </div>

        {/* Cover Teaser Cards Grid (In Questo Numero) */}
        <div className="mt-10 pt-8 border-t border-stone-300">
          <h2 className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-4 text-center">
            &bull; In Questo Numero &bull;
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {digest.sections.slice(0, 3).map((sec, idx) => {
              const leadArticle = sec.articles[0];
              return (
                <div
                  key={idx}
                  onClick={() => onScrollToSection(`section-${idx}`)}
                  className="cursor-pointer group p-3.5 bg-white/70 hover:bg-white rounded border border-stone-200 hover:border-amber-700/50 transition-all shadow-2xs hover:shadow-xs"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8b1e1e] block mb-1">
                    {sec.category}
                  </span>
                  <h3 className="font-serif-title font-bold text-sm text-stone-900 group-hover:text-amber-900 line-clamp-2 leading-snug">
                    {leadArticle?.title || sec.category}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                    {leadArticle?.subtitle || leadArticle?.keyTakeaway || "Approfondimento e curiosità d'autore."}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Editorial of the Chief Editor */}
      <div className="mt-8 bg-white border border-stone-200 rounded-sm p-6 sm:p-10 shadow-xs">
        <div className="flex items-center justify-between border-b border-stone-200 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-900">
              <Feather className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#8b1e1e] block">
                Editoriale di Benvenuto
              </span>
              <h2 className="text-xl sm:text-2xl font-serif-title font-bold text-stone-900">
                {digest.editorial.title}
              </h2>
            </div>
          </div>
        </div>

        {/* Opening Philosophical Quote */}
        {digest.editorial.quote && (
          <blockquote className="my-5 pl-4 border-l-3 border-[#8b1e1e] italic text-stone-700 font-serif-body text-base sm:text-lg bg-amber-50/40 py-2.5 pr-4 rounded-r">
            «{digest.editorial.quote}»
          </blockquote>
        )}

        {/* Narrative Editorial Text with Drop Cap */}
        <div className="font-serif-body text-stone-800 text-base sm:text-lg leading-relaxed space-y-4">
          {digest.editorial.content.split("\n\n").map((paragraph, pIdx) => (
            <p
              key={pIdx}
              className={pIdx === 0 ? "digest-drop-cap" : ""}
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* Signature */}
        <div className="mt-8 pt-4 border-t border-stone-100 flex items-center justify-end text-right">
          <div>
            <div className="font-serif-title font-bold text-base text-stone-900">
              {digest.editorial.author}
            </div>
            <div className="text-xs text-stone-500 italic">
              {digest.editorial.role}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
