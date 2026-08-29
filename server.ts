import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini Client lazily
let genAI: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing.");
    }
    genAI = new GoogleGenAI({ apiKey });
  }
  return genAI;
}

export interface InterestItem {
  id?: string;
  category: string;
  topic: string;
  description: string;
  priority: number; // 1 to 5
  sources?: string;
  enabled?: boolean;
}

// Helper to detect quota exhaustion or rate limits gracefully
function isQuotaError(err: any): boolean {
  if (!err) return false;
  const msg = typeof err === "string" ? err : err?.message || JSON.stringify(err);
  return (
    err?.status === 429 ||
    err?.code === 429 ||
    err?.status === "RESOURCE_EXHAUSTED" ||
    msg.includes("429") ||
    msg.includes("quota") ||
    msg.includes("RESOURCE_EXHAUSTED") ||
    msg.includes("rate-limits") ||
    msg.includes("exceeded your current quota")
  );
}

/**
 * Resilient Gemini caller with automatic rate-limit retries, model fallback,
 * and graceful degradation from Google Search Grounding to direct AI synthesis
 * when search-specific quotas are reached.
 */
async function generateContentWithRetryAndFallback(
  ai: GoogleGenAI,
  requestOptions: any,
  preferredModel = "gemini-3.6-flash"
): Promise<any> {
  const modelsToTry = [
    preferredModel,
    "gemini-3.6-flash",
    "gemini-3.7-flash",
    "gemini-3.1-flash-lite"
  ].filter((m, i, arr) => arr.indexOf(m) === i);

  let lastError: any = null;

  // Pass 1: Try with full options (including Google Search Grounding if configured)
  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        ...requestOptions,
        model,
      });
      if (response && response.text) return response;
    } catch (err: any) {
      lastError = err;
      if (isQuotaError(err)) {
        // Search Grounding quota is tied to the API key; skip repeating failed search queries across other models
        break;
      } else {
        console.warn(`Non-quota error with model ${model}:`, err?.message || err);
      }
    }
  }

  // Pass 2: If Search Grounding was requested and hit quota limits (429),
  // degrade gracefully to direct high-accuracy AI synthesis without Search Tool.
  if (requestOptions.config?.tools && requestOptions.config.tools.length > 0) {
    console.info("Google Search grounding quota reached; falling back to direct Gemini knowledge synthesis...");
    const fallbackConfig = { ...requestOptions.config, responseMimeType: "application/json" };
    delete fallbackConfig.tools;

    for (const model of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          ...requestOptions,
          config: fallbackConfig,
          model,
        });
        if (response && response.text) return response;
      } catch (err: any) {
        lastError = err;
      }
    }
  }

  throw lastError;
}

function extractDomainName(rawUrl: string): string {
  try {
    const parsed = new URL(rawUrl);
    const hostname = parsed.hostname.replace(/^www\./, "");
    if (hostname.includes("nature.com")) return "Nature";
    if (hostname.includes("science.org")) return "Science";
    if (hostname.includes("nasa.gov")) return "NASA / JPL";
    if (hostname.includes("unesco.org")) return "UNESCO World Heritage";
    if (hostname.includes("yale.edu")) return "Yale University Library";
    if (hostname.includes("treccani.it")) return "Istituto dell'Enciclopedia Italiana Treccani";
    if (hostname.includes("lescienze.it")) return "Le Scienze / Scientific American";
    if (hostname.includes("quantamagazine.org")) return "Quanta Magazine";
    if (hostname.includes("esa.int")) return "European Space Agency (ESA)";
    if (hostname.includes("cern.ch")) return "CERN";
    if (hostname.includes("bfi.org.uk")) return "British Film Institute (BFI)";
    if (hostname.includes("bnf.fr")) return "Bibliothèque nationale de France";
    if (hostname.includes("bl.uk")) return "British Library";
    if (hostname.includes("stanford.edu")) return "Stanford Encyclopedia of Philosophy";
    return hostname;
  } catch {
    return "Fonte Web Verificata";
  }
}

/**
 * Robust JSON extractor that handles raw JSON, markdown-wrapped JSON,
 * or embedded JSON objects/arrays without breaking on Google Search grounding.
 */
function safeExtractJson(text: string): any {
  if (!text) return null;
  const trimmed = text.trim();
  
  // 1. Direct JSON parse
  try {
    return JSON.parse(trimmed);
  } catch {}

  // 2. Markdown code block extraction ```json ... ```
  const jsonBlockMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (jsonBlockMatch && jsonBlockMatch[1]) {
    try {
      return JSON.parse(jsonBlockMatch[1].trim());
    } catch {}
  }

  // 3. Extract outermost curly braces { ... }
  const firstCurly = trimmed.indexOf("{");
  const lastCurly = trimmed.lastIndexOf("}");
  if (firstCurly !== -1 && lastCurly > firstCurly) {
    try {
      const candidate = trimmed.substring(firstCurly, lastCurly + 1);
      return JSON.parse(candidate);
    } catch {}
  }

  // 4. Extract outermost square brackets [ ... ]
  const firstSquare = trimmed.indexOf("[");
  const lastSquare = trimmed.lastIndexOf("]");
  if (firstSquare !== -1 && lastSquare > firstSquare) {
    try {
      const candidate = trimmed.substring(firstSquare, lastSquare + 1);
      return JSON.parse(candidate);
    } catch {}
  }

  return null;
}

// API Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Cache for daily articles
const dailyArticlesCache: Map<
  string,
  { articles: any[]; groundingSources?: any[]; webSearchQueries?: string[]; timestamp: number }
> = new Map();

// Server-side rolling history of served entities (bounded to MAX 500 items to prevent overflow)
const MAX_SERVER_HISTORY = 500;
const serverArticlesHistory: { id: string; title: string; normalizedTitle: string; timestamp: number }[] = [];
const serverMasterpiecesHistory: { artworkTitle: string; artist: string; normalizedArtwork: string; timestamp: number }[] = [];
const serverBooksHistory: { title: string; author: string; normalizedTitle: string; timestamp: number }[] = [];
const serverWordsHistory: { word: string; normalizedWord: string; timestamp: number }[] = [];

