import React, { useState, useEffect } from "react";
import { Cpu, Zap, ShieldCheck, X, RefreshCw, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

interface AiStatus {
  success: boolean;
  provider: "groq" | "openrouter" | "gemini" | "none";
  model: string;
  hasGroqKey: boolean;
  hasOpenRouterKey: boolean;
  hasGeminiKey: boolean;
  zeroGoogleTokens: boolean;
  description: string;
}

interface TestResult {
  success: boolean;
  provider?: string;
  model?: string;
  zeroGoogleTokens?: boolean;
  reply?: string;
  latencyMs?: number;
  message?: string;
  error?: string;
}

interface AiEngineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiEngineModal: React.FC<AiEngineModalProps> = ({ isOpen, onClose }) => {
  const [status, setStatus] = useState<AiStatus | null>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const fetchStatus = async () => {
    setIsLoadingStatus(true);
    try {
      const res = await fetch("/api/ai/status");
      const data = await res.json();
      setStatus(data);
    } catch (err) {
      console.error("Errore nel recupero dello stato AI:", err);
    } finally {
      setIsLoadingStatus(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
      setTestResult(null);
    }
  }, [isOpen]);

  const handleRunTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/ai/test", { method: "POST" });
      const data = await res.json();
      setTestResult(data);
    } catch (err: any) {
      setTestResult({
        success: false,
        error: err?.message || "Impossibile contattare il server."
      });
    } finally {
      setIsTesting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        id="ai-engine-modal"
        className="bg-[#FAF6F0] text-[#2C221D] rounded-xl shadow-2xl border border-[#DCD0C0] max-w-xl w-full p-5 sm:p-6 relative max-h-[90vh] overflow-y-auto"
      >
        {/* Intestazione */}
        <div className="flex items-center justify-between border-b border-[#E8DCCB] pb-3.5 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#2A201A] text-amber-300">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-serif text-[#2A201A]">
                Configurazione Motore AI
              </h2>
              <p className="text-xs text-[#6F6052] font-sans">
                Supporto Groq, OpenRouter e Google Gemini
              </p>
            </div>
          </div>
          <button
            id="close-ai-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#6F6052] hover:bg-[#EAE0D2] hover:text-[#2A201A] transition-colors cursor-pointer"
            title="Chiudi finestra"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stato attuale del Provider */}
        <div className="mb-5">
          <div className="text-xs font-sans uppercase font-bold tracking-wider text-[#7B6A5B] mb-2 flex items-center justify-between">
            <span>Provider Attivo</span>
            <button
              onClick={fetchStatus}
              disabled={isLoadingStatus}
              className="text-[11px] text-amber-800 hover:text-amber-950 flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${isLoadingStatus ? "animate-spin" : ""}`} />
              Aggiorna
            </button>
          </div>

          <div className="p-4 rounded-lg bg-white border border-[#E4D7C5] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-base capitalize text-[#2A201A]">
                  {status?.provider === "groq" && "⚡ Groq (Llama 3.3)"}
                  {status?.provider === "openrouter" && "🌐 OpenRouter"}
                  {status?.provider === "gemini" && "✨ Google Gemini"}
                  {status?.provider === "none" && "Nessun provider configurato"}
                  {!status && "Verifica in corso..."}
                </span>
                {status?.model && (
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#F4EDE2] text-[#554538] border border-[#E0D2C0]">
                    {status.model}
                  </span>
                )}
              </div>

              {status?.zeroGoogleTokens ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-sans font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  0 Token Google
                </span>
              ) : status?.provider === "gemini" ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-sans font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  Quota Google Studio
                </span>
              ) : null}
            </div>

            <p className="text-xs text-[#5D4E41] leading-relaxed">
              {status?.description || "Inizializzazione delle configurazioni in corso..."}
            </p>
          </div>
        </div>

        {/* Quadro Chiavi Rilevate */}
        <div className="mb-5">
          <div className="text-xs font-sans uppercase font-bold tracking-wider text-[#7B6A5B] mb-2">
            Chiavi Configurate nei Secrets
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className={`p-2.5 rounded-lg border flex flex-col items-center justify-center text-center ${
              status?.hasGroqKey ? "bg-emerald-50/70 border-emerald-200 text-emerald-900" : "bg-[#F3ECE0] border-[#DFD1BF] text-[#7A6B5C]"
            }`}>
              <span className="font-bold flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" /> Groq
              </span>
              <span className="text-[10px] mt-0.5">
                {status?.hasGroqKey ? "✓ Attivo" : "Non inserito"}
              </span>
            </div>

            <div className={`p-2.5 rounded-lg border flex flex-col items-center justify-center text-center ${
              status?.hasOpenRouterKey ? "bg-emerald-50/70 border-emerald-200 text-emerald-900" : "bg-[#F3ECE0] border-[#DFD1BF] text-[#7A6B5C]"
            }`}>
              <span className="font-bold flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5" /> OpenRouter
              </span>
              <span className="text-[10px] mt-0.5">
                {status?.hasOpenRouterKey ? "✓ Attivo" : "Non inserito"}
              </span>
            </div>

            <div className={`p-2.5 rounded-lg border flex flex-col items-center justify-center text-center ${
              status?.hasGeminiKey ? "bg-amber-50/70 border-amber-200 text-amber-900" : "bg-[#F3ECE0] border-[#DFD1BF] text-[#7A6B5C]"
            }`}>
              <span className="font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Gemini
              </span>
              <span className="text-[10px] mt-0.5">
                {status?.hasGeminiKey ? "✓ Attivo" : "Non inserito"}
              </span>
            </div>
          </div>
        </div>

        {/* Istruzioni pratiche per l'utente */}
        <div className="mb-5 p-3.5 rounded-lg bg-[#EFE6D7] border border-[#DDD0BF] text-xs space-y-2 text-[#4A3B2F]">
          <div className="font-bold font-serif text-[#2C211A] flex items-center gap-1.5">
            <span>Come usare chiavi gratuite a 0 Token Google:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 pl-1 text-[11.5px] leading-relaxed">
            <li>
              <strong>Groq (Gratuito e ultra-veloce):</strong> crea una chiave gratuita su <span className="font-mono text-amber-900">console.groq.com</span> e aggiungi nei <em>Secrets</em> la variabile <span className="font-mono font-bold">GROQ_API_KEY</span>.
            </li>
            <li>
              <strong>OpenRouter (Gratuito con modelli :free):</strong> crea una chiave su <span className="font-mono text-amber-900">openrouter.ai</span> e aggiungi la variabile <span className="font-mono font-bold">OPENROUTER_API_KEY</span>.
            </li>
            <li>
              <strong>Priorità:</strong> se inserisci Groq o OpenRouter, l'app darà automaticamente precedenza a loro per azzerare il consumo dei token di Google AI Studio!
            </li>
          </ul>
        </div>

        {/* Pulsante di Test Live */}
        <div className="border-t border-[#E8DCCB] pt-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#4B3D30]">Verifica Connessione Live</span>
            <button
              id="run-ai-test-btn"
              onClick={handleRunTest}
              disabled={isTesting || status?.provider === "none"}
              className="px-4 py-2 rounded-lg bg-[#2A201A] hover:bg-[#403128] disabled:opacity-50 text-amber-200 text-xs font-bold font-sans flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              {isTesting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Verifica in corso...
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5" />
                  Esegui Test Generazione
                </>
              )}
            </button>
          </div>

          {testResult && (
            <div className={`p-3.5 rounded-lg border text-xs animate-in fade-in duration-200 ${
              testResult.success 
                ? "bg-emerald-50/90 border-emerald-300 text-emerald-950" 
                : "bg-rose-50/90 border-rose-300 text-rose-950"
            }`}>
              {testResult.success ? (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between font-bold">
                    <span className="flex items-center gap-1.5 text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      {testResult.message}
                    </span>
                    {testResult.latencyMs && (
                      <span className="text-[11px] font-mono text-emerald-700">
                        {testResult.latencyMs} ms
                      </span>
                    )}
                  </div>
                  {testResult.reply && (
                    <p className="italic font-serif text-[12px] bg-white/70 p-2 rounded border border-emerald-200/60 mt-1">
                      "{testResult.reply}"
                    </p>
                  )}
                  {testResult.zeroGoogleTokens && (
                    <div className="text-[11px] font-medium text-emerald-700 flex items-center gap-1 pt-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Confermato: nessun token Google AI Studio consumato per questa risposta.
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">Test non riuscito</div>
                    <div className="text-[11px] mt-0.5">{testResult.error}</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
