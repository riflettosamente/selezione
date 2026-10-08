import React, { useState } from "react";
import { ArticleAiMeta } from "../types";
import { Cpu } from "lucide-react";

interface ArticleStatusMarkerProps {
  aiMeta?: ArticleAiMeta;
  title?: string;
  size?: "sm" | "md";
}

export const ArticleStatusMarker: React.FC<ArticleStatusMarkerProps> = ({
  aiMeta,
  title,
  size = "sm"
}) => {
  const [isTouched, setIsTouched] = useState(false);

  const status = aiMeta?.status || "completed";
  const provider = (aiMeta?.provider || "groq").toUpperCase();
  const model = aiMeta?.model || "llama-3.3-70b-versatile";
  const promptTokens = aiMeta?.promptTokens;
  const completionTokens = aiMeta?.completionTokens;
  const totalTokens = aiMeta?.totalTokens || ((promptTokens || 0) + (completionTokens || 0));

  // Determina il colore del pallino marcatore e la descrizione dello stato
  let dotBg = "bg-emerald-500 border-emerald-300 shadow-emerald-500/50";
  let statusText = "Completato";
  let statusBadgeBg = "bg-emerald-100 text-emerald-800 border-emerald-300";

  if (status === "in_production") {
    dotBg = "bg-amber-400 border-amber-200 animate-pulse shadow-amber-400/80";
    statusText = "In Produzione (60s step)";
    statusBadgeBg = "bg-amber-100 text-amber-900 border-amber-300";
  } else if (status === "queued") {
    dotBg = "bg-slate-400 border-slate-300";
    statusText = "In Coda";
    statusBadgeBg = "bg-slate-100 text-slate-800 border-slate-300";
  }

  const dotSizeClass = size === "md" ? "w-3 h-3" : "w-2.5 h-2.5";

  return (
    <div
      className="relative inline-flex items-center shrink-0 group/marker my-auto"
      onClick={(e) => {
        e.stopPropagation();
        setIsTouched(!isTouched);
      }}
      onTouchStart={(e) => {
        e.stopPropagation();
        setIsTouched(!isTouched);
      }}
      tabIndex={0}
      role="button"
      aria-label={`Stato articolo: ${statusText}`}
    >
      {/* Pallino Marcatore */}
      <span
        className={`inline-block rounded-full border ${dotBg} ${dotSizeClass} cursor-pointer transition-transform duration-200 group-hover/marker:scale-125`}
        title={`Stato stesura: ${statusText}`}
      />

      {/* Popup Tooltip con Token usati e Modello LM (attivo su Hover desktop o Tap mobile) */}
      <div
        className={`absolute left-0 bottom-full mb-2 z-50 w-60 sm:w-64 p-3 rounded-lg bg-stone-900 text-stone-100 text-xs shadow-2xl border border-stone-700 backdrop-blur-md pointer-events-none transition-all duration-150 ${
          isTouched ? "block" : "hidden group-hover/marker:block"
        }`}
        style={{ transform: "translateX(-8px)" }}
      >
        <div className="flex items-center justify-between gap-1 pb-1.5 border-b border-stone-800 mb-2">
          <div className="flex items-center gap-1.5 font-bold font-sans min-w-0">
            <Cpu className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-amber-300 font-mono text-[11px] truncate" title={model}>
              {model}
            </span>
          </div>
          <span className={`px-1.5 py-0.5 rounded text-[9px] font-sans font-bold border uppercase tracking-wider shrink-0 ${statusBadgeBg}`}>
            {status === "completed" ? "✓ Completato" : status === "in_production" ? "⚡ In stesura" : "In coda"}
          </span>
        </div>

        <div className="space-y-1.5 font-sans text-[11px]">
          {status === "in_production" ? (
            <p className="text-amber-200/90 italic leading-snug">
              Articolo in fase di stesura con pausa di 60s per rispettare i limiti TPM di Groq.
            </p>
          ) : (
            <>
              <div className="flex justify-between items-center text-stone-300">
                <span>Fornitore AI:</span>
                <span className="font-semibold text-stone-100">{provider}</span>
              </div>
              <div className="flex justify-between items-center text-stone-300">
                <span>Token Prompt:</span>
                <span className="font-mono text-stone-200">{promptTokens ? promptTokens.toLocaleString("it-IT") : "380 ~ 450"}</span>
              </div>
              <div className="flex justify-between items-center text-stone-300">
                <span>Token Output:</span>
                <span className="font-mono text-stone-200">{completionTokens ? completionTokens.toLocaleString("it-IT") : "1.050 ~ 1.250"}</span>
              </div>
              <div className="pt-1 border-t border-stone-800 flex justify-between items-center font-bold text-amber-300">
                <span>Token Totali:</span>
                <span className="font-mono text-xs">{totalTokens ? totalTokens.toLocaleString("it-IT") : "1.500"} token</span>
              </div>
            </>
          )}
        </div>

        {title && (
          <div className="mt-2 pt-1.5 border-t border-stone-800 text-[10px] text-stone-400 italic truncate">
            {title}
          </div>
        )}
      </div>
    </div>
  );
};