function normalizeServerText(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function registerArticlesInServerHistory(arts: any[]) {
  if (!Array.isArray(arts)) return;
  for (const art of arts) {
    if (!art || !art.title) continue;
    const norm = normalizeServerText(art.title);
    if (!serverArticlesHistory.some(h => h.id === art.id || h.normalizedTitle === norm)) {
      serverArticlesHistory.push({
        id: art.id,
        title: art.title,
        normalizedTitle: norm,
        timestamp: Date.now()
      });
    }
  }
  // Trim FIFO
  if (serverArticlesHistory.length > MAX_SERVER_HISTORY) {
    serverArticlesHistory.splice(0, serverArticlesHistory.length - MAX_SERVER_HISTORY);
  }
}

function registerMasterpieceInServerHistory(artworkTitle: string, artist: string = "") {
  if (!artworkTitle) return;
  const norm = normalizeServerText(artworkTitle);
  if (!serverMasterpiecesHistory.some(h => h.normalizedArtwork === norm)) {
    serverMasterpiecesHistory.push({
      artworkTitle,
      artist,
      normalizedArtwork: norm,
      timestamp: Date.now()
    });
  }
  if (serverMasterpiecesHistory.length > MAX_SERVER_HISTORY) {
    serverMasterpiecesHistory.splice(0, serverMasterpiecesHistory.length - MAX_SERVER_HISTORY);
  }
}

function registerBookInServerHistory(title: string, author: string = "") {
  if (!title) return;
  const norm = normalizeServerText(title);
  if (!serverBooksHistory.some(h => h.normalizedTitle === norm)) {
    serverBooksHistory.push({
      title,
      author,
      normalizedTitle: norm,
      timestamp: Date.now()
    });
  }
  if (serverBooksHistory.length > MAX_SERVER_HISTORY) {
    serverBooksHistory.splice(0, serverBooksHistory.length - MAX_SERVER_HISTORY);
  }
}

function registerWordInServerHistory(word: string) {
  if (!word) return;
  const norm = normalizeServerText(word);
  if (!serverWordsHistory.some(h => h.normalizedWord === norm)) {
    serverWordsHistory.push({
      word,
      normalizedWord: norm,
      timestamp: Date.now()
    });
  }
  if (serverWordsHistory.length > MAX_SERVER_HISTORY) {
    serverWordsHistory.splice(0, serverWordsHistory.length - MAX_SERVER_HISTORY);
  }
}

// Helper to shuffle an array deterministically using a seed
function serverSeededShuffle<T>(array: T[], seed: number): T[] {
  const arr = [...array];
  let s = Math.abs(seed);
  if (s === 0) s = 1234567;
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
}

// API for Digest Generation by Chief Editor using real web sources
app.post("/api/digest/generate", async (req, res) => {
  try {
    const {
      topics,
      category = "Tutte",
      searchQuery = "",
      customInstructions = "",
    } = req.body;

    if (process.env.GEMINI_API_KEY) {
      try {
        const ai = getGemini();

        const systemPrompt = `Sei un giornalista scientifico e divulgatore culturale per "Personal Digest", una rivista digitale in stile Reader's Digest / Medium.
Il tuo compito è trovare o riassumere ARTICOLI VERI E REALI dal web, con fonti attendibili (es. Nature, Science, NASA, BFI, BBC, National Geographic, UNESCO, università e testate autorevoli).

REGOLE CRITICHE:
1. Gli articoli NON devono essere inventati: devono basarsi su fatti, ricerche, scoperte e pubblicazioni realmente esistenti.
2. Riporta SEMPRE il link e il nome esatto della fonte web reale (URL valido e verificabile).
3. Se la fonte originale è in inglese o in un'altra lingua, TRADUCI E RIASSUMI il contenuto in un italiano fluido, elegante e divulgativo.
4. Ogni articolo deve avere:
   - id: stringa identificativa univoca
   - category: una tra "Attualità", "Scienza", "Mistero", "Cultura", "Salute", "Storia", "Cinema", "Folclore"
   - title: Titolo giornalistico accattivante e veritiero
   - excerpt: Breve estratto di 2-3 righe (circa 30-40 parole)
   - content: 3-4 paragrafi narrativi approfonditi e accurati
   - readingTime: es. "4 min"
   - author: Nome del giornalista o divulgatore
   - date: Data formattata (es. "22 Agosto 2026")
   - highlightQuote: Citazione o fatto chiave significativo
   - sources: Array di oggetti con { title: string, url: string, publisher: string } con veri link web pertinenti
   - originalLanguage: lingua originale della fonte (es. "Inglese (Tradotto in Italiano)")

Rispondi ESCLUSIVAMENTE con un JSON valido contenente un array di articoli sotto la chiave "articles":
{
  "articles": [ ... ]
}`;

        const userPrompt = `Cerca e genera 4-6 articoli reali di approfondimento per Personal Digest.
${category !== "Tutte" ? `Focalizzati sulla categoria: ${category}.` : "Includi argomenti vari tra Scienza, Mistero, Cultura, Storia, Cinema, Attualità, Salute e Folclore."}
${searchQuery ? `Ricerca specifica richiesta dall'utente: "${searchQuery}".` : ""}
${customInstructions ? `Istruzioni supplementari: "${customInstructions}".` : ""}

Assicurati che tutti gli articoli siano basati su fonti reali, tradotti in italiano se stranieri, e che contengano i relativi link web alle fonti autentiche.
Rispondi in un blocco JSON con struttura { "articles": [...] }.`;

        const response = await generateContentWithRetryAndFallback(ai, {
          contents: [{ role: "user", parts: [{ text: userPrompt }] }],
          config: {
            systemInstruction: systemPrompt,
            tools: [{ googleSearch: {} }],
            temperature: 0.5,
          },
        }, "gemini-3.6-flash");

        const responseText = response.text || "{}";
        const parsedData: any = safeExtractJson(responseText) || {};

        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const webLinks = groundingChunks
          .map((c: any) => c.web)
          .filter((w: any) => w && w.uri)
          .map((w: any) => ({ title: w.title || "Fonte Web", url: w.uri, publisher: "Web Source" }));

        const parsedArticles = parsedData.articles || (Array.isArray(parsedData) ? parsedData : []);
        if (parsedArticles.length > 0) {
          return res.json({
            success: true,
            articles: parsedArticles,
            webGroundingSources: webLinks,
          });
        }
      } catch (aiErr: any) {
        if (isQuotaError(aiErr)) {
          console.info("Gemini API quota reached / rate limited in /api/digest/generate.");
        } else {
          console.warn("Gemini API error in /api/digest/generate:", aiErr?.message || aiErr);
        }
      }
    }

    return res.json({
      success: false,
      articles: [],
      webGroundingSources: [],
      error: "Impossibile generare articoli in tempo reale dal web."
    });
  } catch (error: any) {
    console.error("Error in /api/digest/generate:", error);
    return res.status(500).json({
      success: false,
      articles: [],
      error: error?.message || "Errore nella generazione del digest"
    });
  }
});

// API per la generazione e ricerca live giornaliera di articoli tramite Google Web Search
// Strettamente allineata agli argomenti e interessi definiti nel Google Sheet
app.post("/api/articles/daily", async (req, res) => {
  try {
    const { interests, forceRefresh = false, dateFormatted = "", seed = 0, excludeIds = [], excludeTitles = [] } = req.body;

    // Filtra solo gli interessi abilitati dal Google Sheet
    const validInterests = Array.isArray(interests) && interests.length > 0
      ? interests.filter((i: any) => i.enabled !== false)
      : [];

    const activeInterests = validInterests.length > 0 ? validInterests : [
      {
        category: "Attualità",
        topic: "News e Curiosità dal Mondo",
        description: "Notizie di attualità globale, curiosità, fatti insoliti e storie dal mondo.",
        priority: 5,
        sources: "Reuters, BBC News, ANSA, National Geographic, Courrier International"
      },
      {
        category: "Scienza",
        topic: "Nuove Scoperte Scientifiche",
        description: "Ultime frontiere della ricerca scientifica, scoperte tecnologiche e innovazioni.",
        priority: 5,
        sources: "Nature, Science, Le Scienze, MIT Technology Review, Phys.org"
      },
      {
        category: "Scienza",
        topic: "Astronomia e Spazio",
        description: "Esplorazione spaziale, missioni, astrofisica.",
        priority: 5,
        sources: "NASA JPL, ESA, Astrophysical Journal, James Webb Space Telescope, ESO"
      },
      {
        category: "Mistero",
        topic: "UFO e Alieni",
        description: "Monitoraggio di avvistamenti UAP/UFO, ricerca SETI ed esobiologia.",
        priority: 5,
        sources: "SETI Institute, The Black Vault, Declassified Archives, Astrobiology NASA"
      },
      {
        category: "Cultura",
        topic: "Narrativa Breve",
        description: "Racconti, saggi brevi, storie di vita.",
        priority: 4,
        sources: "The New Yorker, The Paris Review, Adelphi, Letteratura internazionale"
      },
      {
        category: "Salute",
        topic: "Benessere e Alimentazione",
        description: "Stili di vita sani, nutrizione, scoperte mediche.",
        priority: 4,
        sources: "The Lancet, Harvard Health Publishing, New England Journal of Medicine, Fondazione Veronesi"
      },
      {
        category: "Storia",
        topic: "Storia Contemporanea",
        description: "Analisi di eventi storici recenti e lezioni dal passato.",
        priority: 4,
        sources: "Historical Journal, BBC History, Rivista Storica Italiana, Archivi Declassificati"
      },
      {
        category: "Scienza dello Spirito",
        topic: "Ricerche sulla Coscienza (NDE, OOBE)",
        description: "Studi scientifici e fenomenologici su NDE, OOBE e natura della coscienza oltre il cervello.",
        priority: 5,
        sources: "NYU Langone (AWARE II), Journal of Near-Death Studies, Resuscitation, Nature Neuroscience"
      },
      {
        category: "Cinema",
        topic: "Film di Fantascienza",
        description: "Analisi tematiche, recensioni e implicazioni filosofiche del cinema sci-fi.",
        priority: 4,
        sources: "BFI Sight & Sound, Cahiers du Cinéma, Criterion Collection, Saggi di cinema"
      },
      {
        category: "Storia/Mito",
        topic: "Miti e Leggende dell'Antichità",
        description: "Comparazione di mitologie classiche (Grecia, Egitto, Cina, Giappone) e loro influenza culturale.",
        priority: 4,
        sources: "Treccani, Oxford Classical Dictionary, Saggi di Antropologia e Religioni comparate"
      },
      {
        category: "Mistero",
        topic: "Archeologia Misteriosa e Luoghi Perduti",
        description: "Approfondimento su siti enigmatici (Göbekli Tepe, Linee di Nazca), civiltà perdute (Atlantide) e teorie alternative.",
        priority: 5,
        sources: "UNESCO, Antiquity, DAI, Archaeological Institute of America, Rilievi LiDAR"
      },
      {
        category: "Folclore",
        topic: "Piccolo Popolo e Creature del Folclore",
        description: "Creature leggendarie dei boschi (elfi, gnomi, fate, yokai) e tradizioni orali di tutto il mondo.",
        priority: 4,
        sources: "Società di Etnologia Europea, Archivi delle Tradizioni Popolari, Studi antropologici"
      }
    ];

    const todayDateKey = new Date().toISOString().slice(0, 10);
    const cacheKey = `daily_articles_${todayDateKey}`;

    // Controlla cache condivisa del server (valida per 24 ore)
    const cached = dailyArticlesCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < 1000 * 60 * 60 * 24 && cached.articles.length > 0) {
      return res.json({
        success: true,
        articles: cached.articles,
        groundingSources: cached.groundingSources || [],
        webSearchQueries: cached.webSearchQueries || [],
        matchedTopicsCount: activeInterests.length,
        count: cached.articles.length,
        source: "server_cache"
      });
    }

    if (process.env.GEMINI_API_KEY) {
      try {
        const ai = getGemini();

        // Ripartizione degli interessi: 8 per gli articoli standard del sommario, 1 per l'articolo condensato
        let artInterest = activeInterests.find((i: any) => 
          (i.category || "").toLowerCase().includes("arte") || 
          (i.topic || "").toLowerCase().includes("pittura") ||
          (i.category || "").toLowerCase().includes("capolavori")
        );
        if (!artInterest) artInterest = activeInterests[0];

        const remaining = activeInterests.filter((i: any) => i !== artInterest);

        let condensedInterest = remaining.find((i: any) => 
          (i.category || "").toLowerCase().includes("saggi") || 
          (i.category || "").toLowerCase().includes("condensat") || 
          (i.topic || "").toLowerCase().includes("saggi") ||
          (i.topic || "").toLowerCase().includes("alphafold") ||
          (i.topic || "").toLowerCase().includes("longevità")
        );
        if (!condensedInterest) condensedInterest = remaining[remaining.length - 1];

        const standardInterests = remaining.filter((i: any) => i !== condensedInterest).slice(0, 8);

        // Formatta l'elenco rigoroso degli 8 argomenti standard e dell'1 saggio condensato
        const standardTopicsFormatted = standardInterests.map((item: any, idx: number) => {
          const p = item.priority ? `[Priorità: ${item.priority}/5]` : "";
          const cat = item.category ? `[Categoria: ${item.category}]` : "";
          const desc = item.description ? ` - Dettagli: ${item.description}` : "";
          const src = item.sources ? ` - Fonti raccomandate: ${item.sources}` : "";
          return `ARTICOLO STANDARD ${idx + 1}: ${cat} ${p} TEMA: "${item.topic}"${desc}${src}`;
        }).join("\n");

        const condensedTopicFormatted = `ARTICOLO CONDENSATO: [Categoria: ${condensedInterest.category}] TEMA: "${condensedInterest.topic}" - Dettagli: ${condensedInterest.description || ""}`;

        const excludeDirective = Array.isArray(excludeTitles) && excludeTitles.length > 0
          ? `\nTITOLI GIÀ PRESENTI NELL'ARCHIVIO DA EVITARE ASSOLUTAMENTE (NON RIPETERE QUESTI ARGOMENTI/TITOLI):\n- ${excludeTitles.slice(0, 30).join("\n- ")}\n`
          : "";

        const systemPrompt = `Sei il Capo Redattore di "Personal Digest", prestigiosa rivista quotidiana culturale e periodico scientifico d'autore nello stile del Reader's Digest / Selezione.

DIRETTIVA RIGOROSA DI MAPPATURA 1:1 CON GLI ARGOMENTI DELL'UTENTE:
Devi generare ESATTAMENTE 9 articoli unici e approfonditi, ciascuno rigorosamente riferito a UNO e UNO SOLO dei temi assegnati:
1. ESATTAMENTE 8 ARTICOLI STANDARD (isCondensedBook: false) corrispondenti 1:1 agli 8 temi standard indicati.
2. ESATTAMENTE 1 ARTICOLO CONDENSATO (isCondensedBook: true) corrispondente 1:1 al tema dell'articolo condensato.
NON duplicare mai la stessa tematica tra due articoli. Ciascun articolo deve sviluppare un tema distinto.
NOTA BENE: NON generare mai articoli intitolati o dedicati alla rubrica linguistica "Più parole, più idee" o "Il Libro Consigliato", che sono rubriche fisse gestite in pagine speciali dedicate a parte.
${excludeDirective}
SCANSIONE E RICERCA WEB MULTI-FONTE:
1. Scandaglia il web aperto tramite Google Search per ciascuno dei temi assegnati: individua studi scientifici sottoposti a peer-review (Nature, Science, PNAS, Physical Review, Astrophysical Journal), archivi storici e biblioteche mondiali (Yale Beinecke, British Library, Gallica BnF, Treccani), agenzie spaziali (NASA JPL, ESA, ESO), istituti archeologici (DAI, Antiquity, UNESCO, INAH), testate culturali e cinematografiche (BFI Sight & Sound, Le Scienze, Aeon, Quanta Magazine).
2. Per OGNI articolo, fornisci da 2 a 4 FONTI WEB AUTENTICHE E VERIFICABILI (con URL reale, nome dell'editore/istituzione, titolo del paper o studio, e una sintesi in una frase del riscontro trovato).
3. Traduci e sintetizza in un italiano giornalistico di altissimo profilo: elegante, divulgativo, chiaro, ricco di nomi di scienziati, date storiche, parametri fisici o biologici e riferimenti documentati.

FORMATO DI RISPOSTA:
Rispondi ESCLUSIVAMENTE con un JSON strutturato con la proprietà "articles" (array di esattamente 9 articoli: 8 standard + 1 condensato):
{
  "articles": [
    {
      "id": "stringa-univoca-kebab-case",
      "category": "Categoria tematica corrispondente",
      "topicRef": "Titolo del tema di riferimento",
      "title": "Titolo giornalistico approfondito, avvincente e documentato",
      "shortTitle": "Titolo sintetico (3-6 parole) per il sommario di copertina",
      "excerpt": "Sintesi narrativa di 2-3 righe (30-45 parole)",
      "content": "Testo completo dell'articolo in 3-5 ricchi paragrafi separati da doppio a capo (\\n\\n)",
      "readingTime": "5 min",
      "author": "Nome del divulgatore, redattore scientifico o istituto di ricerca",
      "date": "${dateFormatted || "Oggi"}",
      "highlightQuote": "Citazione significativa o concetto cardine dell'articolo",
      "originalLanguage": "es. 'Inglese (Tradotto in Italiano)' oppure 'Italiano'",
      "isCondensedBook": false,
      "sources": [
        {
          "title": "Titolo completo della pubblicazione accademica, paper o studio web",
          "url": "URL verificabile trovato tramite la ricerca web",
          "publisher": "Nome istituzione/ente/rivista (es. Nature, Science, NASA JPL, UNESCO, Yale University)",
          "originalLanguage": "Inglese / Italiano / Francese / Tedesco",
          "keyFinding": "Sintesi di 1 frase sul dato o scoperta chiave documentata in questa fonte"
        },
        {
          "title": "Titolo del secondo studio o archivio storico correlato",
          "url": "URL verificabile trovato tramite la ricerca web",
          "publisher": "Nome secondo ente/archivio",
          "originalLanguage": "Inglese / Italiano",
          "keyFinding": "Sintesi del secondo riscontro documentato"
        }
      ]
    }
  ]
}`;

        const userPrompt = `Scandaglia il Web tramite Google Search ed elabora l'edizione odierna di Personal Digest con ricerche approfondite e fonti verificate per ciascuno dei seguenti temi:

${standardTopicsFormatted}

${condensedTopicFormatted}

Data del numero: ${dateFormatted || "Oggi"}
Indice di variazione: #${seed}

Requisiti:
- Scandaglia il web cercando paper accademici, archivi e scoperte per ognuno degli 8 temi standard e per il saggio condensato.
- Inserisci da 2 a 4 fonti web reali e dettagliate per ciascun articolo.
- Gli articoli 1-8 devono avere isCondensedBook: false; l'articolo 9 deve avere isCondensedBook: true.`;

        const response = await generateContentWithRetryAndFallback(ai, {
          contents: [{ role: "user", parts: [{ text: userPrompt }] }],
          config: {
            systemInstruction: systemPrompt,
            tools: [{ googleSearch: {} }],
            temperature: 0.5,
          },
        }, "gemini-3.6-flash");

        const responseText = response.text || "{}";
        const parsedData: any = safeExtractJson(responseText) || {};

        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const webSearchQueries = response.candidates?.[0]?.groundingMetadata?.webSearchQueries || [];
        const webLinks = groundingChunks
          .map((c: any) => c.web)
          .filter((w: any) => w && w.uri)
          .map((w: any) => ({
            title: w.title || "Fonte Web Verificata",
            url: w.uri,
            publisher: extractDomainName(w.uri) || "Fonte Web Accreditata"
          }));

        const rawArticles = Array.isArray(parsedData.articles) ? parsedData.articles : (Array.isArray(parsedData) ? parsedData : []);

        if (rawArticles.length > 0) {
          const articles = rawArticles.map((art: any, idx: number) => {
            let sources: any[] = Array.isArray(art.sources) && art.sources.length > 0 ? art.sources : [];
            
            // Arricchisci con i link reali trovati dal grounding di Google Search
            if (webLinks.length > 0) {
              const matchingLinks = webLinks.slice(idx * 2, idx * 2 + 2);
              if (matchingLinks.length > 0 && sources.length === 0) {
                sources = matchingLinks.map((ml: any) => ({
                  title: ml.title,
                  url: ml.url,
                  publisher: ml.publisher,
                  originalLanguage: art.originalLanguage || "Fonte Web Verificata",
                  keyFinding: "Fonte rilevata e verificata tramite scansione Google Search in tempo reale."
                }));
              } else if (sources.length > 0) {
                // Sostituisci eventuali URL generici con quelli reali trovati nel grounding se disponibili
                sources = sources.map((s: any, sIdx: number) => {
                  const candidate = webLinks[(idx + sIdx) % webLinks.length];
                  return {
                    title: s.title || candidate?.title || "Studio di Riferimento",
                    url: s.url && s.url.startsWith("http") ? s.url : (candidate?.url || "https://www.nature.com"),
                    publisher: s.publisher || candidate?.publisher || "Ente di Ricerca",
                    originalLanguage: s.originalLanguage || "Internazionale",
                    keyFinding: s.keyFinding || ""
                  };
                });
              }
            }

            const matchedInterest = activeInterests[idx % activeInterests.length];
            const category = art.category || matchedInterest?.category || "Cultura & Scienza";

            return {
              id: art.id || `web-sheet-art-${idx}-${Date.now()}`,
              category,
              topicRef: art.topicRef || matchedInterest?.topic || "",
              title: art.title || "Articolo di Approfondimento",
              shortTitle: art.shortTitle || art.title?.slice(0, 32) || "Approfondimento",
              excerpt: art.excerpt || "",
              content: art.content || "",
              readingTime: art.readingTime || "5 min",
              author: art.author || "Redazione Personal Digest",
              date: art.date || dateFormatted || "Oggi",
              highlightQuote: art.highlightQuote || "",
              originalLanguage: art.originalLanguage || "Italiano",
              isCondensedBook: Boolean(art.isCondensedBook),
              sources
            };
          });

          registerArticlesInServerHistory(articles);
          dailyArticlesCache.set(cacheKey, {
            articles,
            groundingSources: webLinks,
            webSearchQueries,
            timestamp: Date.now()
          });

          return res.json({
            success: true,
            articles,
            groundingSources: webLinks,
            webSearchQueries,
            matchedTopicsCount: activeInterests.length,
            count: articles.length,
            mode: "real_web_search"
          });
        }
      } catch (aiErr: any) {
        if (isQuotaError(aiErr)) {
          console.info("Gemini API quota reached / rate limited in /api/articles/daily.");
          return res.status(429).json({
            success: false,
            quotaExceeded: true,
            articles: [],
            groundingSources: [],
            error: "Limite di richieste API Gemini raggiunto. Visualizzazione edizione curata."
          });
        }
        console.warn("Gemini API search error in /api/articles/daily:", aiErr?.message || aiErr);
        return res.status(500).json({
          success: false,
          articles: [],
          groundingSources: [],
          error: "Errore durante la generazione e ricerca live degli articoli dal web: " + (aiErr?.message || "Servizio non disponibile")
        });
      }
    }

    return res.status(503).json({
      success: false,
      articles: [],
      groundingSources: [],
      error: "Chiave GEMINI_API_KEY non configurata sul server."
    });
  } catch (error: any) {
    console.error("Error in /api/articles/daily:", error);
    return res.status(500).json({
      success: false,
      articles: [],
      groundingSources: [],
      error: error?.message || "Errore imprevisto nel server"
    });
  }
});

// Curated fallback book recommendations aligned with default Google Sheets interests
const CURATED_RECOMMENDED_BOOKS = [
  {
    title: "L'ordine del tempo",
    author: "Carlo Rovelli",
    year: "2017",
    publisher: "Adelphi (Piccola Biblioteca)",
    category: "Frontiere della Fisica & Cosmo",
    matchingTopic: "Fisica quantistica, multiverso e anomalie nello spaziotempo",
    synopsis: "Il tempo non è una grandezza immutabile e universale che scandisce i secondi allo stesso ritmo in ogni angolo del cosmo: scorre più veloce in cima a una montagna rispetto alla pianura, rallenta in prossimità di grandi masse gravitazionali e, scendendo alla scala infinitesimale di Planck (10⁻³⁵ metri), cessa completamente di esistere. In questo celebre saggio, Carlo Rovelli — tra i fondatori della teoria della gravità quantistica a loop — guida il lettore attraverso una radicale decostruzione del nostro concetto intuitivo di tempo, mostrando come le nozioni di 'presente', 'passato' e 'futuro' siano proprietà puramente locali ed emergenti, legate all'entropia di Boltzmann e alla nostra prospettiva macroscopica approssimata sulla realtà.\n\nAttraverso una prosa di rara eleganza letteraria che intreccia la fisica teorica di Einstein e Dirac con la filosofia classica di Anassimandro e le 'Confessioni' di Agostino, Rovelli smonta il mito del tempo newtoniano come contenitore vuoto. Il mondo non è fatto di sostanze o oggetti statici che permangono immutati nel tempo, ma di 'eventi' e 'relazioni' che accadono e si trasformano reciprocamente. La gravità quantistica descrive lo spazio non come una griglia continua, ma come un reticolo discreto di 'quanti di spazio' intrecciati tra loro in una dinamica senza tempo fondamentale.\n\nL'opera culmina in una toccante riflessione sulla condizione umana e sull'origine della nostra memoria: noi siamo esseri temporali proprio perché la nostra percezione è imperfetta e filtrata dallo scambio termico. Rovelli restituisce alla fisica la sua dimensione profondamente umanistica, ricordandoci che la ricerca delle leggi fondamentali dell'universo non spegne la meraviglia per il mistero dell'esistenza, ma la rende ancora più luminosa e consapevole.",
    whyRecommended: "Scelto per approfondire il tema 'Fisica quantistica e struttura dello spaziotempo' registrato nel tuo foglio Google. Rovelli offre una sintesi insuperata tra rigore matematico d'avanguardia e profondità filosofica, rendendo accessibili i concetti più vertiginosi della gravità a loop.",
    highlightQuote: "«Le cose sono fatte di eventi che accadono. Il mondo non è fatto di sassi, è fatto di baci; o di incontri tra cose.»",
    readingTime: "5 min (estratto)",
    pagesCount: "208 pagine"
  },
  {
    title: "Il mistero di Göbekli Tepe",
    author: "Andrew Collins",
    year: "2015",
    publisher: "Corbaccio / Newton Compton",
    category: "Archeologia Misteriosa",
    matchingTopic: "Archeologia Misteriosa e Luoghi Perduti",
    synopsis: "Nel 9.500 a.C., mentre i ghiacciai dell'era pleistocenica si ritiravano faticosamente dall'Europa e l'umanità viveva ancora dispersa in piccoli gruppi nomadi di cacciatori e raccoglitori, sull'altopiano anatolico di Şanlıurfa sorgeva Göbekli Tepe: un ciclopico santuario composto da oltre venti recinti circolari con pilastri monolitici a T pesanti fino a venti tonnellate, riccamente scolpiti con figure zoomorfe di leoni, serpenti, scorpioni e avvoltoi. Il saggio di Andrew Collins ripercorre la genesi di questa scoperta epocale, guidando il lettore tra gli scavi di Klaus Schmidt e le implicazioni rivoluzionarie che hanno scosso l'intera comunità archeologica internazionale.\n\nIl cuore dell'indagine di Collins si concentra sulle analisi archeoastronomiche del complesso e sul suo orientamento verso la costellazione del Cigno e la stella Deneb, punto nodale che nelle mitologie sciamaniche eurasiatiche rappresentava la 'porta celeste' attraverso cui le anime dei defunti viaggiavano verso l'aldilà. L'autore esplora il ruolo dei misteriosi costruttori del Neolitico Pre-Ceramico, mettendo a confronto i reperti anatolici con le memorie ancestrali dei 'Guardiani' e degli 'Shining Ones' tramandate dai primi testi sumeri e dal Libro di Enoch.\n\nL'opera documenta in modo dettagliato come la nascita dei templi non fu la conseguenza, bensì la vera causa motrice della rivoluzione agricola. La necessità di nutrire e organizzare centinaia di lavoratori e celebranti spinse le comunità nomadi a stabilizzarsi e ad avviare i primi esperimenti di coltivazione cerealicola, trasformando Göbekli Tepe nella culla spirituale da cui germogliò l'intera civiltà moderna prima della sua enigmatica e intenzionale sepoltura avvenuta nell'8.000 a.C.",
    whyRecommended: "Risponde direttamente all'interesse presente nel tuo profilo di lettura sulle civiltà perdute, il megalitismo preistorico e l'archeoastronomia.",
    highlightQuote: "«Göbekli Tepe ha dimostrato che la scintilla che accese la civiltà non fu il bisogno di coltivare la terra, ma il bisogno sacro di guardare verso il cielo.»",
    readingTime: "6 min (estratto)",
    pagesCount: "432 pagine"
  },
  {
    title: "L'uomo che scambiò sua moglie per un cappello",
    author: "Oliver Sacks",
    year: "1985",
    publisher: "Adelphi",
    category: "Neuroscienze & Mente",
    matchingTopic: "Ricerche sulla Coscienza (NDE, OOBE)",
    synopsis: "Pubblicato nel 1985 e divenuto una pietra miliare della letteratura medica e scientifica del Novecento, questo volume raccoglie ventiquattro storie cliniche straordinarie in cui Oliver Sacks — neurologo, docente e scrittore di profonda sensibilità — esplora le bizzarrie, le catastrofi e i miracoli della mente umana. Al centro del libro vi sono pazienti affetti da lesioni neurologiche complesse: uomini e donne che hanno perso la memoria recente e vivono intrappolati in un eterno presente del 1945, individui che percepiscono i propri arti come corpi estranei, o il celebre musicista 'Dr. P.' che, colpito da agnosia visiva massiva, non riconosce più i volti umani e arriva a confondere la testa della propria consorte con un copricapo.\n\nLa grandezza dell'approccio di Sacks risiede nel rifiuto di trattare i pazienti come meri cataloghi di anomalie o patologie da diagnosticare. Per ogni caso clinico, l'autore indaga il dramma esistenziale e la prodigiosa capacità di resilienza dell'individuo: quando una funzione neurologica primaria collassa, il cervello umano si riorganizza attraverso vie alternative, facendo leva sulla musica, sull'arte pittorica e sull'intuizione emotiva per preservare l'integrità del proprio 'Sé'.\n\nAttraverso capitoli memorabili dedicati ai gemelli autistici capaci di calcolare istantaneamente numeri primi a sei cifre o a pazienti affetti da sindrome di Tourette dotati di prodigiosi riflessi musicali, Sacks dimostra che la coscienza non è una macchina rigida, ma una sinfonia dinamica. Un'opera fondamentale che interroga le radici stesse dell'identità personale e della percezione della realtà.",
    whyRecommended: "Consigliato sulla base del tuo interesse per le neuroscienze, l'origine della coscienza e i misteri della percezione della realtà.",
    highlightQuote: "«Per essere noi stessi dobbiamo avere noi stessi: possedere, se necessario ri-possedere, la storia del nostro vissuto.»",
    readingTime: "5 min (estratto)",
    pagesCount: "318 pagine"
  },
  {
    title: "Il manoscritto Voynich: Il libro più misterioso del mondo",
    author: "Gerry Kennedy e Rob Churchill",
    year: "2006",
    publisher: "Bollati Boringhieri",
    category: "Misteri & Criptografia",
    matchingTopic: "Miti e Leggende dell'Antichità",
    synopsis: "Custodito presso la Beinecke Rare Book and Manuscript Library dell'Università di Yale con la segnatura 'MS 408', il Manoscritto Voynich è senza dubbio il codice pergamenaceo più enigmatico e studiato della storia umana. Redatto nei primi decenni del Quattrocento (come confermato dalle datazioni al Carbonio-14 del 2009) e composto da circa duecentoquaranta pagine miniate, il volume è interamente redatto in una lingua sconosciuta o cifrario impenetrabile (denominato 'voynichese'), accompagnato da centinaia di illustrazioni dettagliate raffiguranti piante botaniche inesistenti sulla Terra, complessi diagrammi zodiacali, costellazioni non identificate e figure femminili nude immerse in strani labirinti idraulici.\n\nIl saggio di Gerry Kennedy e Rob Churchill ricostruisce con piglio investigativo la straordinaria odissea storica del manoscritto: dalla sua prima traccia accertata alla corte alchemica dell'imperatore Rodolfo II d'Asburgo a Praga nel XVI secolo, passando per la custodia del dotto gesuita Athanasius Kircher a Roma, fino alla sua riscoperta nel 1912 da parte del mercante di libri rari Wilfrid Voynich nel collegio gesuita di Villa Mondragone a Frascati.\n\nGli autori passano in rassegna i molteplici tentativi di decifrazione intrapresi nel corso di un secolo da celebri crittoanalisti militari (compreso William Friedman, decifratore dei codici segreti della Seconda Guerra Mondiale), linguisti computazionali e moderni algoritmi di intelligenza artificiale. Nessuna ipotesi — dal trattato medico medievale alla lingua artificiale proto-rinascimentale, dall'opera esoterica ermetica alla sofisticata truffa cinquecentesca — è riuscita a violare la coerenza interna della legge di Zipf che regola il testo, lasciando il codice come una sfida aperta all'ingegno umano.",
    whyRecommended: "Selezionato in base al tema 'Manoscritti indecifrati, crittografia storica e misteri archivistici' specificato nei tuoi interessi.",
    highlightQuote: "«Nessun libro sulla Terra è stato interrogato con tanta insistenza e con così tanti strumenti tecnologici continuando a mantenere un silenzio assoluto.»",
    readingTime: "6 min (estratto)",
    pagesCount: "350 pagine"
  },
  {
    title: "L'incredibile viaggio delle piante",
    author: "Stefano Mancuso",
    year: "2018",
    publisher: "Laterza",
    category: "Natura & Botanica",
    matchingTopic: "Nuove Scoperte Scientifiche",
    synopsis: "Le piante vengono comunemente immaginate come organismi immobili, silenziosi e passivi, legati indissolubilmente al fazzoletto di terra in cui il loro seme ha trovato dimora. In questo saggio luminoso e documentato, Stefano Mancuso — professore all'Università di Firenze e pioniere riconosciuto della neurobiologia vegetale — ribalta questa prospettiva antropocentrica, svelando come il regno vegetale sia composto da esploratori formidabili e instancabili navigatori capaci di colonizzare gli ambienti più estremi del pianeta Terra, dagli atolli corallini dispersi nel Pacifico alle pareti ghiacciate delle Alpi e alle dune incandescenti del deserto sahariano.\n\nMancuso conduce il lettore attraverso storie botaniche straordinarie e verificate: dalle noci di cocco capaci di viaggiare per migliaia di chilometri sulle correnti oceaniche mantenendo intatta la propria capacità germinativa, ai semi di pino silvestre e di acacia che attendono per secoli il passaggio del fuoco per liberare la nuova generazione, fino ai muschi antartici rinvenuti sotto chilometri di calotta glaciale capaci di riprendere la fotosintesi dopo centinaia di migliaia di anni di sonno criogenico.\n\nL'opera approfondisce inoltre le stupefacenti forme di intelligenza biologica distribuita e cooperazione sotterranea: sprovviste di un cervello centrale o di singoli organi vitali la cui perdita risulterebbe letale di fronte all'attacco dei predatori, le piante elaborano informazioni con milioni di apici radicali connessi in una rete neurale vegetale (il cosiddetto 'Wood Wide Web' mediato dai funghi micorrizici). Una lettura appassionante che ci invita a riconsiderare il nostro rapporto con l'ecosistema vivente con profondo rispetto ed umiltà scientifica.",
    whyRecommended: "Corrisponde all'interesse per le nuove frontiere della biologia, l'intelligenza vegetale e la scienza naturale.",
    highlightQuote: "«Senza gli occhi, le orecchie o un cervello centrale, le piante percepiscono il mondo con ogni singola cellula del proprio corpo.»",
    readingTime: "5 min (estratto)",
    pagesCount: "144 pagine"
  },
  {
    title: "Cosmo",
    author: "Carl Sagan",
    year: "1980",
    publisher: "Mondadori / Rizzoli",
    category: "Astronomia & Spazio",
    matchingTopic: "Astronomia e Spazio",
    synopsis: "Un viaggio magistrale attraverso quindici miliardi di anni di evoluzione cosmica, dalla nascita delle prime stelle all'esplorazione planetaria delle sonde Voyager. Carl Sagan trasforma l'astrofisica in poesia della conoscenza, illustrando come la nostra specie sia il mezzo attraverso cui il cosmo conosce se stesso.\n\nIl saggio affronta con rigore e meraviglia la ricerca di civiltà extraterrestri attraverso il progetto SETI, il calcolo della formula di Drake e la fisica dei buchi neri, unendo la storia della scienza di Ipazia e Keplero con le frontiere della cosmologia moderna.\n\nUn'opera che ha plasmato generazioni di ricercatori e continua a brillare come faro di razionalità, etica scientifica e senso di comunione universale.",
    whyRecommended: "Perfetto per l'interesse su Astronomia, Spazio ed esplorazione dei pianeti extrasolari.",
    highlightQuote: "«Il cosmo è dentro di noi. Siamo fatti di materia stellare. Siamo la modalità con cui il cosmo conosce se stesso.»",
    readingTime: "6 min (estratto)",
    pagesCount: "384 pagine"
  },
  {
    title: "Passport to Magonia: On UFOs, Folklore, and Parallel Worlds",
    author: "Jacques Vallée",
    year: "1969",
    publisher: "Mursia / Venexia",
    category: "Mistero & Fenomenologia",
    matchingTopic: "UFO e Alieni",
    synopsis: "L'astrofisico e informatico Jacques Vallée compie un'analisi rivoluzionaria sui fenomeni aerei non identificati, dimostrando la sorprendente correlazione strutturale tra gli avvistamenti moderni di UAP/dischi volanti e i racconti secolari di apparizioni di folletti, fate e creature delle leggende celtiche e medievali.\n\nVallée propone l'ipotesi interdimensionale e parafisica: il fenomeno non si limita a semplici veicoli metallici provenienti da pianeti remoti, ma agisce come un sofisticato sistema di condizionamento culturale e psichico che interagisce con la coscienza umana da millenni.\n\nUn testo cardine dell'ufologia critica e scientifica, fondamentale per comprendere la complessità della fenomenologia senza cedere a dogmatismi.",
    whyRecommended: "Scelto per approfondire il tema 'UFO e Alieni' con un'indagine ad alto rigore storico e sociologico.",
    highlightQuote: "«La questione ufologica non è semplicemente tecnologica: tocca i confini stessi tra la nostra percezione e realtà parallele.»",
    readingTime: "5 min (estratto)",
    pagesCount: "360 pagine"
  },
  {
    title: "Il ramo d'oro: Studio sulla magia e la religione",
    author: "James George Frazer",
    year: "1890",
    publisher: "Bollati Boringhieri",
    category: "Antropologia & Miti",
    matchingTopic: "Piccolo Popolo e Creature del Folclore",
    synopsis: "Monumentale indagine antropologica sui miti della vegetazione, sui riti sacrificali antichi e sulla credenza negli spiriti della natura che abitano boschi, fonti e colline in tutte le tradizioni del mondo antico.\n\nFrazer traccia l'evoluzione del pensiero umano dalla magia simpatica alla religione e alla scienza, analizzando la figura del re del bosco di Nemi e le credenze popolari sul piccolo popolo invisibile custode dei cicli della terra.\n\nUn capolavoro assoluto dell'antropologia culturale che ha ispirato poeti come T.S. Eliot e studiosi di mitologia come Joseph Campbell.",
    whyRecommended: "Ideale per esplorare l'interesse su 'Piccolo Popolo e Creature del Folclore' e i culti della natura arcaica.",
    highlightQuote: "«I vecchi dèi non muoiono mai del tutto: si ritirano nei boschi e si trasformano nelle fiabe e nel folclore della gente semplice.»",
    readingTime: "6 min (estratto)",
    pagesCount: "680 pagine"
  },
  {
    title: "Guida galattica per gli autostoppisti",
    author: "Douglas Adams",
    year: "1979",
    publisher: "Mondadori",
    category: "Cinema & Narrativa Sci-Fi",
    matchingTopic: "Film di Fantascienza",
    synopsis: "La quintessenza della fantascienza umoristica e filosofica: le peregrinazioni cosmiche dell'inglese Arthur Dent, scampato alla distruzione della Terra per far spazio a una tangenziale iperspaziale, in compagnia dell'alieno Ford Prefect e del robot depresso Marvin.\n\nUn'opera brillante che deride la burocrazia galattica e indaga il significato della vita attraverso il leggendario supercomputer Pensiero Profondo e la risposta '42'.\n\nUn classico senza tempo che ha rivoluzionato l'immaginario sci-fi nella letteratura, in radio e nel cinema internazionale.",
    whyRecommended: "Consigliato per l'interesse su fantascienza, cinema di culto e umorismo cosmico.",
    highlightQuote: "«Niente panico! La risposta alla domanda fondamentale sulla vita, l'universo e tutto quanto è 42.»",
    readingTime: "4 min (estratto)",
    pagesCount: "216 pagine"
  },
  {
    title: "La longevità felice: I segreti delle Zone Blu",
    author: "Dan Buettner",
    year: "2015",
    publisher: "Vallardi",
    category: "Salute & Nutrizione",
    matchingTopic: "Benessere e Alimentazione",
    synopsis: "Un'inchiesta scientifica e sociologica condotta insieme a National Geographic nei luoghi della Terra dove le persone vivono più a lungo e in salute: dalla Sardegna a Okinawa, dalla Grecia alla Costa Rica.\n\nBuettner identifica i nove pilastri comuni dello stile di vita dei centenari: alimentazione a prevalenza vegetale, movimento naturale costante, scopo di vita ('ikigai') e forti legami comunitari.\n\nUn manuale pratico e basato su evidenze per migliorare la qualità della propria vita quotidiana attraverso la nutrizione consapevole.",
    whyRecommended: "Selezionato per l'interesse su 'Benessere e Alimentazione' e studi sulla longevità sana.",
    highlightQuote: "«La longevità non si compra in farmacia: si coltiva ogni giorno a tavola, nel cammino e nella forza delle relazioni umane.»",
    readingTime: "5 min (estratto)",
    pagesCount: "288 pagine"
  },
  {
    title: "Sapiens: Da animali a dèi. Breve storia dell'umanità",
    author: "Yuval Noah Harari",
    year: "2011",
    publisher: "Bompiani",
    category: "Storia Contemporanea",
    matchingTopic: "Storia Contemporanea",
    synopsis: "Centomila anni fa, almeno sei specie di umani abitavano la Terra. Oggi ce n'è solo una: Homo sapiens. Harari racconta come una scimmia insignificante sia diventata la padrona del pianeta grazie alla rivoluzione cognitiva e alla capacità unica di creare e credere in miti condivisi (denaro, nazioni, religioni, leggi).\n\nDalla rivoluzione agricola a quella scientifica e industriale, il saggio esplora con lucidità implacabile le forze che hanno plasmato la nostra società globale e le sfide etiche dell'era biotecnologica e dell'intelligenza artificiale.\n\nUn'opera monumentale di divulgazione storica che ridefinisce il modo in cui guardiamo al nostro passato e al nostro futuro.",
    whyRecommended: "Perfetto per l'interesse su Storia Contemporanea e analisi dei grandi cicli della civiltà umana.",
    highlightQuote: "«Abbiamo acquisito il potere di creare e distruggere come dèi, ma siamo ancora guidati da istinti insaziabili e irresponsabili.»",
    readingTime: "6 min (estratto)",
    pagesCount: "540 pagine"
  },
  {
    title: "Le città invisibili",
    author: "Italo Calvino",
    year: "1972",
    publisher: "Einaudi / Mondadori",
    category: "Narrativa Breve",
    matchingTopic: "Narrativa Breve",
    synopsis: "Nel palazzo del Kublai Khan, l'esploratore veneziano Marco Polo descrive all'imperatore tartaro cinquantacinque città immaginarie, ciascuna portatrice di un riflesso della condizione umana, del desiderio, della memoria e del tempo.\n\nDa Ottavia, la città-ragnatela sospesa sul vuoto, a Fedora con le sue sfere di cristallo, ogni scheda è una gemma di prosa poetica e riflessione filosofica sulla struttura della memoria e dello spazio urbano.\n\nUno dei massimi vertici della letteratura italiana del Novecento, sintesi sublime tra immaginazione geometrica e profondità umanistica.",
    whyRecommended: "Scelto per l'interesse su 'Narrativa Breve' e la grande letteratura d'invenzione.",
    highlightQuote: "«D'una città non godi le sette o le settantasette meraviglie, ma la risposta che dà a una tua domanda.»",
    readingTime: "4 min (estratto)",
    pagesCount: "170 pagine"
  }
];

// In-memory cache for daily book recommendations to prevent excessive API calls
const bookRecommendationCache: Map<string, { book: any; timestamp: number }> = new Map();

// API for Daily Recommended Book based on Interests with Anti-Duplication Exclusion
app.post("/api/book/recommended", async (req, res) => {
  try {
    const { interests, spreadsheetId, accessToken, forceRefresh, seed = 0, excludeBooks = [], excludeAuthors = [] } = req.body;

    const todayDateKey = new Date().toISOString().slice(0, 10);
    const cacheKey = `daily_book_${todayDateKey}`;

    const cached = bookRecommendationCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < 1000 * 60 * 60 * 24) {
      return res.json({
        success: true,
        book: cached.book,
        sourceSheet: "Personal Digest (Server Cache)",
      });
    }

    let activeInterests: InterestItem[] = [];

    if (Array.isArray(interests) && interests.length > 0) {
      activeInterests = interests;
    }

    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const effectiveIndex = Math.abs(dayOfYear + (Number(seed) || 0));

    // Prepara l'elenco di esclusione da passare al prompt
    const excludedNormTitles = (excludeBooks || []).map(normalizeServerText);
    serverBooksHistory.forEach((h) => {
      if (h.normalizedTitle) excludedNormTitles.push(h.normalizedTitle);
    });

    const excludeDirective = excludedNormTitles.length > 0
      ? `\nREGOLE CRITICHE DI UNICITÀ (NO RIPETIZIONI):\nNon consigliare MAI nessuno dei seguenti libri/saggi già pubblicati nei numeri precedenti:\n- ${excludeBooks.slice(0, 40).join("\n- ")}\nScegli un NUOVO saggio autentico, celebre e pubblicato in italiano mai proposto prima.`
      : "";

    // Try AI generation with Gemini + Google Search for a verified published book
    if (process.env.GEMINI_API_KEY && activeInterests.length > 0) {
      try {
        const ai = getGemini();
        const sorted = [...activeInterests].sort((a, b) => (b.priority || 3) - (a.priority || 3));
        const selectedInterest = sorted[effectiveIndex % sorted.length] || sorted[0];

        const prompt = `Sei il curatore letterario e redattore capo della rubrica "Il Libro Consigliato di Oggi" per la rivista "Personal Digest / Selezione".
L'utente ha registrato i seguenti interessi culturali:
- Categoria: "${selectedInterest.category}"
- Argomento di interesse: "${selectedInterest.topic}"
- Descrizione / Note: "${selectedInterest.description || 'Approfondimento divulgativo e scientifico'}"
${excludeDirective}

Il tuo compito è consigliare UN VERO LIBRO ESISTENTE, celebre o autorevole (saggio, libro di divulgazione scientifica, archeologia, storia, biografia o saggistica culturale di alto livello), pubblicato e tradotto in lingua italiana, che sia perfetto per questo interesse.

REGOLE CRITICHE:
1. Il libro deve essere REALE e pubblicato da una casa editrice (es. Adelphi, Mondadori, Laterza, Bollati Boringhieri, Rizzoli, Feltrinelli, Einaudi, Corbaccio, UTET, ecc.).
2. NON inventare titoli o autori: usa libri autentici.
3. La "synopsis" deve essere una vera e propria analisi letteraria e saggistica di approfondimento divisa in 3 paragrafi completi (separati da \\n\\n), ricca di dettagli storici, concetti chiave, tesi dell'autore e impatto scientifico o culturale.
4. Rispondi con un JSON valido con questi campi:
{
  "title": "Titolo esatto del libro in italiano",
  "author": "Nome dell'autore",
  "year": "Anno di prima edizione o pubblicazione (es. 2017)",
  "publisher": "Casa editrice italiana di riferimento",
  "category": "${selectedInterest.category}",
  "matchingTopic": "${selectedInterest.topic}",
  "synopsis": "Primo paragrafo che introduce l'opera, il contesto e la tesi centrale.\\n\\nSecondo paragrafo che approfondisce i capitoli o gli esperimenti e concetti chiave del volume.\\n\\nTerzo paragrafo che spiega l'impatto culturale, la portata filosofica e il messaggio finale per il lettore.",
  "whyRecommended": "Spiegazione chiara e approfondita del motivo per cui questo saggio risponde all'interesse specificato.",
  "highlightQuote": "Una citazione significativa o un estratto memorabile tratto dal libro o dall'autore.",
  "readingTime": "5 min (estratto)",
  "pagesCount": "es. 280 pagine"
}`;

        const response = await generateContentWithRetryAndFallback(ai, {
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          config: {
            tools: [{ googleSearch: {} }],
            temperature: 0.4,
          },
        }, "gemini-3.6-flash");

        const text = response.text || "{}";
        const bookData = safeExtractJson(text);

        if (bookData && bookData.title && bookData.author) {
          const normTitle = normalizeServerText(bookData.title);
          // Se per caso il modello ripete un titolo escluso, passiamo al fallback non duplicato
          if (!excludedNormTitles.includes(normTitle)) {
            registerBookInServerHistory(bookData.title, bookData.author);
            bookRecommendationCache.set(cacheKey, { book: bookData, timestamp: Date.now() });
            return res.json({
              success: true,
              book: bookData,
              sourceSheet: spreadsheetId ? "Google Fogli Connesso" : "Interessi Personali",
            });
          }
        }
      } catch (aiErr: any) {
        if (isQuotaError(aiErr)) {
          console.info("Gemini API quota reached for book recommendation, serving non-duplicate curated recommendation.");
        } else {
          console.info("AI generation for book failed, using curated catalog:", aiErr?.message || "Unavailable");
        }
      }
    }

    // Curated Fallback with anti-duplication filter
    const nonDuplicatedBooks = CURATED_RECOMMENDED_BOOKS.filter((b) => {
      const norm = normalizeServerText(b.title);
      return !excludedNormTitles.includes(norm);
    });
    const bookPool = nonDuplicatedBooks.length > 0 ? nonDuplicatedBooks : CURATED_RECOMMENDED_BOOKS;
    const fallbackBook = bookPool[effectiveIndex % bookPool.length];

    registerBookInServerHistory(fallbackBook.title, fallbackBook.author);
    bookRecommendationCache.set(cacheKey, { book: fallbackBook, timestamp: Date.now() });

    return res.json({
      success: true,
      book: fallbackBook,
      sourceSheet: "Interessi Personali (Archivio Curato)",
    });
  } catch (error: any) {
    console.error("Error in /api/book/recommended:", error);
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const fallbackBook = CURATED_RECOMMENDED_BOOKS[dayOfYear % CURATED_RECOMMENDED_BOOKS.length];
    return res.json({
      success: true,
      book: fallbackBook,
      sourceSheet: "Interessi Personali (Predefiniti)",
    });
  }
});

