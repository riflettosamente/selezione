import { InterestItem } from "../types";

export interface EditorialRubric {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  sourceMechanism: string;
}

export const EDITORIAL_RUBRICS: EditorialRubric[] = [
  {
    id: "parola-giorno",
    name: "Più parole, più idee",
    subtitle: "La Parola del Giorno & Vocabolario",
    description: "Arricchite il vostro vocabolario con etimologie affascinanti, sfumature d'uso, citazioni letterarie e un quiz filologico quotidiano.",
    sourceMechanism: "Attinge dinamicamente dai termini e concetti chiave presenti nei 12 interessi principali."
  },
  {
    id: "libro-consigliato",
    name: "Il Libro Consigliato di Oggi",
    subtitle: "Saggio o Volume Selezionato",
    description: "Un saggio o un libro di riferimento reale, recensito e approfondito con sinossi completa, estratti memorabili e motivi della scelta.",
    sourceMechanism: "Selezionato a rotazione dai temi focali (archeologia, scienze della coscienza, astronomia, storia, miti)."
  },
  {
    id: "massima-giorno",
    name: "La Massima del Giorno",
    subtitle: "Pensiero & Filosofia del Quotidiano",
    description: "Aforisma, riflessione d'autore e massima filosofica per stimolare il pensiero critico e la meraviglia intellettuale.",
    sourceMechanism: "Ispirata alle riflessioni filosofiche, scientifiche ed etiche collegate ai 12 temi della rivista."
  },
  {
    id: "capolavori-arte",
    name: "Capolavori d'Arte",
    subtitle: "L'Opera in Copertina & Analisi Iconologica",
    description: "Esposizione in alta definizione di un capolavoro della pittura mondiale con analisi filologica, contesto storico e committenze.",
    sourceMechanism: "Collegato ai temi della cultura, storia, miti antichi e grandi visioni artistiche dell'umanità."
  }
];

export const DEFAULT_INTERESTS: InterestItem[] = [
  {
    id: "attualita-1",
    category: "Attualità",
    topic: "News e Curiosità dal Mondo",
    description: "Notizie di attualità globale, curiosità, fatti insoliti e storie dal mondo.",
    priority: 5,
    sources: "Reuters, BBC News, ANSA, National Geographic, Courrier International",
    enabled: true,
  },
  {
    id: "scienza-1",
    category: "Scienza",
    topic: "Nuove Scoperte Scientifiche",
    description: "Ultime frontiere della ricerca scientifica, scoperte tecnologiche e innovazioni.",
    priority: 5,
    sources: "Nature, Science, Le Scienze, MIT Technology Review, Phys.org",
    enabled: true,
  },
  {
    id: "scienza-spazio",
    category: "Scienza",
    topic: "Astronomia e Spazio",
    description: "Esplorazione spaziale, missioni, astrofisica.",
    priority: 5,
    sources: "NASA JPL, ESA, Astrophysical Journal, James Webb Space Telescope, ESO",
    enabled: true,
  },
  {
    id: "mistero-ufo",
    category: "Mistero",
    topic: "UFO e Alieni",
    description: "Monitoraggio di avvistamenti UAP/UFO, ricerca SETI ed esobiologia.",
    priority: 5,
    sources: "SETI Institute, The Black Vault, Declassified Archives, Astrobiology NASA",
    enabled: true,
  },
  {
    id: "cultura-narrativa",
    category: "Cultura",
    topic: "Narrativa Breve",
    description: "Racconti, saggi brevi, storie di vita.",
    priority: 4,
    sources: "The New Yorker, The Paris Review, Adelphi, Letteratura internazionale",
    enabled: true,
  },
  {
    id: "salute-benessere",
    category: "Salute",
    topic: "Benessere e Alimentazione",
    description: "Stili di vita sani, nutrizione, scoperte mediche.",
    priority: 4,
    sources: "The Lancet, Harvard Health Publishing, New England Journal of Medicine, Fondazione Veronesi",
    enabled: true,
  },
  {
    id: "storia-contemporanea",
    category: "Storia",
    topic: "Storia Contemporanea",
    description: "Analisi di eventi storici recenti e lezioni dal passato.",
    priority: 4,
    sources: "Historical Journal, BBC History, Rivista Storica Italiana, Archivi Declassificati",
    enabled: true,
  },
  {
    id: "coscienza-spirito",
    category: "Scienza dello Spirito",
    topic: "Ricerche sulla Coscienza (NDE, OOBE)",
    description: "Studi scientifici e fenomenologici su NDE, OOBE e natura della coscienza oltre il cervello.",
    priority: 5,
    sources: "NYU Langone (AWARE II), Journal of Near-Death Studies, Resuscitation, Nature Neuroscience",
    enabled: true,
  },
  {
    id: "cinema-scifi",
    category: "Cinema",
    topic: "Film di Fantascienza",
    description: "Analisi tematiche, recensioni e implicazioni filosofiche del cinema sci-fi.",
    priority: 4,
    sources: "BFI Sight & Sound, Cahiers du Cinéma, Criterion Collection, Saggi di cinema",
    enabled: true,
  },
  {
    id: "storia-mito",
    category: "Storia/Mito",
    topic: "Miti e Leggende dell'Antichità",
    description: "Comparazione di mitologie classiche (Grecia, Egitto, Cina, Giappone) e loro influenza culturale.",
    priority: 4,
    sources: "Treccani, Oxford Classical Dictionary, Saggi di Antropologia e Religioni comparate",
    enabled: true,
  },
  {
    id: "mistero-archeo",
    category: "Mistero",
    topic: "Archeologia Misteriosa e Luoghi Perduti",
    description: "Approfondimento su siti enigmatici (Göbekli Tepe, Linee di Nazca), civiltà perdute (Atlantide) e teorie alternative.",
    priority: 5,
    sources: "UNESCO, Antiquity, DAI, Archaeological Institute of America, Rilievi LiDAR",
    enabled: true,
  },
  {
    id: "folclore-creature",
    category: "Folclore",
    topic: "Piccolo Popolo e Creature del Folclore",
    description: "Creature leggendarie dei boschi (elfi, gnomi, fate, yokai) e tradizioni orali di tutto il mondo.",
    priority: 4,
    sources: "Società di Etnologia Europea, Archivi delle Tradizioni Popolari, Studi antropologici",
    enabled: true,
  },
];


