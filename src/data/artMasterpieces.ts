import { Article } from "../types";
import botticelliImage from "../assets/images/botticelli_magi_1787416919816.jpg";

export interface ArtMasterpiece {
  id?: string;
  artworkTitle: string;
  artist: string;
  shortArtworkTitle?: string;
  year?: string;
  museum?: string;
  city?: string;
  artworkType?: string;
  matchingCategory?: string;
  matchingTopic?: string;
  whyConnected?: string;
  imageUrl?: string;
  fallbackImageUrl?: string;
  coverAccentColor?: string;
  article?: Article;
}

export interface ArtworkMetadata {
  artworkTitle: string;
  artist: string;
  shortArtworkTitle: string;
  year: string;
  museum: string;
  city: string;
  artworkType?: string;
  matchingCategory?: string;
  matchingTopic?: string;
  whyConnected?: string;
  imageUrl: string;
  fallbackImageUrl?: string;
}

// Dizionario di immagini ad altissima definizione per capolavori d'arte, disegni, quadri e illustrazioni storiche verificate
export const ART_IMAGE_DICTIONARY: Record<string, {
  title: string;
  artist: string;
  year: string;
  museum: string;
  city: string;
  artworkType?: string;
  url: string;
  keywords: string[];
}> = {
  "cajal-neuroni": {
    title: "Disegno Istologico dei Neuroni della Corteccia Cerebrale",
    artist: "Santiago Ramón y Cajal",
    year: "1899",
    museum: "Instituto Cajal - CSIC",
    city: "Madrid, Spagna",
    artworkType: "Disegno Scientifico Originale / Inchiostro",
    url: "https://upload.wikimedia.org/wikipedia/commons/5/5b/Cajal_cortex_drawings.png",
    keywords: ["cajal", "ramon y cajal", "neuroni", "corteccia", "cervello", "neuroscienze", "mente", "sinapsi", "disegno istologico", "purkinje", "cervelletto"]
  },
  "cajal-purkinje": {
    title: "Cellule del cervelletto (Purkinje cell)",
    artist: "Santiago Ramón y Cajal",
    year: "1899",
    museum: "Instituto Cajal - CSIC",
    city: "Madrid, Spagna",
    artworkType: "Disegno Scientifico Originale / Inchiostro",
    url: "https://upload.wikimedia.org/wikipedia/commons/6/6f/CajalCerebellum.jpg",
    keywords: ["purkinje", "cervelletto", "cajal", "ramón y cajal", "neuroscienze", "dendriti", "sinapsi"]
  },
  "leonardo-uomo-vitruviano": {
    title: "L'Uomo Vitruviano",
    artist: "Leonardo da Vinci",
    year: "1490 circa",
    museum: "Gallerie dell'Accademia",
    city: "Venezia",
    artworkType: "Disegno a Penna e Inchiostro",
    url: "https://upload.wikimedia.org/wikipedia/commons/2/22/Da_Vinci_Vitruve_Luc_Viatour.jpg",
    keywords: ["vitruviano", "uomo vitruviano", "leonardo", "da vinci", "anatomia", "proporzioni", "geometria", "scienza"]
  },
  "galileo-fasi-lunari": {
    title: "Disegni delle Fasi e dei Crateri Lunari (Sidereus Nuncius)",
    artist: "Galileo Galilei",
    year: "1609-1610",
    museum: "Biblioteca Nazionale Centrale di Firenze",
    city: "Firenze",
    artworkType: "Bozzetto Astronomico ad Acquerello",
    url: "https://upload.wikimedia.org/wikipedia/commons/d/d4/Galileo_Moon_drawings_1610.jpg",
    keywords: ["galileo", "luna", "sidereus nuncius", "galilei", "astronomia", "telescopio", "spazio", "crateri"]
  },
  "haeckel-kunstformen": {
    title: "Kunstformen der Natur (Forme d'Arte della Natura: Discomedusae)",
    artist: "Ernst Haeckel",
    year: "1899-1904",
    museum: "Ernst-Haeckel-Haus",
    city: "Jena, Germania",
    artworkType: "Litografia Scientifica a Colori",
    url: "https://upload.wikimedia.org/wikipedia/commons/b/b8/Haeckel_Discomedusae.jpg",
    keywords: ["haeckel", "kunstformen", "meduse", "discomedusae", "biologia", "natura", "evoluzione", "tavola biologica"]
  },
  "escher-relativita": {
    title: "Relatività (Relativity)",
    artist: "M.C. Escher",
    year: "1953",
    museum: "Escher in Het Paleis",
    city: "L'Aia, Paesi Bassi",
    artworkType: "Litografia / Disegno di Geometria Impossibile",
    url: "https://upload.wikimedia.org/wikipedia/commons/6/60/Relativity_by_M._C._Escher.jpg",
    keywords: ["escher", "relativita", "relativity", "scale impossibili", "gravita", "spazio tempo", "geometria"]
  },
  "boccioni-continuita-spazio": {
    title: "Forme uniche della continuità nello spazio",
    artist: "Umberto Boccioni",
    year: "1913",
    museum: "Museo del Novecento",
    city: "Milano",
    artworkType: "Scultura Monumentale / Avanguardia Futurista",
    url: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Unique_Forms_of_Continuity_in_Space_by_Umberto_Boccioni_1913.jpg",
    keywords: ["boccioni", "continuita nello spazio", "futurismo", "velocita", "dinamismo", "tecnologia", "macchine"]
  },
  "blake-ancient-of-days": {
    title: "Il Grande Architetto dell'Universo (The Ancient of Days)",
    artist: "William Blake",
    year: "1794",
    museum: "British Museum",
    city: "Londra",
    artworkType: "Incisione all'Acquaforte e Acquerello",
    url: "https://upload.wikimedia.org/wikipedia/commons/9/90/The_Ancient_of_Days%2C_Europe_a_Prophecy%2C_copy_K%2C_plate_1_%28Bentley_1%29%2C_1821_%28Fitzwilliam_Museum%29.jpg",
    keywords: ["blake", "ancient of days", "grande architetto", "compasso", "cosmologia", "universo", "william blake"]
  },
  "wright-uccello-pompa": {
    title: "Esperimento su un uccello nella pompa pneumatica",
    artist: "Joseph Wright of Derby",
    year: "1768",
    museum: "National Gallery",
    city: "Londra",
    artworkType: "Dipinto ad Olio su Tela",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/An_Experiment_on_a_Bird_in_an_Air_Pump_by_Joseph_Wright_of_Derby%2C_1768.jpg/1280px-An_Experiment_on_a_Bird_in_an_Air_Pump_by_Joseph_Wright_of_Derby%2C_1768.jpg",
    keywords: ["wright of derby", "pompa pneumatica", "scienza", "esperimento", "illuminismo", "fisica del vuoto"]
  },
  "botticelli-magi": {
    title: "L'Adorazione dei Magi",
    artist: "Sandro Botticelli",
    year: "1475 circa",
    museum: "Galleria degli Uffizi",
    city: "Firenze",
    url: botticelliImage,
    keywords: ["botticelli", "adorazione", "magi", "lama", "filipepi", "uffizi"]
  },
  "botticelli-nascita-venere": {
    title: "La Nascita di Venere",
    artist: "Sandro Botticelli",
    year: "1485 circa",
    museum: "Galleria degli Uffizi",
    city: "Firenze",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg/1280px-Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg",
    keywords: ["venere", "nascita di venere", "botticelli"]
  },
  "botticelli-primavera": {
    title: "La Primavera",
    artist: "Sandro Botticelli",
    year: "1482 circa",
    museum: "Galleria degli Uffizi",
    city: "Firenze",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Botticelli-primavera.jpg/1280px-Botticelli-primavera.jpg",
    keywords: ["primavera", "allegoria della primavera", "botticelli"]
  },
  "michelangelo-creazione-adamo": {
    title: "La Creazione di Adamo",
    artist: "Michelangelo Buonarroti",
    year: "1511-1512",
    museum: "Musei Vaticani, Cappella Sistina",
    city: "Città del Vaticano",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Michelangelo_-_Creation_of_Adam_%28cropped%29.jpg/1200px-Michelangelo_-_Creation_of_Adam_%28cropped%29.jpg",
    keywords: ["michelangelo", "creazione di adamo", "sistina", "adamo", "mente divina", "cervello", "buonarroti"]
  },
  "michelangelo-david": {
    title: "Il David",
    artist: "Michelangelo Buonarroti",
    year: "1501-1504",
    museum: "Galleria dell'Accademia",
    city: "Firenze",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/%27David%27_by_Michelangelo_Fir_JBU005_edit.jpg/800px-%27David%27_by_Michelangelo_Fir_JBU005_edit.jpg",
    keywords: ["david", "michelangelo", "accademia", "marmo di carrara"]
  },
  "van-gogh-notte-stellata": {
    title: "La Notte Stellata",
    artist: "Vincent van Gogh",
    year: "1889",
    museum: "Museum of Modern Art (MoMA)",
    city: "New York",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
    keywords: ["van gogh", "notte stellata", "starry night", "moma", "turbolenza", "vortici", "gogh", "saint-rémy"]
  },
  "van-gogh-girasoli": {
    title: "I Girasoli",
    artist: "Vincent van Gogh",
    year: "1888",
    museum: "National Gallery",
    city: "Londra",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Vincent_Willem_van_Gogh_127.jpg/1200px-Vincent_Willem_van_Gogh_127.jpg",
    keywords: ["girasoli", "van gogh", "sunflowers", "arles"]
  },
  "raffaello-scuola-di-atene": {
    title: "La Scuola di Atene",
    artist: "Raffaello Sanzio",
    year: "1509-1511",
    museum: "Musei Vaticani, Stanza della Segnatura",
    city: "Città del Vaticano",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/%22The_School_of_Athens%22_by_Raffaello_Sanzio_da_Urbino.jpg/1280px-%22The_School_of_Athens%22_by_Raffaello_Sanzio_da_Urbino.jpg",
    keywords: ["raffaello", "scuola di atene", "platone", "aristotele", "segnatura", "sanzio"]
  },
  "hokusai-grande-onda": {
    title: "La Grande Onda di Kanagawa",
    artist: "Katsushika Hokusai",
    year: "1831 circa",
    museum: "British Museum / Tokyo National Museum",
    city: "Londra / Tokyo",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Tsunami_by_hokusai_19th_century.jpg/1280px-Tsunami_by_hokusai_19th_century.jpg",
    keywords: ["hokusai", "grande onda", "kanagawa", "onda", "monte fuji", "ukiyo-e", "katsushika"]
  },
  "disco-di-festo": {
    title: "Il Disco di Festo",
    artist: "Maestri Minoici di Creta",
    year: "1700 a.C. circa",
    museum: "Museo Archeologico di Heraklion",
    city: "Creta, Grecia",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Phaistos_disc_side_A_color.jpg/1200px-Phaistos_disc_side_A_color.jpg",
    keywords: ["festo", "disco di festo", "phaistos", "minoici", "creta", "glifi", "geroglifici"]
  },
  "leonardo-monna-lisa": {
    title: "La Gioconda (Monna Lisa)",
    artist: "Leonardo da Vinci",
    year: "1503-1519",
    museum: "Museo del Louvre",
    city: "Parigi",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/1200px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg",
    keywords: ["gioconda", "monna lisa", "mona lisa", "leonardo da vinci", "louvre"]
  },
  "leonardo-ultima-cena": {
    title: "L'Ultima Cena (Il Cenacolo)",
    artist: "Leonardo da Vinci",
    year: "1495-1498",
    museum: "Santa Maria delle Grazie",
    city: "Milano",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/The_Last_Supper_-_Leonardo_Da_Vinci_-_High_Resolution_32x16.jpg/1280px-The_Last_Supper_-_Leonardo_Da_Vinci_-_High_Resolution_32x16.jpg",
    keywords: ["cenacolo", "ultima cena", "last supper", "leonardo"]
  },
  "caravaggio-vocazione-san-matteo": {
    title: "La Vocazione di San Matteo",
    artist: "Michelangelo Merisi da Caravaggio",
    year: "1599-1600",
    museum: "Chiesa di San Luigi dei Francesi",
    city: "Roma",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/The_Calling_of_Saint_Matthew-Caravaggio_%281599-1600%29.jpg/1280px-The_Calling_of_Saint_Matthew-Caravaggio_%281599-1600%29.jpg",
    keywords: ["caravaggio", "vocazione", "san matteo", "matteo", "luigi dei francesi", "chiaroscuro", "merisi"]
  },
  "caravaggio-canestra-frutta": {
    title: "Canestra di Frutta",
    artist: "Michelangelo Merisi da Caravaggio",
    year: "1597-1600",
    museum: "Pinacoteca Ambrosiana",
    city: "Milano",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Caravaggio_-_Canestra_di_frutta.jpg/1280px-Caravaggio_-_Canestra_di_frutta.jpg",
    keywords: ["canestra", "natura morta", "caravaggio", "ambrosiana"]
  },
  "vermeer-ragazza-orecchino": {
    title: "Ragazza con il turbante (Ragazza con l'orecchino di perla)",
    artist: "Johannes Vermeer",
    year: "1665 circa",
    museum: "Mauritshuis",
    city: "L'Aia, Paesi Bassi",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/1665_Girl_with_a_Pearl_Earring.jpg/1200px-1665_Girl_with_a_Pearl_Earring.jpg",
    keywords: ["vermeer", "orecchino", "perla", "turbante", "mauritshuis", "johannes vermeer"]
  },
  "klimt-il-bacio": {
    title: "Il Bacio (Der Kuss)",
    artist: "Gustav Klimt",
    year: "1907-1908",
    museum: "Österreichische Galerie Belvedere",
    city: "Vienna, Austria",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/The_Kiss_-_Gustav_Klimt_-_Google_Cultural_Institute.jpg/1200px-The_Kiss_-_Gustav_Klimt_-_Google_Cultural_Institute.jpg",
    keywords: ["klimt", "bacio", "kuss", "belvedere", "oro", "gustav klimt"]
  },
  "monet-impressione-sole": {
    title: "Impressione, levar del sole (Impression, soleil levant)",
    artist: "Claude Monet",
    year: "1872",
    museum: "Musée Marmottan Monet",
    city: "Parigi",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Monet_-_Impression%2C_Sunrise.jpg/1280px-Monet_-_Impression%2C_Sunrise.jpg",
    keywords: ["monet", "impressione", "soleil levant", "impressionismo", "marmottan", "claude monet"]
  },
  "friedrich-viandante-nebbia": {
    title: "Viandante sul mare di nebbia (Der Wanderer über dem Nebelmeer)",
    artist: "Caspar David Friedrich",
    year: "1818",
    museum: "Hamburger Kunsthalle",
    city: "Amburgo, Germania",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Caspar_David_Friedrich_-_Wanderer_above_the_sea_of_fog.jpg/1200px-Caspar_David_Friedrich_-_Wanderer_above_the_sea_of_fog.jpg",
    keywords: ["friedrich", "viandante", "nebbia", "wanderer", "romantico", "sublime", "caspar david"]
  },
  "velazquez-las-meninas": {
    title: "Las Meninas",
    artist: "Diego Velázquez",
    year: "1656",
    museum: "Museo del Prado",
    city: "Madrid, Spagna",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Las_Meninas%2C_by_Diego_Vel%C3%A1zquez%2C_from_Prado_in_Google_Earth.jpg/1280px-Las_Meninas%2C_by_Diego_Vel%C3%A1zquez%2C_from_Prado_in_Google_Earth.jpg",
    keywords: ["velazquez", "meninas", "prado", "filippo iv", "diego velazquez"]
  },
  "canova-amore-psiche": {
    title: "Amore e Psiche",
    artist: "Antonio Canova",
    year: "1787-1793",
    museum: "Museo del Louvre",
    city: "Parigi",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Psyche_Revived_by_Cupid%27s_Kiss_Louvre_MR1777.jpg/1280px-Psyche_Revived_by_Cupid%27s_Kiss_Louvre_MR1777.jpg",
    keywords: ["canova", "amore e psiche", "psiche", "marmo", "louvre", "antonio canova"]
  },
  "laocoonte": {
    title: "Gruppo del Laocoonte",
    artist: "Agesandro, Atenodoro e Polidoro",
    year: "I secolo a.C. / I d.C.",
    museum: "Musei Vaticani, Cortile Ottagono",
    city: "Città del Vaticano",
    url: "https://upload.wikimedia.org/wikipedia/commons/1/17/Laocoon_Pio-Clementino_Inv1059-1064-1067.jpg",
    keywords: ["laocoonte", "laocoon", "agesandro", "atenodoro", "polidoro", "serpenti", "troia", "vaticani"]
  },
  "munch-urlo": {
    title: "L'Urlo (Skrik)",
    artist: "Edvard Munch",
    year: "1893",
    museum: "Galleria Nazionale di Oslo",
    city: "Oslo, Norvegia",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg/1200px-Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg",
    keywords: ["urlo", "munch", "scream", "skrik", "edvard munch", "espressionismo"]
  },
  "rembrandt-ronda-notte": {
    title: "Ronda di Notte",
    artist: "Rembrandt van Rijn",
    year: "1642",
    museum: "Rijksmuseum",
    city: "Amsterdam",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/The_Night_Watch_-_HD.jpg/1280px-The_Night_Watch_-_HD.jpg",
    keywords: ["rembrandt", "ronda di notte", "night watch", "rijksmuseum", "banning cocq"]
  },
  "seurat-grande-jatte": {
    title: "Una domenica pomeriggio sull'isola della Grande-Jatte",
    artist: "Georges Seurat",
    year: "1884-1886",
    museum: "Art Institute of Chicago",
    city: "Chicago",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/A_Sunday_on_La_Grande_Jatte%2C_Georges_Seurat%2C_1884.jpg/1280px-A_Sunday_on_La_Grande_Jatte%2C_Georges_Seurat%2C_1884.jpg",
    keywords: ["seurat", "grande jatte", "puntinismo", "pointillisme", "georges seurat"]
  },
  "turner-pioggia-vapore": {
    title: "Pioggia, vapore e velocità",
    artist: "J.M.W. Turner",
    year: "1844",
    museum: "National Gallery",
    city: "Londra",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Rain_Steam_and_Speed_the_Great_Western_Railway.jpg/1280px-Rain_Steam_and_Speed_the_Great_Western_Railway.jpg",
    keywords: ["turner", "pioggia vapore", "ferrovia", "rain steam", "william turner"]
  },
  "dali-persistenza-memoria": {
    title: "La persistenza della memoria",
    artist: "Salvador Dalí",
    year: "1931",
    museum: "Museum of Modern Art (MoMA)",
    city: "New York",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/The_Persistence_of_Memory.jpg/1200px-The_Persistence_of_Memory.jpg",
    keywords: ["dali", "persistenza della memoria", "orologi molli", "surrealismo", "salvador dali"]
  }
};