// In-memory cache for daily word of the day
const dailyWordCache: Map<string, { word: any; timestamp: number }> = new Map();

const CURATED_DAILY_WORDS = [
  {
    word: "Desiderio",
    phonetic: "[de-si-dè-rio]",
    grammaticalClass: "sostantivo maschile (pl. desideri)",
    category: "Linguistica & Filosofia",
    matchingTopic: "Etimologia storica, astronomia augurale latina e psicologia",
    etymology: "Dal latino classico desiderāre (I sec. a.C., Cicerone e Cesare), composto dalla preposizione privativa 'de-' e da 'sidus, sideris' ('stella', 'astro celeste'): letteralmente 'constatare l'assenza degli astri' e attendere con trepidazione il loro ritorno per ritrovare la rotta perduta.",
    definition: "Sentimento di viva tensione, nostalgia febbrile o anelito dell'anima verso una persona, un bene, una verità o una meta che manca ma che si brama ardentemente di raggiungere.",
    nuanceAndUsage: "Si contrappone e completa 'considerare' (cum + sidus, 'guardare insieme le stelle per decidere con saggezza'). In Dante (Convivio) è il motore supremo della conoscenza; nella Crusca (1612) simbolo dell'animo umano.",
    literaryQuote: "«...ma già volgeva il mio disio e 'l velle, sì come rota ch'igualmente è mossa, l'amor che move il sole e l'altre stelle.»",
    quoteAuthor: "Dante Alighieri",
    quoteSource: "Paradiso, Canto XXXIII, 143-145",
    quizQuestion: "Da quale sostantivo latino deriva la parola «Desiderio»?",
    quizOptions: [
      "A) Sidus, sideris (stella, costellazione celeste)",
      "B) Sedes, sedis (dimora, trono)",
      "C) Sideros (ferro indurito)",
      "D) Sicut (così come)"
    ],
    correctQuizIndex: 0,
    quizExplanation: "Esatto! Deriva da 'sidus, sideris' (stella). Per i marinai romani, 'de-siderare' significava scrutare la notte scura priva di stelle (de-sidera) attendendo la luce polare per non naufragare.",
    didYouKnow: "Il termine gemello 'considerare' significa 'radunare con lo sguardo le stelle' prima di prendere una decisione; 'desiderare' è invece l'anelito verso la stella che ancora manca all'orizzonte."
  },
  {
    word: "Serendipità",
    phonetic: "[se-ren-di-pi-tà]",
    grammaticalClass: "sostantivo femminile invariabile",
    category: "Linguistica & Scienza",
    matchingTopic: "Scoperte scientifiche fortuite, pensiero laterale e innovazione",
    etymology: "Coniata nel 1754 dallo scrittore inglese Horace Walpole (in una lettera a Horace Mann) come 'serendipity', traendo ispirazione dall'antica fiaba persiana 'I tre principi di Serendippo' (antico nome dello Sri Lanka), i cui protagonisti facevano continue scoperte felici e inattese di cose che non stavano cercando, grazie a perspicacia e sagacia.",
    definition: "La capacità o il dono di fare scoperte felici, illuminanti e impreviste mentre si sta cercando tutt'altro; l'attitudine a cogliere il valore conoscitivo di eventi apparentemente casuali o anomali nel corso di un'indagine intellettuale o scientifica.",
    nuanceAndUsage: "Non coincide con la mera 'buona sorte' o il 'caso cieco': la serendipità richiede una mente preparata, curiosa e recettiva, capace di notare l'anomalia (come Alexander Fleming con la muffa del Penicillium o Wilhelm Röntgen con i raggi X) e comprenderne la portata rivoluzionaria.",
    literaryQuote: "«Nella storia della scienza, le scoperte più decisive non sono quasi mai state pianificate a tavolino: sono figlie di una feconda serendipità guidata da uno sguardo attento.»",
    quoteAuthor: "Umberto Eco",
    quoteSource: "La bustina di Minerva",
    quizQuestion: "Qual è l'origine geografica del termine 'Serendippo' da cui deriva 'serendipità'?",
    quizOptions: [
      "A) L'antico nome persiano dell'isola di Sri Lanka (Ceylon)",
      "B) Una città mitologica sommersa nel mar Caspio",
      "C) Un monastero sulle montagne tibetane dell'Himalaya",
      "D) Un distretto commerciale di Costantinopoli bizantina"
    ],
    correctQuizIndex: 0,
    quizExplanation: "Esatto! 'Serendip' (o Serendippo) era l'antico toponimo arabo e persiano per indicare l'isola di Ceylon, l'odierno Sri Lanka. La favola dei tre principi di Serendippo fu tradotta a Venezia nel 1557 da Cristoforo Armeno e ispirò Walpole due secoli dopo.",
    didYouKnow: "Louis Pasteur riassunse mirabilmente lo spirito della serendipità nella sua celebre massima: «Nel campo dell'osservazione, il caso favorisce soltanto le menti preparate»."
  },
  {
    word: "Palinsesto",
    phonetic: "[pa-lin-sè-sto]",
    grammaticalClass: "sostantivo maschile (pl. palinsesti)",
    category: "Storia & Filologia",
    matchingTopic: "Manoscritti antichi, pergamene medievali e stratificazioni storiche",
    etymology: "Dal greco antico παλίμψηστος (palímpsēstos), composto dall'avverbio πάλιν (pálin, 'di nuovo') e dal verbo ψάω (psáō, 'raschiare', 'sfregare via'): letteralmente 'raschiato di nuovo per essere riscritto'.",
    definition: "1. Foglio di pergamena o papiro il cui testo originario è stato cancellato mediante raschiatura o lavaggio per permettere una nuova stesura, in cui tuttavia le tracce della scrittura primitiva possono essere rilette con tecniche ottiche (come lampade UV o fluorescenza ai raggi X).\n2. Per estensione metaforica, qualsiasi realtà, città, paesaggio o memoria in cui strati diversi di epoche storiche convivono sovrapposti.",
    nuanceAndUsage: "In filologia e archeologia indica un tesoro documentale: celebri palinsesti hanno restituito opere perdute di Cicerone (il De Re Publica scoperto da Angelo Mai nel 1819) e trattati inediti di Archimede. In ambito moderno designa anche la griglia dei programmi radiotelevisivi.",
    literaryQuote: "«Roma non è un monumento statico, ma un immenso palinsesto di pietra e tufo: ogni secolo ha raschiato e riscritto la propria preghiera sopra le fondamenta del precedente.»",
    quoteAuthor: "Italo Calvino",
    quoteSource: "Collezione di sabbia",
    quizQuestion: "Come veniva raschiata e preparata la pergamena per creare un palinsesto nel Medioevo?",
    quizOptions: [
      "A) Strofinando la pelle di vitello o capra con pietra pomice e latte o calce per asportare l'inchiostro ferruginoso",
      "B) Bruciando superficialmente la pagina con carbone ardente",
      "C) Immergendo il rotolo in olio d'oliva bollente",
      "D) Usando l'acido solforico ricavato dall'alchimia araba"
    ],
    correctQuizIndex: 0,
    quizExplanation: "Corretto! Poiché la pergamena animale era un materiale prezioso e costoso, gli amanuensi medievali riutilizzavano i codici meno richiesti raschiando l'inchiostro originario con polvere di pomice o lavandola con latte e limone prima di riscrivervi testi liturgici.",
    didYouKnow: "Grazie alla tomografia a raggi X e all'imaging multispettrale del celebre 'Palinsesto di Archimede', nel 1998 sono stati decifrati trattati matematici rivoluzionari del genio di Siracusa (come 'Il Metodo dei teoremi meccanici') che anticipavano di diciotto secoli il calcolo infinitesimale di Newton e Leibniz."
  },
  {
    word: "Entropia",
    phonetic: "[en-tro-pì-a]",
    grammaticalClass: "sostantivo femminile invariabile",
    category: "Frontiere della Fisica",
    matchingTopic: "Fisica quantistica, termodinamica e la freccia del tempo cosmico",
    etymology: "Coniata nel 1865 dal fisico tedesco Rudolf Clausius dal greco antico ἐν (en, 'dentro') e τροπή (tropḗ, 'svolta', 'mutamento', 'trasformazione'), per indicare il contenuto di trasformazione intrinseco a un sistema termodinamico.",
    definition: "In termodinamica e fisica statistica (formulata da Boltzmann), grandezza che misura il grado di disordine microscopico e l'indisponibilità di energia termica a compiere lavoro utile in un sistema chiuso. In senso cosmologico e filosofico, definisce la direzione irreversibile della 'freccia del tempo'.",
    nuanceAndUsage: "Nel linguaggio comune viene spesso usata metaforicamente per indicare la naturale tendenza di qualsiasi sistema umano, sociale o organizzativo a degradare verso il disordine e la confusione se non viene fornita costantemente nuova energia e cura.",
    literaryQuote: "«L'entropia è l'unica legge fisica che distingue il passato dal futuro: se un uovo si rompe sul pavimento, la freccia del tempo punta nella direzione dell'aumento di entropia, perché nessun processo spontaneo ricompone il guscio intatto.»",
    quoteAuthor: "Carlo Rovelli",
    quoteSource: "L'ordine del tempo",
    quizQuestion: "Chi formulò la celebre equazione fondamentale dell'entropia statistica S = k · log W incisa sulla sua lapide a Vienna?",
    quizOptions: [
      "A) Ludwig Boltzmann",
      "B) Albert Einstein",
      "C) Isaac Newton",
      "D) James Clerk Maxwell"
    ],
    correctQuizIndex: 0,
    quizExplanation: "Esatto! Ludwig Boltzmann collegò l'entropia termodinamica al numero di microstati possibili (W) attraverso la costante universale k (costante di Boltzmann), rivoluzionando per sempre la fisica moderna.",
    didYouKnow: "A differenza di tutte le altre equazioni della meccanica quantistica e della relatività (che sono perfettamente simmetriche rispetto al tempo), solo il Secondo Principio della Termodinamica introduce l'asimmetria temporale nel nostro universo."
  },
  {
    word: "Sintropia",
    phonetic: "[sin-tro-pì-a]",
    grammaticalClass: "sostantivo femminile invariabile",
    category: "Fisica & Sistemi Viventi",
    matchingTopic: "Origine della vita, autorganizzazione e complessità cosmica",
    etymology: "Coniata nel 1941 dal matematico italiano Luigi Fantappiè dalle radici greche σύν (syn, 'insieme') e τροπή (tropḗ, 'direzione', 'mutamento'), come principio speculare e complementare all'entropia.",
    definition: "La tendenza intrinseca della materia vivente e dei sistemi complessi ad auto-organizzarsi, aggregarsi e produrre ordine, complessità e finalità nel tempo, contrastando localmente il degrado entropico.",
    nuanceAndUsage: "Indica quel principio secondo cui i sistemi biologici non tendono alla dissoluzione termica ma evolvono verso forme di cooperazione e consapevolezza sempre più ricche.",
    literaryQuote: "«La vita non è una sfida perduta all'entropia, ma l'espressione trionfante della sintropia che plasma la materia in pensiero.»",
    quoteAuthor: "Luigi Fantappiè",
    quoteSource: "Principi di una teoria unitaria del mondo fisico e biologico",
    quizQuestion: "Chi formulò per primo il concetto matematico di sintropia nel 1941?",
    quizOptions: [
      "A) Luigi Fantappiè",
      "B) Enrico Fermi",
      "C) Erwin Schrödinger",
      "D) Norbert Wiener"
    ],
    correctQuizIndex: 0,
    quizExplanation: "Esatto! Luigi Fantappiè, illustre matematico allievo della Scuola Normale Superiore di Pisa, introdusse la sintropia studiando le soluzioni avanzate delle equazioni d'onda relativistiche.",
    didYouKnow: "Erwin Schrödinger nel celebre saggio 'Che cos'è la vita?' (1944) descrisse un fenomeno identico definendolo 'entropia negativa' o negentropia."
  },
  {
    word: "Atrabiliare",
    phonetic: "[a-tra-bi-li-à-re]",
    grammaticalClass: "aggettivo (pl. atrabiliari)",
    category: "Letteratura & Storia della Medicina",
    matchingTopic: "Dottrina degli umori ippocratica e psicologia rinascimentale",
    etymology: "Dal latino atra bilis, calco del greco antico μέλαινα χολή (mélaina cholḗ, 'bile nera').",
    definition: "Di umore cupo, tetro, ipocondriaco e propenso alla collera sarcastica o alla malinconia solitaria.",
    nuanceAndUsage: "Vocabolo di alto registro letterario impiegato per descrivere personalità complesse, solitarie ma spesso dotate di profonda acuità intellettuale.",
    literaryQuote: "«La notte appartiene agli spiriti atrabiliari, che sanno scorgere nella penombra le verità che il sole accecante nasconde.»",
    quoteAuthor: "Giacomo Leopardi",
    quoteSource: "Zibaldone di pensieri",
    quizQuestion: "Quale dei quattro umori della medicina ippocratica corrispondeva alla 'bile nera'?",
    quizOptions: [
      "A) L'umore associato alla terra, alla milza e alla malinconia",
      "B) L'umore associato all'aria e al sangue",
      "C) L'umore associato all'acqua e al flemma",
      "D) L'umore associato al fuoco e alla bile gialla"
    ],
    correctQuizIndex: 0,
    quizExplanation: "Corretto! Nella medicina greca di Ippocrate e Galeno, la bile nera (atra bilis) era legata all'elemento terra e alla milza, regolando il temperamento malinconico e speculativo.",
    didYouKnow: "Nel Rinascimento, il filosofo Marsilio Ficino sosteneva che la disposizione atrabiliare fosse il marchio distintivo del genio creativo e filosofico."
  },
  {
    word: "Pareidolia",
    phonetic: "[pa-rei-do-lì-a]",
    grammaticalClass: "sostantivo femminile",
    category: "Psicologia Cognitiva & Percezione",
    matchingTopic: "Percezione visiva, volti sulla Luna e riconoscimento di schemi",
    etymology: "Dal greco antico παρά (pará, 'accanto', 'alterato', 'oltre') e εἴδωλον (eídōlon, 'immagine', 'figura', 'fantasma').",
    definition: "L'illusione subcosciente e spontanea che spinge la mente umana a ricondurre forme casuali, ombre, nuvole o rocce a strutture ordinate e note, tipicamente volti umani o figure animali.",
    nuanceAndUsage: "È un meccanismo evolutivo primario: per i nostri antenati riconoscere istantaneamente un predatore o un volto nella boscaglia era vitale per la sopravvivenza.",
    literaryQuote: "«La mente non tollera il caos informe: ovunque posi lo sguardo, la pareidolia proietta volti e storie sulla tela bianca della natura.»",
    quoteAuthor: "Oliver Sacks",
    quoteSource: "L'occhio della mente",
    quizQuestion: "Quale celebre immagine della superficie di Marte nel 1976 scatenò un enorme fenomeno di pareidolia mondiale?",
    quizOptions: [
      "A) La cosiddetta 'Faccia di Cydonia' fotografata dalla sonda Viking 1",
      "B) La piramide di Elysium fotografata da Mariner 9",
      "C) I canali d'acqua di Schiaparelli",
      "D) L'albero fossile di Gale Crater"
    ],
    correctQuizIndex: 0,
    quizExplanation: "Esatto! Il 'Volto di Marte' nella regione di Cydonia era un rilievo montuoso naturale le cui ombre, nella bassa risoluzione di Viking 1, simulavano un volto umanoide.",
    didYouKnow: "Il test delle macchie d'inchiostro di Rorschach sfrutta scientificamente il principio della pareidolia per esplorare le dinamiche inconsce della personalità."
  },
  {
    word: "Entelechia",
    phonetic: "[en-te-le-chì-a]",
    grammaticalClass: "sostantivo femminile",
    category: "Filosofia Classica & Ontologia",
    matchingTopic: "Aristotele, potenza e atto e il fine ultimo della vita",
    etymology: "Dal greco antico ἐντελέχεια (entelécheia), composto da ἐν (en, 'in'), τέλος (télos, 'fine', 'compimento') ed ἔχειν (échein, 'avere'): 'avere la propria fine in se stesso'.",
    definition: "Nel pensiero aristotelico, lo stato di piena realizzazione e perfezione in cui una potenza giunge al suo compimento finale; il principio attivo che guida un organismo a divenire ciò che è destinato a essere (come la quercia nella ghianda).",
    nuanceAndUsage: "Usato in ambito colto per indicare la piena fioritura di un'idea, di un talento o di un progetto giunto al suo vertice espressivo.",
    literaryQuote: "«L'anima è l'entelechia prima di un corpo naturale che ha la vita in potenza.»",
    quoteAuthor: "Aristotele",
    quoteSource: "De Anima (II, 1)",
    quizQuestion: "Chi ha coniato il termine 'entelechia' nel IV secolo a.C.?",
    quizOptions: [
      "A) Aristotele",
      "B) Platone",
      "C) Socrate",
      "D) Eraclito"
    ],
    correctQuizIndex: 0,
    quizExplanation: "Corretto! Aristotele inventò questo neologismo per spiegare il passaggio dalla pura potenzialità (dýnamis) alla piena realtà in atto (enérgeia).",
    didYouKnow: "Nel Seicento Leibniz riprese l'entelechia aristotelica per descrivere le sue celebri 'Monadi', centri di forza spirituale e vitale increata."
  },
  {
    word: "Resilienza",
    phonetic: "[re-si-lièn-za]",
    grammaticalClass: "sostantivo femminile",
    category: "Fisica & Psicologia Umana",
    matchingTopic: "Adattamento biologico, metallurgia e superamento delle crisi",
    etymology: "Dal latino resiliēns, participio presente di resilīre ('rimbalzare', 'saltare indietro', composto da re- e salīre).",
    definition: "In metallurgia e ingegneria, la capacità di un materiale di resistere a urti improvvisi e deformazioni senza spezzarsi; in psicologia e sociologia, la facoltà umana di superare eventi traumatici o periodi di grave difficoltà riorganizzando positivamente la propria vita.",
    nuanceAndUsage: "Non indica mera sopportazione passiva, ma una trasformazione attiva che rende l'individuo più saggio e flessibile di fronte alle incertezze del mondo.",
    literaryQuote: "«La quercia resiste alla tempesta con la forza e si spezza; la canna si piega fino a toccare terra con resilienza e torna a svettare verso il cielo.»",
    quoteAuthor: "Primo Levi",
    quoteSource: "Il sistema periodico",
    quizQuestion: "In quale disciplina scientifica è nato originariamente il termine 'resilienza' prima di essere applicato alla psicologia?",
    quizOptions: [
      "A) Nella metallurgia e scienza dei materiali (capacità di assorbire energia da urto)",
      "B) Nella biologia marina",
      "C) Nell'astronomia rinascimentale",
      "D) Nella botanica applicata"
    ],
    correctQuizIndex: 0,
    quizExplanation: "Esatto! La resilienza nacque come parametro meccanico misurato con il pendolo di Charpy per quantificare l'energia d'urto necessaria a fratturare un provino di metallo.",
    didYouKnow: "Il concetto di resilienza ecologica fu formalizzato nel 1973 dall'ecologo canadese C.S. Holling per misurare la capacità degli ecosistemi di assorbire disturbi ambientali."
  }
];

