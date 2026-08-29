import React from "react";
import {
  BookOpen,
  Sparkles,
  ListOrdered,
  FileSpreadsheet,
  Archive,
  Sun,
  Moon,
  Coffee,
  RotateCcw
} from "lucide-react";
import { ReaderTheme, FontSize } from "../types";

interface HeaderProps {
  activeTab: "reader" | "interests" | "archive";
  setActiveTab: (tab: "reader" | "interests" | "archive") => void;
  onOpenGenerateModal: () => void;
  onOpenSheetsModal: () => void;
  isGenerating: boolean;
  theme: ReaderTheme;
  setTheme: (theme: ReaderTheme) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  hasSheetsConnection: boolean;
  highPriorityCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenGenerateModal,
  onOpenSheetsModal,
  isGenerating,
  theme,
  setTheme,
  fontSize,
  setFontSize,
  hasSheetsConnection,
  highPriorityCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-stone-200 shadow-xs no-print">
      {/* Top Banner / Masthead mini */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between border-b border-stone-100 text-xs text-stone-500 font-medium">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-100/80 text-amber-900 font-semibold uppercase tracking-wider text-[10px]">
            <Sparkles className="w-3 h-3 text-amber-700" />
            Curato per te
          </span>
          <span className="hidden sm:inline text-stone-600">
            I Miei Interessi &bull; Rivista di Approfondimento & Curiosità
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSheetsModal}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-colors ${
              hasSheetsConnection
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                : "bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200"
            }`}
            title="Sincronizzazione Google Sheets"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>
              {hasSheetsConnection ? "Google Sheet Connesso" : "Collega Google Sheet"}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          </button>

          <span className="hidden md:inline px-2 py-0.5 rounded bg-stone-100 text-stone-600">
            {highPriorityCount} temi Priorità 4-5
          </span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab("reader")}
            className="text-left group focus:outline-none"
          >
            <span className="block text-[10px] tracking-[0.25em] uppercase text-stone-500 font-bold font-sans">
              Edizione Esclusiva
            </span>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-stone-900 font-serif-title group-hover:text-amber-900 transition-colors">
              PERSONAL <span className="text-[#8b1e1e]">DIGEST</span>
            </h1>
          </button>
        </div>

        {/* Tab Navigation */}
        <nav className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg border border-stone-200 text-sm font-medium">
          <button
            onClick={() => setActiveTab("reader")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
              activeTab === "reader"
                ? "bg-white text-stone-900 shadow-xs font-semibold"
                : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/60"
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-800" />
            <span>Rivista</span>
          </button>

          <button
            onClick={() => setActiveTab("interests")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
              activeTab === "interests"
                ? "bg-white text-stone-900 shadow-xs font-semibold"
                : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/60"
            }`}
          >
            <ListOrdered className="w-4 h-4 text-stone-700" />
            <span className="hidden sm:inline">Interessi & Priorità</span>
            <span className="sm:hidden">Interessi</span>
          </button>

          <button
            onClick={() => setActiveTab("archive")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
              activeTab === "archive"
                ? "bg-white text-stone-900 shadow-xs font-semibold"
                : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/60"
            }`}
          >
            <Archive className="w-4 h-4 text-stone-700" />
            <span className="hidden sm:inline">Archivio</span>
          </button>
        </nav>

        {/* Action Controls & Reading Mode */}
        <div className="flex items-center gap-2">
          {/* Theme selector */}
          <div className="hidden lg:flex items-center bg-stone-100 rounded-lg p-0.5 border border-stone-200">
            <button
              onClick={() => setTheme("classic")}
              title="Tema Carta Classica"
              className={`p-1.5 rounded-md transition-colors ${
                theme === "classic" ? "bg-white shadow-xs text-amber-900" : "text-stone-500 hover:text-stone-900"
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTheme("sepia")}
              title="Tema Caldo Sepia"
              className={`p-1.5 rounded-md transition-colors ${
                theme === "sepia" ? "bg-[#f4ece1] shadow-xs text-amber-950 font-bold" : "text-stone-500 hover:text-stone-900"
              }`}
            >
              <Coffee className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTheme("dark")}
              title="Tema Notturno"
              className={`p-1.5 rounded-md transition-colors ${
                theme === "dark" ? "bg-stone-900 text-stone-100 shadow-xs" : "text-stone-500 hover:text-stone-900"
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Generate New Issue Button */}
          <button
            onClick={onOpenGenerateModal}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#8b1e1e] hover:bg-[#721818] text-white text-xs sm:text-sm font-semibold shadow-sm hover:shadow transition-all disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" />
                <span className="hidden sm:inline">Redazione in corso...</span>
                <span className="sm:hidden">Scrivendo...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Genera Nuovo Numero</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