export const ART_MASTERPIECES_CATALOG: ArtMasterpiece[] = [
  {
    id: "capolavori-botticelli-adorazione-dei-magi",
    artworkTitle: "L'Adorazione dei Magi",
    artist: "Sandro Botticelli",
    shortArtworkTitle: "BOTTICELLI: Adorazione dei Magi (1475)",
    year: "1475 circa",
    museum: "Galleria degli Uffizi",
    city: "Firenze",
    matchingCategory: "Storia",
    matchingTopic: "Storia Contemporanea & Enigmi Dinastici del Passato",
    whyConnected: "Selezionato per approfondire il tema storico e le radici della cultura europea: Botticelli immortalò i volti reali dei Medici e il proprio celebre autoritratto, trasformando la pala sacra nel manifesto del Rinascimento.",
    imageUrl: botticelliImage,
    coverAccentColor: "from-amber-900 via-stone-800 to-stone-950",
    article: {
      id: "capolavori-botticelli-adorazione-dei-magi",
      pageNumber: 1,
      category: "Arte",
      imageUrl: botticelliImage,
      title: "Capolavori dell'Umanità: L'Adorazione dei Magi di Sandro Botticelli (1475)",
      shortTitle: "Capolavori: Botticelli e i Magi",
      excerpt: "Conservata alla Galleria degli Uffizi: l'opera del 1475 in cui Botticelli ritrasse la dinastia dei Medici e il proprio autoritratto, trasformando la pala sacra nel manifesto del Rinascimento fiorentino.",
      content: `SCHEDA CRITICA DELL'OPERA:
Titolo: L'Adorazione dei Magi (Epifania di Santa Maria Novella)
Autore: Sandro Botticelli (Alessandro di Mariano di Vanni Filipepi, Firenze 1445 – 1510)
Datazione: 1475 circa
Tecnica e Supporto: Tempera su tavola di pioppo (111 × 134 cm)
Collocazione Attuale: Galleria degli Uffizi, Firenze (Sala 10-14 di Botticelli, Inventario 1890 n. 882)

1. LA COMMITTENZA STORICA E IL CONTESTO URBANO (1475):
Dipinta intorno al 1475 al culmine della maturità stilistica dell'artista, la monumentale tavola fu commissionata a Sandro Botticelli dal facoltoso banchiere e sensale di cambio fiorentino Gaspare di Zanobi del Lama. L'opera era destinata ad ornare l'altare della cappella funeraria di famiglia situata sulla controfacciata della prestigiosa Basilica di Santa Maria Novella a Firenze. La cappella era dedicata all'Epifania del Signore proprio in onore del nome di battesimo del committente (Gaspare, uno dei tre re Magi biblici). Gaspare del Lama, desideroso di riscattare una reputazione professionale talvolta controversa e di ribadire la propria fedeltà incondizionata alla potente dinastia medicea, offrì a Botticelli l'opportunità di concepire un manifesto politico e teologico senza pari.

2. LA RIVOLUZIONE COMPOSITIVA E PROSPETTICA:
Fino a quel momento, la consolidata tradizione figurativa toscana del tema dell'Adorazione dei Magi (dalla celebre pala tardo-gotica di Gentile da Fabriano del 1423 fino alla cavalcata affrescata da Benozzo Gozzoli a Palazzo Medici Riccardi) imponeva una visione a sfilata laterale ed orizzontale: la Vergine con il Bambino era collocata a un estremo della scena e il corteo regale con cavalli e servitori procedeva da sinistra a destra.
Botticelli attuò una svolta compositiva radicale:
- Posizionò la Sacra Famiglia (la Madonna seduta con Gesù Bambino e San Giuseppe vigile alle sue spalle) al centro esatto della composizione, sopraelevata su un basamento naturale di roccia viva e maestosi ruderi di un tempio classico in rovina.
- I ruderi del tempio pagano sullo sfondo alludono, secondo la complessa iconologia neoplatonica della corte laurenziana, al crollo definitivo dell'antico mondo pagano e al sorgere della nuova era della grazia cristiana.
- Gli astanti, i cavalieri e i dignitari non sfilano più in corteo, ma si dispongono simmetricamente a semicerchio in prospettiva centrale convergente verso il punto focale della Vergine, creando una profondità spaziale drammatica e un'atmosfera di intimo raccoglimento collettivo.

3. LA GALLERIA DEI RITRATTI DELLA DINASTIA MEDICEA:
Il fascino storico e documentario dell'opera risiede nella straordinaria galleria di ritratti dal vero e postumi dei principali protagonisti della signoria di Firenze, identificati con puntuale precisione fin dalle 'Vite' di Giorgio Vasari (1568):
• Baldassarre (il Mago anziano in ginocchio che accarezza con venerazione i piedi a Gesù Bambino): è il ritratto postumo di Cosimo il Vecchio de' Medici (1389-1464), 'Pater Patriae' e fondatore della grandezza economica e politica della famiglia.
• Melchiorre (il Mago inginocchiato al centro con il sontuoso manto rosso-cremisi visto di schiena): è Piero il Gottoso (1416-1469), figlio primogenito di Cosimo e padre di Lorenzo.
• Gaspare (il terzo Mago a destra in ginocchio con la veste candida damascata): è Giovanni de' Medici (1421-1463), secondogenito di Cosimo, morto prematuramente.
• I giovani eredi del potere mediceo: a sinistra in piedi spicca il giovane Lorenzo il Magnifico (1449-1492), futuro signore della città, appoggiato con contegno fiero a una grande spada da cavaliere; accanto a lui al centro compare il bellissimo fratello Giuliano de' Medici (1453-1478), ritratto tre anni prima di cadere trafitto nella tragica Congiura dei Pazzi in Santa Maria del Fiore.
• Il committente Gaspare del Lama: è l'uomo anziano con la folta capigliatura bianca e la veste azzurra sulla destra del gruppo mediceo, che fissa intensamente lo spettatore indicandosi con la mano destra per dichiarare la paternità dell'offerta.
• Gli umanisti di corte: tra le figure di sinistra si riconoscono i filosofi neoplatonici dell'Accademia di Careggi, tra cui Marsilio Ficino, Cristoforo Landino e Angelo Poliziano, veri ispiratori del clima intellettuale dell'opera.

4. L'AUTORITRATTO DI SANDRO BOTTICELLI:
All'estrema destra della composizione si trova uno dei volti più celebri e magnetici dell'intero Rinascimento europeo: un giovane uomo di circa trent'anni, avvolto in un luminoso manto color ocra-dorato, che volge deliberatamente la testa all'indietro per fissare con sguardo penetrante e fiero gli occhi di chi osserva. È l'autoritratto di Sandro Botticelli. Questo gesto non è un semplice sfoggio di vanità, ma la solenne rivendicazione dello statuto sociale e intellettuale dell'artista rinascimentale: non più mero esecutore artigiano o manovale della bottega, ma filosofo visivo e protagonista alla pari della vita culturale della polis fiorentina.

5. DALLE COLLEZIONI GRANDUCALI AGLI UFFIZI (1587 - OGGI):
In seguito al tracollo finanziario e alla condanna per truffa di Gaspare del Lama alla fine del Quattrocento, la cappella cadde in disuso. Nel 1587 l'opera fu acquistata ed entrò nelle collezioni del granduca Francesco I de' Medici presso la Villa di Poggio Imperiale. Nel 1796 la tavola venne definitivamente trasferita alla Galleria degli Uffizi, dove oggi risplende accanto alla 'Primavera' (1482) e alla 'Nascita di Venere' (1485) come testimonianza insuperata dell'età dell'oro del mecenatismo fiorentino.`,
      readingTime: "7 min",
      author: "Redazione Arte & Grandi Musei",
      date: "Agosto 2026",
      highlightQuote: "Nel 1475 Botticelli immortalò la dinastia dei Medici e il proprio fiero autoritratto, trasformando la pala sacra nel vertice intellettuale del Rinascimento fiorentino.",
      originalLanguage: "Italiano",
      sources: [
        {
          title: "Gallerie degli Uffizi - Dossier Ufficiale: Sandro Botticelli, Adorazione dei Magi (Inv. 1890 n. 882)",
          url: "https://www.uffizi.it/opere/adorazione-dei-magi-botticelli",
          publisher: "Gallerie degli Uffizi Firenze",
          originalLanguage: "Italiano"
        },
        {
          title: "Istituto Treccani - Dizionario Biografico degli Italiani: Alessandro Filipepi detto Sandro Botticelli",
          url: "https://www.treccani.it/enciclopedia/alessandro-filipepi-detto-sandro-botticelli_(Dizionario-Biografico)/",
          publisher: "Istituto della Enciclopedia Italiana",
          originalLanguage: "Italiano"
        }
      ]
    }
  },
  {
    id: "capolavori-michelangelo-creazione-adamo",
    artworkTitle: "La Creazione di Adamo e il Codice Neuroanatomico",
    artist: "Michelangelo Buonarroti",
    shortArtworkTitle: "MICHELANGELO: Creazione di Adamo (1512)",
    year: "1511-1512",
    museum: "Musei Vaticani, Cappella Sistina",
    city: "Città del Vaticano / Roma",
    matchingCategory: "Scienza dello Spirito",
    matchingTopic: "Ricerche sulla Coscienza (NDE, OOBE)",
    whyConnected: "Ispirato all'interesse 'Ricerche sulla Coscienza (NDE, OOBE)': gli studi neuroanatomici moderni hanno dimostrato che il manto divino di Michelangelo riproduce con esattezza la sezione sagittale del cervello umano, simboleggiando la scintilla della mente e della consapevolezza.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Michelangelo_-_Creation_of_Adam_%28cropped%29.jpg/1200px-Michelangelo_-_Creation_of_Adam_%28cropped%29.jpg",
    coverAccentColor: "from-indigo-950 via-slate-800 to-amber-950",
    article: {
      id: "capolavori-michelangelo-creazione-adamo",
      pageNumber: 1,
      category: "Arte",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Michelangelo_-_Creation_of_Adam_%28cropped%29.jpg/1200px-Michelangelo_-_Creation_of_Adam_%28cropped%29.jpg",
      title: "Capolavori dell'Umanità: Il Cervello Nascosto nella «Creazione di Adamo» di Michelangelo",
      shortTitle: "Capolavori: Michelangelo e la Mente Divina",
      excerpt: "Affrescata tra il 1511 e il 1512 nella volta della Sistina: l'indagine medica e storico-artistica che ha svelato la perfetta sagoma del cervello umano nel manto dell'Eterno.",
      content: `SCHEDA CRITICA DELL'OPERA:
Titolo: La Creazione di Adamo (Volta della Cappella Sistina)
Autore: Michelangelo Buonarroti (Caprese 1475 – Roma 1564)
Datazione: 1511–1512
Tecnica e Supporto: Affresco su intonaco (280 × 570 cm)
Collocazione Attuale: Musei Vaticani, Città del Vaticano (Quarto riquadro centrale della Genesi)

1. LA GENESI DELLA VOLTA DELLA SISTINA (1508-1512):
Commissionata nel maggio del 1508 da papa Giulio II della Rovere, la decorazione dell'immensa volta della Cappella Sistina (oltre cinquecento metri quadrati di superficie curva a venti metri di quota) rappresentò per Michelangelo una sfida titanica sia fisica che concettuale. Rifiutando i collaboratori fiorentini e progettando da solo un innovativo ponteggio pensile 'a gradoni' ad arco ribassato, l'artista toscano lavorò per oltre quattro anni ininterrotti, dipingendo in posizione eretta con le braccia sollevate e il capo rovesciato all'indietro. Il pannello centrale della 'Creazione di Adamo', terminato nell'autunno del 1511 e svelato al pubblico nell'ottobre 1512, è universalmente riconosciuto come il vertice iconico della storia dell'arte occidentale.

2. L'ENIGMA DEL MANTO ROSA E LA SCOPERTA NEUROANATOMICA (1990):
Per quasi cinque secoli, critici e teologi hanno interpretato la grande nube rossastra e il manto fluttuante che avvolge Dio Padre e la corte angelica come una metafora poetica del grembo divino o della conchiglia celeste. Nel 1990, tuttavia, una celebre pubblicazione scientifica del neurochirurgo americano Frank Lynn Meshberger sul prestigioso 'Journal of the American Medical Association' (JAMA) ha aperto una prospettiva rivoluzionaria: il contorno del manto divino riproduce con sbalorditiva esattezza anatomica la sezione sagittale mediana del cervello umano.
I dettagli di corrispondenza neuroanatomica documentati da Meshberger e confermati dai successivi studi della Johns Hopkins University includono:
- Il contorno esterno del drappo rosso coincide con la corteccia cerebrale e il lobo frontale, parietale e occipitale;
- La sciarpa verde che ondeggia alla base ricalca il decorso dell'arteria vertebrale e del tronco encefalico;
- L'angelo alla base sostiene il Signore esattamente nella posizione del cervelletto;
- La figura divina e gli infanti celesti occupano lo spazio del sistema limbico, del talamo e dell'amigdala — la sede fisiologica delle emozioni e della memoria cosciente.

3. GLI STUDI ANATOMICI SEGRETI DEL GIOVANE MICHELANGELO:
Questa incredibile coincidenza trova un fondamento documentario inoppugnabile nelle fonti storiche coeve. Come narrato da Ascanio Condivi e Giorgio Vasari, all'età di diciassette anni (tra il 1492 e il 1493) Michelangelo ottenne dal priore del convento di Santo Spirito a Firenze l'accesso segreto alla sala delle autopsie, dove per mesi dissezionò clandestinamente cadaveri umani a lume di candela per studiare a fondo tendini, ossa, fasci muscolari e la complessa conformazione degli organi interni e del sistema nervoso centrale. Michelangelo era uno dei massimi esperti mondiali di anatomia del suo tempo, e l'occultamento della figura cerebrale nell'affresco pontificio era un sofisticato messaggio cifrato: ciò che Dio trasmette ad Adamo nel celebre contatto a distanza tra gli indici non è soltanto il respiro biologico, ma la scintilla dell'intelletto, della coscienza e del libero arbitrio razionale.

4. LA DINAMICA DELLO SPAZIO TRA LE DITA:
L'apice drammatico dell'affresco risiede nel vuoto millimetrico che separa l'indice potente e proteso del Creatore dall'indice languido e ricettivo di Adamo. Michelangelo scelse deliberatamente di non far toccare le due dita: in quella frazione di spazio risiede la tensione metafisica infinita tra l'infinito divino e la finitezza umana. Adamo, adagiato sul suolo terrestre con un corpo atletico di scultorea bellezza greca, attende il flusso vitale con un'espressione di nostalgia e consapevolezza nascente.

5. RESTAURI E CONSERVAZIONE AI MUSEI VATICANI:
Lo storico restauro della volta conclusosi nel 1994 sotto la direzione di Gianluigi Colalucci ha rimosso secoli di fumo di candele e colle alterate, restituendo alla 'Creazione di Adamo' la sua straordinaria tavolozza cromatica originale: tonalità cangianti di rosa carminio, verde malachite, bruni dorati e un chiaroscuro luminoso che modella le anatomie con la potenza plastica di una scultura marmorea. Oggi l'opera accoglie milioni di visitatori come monumento eterno al mistero della mente e dello spirito umano.`,
      readingTime: "7 min",
      author: "Redazione Beni Culturali & Musei Vaticani",
      date: "Agosto 2026",
      highlightQuote: "Nella Creazione di Adamo Michelangelo celò la sagoma del cervello umano: la scintilla che Dio trasmette all'uomo è la coscienza e il libero arbitrio.",
      originalLanguage: "Italiano",
      sources: [
        {
          title: "Musei Vaticani - La Volta della Cappella Sistina e la Creazione di Adamo",
          url: "https://www.museivaticani.va/",
          publisher: "Stato della Città del Vaticano",
          originalLanguage: "Italiano"
        },
        {
          title: "JAMA - An Interpretation of Michelangelo's Creation of Adam Based on Neuroanatomy",
          url: "https://jamanetwork.com/journals/jama/article-abstract/383495",
          publisher: "Journal of the American Medical Association",
          originalLanguage: "Inglese"
        }
      ]
    }
  },
  {
    id: "capolavori-van-gogh-notte-stellata",
    artworkTitle: "La Notte Stellata e la Fluidodinamica Quantistica",
    artist: "Vincent van Gogh",
    shortArtworkTitle: "VAN GOGH: Notte Stellata (1889)",
    year: "1889",
    museum: "Museum of Modern Art (MoMA)",
    city: "New York",
    matchingCategory: "Scienza",
    matchingTopic: "Astronomia e Spazio & Nuove Scoperte Scientifiche",
    whyConnected: "Ispirato all'interesse 'Astronomia e Spazio': le analisi matematiche condotte da astrofisici hanno dimostrato che i vortici celesti di Van Gogh descrivono con rigore esatto le leggi della turbolenza fluida di Kolmogorov e la fisica dei campi stellari.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
    coverAccentColor: "from-blue-950 via-sky-900 to-amber-950",
    article: {
      id: "capolavori-van-gogh-notte-stellata",
      pageNumber: 1,
      category: "Arte",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
      title: "Capolavori dell'Umanità: La Fisica della Turbolenza nella «Notte Stellata» di Van Gogh",
      shortTitle: "Capolavori: Van Gogh e i Vortici Cosmici",
      excerpt: "Dipinta nel giugno 1889 a Saint-Rémy-de-Provence: le ricerche di astrofisici e fluidodinamici che hanno scoperto le equazioni statistiche di Kolmogorov nei cieli di Van Gogh.",
      content: `SCHEDA CRITICA DELL'OPERA:
Titolo: Notte Stellata (De sterrennacht)
Autore: Vincent van Gogh (Zundert 1853 – Auvers-sur-Oise 1890)
Datazione: Giugno 1889
Tecnica e Supporto: Olio su tela (73,7 × 92,1 cm)
Collocazione Attuale: The Museum of Modern Art (MoMA), New York (Lillie P. Bliss Bequest, 1941)

1. LA SOLITUDINE DI SAINT-RÉMY (GIUGNO 1889):
All'inizio del maggio 1889, dopo la tragica crisi ad Arles e la mutilazione dell'orecchio sinistro, Vincent van Gogh decise volontariamente di ricoverarsi presso il monastero-manicomio di Saint-Paul-de-Mausole a Saint-Rémy-de-Provence. Dalla finestra della sua stanza al primo piano, priva di imposte e protetta da sbarre di ferro, l'artista contemplava ogni notte il cielo provenzale prima dell'alba. «Questa mattina ho visto la campagna dalla mia finestra a lungo prima del levar del sole, senza nient'altro che la stella del mattino, che sembrava grandissima», scrisse in una memorabile lettera al fratello Theo nel giugno 1889. Su quella visione visionaria nacque la 'Notte Stellata'.

2. LA SCOPERTA FISICA: LA TURBOLENZA DI KOLMOGOROV (2006-2024):
Per decenni il cielo vorticoso di Van Gogh è stato considerato una pura trasfigurazione allucinatoria o espressionista della sofferenza mentale del pittore. Tuttavia, nel 2006, un gruppo di fisici guidato da José Luis Aragón dell'Università Nazionale Autonoma del Messico (UNAM) ha condotto un'analisi statistica della luminosità e della distribuzione spettrale dei pixel sulla tela, pubblicando i risultati sulla prestigiosa rivista 'Nature'.
Lo studio ha rivelato un dato sconcertante: i vortici dipinti da Van Gogh seguono fedelmente la legge statistica della 'turbolenza completamente sviluppata' formulata dal matematico sovietico Andrej Kolmogorov nel 1941 (Teoria K41). Nel 2024, un nuovo studio internazionale condotto con idrodinamica computazionale ha confermato che la cascata energetica dei flussi e la scala di dispersione dei vortici di Van Gogh ricalcano sia la legge di Kolmogorov sia la scala microscopica di Batchelor per la turbolenza scalare, un comportamento matematico estremamente complesso che la fisica classica non è in grado di descrivere analiticamente.

3. STRUTTURA COMPOSITIVA E SIMBOLICA:
La composizione è magistralmente bilanciata su due assi visivi:
- La componente terrestre: dominata dal cipresso scuro e monumentale in primo piano sulla sinistra (albero tradizionalmente associato al lutto ma anche alla persistenza della vita e ponte verticale verso l'infinito) e dal piccolo villaggio idealizzato sormontato dal campanile a cuspide, che richiama i paesaggi natii dei Paesi Bassi;
- La componente celeste: occupa oltre due terzi dello spazio con undici stelle incandescenti circondate da aloni dorati concentrici, la falce lunare dorata fusa con il sole all'angolo destro e una gigantesca fascia a spirale ondulata che solca il centro del cielo come un fiume di plasma galattico.

4. LA MATERIA PITTORICA E LA VELOCITÀ DEL GESTO:
Van Gogh applicò i colori puri direttamente dal tubetto sulla tela grezza, utilizzando pennellate corte, dense e materiche (impasto a rilievo) con andamento ritmico e rotatorio. La luce non è statica: gli spettri di blu di Prussia, blu cobalto, giallo cromo e bianco di zinco vibrano in contrasto cromatico simultaneo (secondo la teoria dei colori complementari di Chevreul), trasformando la volta celeste in un organismo vivente pervaso da energie cosmiche universali.

5. DAL RIFIUTO ALL'ICONA DEL MOMA:
Inviata a Parigi a Theo nel settembre 1889, la tela non trovò acquirenti e fu considerata dallo stesso Vincent un esperimento non del tutto riuscito («Nel complesso l'unica cosa che considero un po' valida sono il Campo di grano, la Montagna, il Frutteto... il resto non mi dice nulla»). Nel 1941, grazie al lascito testamentario di Lillie P. Bliss, il dipinto entrò nelle collezioni del Museum of Modern Art di New York, consacrandosi come il capolavoro più amato e visitato dell'arte moderna.`,
      readingTime: "7 min",
      author: "Redazione Storia dell'Arte & Fisica Moderna",
      date: "Agosto 2026",
      highlightQuote: "Gli astrofisici hanno dimostrato che i vortici della Notte Stellata di Van Gogh descrivono con esattezza le leggi della fluidodinamica e della turbolenza cosmica.",
      originalLanguage: "Italiano",
      sources: [
        {
          title: "The Museum of Modern Art (MoMA) - Vincent van Gogh: The Starry Night (1889)",
          url: "https://www.moma.org/collection/works/79802",
          publisher: "MoMA New York",
          originalLanguage: "Inglese"
        },
        {
          title: "Nature - Physicist finds Kolmogorov turbulence scaling in Van Gogh's Starry Night",
          url: "https://www.nature.com/articles/news060703-17",
          publisher: "Nature News",
          originalLanguage: "Inglese"
        }
      ]
    }
  },
  {
    id: "capolavori-raffaello-scuola-di-atene",
    artworkTitle: "La Scuola di Atene e il Trionfo della Filosofia",
    artist: "Raffaello Sanzio",
    shortArtworkTitle: "RAFFAELLO: Scuola di Atene (1511)",
    year: "1509-1511",
    museum: "Musei Vaticani, Stanza della Segnatura",
    city: "Città del Vaticano / Roma",
    matchingCategory: "Cultura",
    matchingTopic: "Narrativa Breve & Miti e Leggende dell'Antichità",
    whyConnected: "Ispirato all'interesse 'Miti e Leggende dell'Antichità' e alla grande cultura classica: Raffaello celebrò la sintesi tra il pensiero mitico-filosofico classico e l'armonia della conoscenza universale.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/%22The_School_of_Athens%22_by_Raffaello_Sanzio_da_Urbino.jpg/1280px-%22The_School_of_Athens%22_by_Raffaello_Sanzio_da_Urbino.jpg",
    coverAccentColor: "from-amber-950 via-stone-800 to-stone-900",
    article: {
      id: "capolavori-raffaello-scuola-di-atene",
      pageNumber: 1,
      category: "Arte",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/%22The_School_of_Athens%22_by_Raffaello_Sanzio_da_Urbino.jpg/1280px-%22The_School_of_Athens%22_by_Raffaello_Sanzio_da_Urbino.jpg",
      title: "Capolavori dell'Umanità: «La Scuola di Atene» di Raffaello e l'Armonia del Pensiero",
      shortTitle: "Capolavori: Raffaello e la Scuola di Atene",
      excerpt: "Affrescata tra il 1509 e il 1511 nella Stanza della Segnatura: l'architettura bramantesca e il vertice intellettuale del Rinascimento dove Platone e Aristotele dialogano con i sapienti.",
      content: `SCHEDA CRITICA DELL'OPERA:
Titolo: La Scuola di Atene (Philosophia)
Autore: Raffaello Sanzio (Urbino 1483 – Roma 1520)
Datazione: 1509–1511
Tecnica e Supporto: Affresco su intonaco (500 × 770 cm)
Collocazione Attuale: Musei Vaticani, Stanza della Segnatura, Città del Vaticano

1. IL PALAZZO APOSTOLICO E LA STANZA DELLA SEGNATURA (1508-1511):
Nel 1508, il venticinquenne Raffaello Sanzio giunse a Roma chiamato da papa Giulio II su suggerimento dell'architetto Donato Bramante. Il pontefice affidò al giovane maestro urbinate la decorazione della sua biblioteca privata e studio personale (in seguito sede del tribunale ecclesiastico della 'Segnatura Gratiae et Iustitiae'). Il programma iconografico umanistico prevedeva la celebrazione delle quattro supreme facoltà dello spirito umano: la Teologia (la Disputa del Sacramento), la Poesia (il Parnaso), la Giustizia (le Virtù e la Legge) e la Filosofia naturale e razionale (la Scuola di Atene).

2. L'ARCHITETTURA ILLUSIONISTICA E LA PROSPETTIVA:
L'affresco è ambientato all'interno di una grandiosa basilica classica a croce greca con volte a botte cassettonate e una maestosa cupola, ispirata direttamente ai rivoluzionari progetti di Donato Bramante per la nuova Basilica di San Pietro in costruzione a pochi metri di distanza. Nelle nicchie parietali vegliano le statue monumentali di Apollo (dio delle arti, della luce e dell'armonia solare) e Minerva (dea della sapienza, della saggezza e dell'ingegno strategico). La rigorosa griglia prospettica convergente guida lo sguardo dello spettatore dal pavimento marmoreo geometrico verso il punto di fuga centrale, situato esattamente tra i due massimi pensatori dell'antichità.

3. IL DIALOGO SUPREMO: PLATONE E ARISTOTELE:
Al centro della composizione avanzano fianco a fianco i due pilastri del pensiero occidentale:
- A sinistra, Platone (ritratto con i tratti fisionomici del venerando Leonardo da Vinci): tiene sotto il braccio il dialogo del 'Timeo' (opera cosmologica sull'origine dell'universo) e solleva l'indice destro verso il cielo, alludendo al mondo trascendente delle Idee, alla metafisica e alla matematica pura;
- A destra, Aristotele: impugna l'Etica Nicomachea' e distende la mano destra aperta orizzontalmente verso la terra, a simboleggiare il metodo empirico, la fisica, l'osservazione della natura biologica e l'etica sociale concreta.
Raffaello non pone le due visioni in contrapposizione distruttiva, ma le armonizza come due ali complementari della ricerca della Verità.

4. LA GALLERIA DEI FILOSOFI E GLI OMAGGI AI CONTEMPORANEI:
Disposti lungo i gradoni si riconoscono i giganti della scienza e della logica:
• Socrate: a sinistra, mentre discute animatamente contando i sillogismi sulle dita con Alcibiade e Senofonte;
• Pitagora: in primo piano a sinistra, mentre annota le leggi dei rapporti armonici e della tetraktys su una lavagna tenuta da un allievo;
• Eraclito (il filosofo del divenire e della malinconia): seduto isolato sui gradini in primo piano, appoggiato a un blocco di marmo mentre scrive. È il celebre omaggio aggiunto nel 1511 con il ritratto di Michelangelo Buonarroti, che stava affrescando la vicina Sistina;
• Diogene il Cinico: disteso con noncuranza sui gradini con la sua ciotola;
• Euclide (ritratto con il volto di Donato Bramante): chino a destra con un compasso in mano mentre dimostra un teorema geometrico agli studenti;
• Tolomeo e Zoroastro: che reggono rispettivamente il globo terrestre e la sfera celeste;
• L'autoritratto di Raffaello: all'estrema destra, il giovane con il berretto nero che fissa con dolcezza chi osserva.

5. IL MANIFESTO DEL RINASCIMENTO:
Con 'La Scuola di Atene', Raffaello ha consegnato al patrimonio universale la più luminosa cattedrale visiva della fiducia nella ragione, nella tolleranza intellettuale e nella dignità della ricerca scientifica e filosofica, dove sapienti di epoche, etnie e fedi diverse convivono in un armonico banchetto dell'intelletto.`,
      readingTime: "7 min",
      author: "Redazione Musei Vaticani & Rinascimento",
      date: "Agosto 2026",
      highlightQuote: "Nella Scuola di Atene Raffaello armonizza Platone e Aristotele: la metafisica celeste e la scienza terrena unite nella ricerca della Verità.",
      originalLanguage: "Italiano",
      sources: [
        {
          title: "Musei Vaticani - Stanze di Raffaello: Stanza della Segnatura (Scuola di Atene)",
          url: "https://www.museivaticani.va/content/museivaticani/it/collezioni/musei/stanze-di-raffaello/stanza-della-segnatura/scuola-di-atene.html",
          publisher: "Musei Vaticani",
          originalLanguage: "Italiano"
        },
        {
          title: "Istituto Treccani - Raffaello Sanzio e la Scuola di Atene",
          url: "https://www.treccani.it/enciclopedia/raffaello-sanzio/",
          publisher: "Treccani",
          originalLanguage: "Italiano"
        }
      ]
    }
  },
  {
    id: "capolavori-hokusai-grande-onda",
    artworkTitle: "La Grande Onda di Kanagawa e la Geometria della Natura",
    artist: "Katsushika Hokusai",
    shortArtworkTitle: "HOKUSAI: La Grande Onda (1831)",
    year: "1831 circa",
    museum: "British Museum / Tokyo National Museum",
    city: "Londra / Tokyo",
    matchingCategory: "Folclore",
    matchingTopic: "Piccolo Popolo e Creature del Folclore & Natura Primordiale",
    whyConnected: "Ispirato all'interesse 'Piccolo Popolo e Creature del Folclore' e alla spiritualità della natura: Hokusai tradusse gli spiriti del mare (kami) e la potenza della natura giapponese in una xilografia immortale.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Tsunami_by_hokusai_19th_century.jpg/1280px-Tsunami_by_hokusai_19th_century.jpg",
    coverAccentColor: "from-blue-950 via-teal-900 to-slate-950",
    article: {
      id: "capolavori-hokusai-grande-onda",
      pageNumber: 1,
      category: "Arte",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Tsunami_by_hokusai_19th_century.jpg/1280px-Tsunami_by_hokusai_19th_century.jpg",
      title: "Capolavori dell'Umanità: «La Grande Onda di Kanagawa» di Hokusai",
      shortTitle: "Capolavori: Hokusai e la Grande Onda",
      excerpt: "Pubblicata nel 1831 nella serie delle Trentasei vedute del Monte Fuji: la xilografia in blu di Prussia che ha rivoluzionato l'arte mondiale con la potenza dell'oceano.",
      content: `SCHEDA CRITICA DELL'OPERA:
Titolo: Sotto la grande onda al largo di Kanagawa (Kanagawa-oki nami ura)
Autore: Katsushika Hokusai (Edo / Tokyo 1760 – 1849)
Datazione: 1831 circa (Periodo Edo, Era Tenpō)
Tecnica e Supporto: Xilografia policroma su carta di gelso washi (25,7 × 37,8 cm)
Collocazione Principale: British Museum (Londra), Metropolitan Museum of Art (New York), Tokyo National Museum

1. LA SERIE DEL MONTE FUJI E LA MATURITÀ DI HOKUSAI (1831):
All'età di settant'anni, dopo una vita trascorsa a cambiare oltre trenta pseudonimi artistici e novanta abitazioni a Edo, il maestro Katsushika Hokusai intraprese la monumentale serie di stampe ukiyo-e ('immagini del mondo fluttuante') intitolata 'Trentasei vedute del Monte Fuji' (Fugaku sanjūrokkei). Pubblicata dall'editore Nishimuraya Yohachi, la raccolta fu concepita per celebrare il vulcano sacro come simbolo di eternità spirituale e custode del segreto dell'immortalità nella tradizione shintoista e buddhista. La prima e più celebre tavola della serie fu 'La Grande Onda al largo di Kanagawa'.

2. LA RIVOLUZIONE DEL BLU DI PRUSSIA E LA PROSPETTIVA OCCIDENTALE:
Fino agli anni Venti dell'Ottocento, gli incisori giapponesi utilizzavano pigmenti organici vegetali per il blu (come l'indaco o il giorno-fiorito), che tendevano a sbiadire rapidamente alla luce. Hokusai fu tra i primissimi artisti a impiegare il 'blu di Prussia' (berorin ai, blu di Berlino), un pigmento sintetico importato clandestinamente attraverso i mercanti olandesi dell'isola artificiale di Dejima a Nagasaki. La straordinaria intensità e la resistenza cromatica di questo blu consentirono a Hokusai di creare sfumature tonali (bokashi) profonde mai viste prima, fondendo la tradizione calligrafica nipponica con i principi della prospettiva lineare e del punto di fuga ribassato appresi dalle incisioni europee.

3. DINAMICA DEI FLUIDI E FRATTALI NATURALI:
La scena cattura un istante infinitesimale di violenza oceanica:
- L'onda mostruosa (un'onda anomala o maroso da tempesta, non uno tsunami come spesso erroneamente creduto) si inarca a spirale dal lato sinistro occupando l'intero quadrante superiore, con creste che si frammentano in 'artigli' di schiuma bianca pronti ad abbattersi sui barcaioli;
- Tre fragili imbarcazioni veloci da trasporto del pesce (oshiokuri-bune) scivolano nelle gole d'acqua, con i rematori rannicchiati in perfetta sincronia che assecondano la corrente marina invece di opporvisi, testimoniando la resilienza umana di fronte alla furia degli elementi;
- Sullo sfondo, immobile e solenne nel punto focale esatto del cavo dell'onda, si staglia il Monte Fuji innevato: la sua sagoma piramidale è dipinta con le stesse tonalità di blu e la neve sulla cima richiama la schiuma dell'onda, creando un gioco visivo speculare tra l'effimero moto ondoso e l'immutabilità della montagna sacra.

4. L'IMPATTO GLOBALE SUL GIAPPONISMO E SULL'ARTE EUROPEA:
Con l'apertura forzata dei porti giapponesi nel 1854 e l'Esposizione Universale di Parigi del 1867, le stampe di Hokusai travolsero la scena artistica europea dando vita al fenomeno del 'Giapponismo'. Claude Monet collezionò oltre duecento stampe di Hokusai a Giverny, Vincent van Gogh ne lodò la precisione quasi microscopica («queste onde sono artigli, la nave vi è intrappolata e tu lo senti»), e il compositore Claude Debussy scelse proprio 'La Grande Onda' per la copertina della prima partizione orchestrale del suo poema sinfonico 'La Mer' (1905).

5. ICONA UNIVERSALE:
Oggi 'La Grande Onda di Kanagawa' è considerata una delle opere d'arte più riprodotte, riconoscibili e studiate dell'intera storia umana, sintesi insuperata del sublime naturale e dell'armonia tra l'uomo e il cosmo.`,
      readingTime: "6 min",
      author: "Redazione Arte Asiatica & Musei Internazionali",
      date: "Agosto 2026",
      highlightQuote: "Con il blu di Prussia e la dinamica frattale dell'oceano, Hokusai trasformò l'onda in un'icona universale del sublime e della resilienza.",
      originalLanguage: "Italiano",
      sources: [
        {
          title: "The British Museum - Katsushika Hokusai: Under the Wave off Kanagawa (1831)",
          url: "https://www.britishmuseum.org/collection/object/A_1937-0710-0-147",
          publisher: "The British Museum London",
          originalLanguage: "Inglese"
        },
        {
          title: "Metropolitan Museum of Art - The Great Wave at Kanagawa Dossier",
          url: "https://www.metmuseum.org/art/collection/search/45434",
          publisher: "The Met New York",
          originalLanguage: "Inglese"
        }
      ]
    }
  },
  {
    id: "capolavori-disco-di-festo-creta",
    artworkTitle: "Il Disco di Festo e i Simboli Sacri di Creta",
    artist: "Maestri Minoici di Creta",
    shortArtworkTitle: "ARTE MINOICA: Il Disco di Festo (1700 a.C.)",
    year: "1700 a.C. circa",
    museum: "Museo Archeologico di Heraklion",
    city: "Creta, Grecia",
    matchingCategory: "Mistero",
    matchingTopic: "Archeologia Misteriosa e Luoghi Perduti",
    whyConnected: "Ispirato all'interesse 'Archeologia Misteriosa e Luoghi Perduti': il Disco di Festo rappresenta il più grande enigma epigrafico dell'antichità e il primo documento a caratteri mobili della storia.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Phaistos_disc_side_A_color.jpg/1200px-Phaistos_disc_side_A_color.jpg",
    coverAccentColor: "from-amber-950 via-stone-800 to-orange-950",
    article: {
      id: "capolavori-disco-di-festo-creta",
      pageNumber: 1,
      category: "Arte",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Phaistos_disc_side_A_color.jpg/1200px-Phaistos_disc_side_A_color.jpg",
      title: "Capolavori dell'Umanità: I Sigilli Enigmatici del Disco di Festo (1700 a.C.)",
      shortTitle: "Capolavori: Il Disco di Festo",
      excerpt: "Rinvenuto nel 1908 nel palazzo minoico di Festo: il disco d'argilla cotta con 241 glifi impressi a spirale che precede la stampa a caratteri mobili di tremila anni.",
      content: `SCHEDA CRITICA DELL'OPERA:
Titolo: Il Disco di Festo (Diskos tīs Phaistoú)
Autore: Maestri e scribi della civiltà minoica (Creta neopalaziale)
Datazione: 1700–1600 a.C. circa (Bronzo Medio III / Tardo Minoico I)
Tecnica e Supporto: Disco di argilla fine cotta con glifi impressi a stampo mobile (diametro 16 cm, spessore 2,1 cm)
Collocazione Attuale: Museo Archeologico di Heraklion, Creta, Grecia (Sala Minoica, Reperto n. HM 1358)

1. LA SCOPERTA NEL PALAZZO DI FESTO (1908):
Il 3 luglio 1908, durante gli scavi condotti dalla Missione Archeologica Italiana guidata da Federico Halbherr e Luigi Pernier nel sito palaziale minoico di Festo, sulla costa meridionale di Creta, l'archeologo Pernier riportò alla luce un reperto destinato a diventare uno dei più grandi enigmi dell'archeologia mondiale. Nel vano sotterraneo 101 del tempio-deposito, sigillato sotto uno strato di cenere e frammenti di tavolette in Lineare A risalenti al crollo sismico del 1600 a.C., giaceva un disco circolare d'argilla color ocra dorata, intatto e perfettamente conservato.

2. L'ANTICIPAZIONE DELLA STAMPA TIPOGRAFICA A CARATTERI MOBILI:
L'aspetto più rivoluzionario e sconvolgente del manufatto non risiede soltanto nel suo contenuto linguistico, ma nella tecnica manifatturiera impiegata per realizzarlo. A differenza di tutte le altre tavolette d'argilla dell'antico Vicino Oriente e del mondo egeo — in cui i segni venivano incisi a mano libera con uno stilo appuntito sull'argilla fresca —, i 241 simboli del Disco di Festo furono impressi utilizzando 45 punzoni o timbri singoli in rilievo in legno duro o bronzo.
Ogni glifo (la testa con copricapo piumato, lo scudo tondo con umbone, il ramo d'ulivo, il pesce, l'ascia bipenne labrys, il gatto, l'alveare) veniva impresso con una pressione uniforme lungo una linea guida a spirale tracciata dall'esterno verso il centro. Si tratta del più antico esempio al mondo di testo riproducibile mediante caratteri mobili, anticipando l'invenzione della tipografia di Johannes Gutenberg di ben tremiladuecento anni.

3. ANALISI ICONOGRAFICA DEI 45 GLIFI:
I glifi sono suddivisi in 61 gruppi o 'parole' separati da linee verticali incise: 31 gruppi sulla faccia A (122 segni) e 30 gruppi sulla faccia B (119 segni). L'iconografia riflette l'universo quotidiano e religioso minoico:
- Guerrieri e corpi umani in movimento;
- Fauna marina e terrestre mediterranea (colombe, buoi, insetti);
- Strumenti di navigazione, armi cerimoniali e architetture sacre con colonne;
- Un piccolo segno obliquo tracciato a mano sotto l'ultimo segno di alcuni gruppi, interpretato come un marcatore prosodico, un ritornello poetico o una cesura musicale.

4. I TENTATIVI DI DECIFRAZIONE (1908-2024):
Nel corso di oltre un secolo, filologi, epigrafisti e linguisti computazionali hanno proposto decine di traduzioni e interpretazioni: dall'inno sacro alla Dea Madre minoica Astarte, al trattato di alleanza marittima tra le città cretesi, dalla preghiera funebre al calendario astronomico lunisolare. Le più recenti analisi fonetiche comparate con la Lineare A e la Lineare B micenea (decrittata nel 1952 da Michael Ventris) suggeriscono che il testo rappresenti una lingua egea pre-greca intrisa di formule liturgiche e ritmi poetici cantati nei santuari montani minoici.

5. CUSTODE DELL'ORIGINE DELLA SCRITTURA EUROPEA:
Esposto al Museo Archeologico di Heraklion insieme agli affreschi di Cnosso e ai rhyta cerimoniali, il Disco di Festo rimane il simbolo supremo della raffinata civiltà minoica: un faro di ingegno artigianale che continua a custodire la voce perduta della prima grande civiltà marittima d'Europa.`,
      readingTime: "7 min",
      author: "Redazione Archeologia & Epigrafia Antica",
      date: "Agosto 2026",
      highlightQuote: "Impresso con punzoni a caratteri mobili nel 1700 a.C., il Disco di Festo precede la tipografia di 3.200 anni custodendo l'enigma della lingua minoica.",
      originalLanguage: "Italiano",
      sources: [
        {
          title: "Heraklion Archaeological Museum - The Phaistos Disc Official Dossier",
          url: "https://heraklionmuseum.gr/",
          publisher: "Hellenic Ministry of Culture",
          originalLanguage: "Inglese"
        },
        {
          title: "Istituto di Studi Egei e Micenei (CNR) - Ricerche sul Disco di Festo e la Lineare A",
          url: "https://www.cnr.it/",
          publisher: "CNR Italia",
          originalLanguage: "Italiano"
        }
      ]
    }
  }
];