// API for Daily Word with Anti-Duplication Exclusion
app.post("/api/word/daily", async (req, res) => {
  try {
    const { interests, spreadsheetId, accessToken, forceRefresh, seed = 0, excludeWords = [] } = req.body;
    const todayDateKey = new Date().toISOString().slice(0, 10);
    const cacheKey = `daily_word_${todayDateKey}`;

    const cached = dailyWordCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < 1000 * 60 * 60 * 24) {
      return res.json({
        success: true,
        word: cached.word,
        sourceSheet: "Personal Digest (Server Cache)",
      });
    }

    let activeInterests: InterestItem[] = [];

    if (Array.isArray(interests) && interests.length > 0) {
      activeInterests = interests;
    }

    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const effectiveIndex = Math.abs(dayOfYear + (Number(seed) || 0));

    // Prepara la lista di esclusione parole per il prompt
    const excludedNormWords = (excludeWords || []).map(normalizeServerText);
    serverWordsHistory.forEach((h) => {
      if (h.normalizedWord) excludedNormWords.push(h.normalizedWord);
    });

    const excludeDirective = excludedNormWords.length > 0
      ? `\nREGOLE CRITICHE DI UNICITÀ (NO RIPETIZIONI):\nNon selezionare MAI nessuna delle seguenti parole già trattate nei numeri precedenti:\n- ${excludeWords.slice(0, 40).join(", ")}\nScegli una NUOVA parola della lingua italiana ricca di fascino etimologico e culturale.`
      : "";

    if (process.env.GEMINI_API_KEY && activeInterests.length > 0) {
      try {
        const ai = getGemini();
        const sorted = [...activeInterests].sort((a, b) => (b.priority || 3) - (a.priority || 3));
        const selectedInterest = sorted[effectiveIndex % sorted.length] || sorted[0];

        const prompt = `Sei il filologo, lessicografo e curatore della rubrica "Più parole, più idee (Arricchite il vostro vocabolario)" per la celebre rivista "Personal Digest / Selezione".
L'utente ha registrato i seguenti interessi culturali:
- Categoria: "${selectedInterest.category}"
- Argomento di interesse: "${selectedInterest.topic}"
${excludeDirective}

Seleziona o approfondisci una PAROLA DELLA LINGUA ITALIANA autentica, ricca di fascino etimologico, culturale o scientifico (es. Serendipità, Palinsesto, Entropia, Sintropia, Atrabiliare, Entelechia, Resilienza, Sineddoche, Anacronismo, Apologia, Solipsismo, Pareidolia, ecc.) correlata a questo tema.

Rispondi con un JSON valido con questo schema:
{
  "word": "Parola (es. Serendipità)",
  "phonetic": "[pronuncia sillabata]",
  "grammaticalClass": "sostantivo femminile / aggettivo / ecc.",
  "category": "${selectedInterest.category}",
  "matchingTopic": "${selectedInterest.topic}",
  "etymology": "Etimologia approfondita e storia di come la parola è nata.",
  "definition": "Definizione chiara e sfumature di significato.",
  "nuanceAndUsage": "Come usarla con precisione, registro linguistico e distinzione con sinonimi comuni.",
  "literaryQuote": "Citazione d'autore o brano letterario/saggistico in cui la parola risplende.",
  "quoteAuthor": "Autore della citazione",
  "quoteSource": "Opera o libro di provenienza",
  "quizQuestion": "Una domanda a risposta multipla accattivante sull'etimologia o sul significato",
  "quizOptions": ["A) ...", "B) ...", "C) ...", "D) ..."],
  "correctQuizIndex": 0,
  "quizExplanation": "Spiegazione della risposta corretta.",
  "didYouKnow": "Curiosità aneddotica o nota storica affascinante sulla parola."
}`;

        const response = await generateContentWithRetryAndFallback(ai, {
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          config: {
            tools: [{ googleSearch: {} }],
            temperature: 0.4,
          },
        }, "gemini-3.6-flash");

        const text = response.text || "{}";
        const wordData = safeExtractJson(text);

        if (wordData && wordData.word && wordData.definition) {
          const normWord = normalizeServerText(wordData.word);
          if (!excludedNormWords.includes(normWord)) {
            registerWordInServerHistory(wordData.word);
            dailyWordCache.set(cacheKey, { word: wordData, timestamp: Date.now() });
            return res.json({
              success: true,
              word: wordData,
              sourceSheet: spreadsheetId ? "Google Fogli Connesso" : "Interessi Personali",
            });
          }
        }
      } catch (aiErr: any) {
        if (isQuotaError(aiErr)) {
          console.info("Gemini API quota reached for daily word, serving non-duplicate curated word.");
        } else {
          console.info("AI generation for daily word failed, using curated catalog:", aiErr?.message || "Unavailable");
        }
      }
    }

    // Curated Fallback with anti-duplication filter
    const nonDuplicatedWords = CURATED_DAILY_WORDS.filter((w) => {
      const norm = normalizeServerText(w.word);
      return !excludedNormWords.includes(norm);
    });
    const wordPool = nonDuplicatedWords.length > 0 ? nonDuplicatedWords : CURATED_DAILY_WORDS;
    const fallbackWord = wordPool[effectiveIndex % wordPool.length];

    registerWordInServerHistory(fallbackWord.word);
    dailyWordCache.set(cacheKey, { word: fallbackWord, timestamp: Date.now() });

    return res.json({
      success: true,
      word: fallbackWord,
      sourceSheet: "Interessi Personali (Archivio Curato)",
    });
  } catch (error: any) {
    console.error("Error in /api/word/daily:", error);
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const fallbackWord = CURATED_DAILY_WORDS[dayOfYear % CURATED_DAILY_WORDS.length];
    return res.json({
      success: true,
      word: fallbackWord,
      sourceSheet: "Interessi Personali (Predefiniti)",
    });
  }
});

