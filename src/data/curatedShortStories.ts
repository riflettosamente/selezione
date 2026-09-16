import { Article } from "../types";

export interface CuratedShortStory {
  id: string;
  storyWorkTitle: string;
  storyAuthor: string;
  storyYear: string;
  storyCulture: string;
  storyOriginalCollection: string;
  matchingInterests: string[]; // es. "UFO e Alieni", "Astronomia e Spazio", "Mistero", "Archeologia", "Scienza dello Spirito", ecc.
  title: string;
  shortTitle: string;
  excerpt: string;
  content: string;
  readingTime: string;
  highlightQuote: string;
  sources: { title: string; url: string; publisher: string; originalLanguage?: string; keyFinding?: string }[];
}

export const CURATED_PUBLIC_DOMAIN_STORIES: CuratedShortStory[] = [
  {
    id: "racconto-luciano-storia-vera",
    storyWorkTitle: "Una storia vera (Verae Historiae) - Il Viaggio sulla Luna",
    storyAuthor: "Luciano di Samosata",
    storyYear: "II secolo d.C. (circa 175 d.C.)",
    storyCulture: "Greco-romana / Ellenistica",
    storyOriginalCollection: "Verae Historiae, Libro I",
    matchingInterests: ["Astronomia e Spazio", "UFO e Alieni", "Film di Fantascienza", "Miti e Leggende dell'Antichità"],
    title: "Una storia vera: Il Viaggio sulla Luna e l'Incontro con gli Abitanti Celesti",
    shortTitle: "Luciano: Viaggio sulla Luna",
    excerpt: "Il primo resoconto letterario di un viaggio cosmico: Luciano di Samosata narra l'ascesa oltre le Colonne d'Ercole fino a un regno lunare sospeso nel vuoto cosmico.",
    highlightQuote: "«Salpammo spinti da un tifone improvviso: per sette giorni e sette notti solcammo l'aria, finché scorgemmo una grande terra nell'aria, simile a un'isola lucente.»",
    readingTime: "7 min",
    content: `### L'Ascesa oltre il Limite del Mondo Conosciuto

Salpammo un tempo dalle Colonne d'Ercole, spinti dal desiderio ardente di apprendere dove terminasse l'Oceano e quali genti abitassero le terre di là dal mare. Per ottanta giorni la nostra nave fu squassata da tempeste furiose, finché un giorno, all'improvviso, un turbine vorticoso sollevò l'imbarcazione a un'altezza di circa tremila stadi.

Non ricademmo più nel mare: sospesi in alto da un vento costante che gonfiava le vele, navigammo attraverso l'etere per sette giorni e sette notti. All'ottavo giorno scorgemmo una grande terra sospesa nell'aria, rotonda e risplendente di una luce vividissima, simile a un'isola brillante nel buio.

### L'Approdamento sul Globo Lunare

Accostatoci a quella terra celeste, ormeggiammo la nave e sbarcammo per esplorarla. Il suolo era coltivato, morbido e cosparso di una polvere argentea che luccicava come brina sotto raggi sconosciuti. Ma scesa la notte, vedemmo molte altre isole fiammeggianti attorno a noi, alcune più grandi, altre più minute, di color del fuoco, e sotto di noi un'altra terra vasta, con città, fiumi, monti e foreste, che riconoscemmo essere la Terra da cui eravamo partiti.

Mentre eravamo intenti a contemplare questo prodigio, fummo circondati da creature straordinarie: i Cavalieri dei Grifi, guardie a cavallo di immensi uccelli a tre teste dalle ali spiegate, incaricati dal re Endimione di vigilare sui confini del regno lunare.

### Al Cospetto di Endimione

Condotti alla presenza del sovrano, Endimione ci osservò con benevolenza e comprese subito dalla foggia delle nostre vesti che eravamo mortali di stirpe greca. Ci offrì ospitalità e ci svelò la prodigiosa natura di quel mondo: lassù non vi sono donne, ma gli abitanti nascono dagli alberi celesti; non bevono acqua ordinaria, ma condensano il fumo di nubi aromatiche; nei loro occhi arde una facoltà che consente di rimirare la Terra come attraverso una lente trasparente.

> «Voi mortali credete che la Terra sia il centro di ogni respiro; ma nell'aria infinita vi sono innumerevoli mondi popolati da creature che guardano al vostro cielo con lo stesso attonito stupore con cui voi rimirate la Luna.» — *Luciano di Samosata*

### Il Ritorno verso l'Oceano

Dopo aver assistito alle contese celesti tra gli eserciti della Luna e quelli del Sole per la colonizzazione della Stella del Mattino (Venere), chiedemmo a Endimione il congedo. Il re ci colmò di doni, donandoci vesti di vetro filato e ampolle d'aria pura. Sciogliemmo le vele nel mare di nubi e, planando gradualmente attraverso i cerchi celesti, dopo giorni di volo ritornammo a posarci sulle acque salse del nostro mare terracqueo, custodi di una visione che la ragione degli uomini stenta a credere.`,
    sources: [
      {
        title: "Lucian of Samosata: A True Story (Verae Historiae) - Testo Classico Integrale",
        url: "https://www.gutenberg.org/ebooks/45858",
        publisher: "Project Gutenberg / Oxford Classical Texts",
        originalLanguage: "Greco Antico (Traduzione in Italiano)",
        keyFinding: "Considerata la prima opera documentata di proto-fantascienza e viaggio interplanetario nella letteratura mondiale."
      },
      {
        title: "Treccani: Luciano di Samosata e la nascita del racconto cosmico",
        url: "https://www.treccani.it/enciclopedia/luciano-di-samosata/",
        publisher: "Istituto dell'Enciclopedia Italiana Treccani",
        originalLanguage: "Italiano",
        keyFinding: "Analisi filologica della satira lucianea e della precorritrice intuizione di mondi extraterrestri abitati."
      }
    ]
  },
  {
    id: "racconto-gilgamesh-foresta-cedri",
    storyWorkTitle: "Epopea di Gilgamesh - La Spedizione nella Foresta dei Cedri e la Sfida a Humbaba",
    storyAuthor: "Anonimo Sumero-Babilonese (Tavole di Ninive)",
    storyYear: "circa 2100 a.C.",
    storyCulture: "Mesopotamica (Sumeri / Babilonesi)",
    storyOriginalCollection: "Tavole della Biblioteca Reale di Assurbanipal, Tavola IV-V",
    matchingInterests: ["Miti e Leggende dell'Antichità", "Archeologia Misteriosa e Luoghi Perduti", "Storia", "Piccolo Popolo e Creature del Folclore"],
    title: "Epopea di Gilgamesh: La Foresta dei Cedri e il Guardiano della Montagna Sacra",
    shortTitle: "Gilgamesh: La Foresta dei Cedri",
    excerpt: "Dalle prime tavolette incise a cuneiforme dell'umanità: Gilgamesh ed Enkidu attraversano le terre selvagge per affrontare l'antico guardiano titanico dei monti primordiali.",
    highlightQuote: "«Camminarono per cinquanta leghe, e quando giunsero ai piedi della Montagna Verde, rimasero immobili, contemplando la grandezza dei cedri.»",
    readingTime: "7 min",
    content: `### L'Inizio del Cammino verso la Montagna Sacra

Gilgamesh, re della possente Uruk dalle mura scintillanti, parlò al compagno Enkidu, l'uomo nato dalle terre selvagge: «Amico mio, non abbiamo ancora inciso il nostro nome sulla roccia della memoria eterna. Lassù, sulle montagne del Libano, sorge la Foresta dei Cedri che gli dèi hanno affidato al custode Humbaba, il cui ruggito è come il diluvio, la cui bocca sputa fuoco e il cui fiato è la morte. Andiamo a sfidarlo, e abbatteremo il cedro per portare a Uruk la gloria immutabile».

Enkidu, che conosceva la foresta sin dai giorni in cui errava con le gazzelle, sentì il cuore stringersi nel petto: «Io conosco quel regno d'ombre, Gilgamesh. Nessun mortale può penetrarvi senza che il terrore gli paralizzi le membra». Ma il re affilò l'ascia di bronzo, pesante trenta talenti, e insieme lasciarono le porte di Uruk.

### La Visione della Montagna Incantata

Marciarono per cinquanta leghe al giorno, compiendo in tre tappe un cammino che ai comuni viandanti richiede sei settimane. Giunti alla sesta giornata, raggiunsero le falde della Montagna dei Cedri, la dimora sacra dove gli Anunnaki pongono i loro troni segreti.

Rimasero muti, immobili, guardando l'altezza immensa degli alberi: i cedri si innalzavano dritti come colonne verso il cielo, gettando un'ombra densa, profumata di resina e incenso. Sentivano il canto degli uccelli selvatici che modulavano melodie antiche, e il fruscio di scimmie e caprioli che custodivano i sentieri erbosi. In quel silenzio primordiale, la montagna sembrava respirare.

### L'Apparizione del Titano Humbaba

Quando il primo fendente dell'ascia di Gilgamesh risuonò nella foresta, la terra tremò fin dalle radici. Dalle profondità dell'ombra emerse Humbaba: i suoi passi schiacciavano le querce, il suo sguardo gettava una coltre d'angoscia sul cuore degli eroi.

> «Perché avete varcato il confine proibito? Gli dèi mi hanno posto a guardia di questa selva affinché il silenzio della creazione non fosse infranto dal ferro degli uomini.» — *Epopea di Gilgamesh, Tavola V*

### Il Trionfo e il Prezzo del Fato

Fu allora che Shamash, il dio del Sole, mandò otto venti spaventosi dal cielo: il vento del nord, il vento del sud, la tempesta e il turbine che accecarono Humbaba sollevando una polvere rovente. Incapace di muoversi, il guardiano cadde trafitto ai piedi dei giganti. Abbattuto il guardiano, Gilgamesh tagliò il più alto tra i cedri per trarne la porta monumentale del tempio di Enlil a Nippur, incidendo per sempre la propria memoria nella pietra viva del mondo antico.`,
    sources: [
      {
        title: "The Epic of Gilgamesh - Standard Babylonian Version (British Museum)",
        url: "https://www.britishmuseum.org/collection/galleries/mesopotamia",
        publisher: "British Museum / Oxford University Press",
        originalLanguage: "Cuneiforme Sumero-Accadico (Tradotto in Italiano)",
        keyFinding: "Il testo letterario e mitologico più antico dell'umanità, conservato sulle tavolette d'argilla di Assurbanipal."
      },
      {
        title: "Treccani: L'Epopea di Gilgamesh e l'archetipo dell'eroe mesopotamico",
        url: "https://www.treccani.it/enciclopedia/epopea-di-gilgamesh/",
        publisher: "Istituto dell'Enciclopedia Italiana Treccani",
        originalLanguage: "Italiano",
        keyFinding: "Contestualizzazione archeologica e letteraria del ciclo di Gilgamesh e del viaggio oltre i confini del mondo civile."
      }
    ]
  },
  {
    id: "racconto-poe-discesa-maelstrom",
    storyWorkTitle: "Una discesa nel Maelström (A Descent into the Maelström)",
    storyAuthor: "Edgar Allan Poe",
    storyYear: "1841",
    storyCulture: "Letteratura Americana / Gotico e Razionale",
    storyOriginalCollection: "Graham's Lady's and Gentleman's Magazine (maggio 1841)",
    matchingInterests: ["Mistero", "Scienza", "Nuove Scoperte Scientifiche", "Archeologia Misteriosa e Luoghi Perduti"],
    title: "Una discesa nel Maelström: Il Naufragio nel Cuore del Vortice Primordiale",
    shortTitle: "Poe: Discesa nel Maelström",
    excerpt: "Sulle scogliere norvegesi delle Lofoten, un vecchio marinaio dai capelli imbiancati dal terrore racconta come la lucida osservazione della fisica lo salvò dall'abisso liquido del Moskenstraumen.",
    highlightQuote: "«Guardai dritto dentro l'abisso spalancato: il gorgo roteava con una pendenza vertiginosa e un boato che faceva piangere le scogliere.»",
    readingTime: "8 min",
    content: `### L'Incontro sulla Scogliera di Helseggen

Eravamo giunti sulla vetta del monte Helseggen, nella remota regione delle Lofoten, in Norvegia. La scogliera precipitava a picco nel mare scuro per oltre millecinquecento piedi. La guida, un uomo dal corpo spezzato e dai capelli candidi come la neve sebbene avesse meno di quarant'anni, si sedette sull'orlo del precipizio e mi indicò le onde sottostanti.

«Guardi laggiù, tra le isole di Mosken e Værøy», mi disse. Il mare, fino ad allora plumbeo e calmo, cominciò improvvisamente a ribollire come una gigantesca caldaia. Mille correnti invisibili si scontrarono con violenza inaudita, e nel giro di pochi minuti una voragine circolare, profonda più di un miglio, si spalancò nel ventre delle acque, ruggendo come una mandria di leoni selvaggi.

### Nel Ventre della Tempesta

«Sei anni fa, io e i miei due fratelli uscimmo con la nostra lancia da pesca verso le secche esterne. Al ritorno, l'orologio si fermò e il cielo fu oscurato da un uragano scaturito dal nulla. Prima che potessimo ammainare la randa, un'onda ciclopica spazzò il ponte portandosi via mio fratello minore.

Pochi istanti dopo, il mare si placò ma la lancia venne catturata da una forza silenziosa e mostruosa: fummo risucchiati lungo la spirale esterna del Maelström. Mio fratello maggiore, impazzito per il terrore, si aggrappò all'anello della barra di timone strappandomi con ferocia dal punto di salvezza. Io non provai odio per lui; compresi che il terrore cancella l'anima umana.

### La Scoperta della Legge dei Corpi Sospesi

Mentre scendevamo lungo le pareti levigate di quell'imbuto vertiginoso, che splendeva di un chiarore spettrale sotto i raggi della luna piena, compresi che la morte era inevitabile. Fu allora che la disperazione lasciò il posto a una singolare curiosità scientifica: guardai i relitti che danzavano attorno a noi nell'imbuto.

Notai un fenomeno stupefacente che rispondeva a una legge precisa della dinamica dei fluidi: i relitti più massicci, come i tronchi e i frammenti quadrati di navi, precipitavano per primi verso il fondo ruggente, mentre i corpi cilindrici leggeri scendevano con una lentezza straordinariamente maggiore.

> «Nel momento estremo in cui la ragione sembrava destinata a dissolversi, fu proprio il rigore dell'osservazione naturale a tracciarmi l'unica via di fuga dall'abisso.» — *Edgar Allan Poe*

### Il Salto nell'Abisso

Senza perdere un secondo, legai me stesso a un barile vuoto e cilindrico di quelli usati per la salamoia delle aringhe, e mi lanciai nel gorgo, lasciando che la barca con mio fratello continuasse la sua corsa verso la gola del mostro. La mia intuizione si rivelò esatta: la barca sprofondò nel nulla in pochi minuti, mentre il barile a cui ero assicurato rimase sospeso a mezza costa dell'imbuto fino a quando la marea non invertì il suo moto e il vortice si dissolse, riconsegnandomi vivo a pescatori che stentarono a riconoscere il mio volto trasfigurato.`,
    sources: [
      {
        title: "Edgar Allan Poe: A Descent into the Maelström - The Complete Works",
        url: "https://www.gutenberg.org/ebooks/2147",
        publisher: "Project Gutenberg / University of Virginia Library",
        originalLanguage: "Inglese (Tradotto in Italiano)",
        keyFinding: "Il capolavoro proto-scientifico di Poe che unisce terrore cosmico e calcolo fisico razionale."
      },
      {
        title: "Enciclopedia Britannica: The Lofoten Maelstrom (Moskenstraumen) and Poe's fiction",
        url: "https://www.britannica.com/topic/A-Descent-into-the-Maelstrom",
        publisher: "Encyclopaedia Britannica",
        originalLanguage: "Inglese",
        keyFinding: "Studio sulle reali correnti oceaniche di marea del canale Moskenstraumen che ispirarono il racconto."
      }
    ]
  },
  {
    id: "racconto-klingemann-veglie-bonaventura",
    storyWorkTitle: "Le veglie di Bonaventura (Nachtwachen von Bonaventura) - La Veglia del Guardiano Notturno",
    storyAuthor: "August Klingemann (Bonaventura)",
    storyYear: "1804",
    storyCulture: "Romantica Tedesca / Filosofica",
    storyOriginalCollection: "Nachtwachen von Bonaventura, Veglia I",
    matchingInterests: ["Ricerche sulla Coscienza (NDE, OOBE)", "Scienza dello Spirito", "Cultura", "Storia"],
    title: "Le veglie di Bonaventura: La Notte del Guardiano e il Teatro delle Anime",
    shortTitle: "Bonaventura: Il Guardiano Notturno",
    excerpt: "Nella quiete sepolcrale di una città addormentata, il guardiano notturno veglia sui tetti, osservando il fragile confine tra la veglia del corpo e il risveglio dello spirito interiore.",
    highlightQuote: "«Cammino solitario sui camminamenti della notte: là sotto gli uomini dormono e sognano di essere re o mendicanti, dimentichi che al mattino il sipario cadrà per tutti.»",
    readingTime: "7 min",
    content: `### Il Canto della Mezzanotte sui Tetti della Città

Batto con la mia picca sul selciato d'arenaria e il rintocco risuona per le vie deserte della vecchia città gotica. È scoccata la mezzanotte: l'ora in cui le leggi del giorno tacciono e la notte apre il suo tribunale silenzioso. Io sono il guardiano Kreuzgang, colui che resta desto quando l'intero mondo chiude le palpebre e cade nell'oblio.

Dall'alto del campanile guardo verso il basso: le case con i tetti a spiovente sembrano bare allineate sotto la luce fredda della luna. Là dentro riposano i potenti accanto ai miserabili, il filosofo accanto al pazzo. Nel sonno nessuno di loro è migliore dell'altro: respirano lo stesso fiato fragile, sospesi sul ciglio del nulla.

### Il Risveglio Interiore e il Teatro delle Illusioni

Mentre sorveglio le strade vuote, odo a tratti gemiti lontani o risate sommesse che fuoriescono dalle finestre socchiuse: sono i sogni che scuotono le anime prigioniere della carne. Quale prodigio è mai questo, che l'uomo per sentirsi vivo debba dimenticare se stesso ogni notte?

Mi fermo davanti al cimitero monumentale della cattedrale, dove le croci di pietra proiettano ombre sottili come dita verso l'oriente. È qui che lo spirito comprende la propria natura incorporea: quando la vista esteriore si spegne, si accende un occhio interiore capace di misurare l'illusione del tempo terreno.

> «Tutto ciò che di giorno chiamiamo certezza, potere o ricchezza non è che una recita di marionette; solo la notte solitaria restituisce alla coscienza la sua vera patria infinita.» — *August Klingemann (Bonaventura)*

### L'Attesa della Prima Luce

L'alba comincia a tingere di cenere e viola la linea dell'orizzonte orientale. Una campana lontana annuncia la fine del mio turno di guardia. Gli artigiani cominciano a spalancare le persiane, i cavalli scalpitano sulle pietre della piazza, e la grande commedia umana riprende il suo corso effimero. Io ripongo il mio corno d'ottone e sorrido in silenzio, custode dei segreti che la luce del giorno non saprà mai spiegare.`,
    sources: [
      {
        title: "Bonaventura (August Klingemann): Nachtwachen - Testo Critico",
        url: "https://www.gutenberg.org/ebooks/15456",
        publisher: "Project Gutenberg / Reclam Bibliothek",
        originalLanguage: "Tedesco (Traduzione in Italiano)",
        keyFinding: "Uno dei vertici più enigmatici della letteratura filosofica del romanticismo europeo."
      },
      {
        title: "Adelphi: Le veglie di Bonaventura e l'enigma della coscienza",
        url: "https://www.adelphi.it/",
        publisher: "Adelphi Edizioni",
        originalLanguage: "Italiano",
        keyFinding: "Riflessione critica sul capolavoro anonimo dell'Ottocento tedesco e la sua attualità sulla natura della coscienza."
      }
    ]
  },
  {
    id: "racconto-homer-discesa-ade",
    storyWorkTitle: "Odissea - Il Libro dei Morti e l'Incontro nell'Erebo (Nékyia)",
    storyAuthor: "Omero",
    storyYear: "VIII secolo a.C.",
    storyCulture: "Greca Arcaica / Mitologia Classica",
    storyOriginalCollection: "Odissea, Canto XI (vv. 23-224)",
    matchingInterests: ["Miti e Leggende dell'Antichità", "Ricerche sulla Coscienza (NDE, OOBE)", "Storia/Mito", "Cultura"],
    title: "Odissea (Canto XI): La Discesa di Odisseo nell'Erebo e il Dialogo con l'Ombra di Tiresia",
    shortTitle: "Omero: La Discesa nell'Ade",
    excerpt: "Ai confini dell'Oceano profondo, avvolto da nebbie perenni, Odisseo compie il rito della fossa di sangue per interrogare le ombre dei trapassati sul destino del suo ritorno a Itaca.",
    highlightQuote: "«Giungemmo ai confini dell'Oceano profondo, dove i Cimmeri vivono avvolti da nebbie eterne, senza che mai il Sole splendente li conforti con la sua luce.»",
    readingTime: "8 min",
    content: `### Ai Limiti dell'Oceano Profondo

Spinte dal vento di Borea, le nostre prore raggiunsero infine l'estremo lembo delle acque del mondo, là dove il fiume Oceano riversa le sue correnti nell'abisso. Lì sorge la terra desolata dei Cimmeri, un popolo avvolto da una notte perenne e da nubi senza fine; né il Sole splendente quando ascende verso il cielo stellato, né quando dalla volta scende verso la Terra, volge mai il suo raggio su quelle coste oscure.

Sbarcammo sul greto sabbioso e ci incamminammo lungo il corso dell'acqua fino a raggiungere il luogo indicatoci dalla maga Circe: là dove l'Acheronte accoglie le fiamme del Flegetonte e i gorghi gelidi del Cocito, ai piedi di un'alta roccia a picco.

### Il Rito della Fossa e l'Affollarsi delle Ombre

Scavai col ferro della mia spada una fossa larga un cubito per ogni lato e vi versai la libagione per tutti i trapassati: prima latte e miele, poi vino soave, e per terza acqua pura, cospargendovi sopra farina d'orzo candida. Poi immolai i due montoni neri, lasciando che il sangue scuro colasse nella fossa scavata.

Subito dalle profondità dell'Erebo accorsero le ombre di coloro che non sono più: spose giovani, vecchi affranti da lunghi affanni, fanciulli teneri dal cuore ancora ignaro e guerrieri trafitti dal bronzo con le armi lorde di sangue. Volitavano attorno alla fossa con un mormorio stridente che mi ghiacciò il sangue nelle vene; ma io, tenendo sguainata la spada lucente, impedii alle ombre di accostarsi al sangue prima che avessi interrogato il vate Tiresia.

### La Profezia dell'Indovino Tebano

Venne infine l'ombra di Tiresia, reggendo uno scettro d'oro puro. Bevve del sangue scuro e subito riconobbe il mio volto: «Odisseo, figlio di Laerte, accorto re di Itaca, perché hai lasciato la luce del sole per contemplare la dimora dei morti dove non v'è letizia? Tu cerchi un ritorno dolce sul mare, ma un dio potente, Enosigeo Poseidone, ti renderà amaro il cammino per aver accecato il suo diletto figlio Polifemo».

> «Ma se saprai frenare il tuo animo e quello dei compagni quando approderete all'isola Trinacria, giungerai infine a Itaca, seppure solo, su nave straniera, per ritrovare la tua casa invasa dall'arroganza.» — *Odissea, Canto XI*

### L'Abbraccio Mancato con la Madre

Dopo Tiresia, si fece avanti la madre mia, Anticlea, che avevo lasciato ancora viva quando partii per le rive di Troia. Tre volte mi slanciai in avanti, col cuore gonfio di pianto, desideroso di stringerla al petto; e per tre volte la sua immagine sfuggì dalle mie braccia come un soffio o un sogno fuggevole. «Madre mia», gridai, «perché mi sfuggi?». Ed ella mi rispose che tale è la legge dei mortali quando muoiono: i nervi non legano più le ossa e la carne, e l'anima come un'ala leggera vola via via solitaria nel silenzio.`,
    sources: [
      {
        title: "Omero: Odissea (Canto XI - Nékyia) - Fondazione Lorenzo Valla / Mondadori",
        url: "https://www.treccani.it/enciclopedia/odissea/",
        publisher: "Lorenzo Valla / Treccani",
        originalLanguage: "Greco Antico (Tradotto in Italiano)",
        keyFinding: "Il prototipo universale del viaggio catabatico dell'eroe e dell'indagine sul regno dell'invisibile."
      },
      {
        title: "Perseus Digital Library: Homer's Odyssey, Book 11",
        url: "https://www.perseus.tufts.edu/",
        publisher: "Tufts University / Perseus Collection",
        originalLanguage: "Greco Antico",
        keyFinding: "Edizione filologica e commento storico-mitologico al testo omerico dell'evocazione dei morti."
      }
    ]
  },
  {
    id: "racconto-plato-mito-er",
    storyWorkTitle: "La Repubblica (Politeia) - Il Mito di Er e il Viaggio dell'Anima",
    storyAuthor: "Platone",
    storyYear: "circa 375 a.C.",
    storyCulture: "Greca Classica / Filosofica",
    storyOriginalCollection: "La Repubblica, Libro X (614b-621d)",
    matchingInterests: ["Ricerche sulla Coscienza (NDE, OOBE)", "Scienza dello Spirito", "Miti e Leggende dell'Antichità", "Cultura"],
    title: "Il Mito di Er: L'Esperienza oltre la Morte e il Fuso di Ananke",
    shortTitle: "Platone: Il Mito di Er",
    excerpt: "La prima grande narrazione di una Near-Death Experience documentata nella filosofia occidentale: Er di Panfilia muore sul campo di battaglia e torna dodici giorni dopo a raccontare ciò che vide oltre la vita.",
    highlightQuote: "«Rimasto ucciso in battaglia, dopo dieci giorni fu raccolto intatto sul campo; e giunto al dodicesimo giorno sulla pira funebre, tornò in vita e narrò ciò che aveva scorto nell'altro mondo.»",
    readingTime: "8 min",
    content: `### Il Risveglio sulla Pira Funebre

Er, figlio di Armenio, originario della Panfilia, cadde ucciso in una dura battaglia. Quando dieci giorni dopo i corpi dei caduti furono raccolti già decomposti, il suo cadavere fu trovato prodigiosamente incorrotto. Condotto a casa per le esequie, al dodicesimo giorno, proprio mentre si trovava deposto sulla pira di legna per essere arso, riaprì improvvisamente gli occhi e, tra lo sgomento dei presenti, cominciò a descrivere il viaggio compiuto dalla sua anima.

Non appena uscito dal corpo, narrò Er, la sua coscienza si era unita a una grande moltitudine di spiriti in cammino, fino a giungere in una radura luminosa dove si aprivano quattro voragini misteriose: due nella terra, e due contrapposte nella volta celeste.

### I Giudici e i Due Cammini

Sedevano in quel luogo supremo giudici incorruttibili che, dopo aver esaminato la vita trascorsa da ciascuna anima, apponevano sul petto dei giusti una targa luminosa indirizzandoli lungo il cammino che saliva a destra attraverso le sfere del cielo; agli ingiusti, invece, veniva imposto sul dorso il sigillo delle colpe commesse, ed essi dovevano intraprendere il cammino sotterraneo a sinistra per purificarsi attraverso le pene del rimorso.

A Er, tuttavia, i custodi ingiunsero di non oltrepassare le soglie: «Tu sei stato prescelto come messaggero per gli uomini: osserva attentamente ogni cosa per riferire ai mortali quale sia il destino che li attende oltre la frontiera del corpo».

### Il Fuso di Luce e le Tre Parche

Dopo sette giorni di permanenza nella prateria cosmica, le anime furono condotte alla presenza della Necessità (Ananke). Al centro del cosmo splendeva una colonna diritta di luce pura, simile a un arcobaleno ma immensamente più viva, che attraversava l'universo intero.

Da quella colonna pendeva il Fuso della Necessità, formato da otto cerchi concentrici che ruotavano armoniosamente producendo un'unica sinfonia perfetta, la musica delle sfere. Sedute in trono attorno al fuso stavano le tre Moire figlie della Notte: Cloto che canta il presente, Lachesi che canta il passato, e Atropo che canta il futuro ineluttabile.

> «Non sarà il demone a scegliere la vostra sorte, ma sarete voi stessi a scegliere il vostro destino: la virtù non ha padrone; chi la onorerà ne avrà di più, chi la disprezzerà ne avrà di meno. La responsabilità è di chi sceglie; il dio non è colpevole.» — *Platone, La Repubblica, Libro X*

### Il Fiume Amelete e la Rinascita

Presentate al cospetto di Lachesi, le anime furono invitate a scegliere la loro prossima vita terrena tra una moltitudine di modelli d'esistenza sparsi sul prato: vite di tiranni, vite di umili operai, vite di saggi e vite di animali. Er vide uomini un tempo potenti scegliere per avidità il destino tragico di sovrani odiati, e vide Odisseo, rinsavito dalle fatiche dell'ambizione, cercare a lungo l'esistenza dimenticata di un semplice contadino sereno. Scelta la vita, le anime furono condotte attraverso la pianura infuocata del Lete per bere l'acqua del fiume Amelete, che cancella ogni ricordo terreno, per poi saettare come stelle cadenti verso i grembi delle madri, mentre a Er fu impedito di bere affinché la memoria della verità rimanesse viva tra gli uomini.`,
    sources: [
      {
        title: "Platone: La Repubblica (Libro X - Mito di Er) - Bompiani / Testi a fronte",
        url: "https://www.treccani.it/enciclopedia/repubblica-di-platone/",
        publisher: "Bompiani / Istituto Treccani",
        originalLanguage: "Greco Antico (Tradotto in Italiano)",
        keyFinding: "La più celebre narrazione filosofica dell'antichità sulla sopravvivenza della coscienza alla morte biologica."
      },
      {
        title: "Stanford Encyclopedia of Philosophy: Plato's Myth of Er and Metempsychosis",
        url: "https://plato.stanford.edu/entries/plato-myths/",
        publisher: "Stanford University",
        originalLanguage: "Inglese",
        keyFinding: "Analisi ermeneutica e comparativa sul rapporto tra esperienza di pre-morte e dottrina etica della scelta."
      }
    ]
  },
  {
    id: "racconto-maupassant-horla",
    storyWorkTitle: "L'Horla (Le Horla)",
    storyAuthor: "Guy de Maupassant",
    storyYear: "1887",
    storyCulture: "Francese / Racconto Fantastico e Psicologico",
    storyOriginalCollection: "Le Horla (Editions Ollendorff, Parigi 1887)",
    matchingInterests: ["Mistero", "UFO e Alieni", "Scienza dello Spirito", "Cultura"],
    title: "L'Horla: L'Invisibile Presenza che Abita tra le Ombre della Mente",
    shortTitle: "Maupassant: L'Horla",
    excerpt: "Sulle rive della Senna a Rouen, un gentiluomo registra nel suo diario l'avvento di un'entità immateriale sconosciuta venuta dal mare che piega la volontà umana senza mai mostrare il proprio volto.",
    highlightQuote: "«Un essere invisibile esiste dunque accanto a noi! Egli non beve che la nostra acqua, non respira che il nostro fiato, e ci comanda col pensiero come noi comandiamo ai cani.»",
    readingTime: "8 min",
    content: `### 8 Maggio: La Calma che Precede la Bufera

Che giornata deliziosa! Ho trascorso l'intera mattinata disteso sull'erba davanti alla mia casa di campagna a Biessard, vicino a Rouen. La Senna scorreva scintillante sotto il sole, e ho ammirato un magnifico tre alberi brasiliano, tutto bianco, che risaliva maestoso la corrente verso il porto. Lo salutai con gioia, sentendomi pervaso da un benessere assoluto. Non sapevo ancora quale maledizione fosse custodita a bordo di quel vascello straniero.

### 2 Giugno: L'Inizio dell'Assedio Invisibile

Da qualche settimana soffro di una febbre strana e opprimente. Non provo dolore fisico, ma un'angoscia indefinibile mi stringe la gola non appena cala il crepuscolo. Quando mi addormento, vengo svegliato da incubi atroci: sento chiaramente che qualcuno si accosta al mio letto nell'oscurità, si china su di me, appoggia la bocca sulla mia bocca e comincia a **bere il mio fiato**.

Mi risveglio grondante di sudore freddo, cerco a tastoni una candela, guardo nella stanza vuota: non c'è nessuno. Eppure la caraffa d'acqua che lascio ogni sera piena sul comodino al mattino è vuota fino all'ultima goccia.

### 19 Agosto: L'Esperimento dello Specchio

Ho fatto sigillare le porte e ho cosparso di farina il pavimento della mia camera. L'acqua è sparita di nuovo, ma non vi è alcuna orma sulla farina! Ieri ho avuto la prova definitiva: ero seduto alla scrivania, fingendo di leggere con la testa reclinata sulle pagine.

Dietro di me, sopra il camino, si trova un grande specchio veneziano. Mi sono girato di scatto per sorprendere l'essere alle mie spalle: nello specchio la stanza era illuminata a giorno, vedevo il letto, le sedie, la tenda scura... **ma la mia figura non c'era!** Un velo trasparente, una nebbia opaca e informe nascondeva la mia immagine riflessa, come se un corpo incorporeo si frapponesse tra me e il vetro.

> «Come l'uomo un tempo dominò le bestie della selva, così è giunto sul pianeta un nuovo padrone: colui che non vediamo, ma che vede noi; colui che la materia non può arrestare: l'Horla!» — *Guy de Maupassant*

### Il Nome del Dominatore

Ho letto sui giornali di una misteriosa epidemia che sta colpendo la provincia di San Paolo in Brasile: la gente impazzisce sentendosi dominata da presenze aeree che obbediscono a una volontà aliena. Ora capisco: il veliero brasiliano che ho salutato l'8 maggio ha portato l'entità fin sulla mia riva! Egli è qui, nella mia stanza, mi osserva mentre scrivo queste righe. Non posso più fuggire; appartengo all'invisibile.`,
    sources: [
      {
        title: "Guy de Maupassant: Le Horla - Bibliothèque nationale de France (Gallica)",
        url: "https://gallica.bnf.fr/ark:/12148/bpt6k1025547q",
        publisher: "Gallica / Bibliothèque nationale de France",
        originalLanguage: "Francese (Tradotto in Italiano)",
        keyFinding: "La vetta indiscussa della narrativa fantastica ottocentesca sul tema dell'entità invisibile aliena."
      },
      {
        title: "Treccani: Maupassant e la dissoluzione della ragione fantastica",
        url: "https://www.treccani.it/enciclopedia/guy-de-maupassant/",
        publisher: "Istituto dell'Enciclopedia Italiana Treccani",
        originalLanguage: "Italiano",
        keyFinding: "Studio critico sulla trasposizione dell'angoscia della dominazione psichica e pre-fantascientifica."
      }
    ]
  },
  {
    id: "racconto-yeats-celtic-twilight",
    storyWorkTitle: "Il crepuscolo celtico (The Celtic Twilight) - Il Piccolo Popolo delle Selve d'Irlanda",
    storyAuthor: "William Butler Yeats",
    storyYear: "1893",
    storyCulture: "Irlandese / Tradizione Folclorica Celtica",
    storyOriginalCollection: "The Celtic Twilight: Men and Women, Dhouls and Faeries (Lawrence & Bullen, Londra 1893)",
    matchingInterests: ["Piccolo Popolo e Creature del Folclore", "Folclore", "Miti e Leggende dell'Antichità", "Cultura"],
    title: "Il crepuscolo celtico: Gli Incontri Notturni con la Buona Gente di Sligo",
    shortTitle: "Yeats: Il Piccolo Popolo d'Irlanda",
    excerpt: "Sotto le querce centenarie di Drumcliff e le alture nebbiose del Ben Bulben, William Butler Yeats raccoglie le testimonianze orali di contadini e pescatori che hanno incrociato le danze dei Sidhe.",
    highlightQuote: "«Non sono fantasmi di morti, né demoni scaturiti dalla terra: sono i Sidhe, la gente antica che danzava sui prati prima ancora che il ferro conoscesse la ruggine.»",
    readingTime: "7 min",
    content: `### Le Colline Incantate della Contea di Sligo

Chiunque abbia camminato al tramonto tra i laghi e le torbiere della contea di Sligo, sotto l'ombra maestosa del monte Ben Bulben, sa che in quella terra il confine tra ciò che si vede e ciò che si avverte è sottile come una ragnatela posata sulla rugiada. Là il tempo moderno non ha mai cancellato la memoria della *Buona Gente* (*The Good People*), gli antichi abitanti fatati delle colline cave.

I vecchi pescatori di Rosses Point non parlano di loro per superstizione puerile, ma con il rispetto doveroso che si deve a vicini potenti e guardinghi, capaci di regalare favolose melodie a chi cammina col cuore puro o di confondere i sentieri di chi si mostra arrogante.

### La Notte delle Danze al Crocevia

Un contadino che conoscevo, Paddy Flynn di Ballisodare, un uomo mite che visse oltre novant'anni senza mai calzare scarpe strette, mi raccontò di una notte di mezza estate in cui tornava a piedi da una fiera attraverso la brughiera. Giunto nei pressi di un rath circolare, un antico tumulo dell'Età del Bronzo, sentì levarsi dall'erba una musica d'arpa così dolce e struggente che i suoi piedi rifiutarono di proseguire.

Affacciatosi dietro una siepe di biancospino, scorse decine di creature dalle vesti d'argento e verde smeraldo, alte poco più di due palmi ma dai volti fieri e regali, che danzavano in cerchi perfetti senza piegare un solo stelo d'avena selvatica.

> «Gli dèi delle antiche razze non sono morti: si sono soltanto fatti più piccoli e segreti, trovando rifugio nel cuore delle colline e negli angoli dove l'uomo moderno non osa inoltrarsi da solo.» — *William Butler Yeats*

### Il Dono del Silenzio

Paddy rimase ad ascoltare quella melodia celestiale per quella che gli parve mezz'ora; ma quando la prima luce del giorno disperse le ombre e i Sidhe svanirono nelle fenditure del tumulo, si accorse che il sole sorgeva dalla parte opposta del cielo: tre giorni e tre notti erano trascorsi mentre la sua mente era rimasta rapita da quell'armonia. Da quella notte, Paddy non conobbe più l'angoscia né l'inquietudine terrena, conservando nello sguardo la pace luminosa di chi ha toccato il bordo dell'eternità.`,
    sources: [
      {
        title: "William Butler Yeats: The Celtic Twilight - Complete Text (1893)",
        url: "https://www.gutenberg.org/ebooks/2527",
        publisher: "Project Gutenberg / Oxford University Press",
        originalLanguage: "Inglese (Tradotto in Italiano)",
        keyFinding: "La raccolta seminale in cui il Premio Nobel irlandese trascrisse le tradizioni orali del piccolo popolo."
      },
      {
        title: "National Library of Ireland: The Life and Works of William Butler Yeats",
        url: "https://www.nli.ie/",
        publisher: "National Library of Ireland",
        originalLanguage: "Inglese",
        keyFinding: "Archivio storico dei manoscritti di Yeats sul folclore celtico e le testimonianze popolari di Sligo."
      }
    ]
  },
  {
    id: "racconto-apuleio-amore-psiche",
    storyWorkTitle: "Le Metamorfosi (L'asino d'oro) - La Favola di Amore e Psiche",
    storyAuthor: "Apuleio",
    storyYear: "circa 170 d.C.",
    storyCulture: "Romana d'Africa / Mitologia e Iniziazione Misterica",
    storyOriginalCollection: "Metamorphoseon libri XI, Libri IV-VI",
    matchingInterests: ["Miti e Leggende dell'Antichità", "Storia/Mito", "Cultura", "Scienza dello Spirito"],
    title: "Le Metamorfosi: La Favola di Amore e Psiche e la Lampada dell'Invisibile",
    shortTitle: "Apuleio: Amore e Psiche",
    excerpt: "Dalla più celebre favola filosofica dell'antichità romana: Psiche, mortale di sfolgorante bellezza, sposa nell'oscurità un dio invisibile e infrange il patto accendendo la lucerna del sapere.",
    highlightQuote: "«In una città vivevano un re e una regina che avevano tre figlie bellissime; ma la più giovane, Psiche, possedeva una grazia così luminosa che la voce umana non era degna di lodarla.»",
    readingTime: "8 min",
    content: `### Il Palazzo delle Voci Invisibili

Condotta sulla cima di un'alta rupe selvaggia secondo l'oscuro oracolo di Apollo Milesio, Psiche, abbandonata dalla sua gente a quello che credeva un mostro fatale, sentì levarsi un alito soave di Zefiro che gonfiò le sue vesti e la depose dolcemente nel grembo di una valle fiorita.

Là sorgeva un palazzo magnifico, non edificato da mani umane ma da un'arte divina: colonne d'oro zecchino, pareti d'argento cesellate con animali silvestri e pavimenti intarsiati di pietre preziose. Nessun servo o guardia presidiava le porte, ma voci limpide e incorporee la accolsero chiamandola per nome: «Entra, o signora; tutto ciò che vedi è tuo; noi siamo le tue serve invisibili».

### Lo Sposo Misterioso e il Patto Notturno

Quando scese la notte e il sonno la colse, uno sposo sconosciuto si accostò al suo talamo. Psiche non poteva scorgerne le fattezze nel buio assoluto, ma la sua voce era dolce come il miele e le sue carezze colme di tenerezza. Prima che la prima luce dell'alba tingesse il cielo, l'amante misterioso ripartiva precipitosamente.

Per molte notti questo prodigio si ripeté, e lo sposo la ammonì con parole accorate: «Psiche, tenera sposa, non cercare mai di scorgere il mio volto, né cedere alle insidie delle tue sorelle invidiose: se vedrai il mio aspetto divino, il nostro patto d'amore sarà infranto e mi perderai per sempre».

### Il Lampo della Verità e la Goccia d'Olio

Ma le sorelle di Psiche, corrose dall'invidia per quella reggia incantata, instillarono nella fanciulla il terrore che il compagno notturno fosse un serpente velenoso pronto a divorarla. Una notte, vinta dalla curiosità e dal dubbio, Psiche attese che lo sposo dormisse profondamente; prese allora una lucerna a olio e un affilato rasoio, nascondendoli sotto una coltre.

Quando la luce della fiammella ruppe le tenebre della stanza, Psiche vide ciò che nessun mortale aveva mai contemplato: non un mostro alato, ma il più radioso tra tutti gli dèi, **Cupido in persona**, con la chioma bionda profumata d'ambrosia e due ali candide dalle piume iridescenti come la rugiada mattutina.

> «Nel tremito della mano che reggeva la lucerna, una goccia d'olio bollente cadde sulla spalla destra del dio: egli si svegliò ferito, comprese il tradimento della fede promessa, e volò via nell'etere piangendo la fragilità della passione umana.» — *Apuleio, Metamorfosi*

### Le Prove e l'Immortalità

Iniziò così il doloroso pellegrinaggio di Psiche attraverso il mondo per riconquistare lo sposo perduto. Sottomessa alla gelosa Venere, affrontò prove sovrumane: separare una montagna di semi minuti con l'aiuto delle formiche pietose, raccogliere i fiocchi d'oro dal vello delle pecore furiose e discendere fin nel regno infero di Proserpina per chiedere l'ampolla della bellezza. Vinte tutte le prove grazie alla purezza della sua devozione, Giove ne ebbe compassione e le offrì la coppa dell'ambrosia divina, donandole l'immortalità per unirla in eterno ad Amore.`,
    sources: [
      {
        title: "Apuleio: Le Metamorfosi (L'asino d'oro) - Fondazione Lorenzo Valla / Mondadori",
        url: "https://www.treccani.it/enciclopedia/apuleio/",
        publisher: "Mondadori / Lorenzo Valla",
        originalLanguage: "Latino (Tradotto in Italiano)",
        keyFinding: "La più alta allegoria iniziatica del mondo classico sul connubio tra anima razionale (Psiche) e slancio divino (Amore)."
      },
      {
        title: "The Latin Library: Apuleius - Metamorphoses Liber IV-VI",
        url: "https://www.thelatinlibrary.com/apuleius.html",
        publisher: "The Latin Library",
        originalLanguage: "Latino",
        keyFinding: "Edizione latina originale integrale dei capitoli dedicati alla fabula di Amore e Psiche."
      }
    ]
  }
];