// Funzione helper per trovare l'immagine e la scheda critica più adatta da catalogo o dizionario
function findVerifiedDictionaryEntry(title: string = "", artist: string = "", text: string = "") {
  const query = `${title} ${artist} ${text}`.toLowerCase();
  
  // 1. Cerca per titolo specifico dell'opera, artista o parole chiave nel dizionario ad alta risoluzione
  for (const [key, item] of Object.entries(ART_IMAGE_DICTIONARY)) {
    const itemTitleLower = (item.title || "").toLowerCase();
    const itemArtistLower = (item.artist || "").toLowerCase();
    
    // Verifica se il titolo dell'opera, l'artista o una parola chiave è presente
    const titleMatch = itemTitleLower.length > 3 && query.includes(itemTitleLower);
    const keywordMatch = item.keywords && item.keywords.some((kw) => kw.length >= 3 && query.includes(kw.toLowerCase()));
    const artistMatch = itemArtistLower.length > 4 && (query.includes(itemArtistLower) || (artist && artist.toLowerCase().includes(itemArtistLower)));

    if (titleMatch || keywordMatch || artistMatch) {
      return item;
    }
  }

  // 2. Cerca nel catalogo dei capolavori per titolo specifico dell'opera
  const catMatch = ART_MASTERPIECES_CATALOG.find((m) => {
    const artTitle = (m.artworkTitle || "").toLowerCase();
    const shortTitle = (m.shortArtworkTitle || "").toLowerCase();
    return (
      (artTitle.length > 3 && query.includes(artTitle)) ||
      (shortTitle.length > 3 && query.includes(shortTitle))
    );
  });

  if (catMatch) {
    return {
      title: catMatch.artworkTitle,
      artist: catMatch.artist,
      year: catMatch.year,
      museum: catMatch.museum,
      city: catMatch.city,
      url: catMatch.imageUrl,
      keywords: []
    };
  }

  return null;
}

