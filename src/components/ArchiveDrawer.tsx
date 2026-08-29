import React from "react";
import { DigestEdition } from "../types";
import { Archive, BookOpen, Trash2, Clock, Sparkles } from "lucide-react";

interface ArchiveDrawerProps {
  editions: DigestEdition[];
  currentEditionId: string;
  onSelectEdition: (edition: DigestEdition) => void;
  onDeleteEdition: (id: string) => void;
  onOpenNewModal: () => void;
}

export const ArchiveDrawer: React.FC<ArchiveDrawerProps> = ({
  editions,
  currentEditionId,
  onSelectEdition,
  onDeleteEdition,
  onOpenNewModal,
}) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-white border border-stone-200 rounded-sm p-6 mb-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-6 mb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8b1e1e] mb-1 font-sans">
              <Archive className="w-4 h-4" />
              Archivio Uscite &bull; Collezione Personale
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif-title font-bold text-stone-900">
              Numeri Pubblicati
            </h1>
            <p className="text-sm text-stone-600 font-sans mt-1">
              Rileggi le edizioni precedenti della tua rivista digitale di approfondimento.
            </p>
          </div>

          <button
            onClick={onOpenNewModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#8b1e1e] hover:bg-[#741919] text-white text-xs sm:text-sm font-semibold transition-all shadow-sm self-start sm:self-auto"
          >
            <Sparkles className="w-4 h-4" />
            <span>Redigi Nuovo Numero</span>
          </button>
        </div>

        <div className="text-xs text-stone-500 font-medium">
          Totale uscite archiviate: <strong>{editions.length}</strong>
        </div>
      </div>

      {/* Editions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {editions.map((ed) => {
          const isCurrent = ed.id === currentEditionId;
          const articleCount = ed.sections.reduce((acc, s) => acc + s.articles.length, 0);

          return (
            <div
              key={ed.id}
              className={`bg-white border rounded-sm p-6 flex flex-col justify-between transition-all ${
                isCurrent
                  ? "border-[#8b1e1e] ring-2 ring-[#8b1e1e]/20 shadow-md bg-amber-50/10"
                  : "border-stone-200 hover:border-stone-300 shadow-xs hover:shadow"
              }`}
            >
              <div>
                {/* Badge Row */}
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="font-bold uppercase tracking-widest text-[#8b1e1e] bg-red-50 px-2 py-0.5 rounded border border-red-100 font-sans text-[10px]">
                    NUMERO {ed.issueNumber}
                  </span>
                  <span className="text-stone-500 font-sans">
                    {ed.publicationDate}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-serif-title font-bold text-xl text-stone-900 leading-snug mb-2 line-clamp-2">
                  {ed.editionTitle}
                </h3>

                <p className="font-serif-body italic text-stone-600 text-xs sm:text-sm mb-4 line-clamp-3">
                  "{ed.editionSubtitle}"
                </p>

                {/* Metadata */}
                <div className="text-xs text-stone-500 font-sans space-y-1 mb-6 pt-3 border-t border-stone-100">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-stone-400" />
                    <span>{ed.sections.length} sezioni &bull; {articleCount} articoli curati</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    <span>Lettura: ~{ed.readingTimeMinutes || 10} minuti</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-stone-100 gap-2">
                <button
                  onClick={() => onSelectEdition(ed)}
                  className={`flex-1 py-2 px-3 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                    isCurrent
                      ? "bg-[#8b1e1e] text-white"
                      : "bg-stone-100 hover:bg-stone-200 text-stone-800"
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{isCurrent ? "In Lettura" : "Apri & Leggi"}</span>
                </button>

                {editions.length > 1 && (
                  <button
                    onClick={() => {
                      if (confirm(`Eliminare l'edizione "${ed.editionTitle}" dall'archivio?`)) {
                        onDeleteEdition(ed.id);
                      }
                    }}
                    className="p-2 rounded text-stone-400 hover:text-red-700 hover:bg-red-50 transition-colors"
                    title="Elimina edizione"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
