import React, { useState } from "react";
import { InterestItem } from "../types";
import { Sparkles, Star, Feather, BookOpen, Clock, AlertCircle } from "lucide-react";

interface GenerateDigestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (options: {
    editionName: string;
    customInstructions: string;
    issueNumber: number;
  }) => Promise<void>;
  interests: InterestItem[];
  currentIssueCount: number;
  isGenerating: boolean;
}

export const GenerateDigestModal: React.FC<GenerateDigestModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
  interests,
  currentIssueCount,
  isGenerating,
}) => {
  const [editionName, setEditionName] = useState(`Edizione ${new Date().toLocaleDateString("it-IT", { month: "long", year: "numeric" })}`);
  const [issueNumber, setIssueNumber] = useState(currentIssueCount + 1);
  const [customInstructions, setCustomInstructions] = useState("");

  if (!isOpen) return null;

  const highPriorityTopics = interests.filter((i) => i.enabled && i.priority >= 4);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onGenerate({
      editionName,
      customInstructions,
      issueNumber,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white border border-stone-300 rounded-sm shadow-xl max-w-2xl w-full p-6 sm:p-8 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
              <Feather className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif-title font-bold text-xl text-stone-900">
                Stesura Personal Digest
              </h3>
              <p className="text-xs text-stone-500 font-sans">
                L'Editor Capo curerà il nuovo numero basato sui tuoi argomenti a Priorità 4 e 5
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isGenerating}
            className="text-stone-400 hover:text-stone-700 font-bold p-1 disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Titolo / Mese dell'Edizione
              </label>
              <input
                type="text"
                value={editionName}
                onChange={(e) => setEditionName(e.target.value)}
                placeholder="es. Edizione Autunnale, Focus Enigmi..."
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Numero Uscita
              </label>
              <input
                type="number"
                min="1"
                value={issueNumber}
                onChange={(e) => setIssueNumber(Number(e.target.value))}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-600"
                required
              />
            </div>
          </div>

          {/* Active Priority 4 & 5 Topics preview */}
          <div className="bg-amber-50/60 border border-amber-200/80 rounded p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8b1e1e] flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                Argomenti Selezionati ({highPriorityTopics.length})
              </span>
              <span className="text-[11px] text-stone-500">
                Solo temi con Priorità 4 e 5 attivi
              </span>
            </div>

            {highPriorityTopics.length === 0 ? (
              <div className="text-xs text-amber-900 italic">
                Attenzione: nessun argomento ha priorità 4 o 5. Verranno utilizzati gli argomenti attivi generali.
              </div>
            ) : (
              <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                {highPriorityTopics.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between text-xs bg-white px-2.5 py-1.5 rounded border border-amber-200/60"
                  >
                    <span className="font-serif-title font-medium text-stone-900 truncate mr-2">
                      {t.topic}
                    </span>
                    <span className="shrink-0 px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[10px]">
                      ★ {t.priority}/5
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
              Istruzioni Particolari per l'Editor Capo (Opzionale)
            </label>
            <textarea
              rows={3}
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              placeholder="es. Metti in risalto gli enigmi dell'archeologia marina e approfondisci i paradossi temporali della fisica quantistica..."
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-600"
            />
          </div>

          {/* Guidelines reminder */}
          <div className="text-xs text-stone-500 italic flex items-center gap-2 pt-1">
            <BookOpen className="w-4 h-4 text-stone-400 shrink-0" />
            <span>
              Generazione con tono giornalistico divulgativo d'autore, 1-2 storie narrate per argomento, editoriale di copertina e rubrica speciale finale.
            </span>
          </div>

          {/* Actions */}
          <div className="mt-6 pt-4 border-t border-stone-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isGenerating}
              className="px-4 py-2 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs sm:text-sm font-semibold transition-colors disabled:opacity-50"
            >
              Annulla
            </button>

            <button
              type="submit"
              disabled={isGenerating}
              className="inline-flex items-center gap-2 px-5 py-2 rounded bg-[#8b1e1e] hover:bg-[#721818] text-white text-xs sm:text-sm font-semibold transition-all disabled:opacity-50 shadow-xs"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Redazione in corso...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Avvia Redazione del Digest</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