// Helper per pulire e validare gli URL immagine (rimuove UTM e parametri superflui)
function sanitizeArtworkImageUrl(url?: string | null): string | null {
  if (!url || typeof url !== "string" || !url.startsWith("http")) return null;
  if (url.includes("placeholder") || url.includes("/wiki/File:")) return null;
  return url.split("?")[0];
}

// Helper universale per convertire qualsiasi URL immagine in un URL proxy sicuro con caching
export function getProxiedImageUrl(url?: string | null, artist?: string, title?: string): string {
  if (!url || typeof url !== "string") {
    if (artist || title) {
      const params = new URLSearchParams();
      if (artist) params.set("artist", artist);
      if (title) params.set("title", title);
      return `/api/art/image-proxy?${params.toString()}`;
    }
    return botticelliImage;
  }
  // Se è già un asset locale o un data URI o URL relativo
  if (url.startsWith("data:") || url.startsWith("/src/") || url.startsWith("/assets/")) {
    return url;
  }
  if (url.startsWith("/api/art/image-proxy")) {
    return url;
  }
  const cleanUrl = url.split("?")[0];
  const params = new URLSearchParams();
  params.set("url", cleanUrl);
  if (artist) params.set("artist", artist);
  if (title) params.set("title", title);
  return `/api/art/image-proxy?${params.toString()}`;
}