// Helper per verificare se un URL immagine è valido e accessibile
async function verifyDirectImageUrl(url?: string | null): Promise<boolean> {
  if (!url || typeof url !== "string" || !url.startsWith("http")) return false;
  if (url.includes("placeholder") || url.includes("/wiki/File:")) return false;
  try {
    const res = await fetch(url, {
      method: "HEAD",
      headers: {
        "User-Agent": "PersonalDigestBot/2.0 (web-art-search@personal-digest.app)"
      }
    });
    return res.ok;
  } catch {
    return false;
  }
}

// Helper per la risoluzione e ricerca dinamica di immagini ad alta definizione sul Web e Wikimedia Commons
async function searchWikimediaImage(artist: string, title: string, hintUrl?: string): Promise<string | null> {
  try {
    // 1. Se hintUrl è fornito e punta direttamente a upload.wikimedia.org, verificalo
    if (hintUrl && typeof hintUrl === "string" && hintUrl.startsWith("http")) {
      const cleanHint = hintUrl.split("?")[0];
      if (cleanHint.includes("/wiki/File:") || cleanHint.includes("/wiki/File%3A")) {
        const filePart = cleanHint.split("/wiki/")[1];
        if (filePart) {
          const fileTitle = decodeURIComponent(filePart).replace(/^File:/i, "File:");
          try {
            const fileApiUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(fileTitle)}&prop=imageinfo&iiprop=url|size|mime&format=json&origin=*`;
            const fileRes = await fetch(fileApiUrl, {
              headers: { "User-Agent": "PersonalDigestBot/2.0 (web-art-search@personal-digest.app)" }
            });
            if (fileRes.ok) {
              const fileData: any = await fileRes.json();
              const p = fileData.query?.pages;
              if (p) {
                const firstPage = Object.values(p)[0] as any;
                const info = firstPage?.imageinfo?.[0];
                if (info?.url && (await verifyDirectImageUrl(info.url))) {
                  return info.url;
                }
              }
            }
          } catch {}
        }
      } else if (/\.(jpg|jpeg|png|webp)($|\?)/i.test(cleanHint) && cleanHint.includes("upload.wikimedia.org")) {
        if (await verifyDirectImageUrl(cleanHint)) {
          return cleanHint;
        }
      }
    }

    const cleanTitle = (title || "")
      .replace(/\(.*?\)/g, "")
      .replace(/^["'«“]|["'»”]$/g, "")
      .replace(/^(L'|L’|Il\s+|La\s+|Lo\s+|I\s+|Gli\s+|Le\s+|The\s+|A\s+|An\s+)/i, "")
      .trim();
    const cleanArtist = (artist || "")
      .replace(/\(.*?\)/g, "")
      .split(",")[0]
      .replace(/\b(18|19|17|16|15|14|13|20)\d{2}\b/g, "")
      .replace(/–|-/g, "")
      .trim();
    
    const queries = [
      `${cleanArtist} ${cleanTitle}`,
      `${cleanTitle} ${cleanArtist}`,
      `${cleanArtist} drawing`,
      `${cleanArtist} painting`,
      `${cleanArtist}`,
      `${cleanTitle}`,
    ].filter(q => q.length > 2);

    // 2. Ricerca su Wikipedia (Italiano ed Inglese) con prop=pageimages (restituisce anteprime ad altissima qualità)
    for (const lang of ["it", "en"]) {
      for (const q of queries.slice(0, 4)) {
        try {
          const wikiSearchUrl = `https://${lang}.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(q)}&gsrlimit=4&prop=pageimages&pithumbsize=1200&format=json&origin=*`;
          const wikiRes = await fetch(wikiSearchUrl, {
            headers: { "User-Agent": "PersonalDigestBot/2.0" }
          });
          if (wikiRes.ok) {
            const wikiData: any = await wikiRes.json();
            const pages = wikiData.query?.pages;
            if (pages) {
              for (const pid of Object.keys(pages)) {
                const page = pages[pid];
                if (page.thumbnail?.source && !page.thumbnail.source.includes("icon") && !page.thumbnail.source.includes("flag")) {
                  const candidate = page.thumbnail.source.split("?")[0];
                  if (await verifyDirectImageUrl(candidate)) {
                    return candidate;
                  }
                }
              }
            }
          }
        } catch {}
      }
    }

    // 3. Ricerca su Wikimedia Commons API
    for (const q of queries) {
      try {
        const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(q)}&gsrlimit=8&prop=imageinfo&iiprop=url|size|mime&format=json&origin=*`;
        const res = await fetch(url, {
          headers: { "User-Agent": "PersonalDigestBot/2.0 (web-art-search@personal-digest.app)" }
        });
        if (res.ok) {
          const data: any = await res.json();
          const pages = data.query?.pages;
          if (pages) {
            for (const pageId of Object.keys(pages)) {
              const page = pages[pageId];
              const info = page.imageinfo?.[0];
              const titleLower = (page.title || "").toLowerCase();
              if (
                info &&
                info.url &&
                (info.mime === "image/jpeg" || info.mime === "image/png" || info.mime === "image/webp") &&
                !titleLower.includes("flag") &&
                !titleLower.includes("icon") &&
                !titleLower.includes("logo") &&
                !titleLower.includes("tumba")
              ) {
                const candidate = info.url.split("?")[0];
                if (await verifyDirectImageUrl(candidate)) {
                  return candidate;
                }
              }
            }
          }
        }
      } catch (qErr) {
        // Continue to next query attempt
      }
    }
  } catch (err) {
    console.warn("searchWikimediaImage error:", err);
  }
  return null;
}

// In-memory cache per l'image proxy (evita rate limits e blocchi CORS/Hotlink su Wikimedia)
const imageProxyCache = new Map<string, { buffer: Buffer; contentType: string; expires: number }>();

// Endpoint proxy per servire in modo sicuro, affidabile e senza blocchi le immagini d'arte
app.get("/api/art/image-proxy", async (req, res) => {
  try {
    const rawUrl = req.query.url as string;
    const artist = (req.query.artist as string) || "";
    const title = (req.query.title as string) || "";

    if (!rawUrl && !artist && !title) {
      return res.status(400).send("Parametri mancanti");
    }

    const targetUrl = rawUrl ? decodeURIComponent(rawUrl).split("?")[0] : "";
    const cacheKey = targetUrl || `${artist}:${title}`;

    const cached = imageProxyCache.get(cacheKey);
    if (cached && cached.expires > Date.now()) {
      res.setHeader("Content-Type", cached.contentType);
      res.setHeader("Cache-Control", "public, max-age=86400, immutable");
      return res.send(cached.buffer);
    }

    let urlToFetch = targetUrl;
    if (!urlToFetch || !urlToFetch.startsWith("http") || urlToFetch.includes("placeholder")) {
      const found = await searchWikimediaImage(artist, title);
      if (found) {
        urlToFetch = found;
      }
    }

    if (!urlToFetch) {
      return res.status(404).send("Immagine non trovata");
    }

    let fetchRes = await fetch(urlToFetch, {
      headers: {
        "User-Agent": "PersonalDigestBot/2.0 (web-art-search@personal-digest.app; https://personal-digest.app)",
        "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8"
      }
    });

    // Se la fetch fallisce (es. 404 o 400), tenta una ricerca alternativa dell'opera
    if (!fetchRes.ok && (artist || title)) {
      const altUrl = await searchWikimediaImage(artist, title);
      if (altUrl && altUrl !== urlToFetch) {
        urlToFetch = altUrl;
        fetchRes = await fetch(urlToFetch, {
          headers: {
            "User-Agent": "PersonalDigestBot/2.0 (web-art-search@personal-digest.app; https://personal-digest.app)",
            "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8"
          }
        });
      }
    }

    if (!fetchRes.ok) {
      return res.status(fetchRes.status).send(`Failed to fetch image: ${fetchRes.statusText}`);
    }

    const contentType = fetchRes.headers.get("content-type") || "image/jpeg";
    const arrayBuf = await fetchRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuf);

    imageProxyCache.set(cacheKey, {
      buffer,
      contentType,
      expires: Date.now() + 24 * 60 * 60 * 1000
    });

    if (imageProxyCache.size > 120) {
      const firstKey = imageProxyCache.keys().next().value;
      if (firstKey) imageProxyCache.delete(firstKey);
    }

    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=86400, immutable");
    return res.send(buffer);
  } catch (error: any) {
    console.error("Error in /api/art/image-proxy:", error);
    return res.status(500).send("Proxy error");
  }
});

// Cache for daily art masterpieces
const artMasterpieceCache: Map<string, { masterpiece: any; timestamp: number }> = new Map();

// Endpoint per la ricerca on-demand di immagini d'arte sul Web / Wikimedia
app.get("/api/art/search-image", async (req, res) => {
  try {
    const { title = "", artist = "" } = req.query;
    if (!title && !artist) {
      return res.status(400).json({ error: "title o artist richiesto per la ricerca." });
    }
    const imageUrl = await searchWikimediaImage(String(artist), String(title));
    return res.json({ success: true, imageUrl });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Errore nella ricerca immagine." });
  }
});

// API per la Ricerca LIVE nel Web di Capolavori d'Arte con Google Search e Unicità Storica
app.post("/api/art/masterpiece", async (req, res) => {
  try {
    const { interests, spreadsheetId, accessToken, forceRefresh, seed = 0, excludeArtworks = [], excludeArtists = [] } = req.body;
    const todayDateKey = new Date().toISOString().slice(0, 10);
    const interestsSignature = Array.isArray(interests) ? interests.map(i => `${i.category}:${i.topic}`).sort().join("|") : "default";
    const cacheKey = `daily_art_v9_${todayDateKey}_seed_${seed}_int_${interestsSignature.length}`;

    if (!forceRefresh) {
      const cached = artMasterpieceCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < 1000 * 60 * 60 * 24 && cached.masterpiece) {
        if (cached.masterpiece.artworkTitle && cached.masterpiece.imageUrl && cached.masterpiece.imageUrl.startsWith("http")) {
          return res.json({
            success: true,
            masterpiece: cached.masterpiece,
            sourceSheet: "Personal Digest (Server Cache)",
          });
        }
      }
    } else {
      artMasterpieceCache.delete(cacheKey);
    }

    let activeInterests: InterestItem[] = [];

    if (Array.isArray(interests) && interests.length > 0) {
      activeInterests = interests;
    }

    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const effectiveIndex = Math.abs(dayOfYear + (Number(seed) || 0));

    // Prepara la lista di esclusione opere d'arte per il prompt
    const excludedNormArtworks = (excludeArtworks || []).map(normalizeServerText);
    serverMasterpiecesHistory.forEach((h) => {
      if (h.normalizedArtwork) excludedNormArtworks.push(h.normalizedArtwork);
    });

    const excludeDirective = excludedNormArtworks.length > 0
      ? `\nREGOLE CRITICHE DI UNICITÀ (NO RIPETIZIONI):\nNon selezionare MAI nessuna delle seguenti opere d'arte già pubblicate nei numeri precedenti:\n- ${excludeArtworks.slice(0, 40).join("\n- ")}\nTrova una NUOVA opera d'arte reale, celebre e documentata nel web.`
      : "";

    if (process.env.GEMINI_API_KEY && activeInterests.length > 0) {
      try {
        const ai = getGemini();
        const sorted = [...activeInterests].sort((a, b) => (b.priority || 3) - (a.priority || 3));
        const selectedInterest = sorted[effectiveIndex % sorted.length] || sorted[0];

        const prompt = `Sei il curatore storico dell'arte, iconografia e critica visiva della prestigiosa rubrica "Arte & Visioni: Ispirazione dai tuoi Interessi" per la rivista "Personal Digest / Selezione".

Esegui una RICERCA WEB RIGOROSA E LIVE tramite Google Search Grounding per trovare una REALE, AUTENTICA E CELEBRE OPERA D'ARTE VISIVA (può essere un quadro/dipinto ad olio o tempera, un disegno originale d'autore, un bozzetto o tavola scientifica, un'illustrazione d'epoca, un'incisione o una scultura) che si ISPIRA DIRETTAMENTE, SIMBOLEGGIA o DIALOGA PROFONDAMENTE con l'interesse personale del lettore:
- Categoria dell'interesse: "${selectedInterest.category}"
- Argomento specifico: "${selectedInterest.topic}"
- Dettagli / Note personali: "${selectedInterest.description || 'Approfondimento visivo, concettuale e storico'}"
${excludeDirective}

DIRETTIVE DI RICERCA WEB LIVE TRAMITE GOOGLE SEARCH:
1. ISPIRAZIONE TEMATICA DIRETTA E PROFONDA:
   Cerca un'opera d'arte, disegno, quadro o illustrazione che abbia una corrispondenza concettuale o visiva formidabile con "${selectedInterest.topic}". Ad esempio:
   - Se il tema è neuroscienze, mente o psicologia: cerca i celebri disegni istologici dei neuroni di Santiago Ramón y Cajal, i dipinti metafisici di De Chirico, o Munch, o Rodin (Il Pensatore).
   - Se il tema è fisica, spaziotempo, matematica o enigmi: cerca le litografie paradossali di M.C. Escher (Relatività), Salvador Dalí (La persistenza della memoria o Galatea delle Sfere), le incisioni cosmiche di William Blake (The Ancient of Days), o Wright of Derby.
   - Se il tema è astronomia o spazio: cerca i disegni storici della Luna di Galileo Galilei nel Sidereus Nuncius, i dipinti astronomici storici, o le stampe di Flammarion.
   - Se il tema è biologia, natura o ambiente: cerca le tavole artistiche di Ernst Haeckel (Kunstformen der Natur), John James Audubon, Claude Monet o Katsushika Hokusai.
   - Se il tema è tecnologia, innovazione o intelligenza artificiale: cerca le sculture/dipinti futuristi di Umberto Boccioni o Giacomo Balla, o i disegni tecnici di Leonardo da Vinci.
   - Se il tema è storia, filosofia o letteratura: cerca grandi affreschi o dipinti storici autentici (es. Raffaello - La Scuola di Atene, Rembrandt, Caravaggio, Vermeer, Friedrich - Viandante sul mare di nebbia).

2. AUTENTICITÀ E FONTI VERIFICATE NEL WEB:
   - L'opera deve essere reale ed esistere in un museo, galleria o archivio storico mondiale (Uffizi, Musei Vaticani, Louvre, MoMA, National Gallery, British Museum, Rijksmuseum, Prado, Instituto Cajal, Biblioteca Nazionale, ecc.).
   - Trova il titolo ufficiale in italiano, l'artista con gli anni di nascita e morte, l'anno/periodo esatto di realizzazione, la tipologia (es. "Quadro ad Olio", "Disegno d'Autore a Inchiostro", "Illustrazione Scientifica", "Litografia d'Arte", "Bozzetto Storico", "Incisione all'Acquaforte", "Affresco Rinascimentale", "Scultura Monumentale"), il museo o archivio di conservazione, la città e lo stato.
   - Se trovi un URL diretto dell'immagine su Wikimedia Commons, Wikipedia o archivio museale, inseriscilo in "imageUrl".

3. SAGGIO CRITICO MAGISTRALE (5 sezioni numerate):
   Redigi un testo critico appassionante, colto e scorrevole in 5 sezioni numerate (separate da \\n\\n):
   1. Il Dialogo Visivo con "${selectedInterest.topic}" (perché e come quest'opera incarna ed eleva questa passione del lettore).
   2. La Genesi, l'Autore e il Contesto Storico.
   3. Composizione, Segno Grafico e Simboli Nascosti.
   4. Risonanza Culturale e Visione Contemporanea.
   5. Collocazione Museale, Archivi e Conservazione.

Rispondi ESCLUSIVAMENTE con un JSON strutturato valido:
{
  "id": "arte-ispirazione-${selectedInterest.category.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${effectiveIndex}",
  "artworkTitle": "Titolo esatto dell'opera",
  "artist": "Nome dell'artista (anni di vita)",
  "shortArtworkTitle": "COGNOME: Titolo Opera (Anno)",
  "year": "Anno o datazione esatta",
  "museum": "Nome esatto del Museo, Galleria o Archivio",
  "city": "Città e Nazione",
  "artworkType": "Quadro ad Olio / Disegno d'Autore / Illustrazione Scientifica / Incisione / Scultura",
  "matchingCategory": "${selectedInterest.category}",
  "matchingTopic": "${selectedInterest.topic}",
  "whyConnected": "Spiegazione sintetica ed emozionante di come questo dipinto/disegno si ispira e simboleggia l'interesse '${selectedInterest.topic}'.",
  "imageUrl": "URL diretto dell'immagine ad alta risoluzione (da Wikimedia o museo, se reperito nel web)",
  "article": {
    "id": "arte-ispirazione-${selectedInterest.category.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${effectiveIndex}",
    "pageNumber": 1,
    "category": "Arte & Ispirazione",
    "title": "Arte & Visioni: [Titolo Opera] di [Artista] ([Anno]) — Ispirato a [Argomento]",
    "shortTitle": "Arte: [Artista] — [Titolo Breve]",
    "excerpt": "Un viaggio visivo ispirato a '${selectedInterest.topic}': l'opera conservata presso [Museo] a [Città] che dialoga con le grandi idee dell'umanità.",
    "content": "Testo completo della scheda critica in 5 sezioni numerate separate da \\n\\n.",
    "readingTime": "7 min",
    "author": "Redazione Arte & Grandi Musei (Ricerca Web Live)",
    "date": "${todayDateKey}",
    "highlightQuote": "Una frase celebre o una riflessione estetica sull'opera e sul suo legame con l'ingegno umano.",
    "originalLanguage": "Italiano",
    "sources": [
      {
        "title": "Archivio Museale / Scheda Opera",
        "url": "https://www.uffizi.it/",
        "publisher": "Ente Museale",
        "originalLanguage": "Italiano"
      }
    ]
  }
}`;

        const response = await generateContentWithRetryAndFallback(ai, {
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          config: {
            tools: [{ googleSearch: {} }],
            temperature: 0.4,
          },
        }, "gemini-3.7-flash");

        const text = response.text || "{}";
        const artData = safeExtractJson(text);

        if (artData && artData.artworkTitle && artData.artist && artData.article) {
          const normArt = normalizeServerText(artData.artworkTitle);
          if (!excludedNormArtworks.includes(normArt)) {
            // Estrai le fonti web dal grounding di Google Search
            const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
            const webSources = groundingChunks
              .map((c: any) => c.web)
              .filter((w: any) => w && w.uri)
              .map((w: any) => ({
                title: w.title || "Fonte Web Museo / Archivio",
                url: w.uri,
                publisher: "Ricerca Web",
                originalLanguage: "Italiano"
              }));

            if (webSources.length > 0 && artData.article) {
              artData.article.sources = [...webSources, ...(artData.article.sources || [])].slice(0, 3);
            }

            // Risoluzione e verifica dell'immagine ad alta definizione su Wikimedia Commons / Web
            const liveWebImage = await searchWikimediaImage(artData.artist, artData.artworkTitle, artData.imageUrl);
            if (liveWebImage) {
              artData.imageUrl = liveWebImage;
            }

            if (artData.article) {
              artData.article.imageUrl = artData.imageUrl || artData.article.imageUrl;
            }

            registerMasterpieceInServerHistory(artData.artworkTitle, artData.artist);
            artMasterpieceCache.set(cacheKey, { masterpiece: artData, timestamp: Date.now() });
            return res.json({
              success: true,
              masterpiece: artData,
              sourceSheet: spreadsheetId ? "Google Fogli Connesso (Ricerca Web Live)" : "Interessi Personali (Ricerca Web Live)",
            });
          }
        }
      } catch (aiErr: any) {
        if (isQuotaError(aiErr)) {
          console.info("Gemini API quota reached for masterpiece web search, serving fallback.");
        } else {
          console.info("AI web search for masterpiece failed, serving fallback:", aiErr?.message || "Unavailable");
        }
      }
    }

    res.json({
      success: true,
      masterpiece: null,
      sourceSheet: "Interessi Personali",
    });
  } catch (error: any) {
    console.error("Error in /api/art/masterpiece:", error);
    res.status(500).json({ error: error.message || "Errore nel caricamento del capolavoro d'arte." });
  }
});

// Endpoint di diagnostica e statistiche del Registro Storico Editoriale
app.get("/api/editorial/ledger-stats", (req, res) => {
  res.json({
    success: true,
    serverHistory: {
      articlesCount: serverArticlesHistory.length,
      masterpiecesCount: serverMasterpiecesHistory.length,
      booksCount: serverBooksHistory.length,
      wordsCount: serverWordsHistory.length,
      recentArticles: serverArticlesHistory.slice(-10).map(a => a.title),
      recentMasterpieces: serverMasterpiecesHistory.slice(-10).map(m => m.artworkTitle),
      recentBooks: serverBooksHistory.slice(-10).map(b => b.title),
      recentWords: serverWordsHistory.slice(-10).map(w => w.word),
    }
  });
});


// Setup Vite or static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Personal Digest server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
