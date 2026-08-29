import React from "react";
import { SpecialFeature as SpecialFeatureType } from "../types";
import { Sparkles, Lightbulb, HelpCircle } from "lucide-react";

interface SpecialFeatureProps {
  feature: SpecialFeatureType;
}

export const SpecialFeature: React.FC<SpecialFeatureProps> = ({
  feature,
}) => {
  if (!feature) return null;

  return (
    <div className="mt-16 bg-[#FDFBF7] border-2 border-dashed border-amber-800/40 rounded-sm p-6 sm:p-10 shadow-xs relative overflow-hidden">
      {/* Decorative Ribbon Stamp */}
      <div className="flex flex-wrap items-center justify-between border-b border-amber-800/20 pb-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#8b1e1e] text-white flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#8b1e1e] block font-sans">
              Rubrica Speciale Finale
            </span>
            <h2 className="text-xl sm:text-2xl font-serif-title font-bold text-stone-900">
              {feature.rubricName || "La Chicca dell'Editor: Curiosità Bizzarre dal Mondo"}
            </h2>
          </div>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-2xl sm:text-3xl font-serif-title font-black text-stone-900 mb-4 leading-tight">
        {feature.title}
      </h3>

      {/* Story Text */}
      <div className="font-serif-body text-stone-800 text-base sm:text-lg leading-relaxed space-y-4 mb-6">
        {feature.story.split("\n\n").map((para, idx) => (
          <p key={idx}>{para}</p>
        ))}
      </div>

      {/* Why It Matters Callout */}
      {feature.whyItMatters && (
        <div className="bg-amber-100/60 border border-amber-200/80 rounded p-4 mb-4 text-sm sm:text-base font-serif-body text-stone-800">
          <div className="flex items-center gap-2 text-amber-950 font-bold font-sans text-xs uppercase tracking-wider mb-1">
            <Lightbulb className="w-4 h-4 text-amber-700" />
            Il Fascino Nascosto
          </div>
          <p className="italic">{feature.whyItMatters}</p>
        </div>
      )}

      {/* Trivia Fact Highlight */}
      {feature.triviaFact && (
        <div className="bg-white border-l-4 border-[#8b1e1e] p-4 rounded-r shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#8b1e1e] mb-1 font-sans flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5" />
            Curiosità Lampo
          </div>
          <p className="font-sans text-sm sm:text-base font-medium text-stone-800">
            {feature.triviaFact}
          </p>
        </div>
      )}
    </div>
  );
};