// Risolutore intelligente e dinamico che associa a QUALSIASI articolo d'arte o capolavoro l'esatta immagine e scheda critica
export function getArtworkMetadataForArticle(
  article: Article,
  defaultMasterpiece?: ArtMasterpiece | null
): ArtworkMetadata {
  const safeFallback = "https://upload.wikimedia.org/wikipedia/commons/5/5b/Michelangelo_-_Creation_of_Adam_%28cropped%29.jpg";

  // Caso 1: Articolo nullo o non fornito
  if (!article) {
    if (defaultMasterpiece) {
      const dictMatch = findVerifiedDictionaryEntry(defaultMasterpiece.artworkTitle, defaultMasterpiece.artist);
      const isBotticelliMagi =
        defaultMasterpiece.artworkTitle?.toLowerCase().includes("adorazione") &&
        defaultMasterpiece.artist?.toLowerCase().includes("botticelli");

      let resolvedImg = sanitizeArtworkImageUrl(defaultMasterpiece.imageUrl || defaultMasterpiece.article?.imageUrl);
      if ((!resolvedImg || resolvedImg === botticelliImage || resolvedImg.includes("botticelli")) && !isBotticelliMagi && dictMatch) {
        resolvedImg = dictMatch.url;
      }

      const effectiveUrl = resolvedImg || dictMatch?.url || botticelliImage;

      return {
        artworkTitle: defaultMasterpiece.artworkTitle,
        artist: defaultMasterpiece.artist,
        shortArtworkTitle: defaultMasterpiece.shortArtworkTitle || `${defaultMasterpiece.artist}: ${defaultMasterpiece.artworkTitle}`,
        year: defaultMasterpiece.year,
        museum: defaultMasterpiece.museum,
        city: defaultMasterpiece.city,
        artworkType: defaultMasterpiece.artworkType || dictMatch?.artworkType || "Opera d'Arte",
        matchingCategory: defaultMasterpiece.matchingCategory,
        matchingTopic: defaultMasterpiece.matchingTopic,
        whyConnected: defaultMasterpiece.whyConnected,
        imageUrl: effectiveUrl,
        fallbackImageUrl: dictMatch?.url || (isBotticelliMagi ? botticelliImage : safeFallback)
      };
    }
    return {
      artworkTitle: "L'Adorazione dei Magi",
      artist: "Sandro Botticelli",
      shortArtworkTitle: "BOTTICELLI: Adorazione dei Magi (1475)",
      year: "1475 circa",
      museum: "Galleria degli Uffizi",
      city: "Firenze",
      artworkType: "Dipinto Rinascimentale",
      imageUrl: botticelliImage,
      fallbackImageUrl: botticelliImage
    };
  }

  // Priorità 0: Se l'articolo possiede già metadati di un'opera d'arte ben definiti
  if (article.artworkTitle && article.artworkArtist) {
    const imgUrl = sanitizeArtworkImageUrl(article.artworkImageUrl || article.imageUrl) || safeFallback;
    return {
      artworkTitle: article.artworkTitle,
      artist: article.artworkArtist,
      shortArtworkTitle: `${article.artworkArtist.toUpperCase()}: ${article.artworkTitle}`,
      year: article.artworkYear || "Epoca Storica",
      museum: article.artworkMuseum || "Collezione Museale / Archivio",
      city: "",
      artworkType: "Opera d'Arte Analizzata",
      imageUrl: imgUrl,
      fallbackImageUrl: imgUrl
    };
  }

  // Testo combinato per la ricerca
  const combinedText = `${article.title} ${article.excerpt || ""} ${article.content?.slice(0, 800) || ""} ${article.author || ""}`.toLowerCase();

  // Priorità 1: Se l'articolo è precisamente il Capolavoro in Copertina
  if (defaultMasterpiece) {
    const isDirectMatch =
      defaultMasterpiece.id === article.id ||
      defaultMasterpiece.article?.id === article.id ||
      (defaultMasterpiece.artworkTitle &&
        defaultMasterpiece.artworkTitle.length > 4 &&
        article.title.toLowerCase().includes(defaultMasterpiece.artworkTitle.toLowerCase()));

    if (isDirectMatch) {
      const isBotticelliMagi =
        defaultMasterpiece.artworkTitle?.toLowerCase().includes("adorazione") &&
        defaultMasterpiece.artist?.toLowerCase().includes("botticelli");

      const dictMatch = findVerifiedDictionaryEntry(defaultMasterpiece.artworkTitle, defaultMasterpiece.artist);
      let finalImageUrl = sanitizeArtworkImageUrl(defaultMasterpiece.imageUrl || defaultMasterpiece.article?.imageUrl || article.imageUrl);
      if ((!finalImageUrl || finalImageUrl === botticelliImage || finalImageUrl.includes("botticelli")) && !isBotticelliMagi && dictMatch) {
        finalImageUrl = dictMatch.url;
      }

      const effectiveUrl = finalImageUrl || dictMatch?.url || botticelliImage;

      return {
        artworkTitle: defaultMasterpiece.artworkTitle,
        artist: defaultMasterpiece.artist,
        shortArtworkTitle: defaultMasterpiece.shortArtworkTitle || `${defaultMasterpiece.artist}: ${defaultMasterpiece.artworkTitle}`,
        year: defaultMasterpiece.year,
        museum: defaultMasterpiece.museum,
        city: defaultMasterpiece.city,
        artworkType: defaultMasterpiece.artworkType || dictMatch?.artworkType || "Opera d'Arte",
        matchingCategory: defaultMasterpiece.matchingCategory,
        matchingTopic: defaultMasterpiece.matchingTopic,
        whyConnected: defaultMasterpiece.whyConnected,
        imageUrl: effectiveUrl,
        fallbackImageUrl: dictMatch?.url || (isBotticelliMagi ? botticelliImage : safeFallback)
      };
    }
  }

  // Priorità 2: Corrispondenza per Titolo Opera nel catalogo ART_MASTERPIECES_CATALOG
  const catalogMatch = ART_MASTERPIECES_CATALOG.find((m) => {
    if (m.id === article.id || m.article?.id === article.id) return true;
    const mTitle = (m.artworkTitle || "").toLowerCase();
    return mTitle.length > 4 && article.title.toLowerCase().includes(mTitle);
  });

  if (catalogMatch) {
    const catalogImg = sanitizeArtworkImageUrl(catalogMatch.imageUrl || catalogMatch.article?.imageUrl || article.imageUrl);
    return {
      artworkTitle: catalogMatch.artworkTitle,
      artist: catalogMatch.artist,
      shortArtworkTitle: catalogMatch.shortArtworkTitle || `${catalogMatch.artist}: ${catalogMatch.artworkTitle}`,
      year: catalogMatch.year,
      museum: catalogMatch.museum,
      city: catalogMatch.city,
      artworkType: catalogMatch.artworkType || "Capolavoro d'Arte",
      matchingCategory: catalogMatch.matchingCategory,
      matchingTopic: catalogMatch.matchingTopic,
      whyConnected: catalogMatch.whyConnected,
      imageUrl: catalogImg || safeFallback,
      fallbackImageUrl: catalogImg || safeFallback
    };
  }

  // Priorità 3: Corrispondenza nel dizionario verificato tramite titolo opera
  const dictMatch = findVerifiedDictionaryEntry(article.title, article.author, combinedText);
  if (dictMatch) {
    return {
      artworkTitle: dictMatch.title,
      artist: dictMatch.artist,
      shortArtworkTitle: `${dictMatch.artist.toUpperCase()}: ${dictMatch.title}`,
      year: dictMatch.year,
      museum: dictMatch.museum,
      city: dictMatch.city,
      artworkType: dictMatch.artworkType || "Opera d'Arte",
      imageUrl: dictMatch.url,
      fallbackImageUrl: dictMatch.url
    };
  }

  // Priorità 4: Se l'articolo possiede un'immagine valida del web
  const sanitizedArticleImg = sanitizeArtworkImageUrl(article.imageUrl);
  if (sanitizedArticleImg) {
    const cleanedTitle = article.title
      .replace(/^Capolavori dell'Umanità:\s*|«|»/gi, "")
      .replace(/^Arte & Visioni:\s*/gi, "")
      .trim();
    return {
      artworkTitle: cleanedTitle,
      artist: article.author || "Maestro dell'Arte",
      shortArtworkTitle: article.shortTitle || cleanedTitle,
      year: "Epoca Storica",
      museum: "Collezione Museale",
      city: "",
      artworkType: "Opera d'Arte",
      imageUrl: sanitizedArticleImg,
      fallbackImageUrl: safeFallback
    };
  }

  // Priorità 5: Fallback finale
  return {
    artworkTitle: "L'Adorazione dei Magi",
    artist: "Sandro Botticelli",
    shortArtworkTitle: "BOTTICELLI: Adorazione dei Magi (1475)",
    year: "1475 circa",
    museum: "Galleria degli Uffizi",
    city: "Firenze",
    artworkType: "Dipinto Rinascimentale",
    imageUrl: botticelliImage,
    fallbackImageUrl: botticelliImage
  };
}

export function getMasterpieceForDayAndInterests(
  daySeed: number,
  interests: { category?: string; topic?: string; priority?: number }[] = [],
  excludeArtworks: string[] = []
): ArtMasterpiece {
  const normExcludes = (excludeArtworks || []).map((t) =>
    (t || "").toLowerCase().replace(/[^a-z0-9]/g, "")
  );

  const isExcluded = (artTitle: string) => {
    const normTitle = (artTitle || "").toLowerCase().replace(/[^a-z0-9]/g, "");
    return normExcludes.some((ex) => ex.length > 2 && (normTitle.includes(ex) || ex.includes(normTitle)));
  };

  // Converti gli elementi del dizionario in ArtMasterpiece per estendere il pool di scelta
  const dictionaryMasterpieces: ArtMasterpiece[] = Object.entries(ART_IMAGE_DICTIONARY).map(([key, item]) => {
    return {
      id: `dict-art-${key}`,
      artworkTitle: item.title,
      artist: item.artist,
      shortArtworkTitle: `${item.artist.toUpperCase()}: ${item.title}`,
      year: item.year,
      museum: item.museum,
      city: item.city,
      artworkType: item.artworkType || "Capolavoro d'Arte",
      matchingCategory: "Cultura",
      matchingTopic: item.keywords.join(", "),
      imageUrl: item.url,
      fallbackImageUrl: item.url,
      article: {
        id: `dict-art-${key}`,
        pageNumber: 1,
        category: "Arte & Ispirazione",
        title: `Arte & Visioni: ${item.title} di ${item.artist} (${item.year})`,
        shortTitle: `Arte: ${item.artist} — ${item.title.slice(0, 30)}`,
        excerpt: `Conservato presso ${item.museum} a ${item.city}: il capolavoro d'arte d'autore che dialoga con la sensibilità e gli interessi del lettore.`,
        content: `### Il Contesto Storico e la Visione dell'Autore

L'opera "${item.title}", realizzata da ${item.artist} nel ${item.year}, rappresenta una delle testimonianze più affascinanti della storia dell'arte mondiale. Conservata e custodita presso ${item.museum} a ${item.city}, la tela esprime la straordinaria sensibilità stilistica e la padronanza tecnica dell'autore.

![${item.title}](${item.url})

### Composizione, Tecnica e Simbolismo

L'articolazione della scena, la scelta della palette cromatica e l'equilibrio della composizione testimoniano il profondo dialogo tra forma e significato. Ogni dettaglio dell'opera di ${item.artist} nasconde un preciso messaggio simbolico, volto a guidare lo spettatore attraverso una riflessione sia estetica che filosofica.

> «${item.title} rimane una gemma preziosa della collezione di ${item.museum}, capace di emozionare e ispirare studiosi e appassionati di ogni epoca.»

### L'Eredità nei Grandi Musei

Oggi l'opera continua ad attirare visitatori da tutto il mondo a ${item.city}, confermandosi un punto di riferimento imprescindibile per la comprensione della corrente artistica di appartenenza e un patrimonio culturale inestimabile per l'umanità.`,
        readingTime: "5 min",
        author: "Redazione Arte & Grandi Musei",
        date: "Oggi",
        highlightQuote: `«${item.title} di ${item.artist}: una testimonianza immortale del genio artistico dell'umanità.»`,
        originalLanguage: "Italiano",
        sources: [
          {
            title: `Archivio Ufficiale Museo: ${item.museum}`,
            url: item.url,
            publisher: item.museum,
            originalLanguage: "Italiano"
          }
        ]
      }
    };
  });

  const fullPool = [...ART_MASTERPIECES_CATALOG, ...dictionaryMasterpieces].filter(
    (art) => !isExcluded(art.artworkTitle)
  );

  const pool = fullPool.length > 0 ? fullPool : ART_MASTERPIECES_CATALOG;

  if (!interests || interests.length === 0) {
    return pool[Math.abs(daySeed + 7) % pool.length];
  }

  // Cerca un capolavoro che corrisponda ai keyword dell'interesse attivo
  const sortedInterests = [...interests].sort((a, b) => (b.priority || 3) - (a.priority || 3));
  const selectedInterest = sortedInterests[Math.abs(daySeed) % sortedInterests.length] || sortedInterests[0];
  const searchTerms = [
    (selectedInterest.category || "").toLowerCase(),
    (selectedInterest.topic || "").toLowerCase()
  ].filter(Boolean);

  const matched = pool.find((art) => {
    const artText = `${art.artworkTitle} ${art.artist} ${art.matchingCategory || ''} ${art.matchingTopic || ''}`.toLowerCase();
    return searchTerms.some((term) => term.length > 3 && artText.includes(term));
  });

  if (matched) {
    return matched;
  }

  return pool[Math.abs(daySeed * 17 + 3) % pool.length];
}