export function isShortStoryTopic(topic: string, category: string): boolean {
  if (!topic && !category) return false;
  const t = (topic || "").toLowerCase();
  const c = (category || "").toLowerCase();
  return (
    t.includes("narrativa breve") ||
    t.includes("racconto") ||
    t.includes("racconti") ||
    t.includes("short story") ||
    (c.includes("cultura") && t.includes("narrativa")) ||
    (c.includes("letteratura") && t.includes("racconto"))
  );
}

export function getCuratedShortStory(
  matchingTopicOrCategory: string,
  seed: number,
  excludeTitles: string[] = []
): CuratedShortStory {
  const normExcludes = (excludeTitles || []).map(t =>
    (t || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "")
  );

  const available = CURATED_PUBLIC_DOMAIN_STORIES.filter(s => {
    const normT = (s.title + " " + s.storyWorkTitle)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "");
    return !normExcludes.some(ex => ex.length > 5 && normT.includes(ex));
  });

  const pool = available.length > 0 ? available : CURATED_PUBLIC_DOMAIN_STORIES;

  // Cerca un racconto affine ai temi passati
  if (matchingTopicOrCategory) {
    const term = matchingTopicOrCategory.toLowerCase();
    const matched = pool.filter(s =>
      s.matchingInterests.some(m => m.toLowerCase().includes(term) || term.includes(m.toLowerCase()))
    );
    if (matched.length > 0) {
      const idx = Math.abs(seed) % matched.length;
      return matched[idx];
    }
  }

  const idx = Math.abs(seed) % pool.length;
  return pool[idx];
}

export function formatStoryAsArticle(
  story: CuratedShortStory,
  dateFormatted: string,
  index: number
): Article {
  return {
    id: `story-${story.id}-${Date.now()}`,
    pageNumber: index + 2,
    category: "Cultura",
    topicRef: "Narrativa Breve",
    title: story.title,
    shortTitle: story.shortTitle,
    excerpt: story.excerpt,
    content: story.content,
    readingTime: story.readingTime,
    author: `${story.storyAuthor} (${story.storyYear})`,
    date: dateFormatted || "Oggi",
    highlightQuote: story.highlightQuote,
    originalLanguage: story.storyCulture,
    isCondensedBook: false,
    isShortStory: true,
    storyWorkTitle: story.storyWorkTitle,
    storyAuthor: story.storyAuthor,
    storyYear: story.storyYear,
    storyCulture: story.storyCulture,
    storyOriginalCollection: story.storyOriginalCollection,
    sources: story.sources
  };
}
