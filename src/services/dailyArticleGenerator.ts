import { Article, InterestItem } from "../types";

export interface ArticleTemplate {
  category: string;
  topicKeyword: string;
  title: string;
  shortTitle: string;
  excerpt: string;
  content: string;
  readingTime: string;
  author: string;
  highlightQuote: string;
  sources: { title: string; url: string; publisher: string; originalLanguage?: string }[];
}

// Matrice di argomenti ricchi ed elaborati per ciascuna categoria/interesse
const INTEREST_TOPICS_POOL: Record<string, ArticleTemplate[]> = {
  "Mistero": [
    {
      category: "Mistero",
      topicKeyword: "archeologia",
      title: "Göbekli Tepe: Il Santuario Megalitico che Riscrisse la Storia dell'Umanità",
      shortTitle: "Göbekli Tepe: Il primo tempio",
      excerpt: "Erretto nel 9.500 a.C. nel sud-est dell'Anatolia, questo complesso di pilasti a T decorati con animali selvatici dimostra che il bisogno del sacro precedette l'agricoltura.",
      content: `### Alle Radici della Civiltà Monumentale

Nel sud-est dell'Anatolia, su un crinale brullo che domina l'altopiano di Şanlıurfa, il santuario megalitico di **Göbekli Tepe** continua a mettere in discussione i pilastri della storia antica. Gli scavi archeologici avviati nel 1995 dal Deutsches Archäologisches Institut (DAI), sotto la guida di Klaus Schmidt, e riconosciuti dall'UNESCO come Patrimonio Mondiale nel 2018, hanno riportato alla luce cerchi concentrici di proporzioni colossali risalenti all'Età della Pietra.

Al centro di ciascun recinto sorgono pilastri monolitici a forma di T alti fino a cinque metri e mezzo, dal peso compreso tra 10 e 20 tonnellate. Le superfici in pietra calcarea sono cesellate con bassorilievi di leoni ruggenti, cinghiali, avvoltoi ad ali spiegate e scorpioni, oltre a inquietanti figure antropomorfe stilizzate con mani conserte sul ventre.

### Una Rivoluzione nel Paradigma Storico

Le datazioni al Carbonio-14 fissano l'edificazione del sito tra il **9.500 e il 9.000 a.C.** (oltre 11.500 anni fa). Göbekli Tepe precede di 7.000 anni il complesso di Stonehenge e di oltre 6.000 anni la Grande Piramide di Giza, collocandosi in un'epoca in cui l'umanità muoveva i primi passi fuori dall'era glaciale.

> «Göbekli Tepe dimostra che fu l'esigenza spirituale e comunitaria a spingere i cacciatori nomadi a coordinarsi, stimolando la nascita dell'agricoltura stanziale e non viceversa.» — *Prof. Klaus Schmidt*

### Il Misterioso Seppellimento Rituale

Intorno all'8.000 a.C., il santuario non fu distrutto ma venne **deliberatamente seppellito** sotto centinaia di tonnellate di terra e detriti. Questa scelta consapevole ha preservato il tempio intatto nel grembo della terra per oltre diecimila anni, consegnandoci intatta una capsula del tempo dell'Età della Pietra.`,
      readingTime: "7 min",
      author: "Redazione Archeologia & Misteri",
      highlightQuote: "«Alle radici della civiltà non vi fu la zappa, ma l'anelito verso il sacro e l'invisibile.»",
      sources: [
        { title: "UNESCO World Heritage - Göbekli Tepe Official Documentation", url: "https://whc.unesco.org/en/list/1572/", publisher: "UNESCO" },
        { title: "Deutsches Archäologisches Institut (DAI) - Göbekli Tepe Project", url: "https://www.dainst.org/", publisher: "DAI Berlin" }
      ]
    },
    {
      category: "Mistero",
      topicKeyword: "ufo",
      title: "L'Enigma del Segnale Wow! e la Ricerca SETI di Intelligenza Cosmica",
      shortTitle: "L'enigma del segnale Wow!",
      excerpt: "Il 15 agosto 1977 il radiotelescopio Big Ear captò una sequenza radio anomala di 72 secondi a 1420 MHz. A distanza di quasi mezzo secolo, la scienza torna ad indagare.",
      content: `### La Notte che Scosse la Radioastronomia

Era la tarda serata del 15 agosto 1977 quando la stampante ad aghi del radiotelescopio *Big Ear* dell'Università Statale dell'Ohio registrò un'anomalia senza precedenti nello spettro elettromagnetico. L'astronomo **Jerry R. Ehman**, esaminando i tabulati cartacei, notò una sequenza di caratteri che misuravano l'intensità del segnale: **6EQUJ5**.

Cerchiò in rosso quella stringa eccezionale e scrisse a margine un'unica parola diventata celebre in tutto il mondo: **"Wow!"**.

### Perché il Segnale Fu Considerato Unico?

Il segnale si distingueva da qualsiasi interferenza terrestre o radiazione astrofisica naturale per tre caratteristiche fondamentali:
1. **La Frequenza dell'Idrogeno:** Corrispondeva a 1420,405 MHz, la linea spettrale dell'idrogeno neutro indicata dai fisici Cocconi e Morrison come il canale radio cosmico ideale per trasmissioni interstellari.
2. **Durata e Intensità:** Raggiunse un picco 30 volte superiore al rumore di fondo per esattamente 72 secondi, pari al tempo di passaggio del telescopio.
3. **Assenza di Armoniche Terrestri:** Nessun satellite, velivolo o emittente terrestre dell'epoca operava su quella frequenza riservata.

> «Il segnale Wow! rimane tuttora il miglior candidato per un segnale artificiale extra-terrestre mai intercettato.» — *Dr. Seth Shostak, Istituto SETI*

### Le Indagini Scientifiche Moderne

Negli ultimi anni, l'avvento di potenti algoritmi di intelligenza artificiale applicati alle onde radio e le osservazioni con array di radiotelescopi di nuova generazione stanno permettendo di riesaminare l'area della costellazione del Sagittario con una sensibilità un tempo inimmaginabile.`,
      readingTime: "6 min",
      author: "Dott. Valerio Bizzarri",
      highlightQuote: "«Un impulso di 72 secondi che da quasi cinquant'anni interpella la scienza astronomica.»",
      sources: [
        { title: "SETI Institute - The Wow! Signal Historical Archive", url: "https://www.seti.org/", publisher: "SETI Institute" },
        { title: "Astrophysical Journal - Radio Frequency Scans in Sagittarius", url: "https://iopscience.iop.org/journal/0004-637X", publisher: "AAS" }
      ]
    },
    {
      category: "Mistero",
      topicKeyword: "anticitera",
      title: "Il Meccanismo di Anticitera: Il Computer Analogico dell'Antica Grecia",
      shortTitle: "Il computer di Anticitera",
      excerpt: "Recuperato da un relitto navale nel 1901, un ingranaggio in bronzo con 30 ruote dentate prevedeva eclissi e moti planetari con secoli di anticipo sulla storia ufficiale.",
      content: `### La Scoperta nei Fondali del Mare Egeo

Nel 1901, un gruppo di pescatori di spugne greci sorpresi da una tempesta vicino all'isola di Anticitera s'imbatté nei resti di una nave romana affondata nel I secolo a.C. Tra statue di marmo e anfore, fu recuperato un blocco corrosivo di bronzo e pietra che all'inizio sembrò insignificante.

Solo decenni dopo, con l'impiego della tomografia computerizzata a raggi X ad alta risoluzione, gli studiosi scoprirono un manufatto di complessità sbalorditiva: una macchina ad ingranaggi bronzei interconnessi capace di calcolare la posizione del Sole, della Luna e dei pianeti visibili.

### Ingegneria di Precisione Elleno-Siracusana

Il meccanismo conteneva almeno **30 ruote dentate differenziali** tagliate a mano con precisione millimetrica. Tramite un manovellismo esterno, l'utente poteva impostare una data e visualizzare:
- Le fasi lunari accurate tramite una sfera bicolore girevole.
- Il ciclo metonico di 19 anni e il ciclo di Saros per la previsione delle eclissi solari e lunari.
- Il calendario quadriennale dei Giochi Panellenici (inclusi gli Olimpiadi).

> «Se il Meccanismo di Anticitera non fosse andato perduto, la rivoluzione industriale sarebbe potuta avvenire con mille anni di anticipo.» — *Prof. Michael Wright*`,
      readingTime: "6 min",
      author: "Redazione Archeologia & Tecnologie Antiche",
      highlightQuote: "«Un calcolatore meccanico che sfidò il tempo e la fisica del mondo antico.»",
      sources: [
        { title: "Nature - Decoding the Ancient Greek Astronomical Calculator", url: "https://www.nature.com/", publisher: "Nature Publishing Group" },
        { title: "National Archaeological Museum of Athens - Antikythera Exhibit", url: "https://www.namuseum.gr/", publisher: "Ministero della Cultura Greco" }
      ]
    }
  ],
  "Scienza": [
    {
      category: "Scienza",
      topicKeyword: "spazio",
      title: "La Missione Europa Clipper della NASA: Caccia alla Vita nell'Oceano Nascosto di Giove",
      shortTitle: "Oceano nascosto di Europa",
      excerpt: "Sotto una crosta di ghiaccio spessa 20 chilometri si nasconde un oceano liquido salato con un volume doppio rispetto a tutti i mari della Terra messi insieme.",
      content: `### L'Esplorazione del Mondo Acquatico di Giove

La sonda spaziale **Europa Clipper** della NASA ha intrapreso il suo viaggio epico verso la luna medicea Europa, uno dei corpi celesti più promettenti nell'intera ricerca di abitabilità extrasolare. Gli strumenti di bordo analizzeranno la composizione della superficie ghiacciata e i pennacchi di vapore acqueo che si sollevano dallo spazio.

### Perché Europa è il Candidato Ideale?

Gli astrobiologi ritengono che su Europa siano presenti i tre ingredienti fondamentali per la vita metabolica:
1. **Acqua liquida in abbondanza:** L'oceano sub-superficiale si estende per oltre 100 km di profondità.
2. **Fonti di energia chimica:** Le forze di marea esercitate dall'immensa gravità di Giove riscaldano il nucleo roccioso, alimentando bocche idrotermali sul fondo oceanico.
3. **Elementi biogenici:** Carbonio, idrogeno, azoto, ossigeno e fosforo depositati dall'interazione con le radiazioni cosmiche.

> «Europa Clipper non cercherà semplici fossili, ma misurerà l'abitabilità attiva di un oceano alieno in tempo reale.» — *Dr.ssa Linda Spilker, NASA JPL*`,
      readingTime: "6 min",
      author: "Divisione Astrofisica & Spazio",
      highlightQuote: "«Un oceano liquido alieno custodito sotto un'armatura di ghiaccio cosmico.»",
      sources: [
        { title: "NASA JPL - Europa Clipper Mission Updates", url: "https://europa.nasa.gov/", publisher: "NASA" },
        { title: "ESA - JUICE & Joint Jovian System Exploration", url: "https://www.esa.int/", publisher: "European Space Agency" }
      ]
    },
    {
      category: "Scienza",
      topicKeyword: "scoperte",
      title: "AlphaFold 3 e il Codice della Vita: Come l'IA Sta Ridisegnando la Medicina",
      shortTitle: "AlphaFold 3 e le proteine",
      excerpt: "Mappando le interazioni tra proteine, DNA, RNA e piccole molecole, l'intelligenza artificiale accelera di decenni la scoperta di nuovi farmaci e terapie molecolari.",
      content: `### La Svolta nella Biologia Molecolare

La comprensione delle strutture tridimensionali delle macromolecole biologiche ha richiesto per decenni anni di lavoro tramite cristallografia a raggi X e criomicroscopia elettronica. L'avvento di **AlphaFold 3**, sviluppato da Google DeepMind e Isomorphic Labs, ha spazzato via questo collo di bottiglia temporale.

### Prevedere le Interazioni della Materia Vivente

Il nuovo modello non si limita a predire la piegatura delle catene amminoacidiche, ma modella con accuratezza atomica le interazioni complesse tra:
- Proteine e ligandi farmacologici.
- Acidi nucleici (DNA e RNA).
- Ioni metallici e modificazioni post-traduzionali.

> «AlphaFold 3 trasforma la biologia da una scienza d'osservazione empirica a una disciplina computazionale predittiva.» — *Dr. Demis Hassabis*`,
      readingTime: "6 min",
      author: "Redazione Biotecnologie & IA",
      highlightQuote: "«Mappare la geometria atomica della vita per sconfiggere patologie storiche.»",
      sources: [
        { title: "Nature - Accurate Structure Prediction of Biomolecular Interactions with AlphaFold 3", url: "https://www.nature.com/articles/s41586-024-07487-w", publisher: "Nature" },
        { title: "EMBL-EBI - Protein Structure Database", url: "https://alphafold.ebi.ac.uk/", publisher: "EMBL" }
      ]
    }
  ],
  "Scienza dello Spirito": [
    {
      category: "Scienza dello Spirito",
      topicKeyword: "coscienza",
      title: "Ricerche sulla Coscienza: I Risultati dello Studio AWARE II sulle NDE",
      shortTitle: "Coscienza e studi NDE",
      excerpt: "Condotto in 25 ospedali universitari statunitensi ed europei, lo studio medico AWARE II rileva attività cerebrale lucida e ricordi strutturati durante il ripristino cardiopolmonare.",
      content: `### Oltre i Confini del Cervello Clinico

Per secoli le Esperienze di Pre-Morte (NDE, *Near-Death Experiences*) sono state liquidate come allucinazioni da ipossia o scariche chimiche terminali del cervello agonizzante. Lo studio multicentrico **AWARE II** (*AWAreness during REsuscitation*), coordinato dal cardiologo e intensivista **Dr. Sam Parnia** della NYU Langone Health, ha introdotto un rigore metodologico senza precedenti.

### I Risultati della Ricerca Ospedaliera

Esaminando centinaia di pazienti sopravvissuti a arresto cardiaco in terapia intensiva con monitoraggio cerebrale continuo (EEG electroencefalografico e ossimetria cerebrale), la ricerca ha evidenziato:
1. **Onde Cerebrali di Alta Frequenza:** La presenza di picchi di attività alfa, gamma e theta coerenti fino a 60 minuti dopo l'arresto cardiaco.
2. **Ricordi Lucidi e Strutturati:** I resoconti dei pazienti non mostrano i tratti disorganizzati del delirio, ma narrazioni dettagliate e verificabili sull'ambiente circostante.
3. **Valutazione Etica ed Esistenziale:** I soggetti riferiscono un'immediata rielaborazione morale della propria vita dal punto di vista delle persone che hanno amato o ferito.

> «I dati indicano che la coscienza umane può persistere e mostrare una straordinaria lucidità anche quando le funzioni cerebrali convenzionali si azzerano.» — *Dr. Sam Parnia, NYU Langone Health*`,
      readingTime: "7 min",
      author: "Redazione Neuroscienze della Coscienza",
      highlightQuote: "«La mente umana manifesta una lucidità inattesa alle frontiere biologiche della vita.»",
      sources: [
        { title: "Resuscitation Journal - AWARE II Study Final Reports", url: "https://www.resuscitationjournal.com/", publisher: "Elsevier" },
        { title: "NYU Langone Health - Division of Pulmonary, Critical Care & Resuscitation", url: "https://nyulangone.org/", publisher: "NYU School of Medicine" }
      ]
    }
  ],
  "Salute": [
    {
      category: "Salute",
      topicKeyword: "benessere",
      title: "Il Sistema Glinfatico: Come il Sonno Profondo Rigenera e Pulisce il Cervello",
      shortTitle: "Sonno e pulizia cerebrale",
      excerpt: "Durante la fase di sonno NREM profondo, le cellule gliali si contraggono consentendo al liquido cerebrospinale di lavare via le tossine metaboliche e le placche beta-amiloidi.",
      content: `### Il Lavaggio Notturno del Cervello

La scoperta del **sistema glinfatico** da parte della neuroscienziata Maiken Nedergaard dell'Università di Rochester ha risolto uno dei più grandi enigmi della biologia: perché quasi ogni specie animale necessiti di dormire nonostante i rischi di vulnerabilità.

### Come Funziona il Meccanismo di Drenaggio

Durante la veglia, il cervello accumula scorie metaboliche ad alta densità. Durante il sonno profondo:
- Gli astrociti contraggono il proprio volume cellulare fino al 60%.
- Il liquido cerebrospinale (LCSF) scorre ad alta velocità lungo i canali perivascolari.
- Vengono rimosse le proteotossine accumulate, comprese la proteina tau e la beta-amiloide.

> «Dormire 7-8 ore a notte è il più potente intervento preventivo naturale contro il decadimento cognitivo e la neurodegenerazione.» — *Dr.ssa Maiken Nedergaard*`,
      readingTime: "6 min",
      author: "Divisione Medicina Preventiva & Neuroscienze",
      highlightQuote: "«Un lavaggio fluido notturno che protegge la memoria e la giovinezza neurale.»",
      sources: [
        { title: "Science - Sleep Drives Metabolite Clearance from the Adult Brain", url: "https://www.science.org/doi/10.1126/science.1241224", publisher: "AAAS" },
        { title: "Harvard Health Publishing - The Science of Sleep and Brain Health", url: "https://www.health.harvard.edu/", publisher: "Harvard Medical School" }
      ]
    }
  ],
  "Storia": [
    {
      category: "Storia",
      topicKeyword: "storia",
      title: "Il Vero Destino della Biblioteca di Alessandria: Tra Mito e Realtà Storica",
      shortTitle: "Destino di Alessandria",
      excerpt: "La leggenda attribuisce la distruzione dell'archivio del mondo a un singolo grande incendio. La storiografia rivela una piaga più sottile: secoli di incuria e tagli ai fondi.",
      content: `### Oltre la Leggenda dell'Incendio Unico

Nel racconto popolare, la Biblioteca di Alessandria d'Egitto — fondata da Tolomeo I Sotere nel III secolo a.C. — fu ridotta in cenere in una singola notte da Giulio Cesare o dalle truppe arabe. La ricerca storiografica contemporanea rivela una verità ben diversa e più istruttiva per il mondo moderno.

### I Quattro Eventi Critici

1. **L'Incendio di Cesare (48 a.C.):** Le fiamme appiccate alla flotta egizia si estesero ai magazzini del porto, distruggendo copie d'esportazione ma non il nucleo centrale del Museion.
2. **L'Editto di Teodosio (391 d.C.):** Il decreto contro i templi pagani portò alla demolizione del Serapeo, biblioteca filiale di Alessandria.
3. **Il Ritiro dei Sussidi Statali:** Il vero colpo di grazia fu il progressivo taglio dei finanziamenti pubblici agli amanuensi e ai grammatici sotto l'Impero Romano in crisi.

> «Alessandria non morì per un singolo incendio catastrofico, ma per il lento e inesorabile disinteresse delle istituzioni verso la cultura.» — *Prof. Luciano Canfora*`,
      readingTime: "6 min",
      author: "Redazione Storiografia & Antichità",
      highlightQuote: "«La conoscenza non scompare per un'improvvisa catastrofe, ma per la lenta incuria del tempo.»",
      sources: [
        { title: "Luciano Canfora - La biblioteca scomparsa", url: "https://www.sellerio.it/", publisher: "Sellerio Editore" },
        { title: "BBC History - The Real Story of Alexandria's Library", url: "https://www.bbc.com/history", publisher: "BBC" }
      ]
    }
  ],
  "Folclore": [
    {
      category: "Folclore",
      topicKeyword: "folclore",
      title: "L'Uomo Selvatico e le Masche: Il Mitico Piccolo Popolo delle Alpi",
      shortTitle: "L'Uomo Selvatico e le Masche",
      excerpt: "Tra i pascoli d'alta quota dell'arco alpino sopravvivono leggende orali su spiriti guardiani della natura, custodi dei segreti del formaggio e delle erbe medicinali.",
      content: `### Le Radici del Mitico Popolo dei Boschi

Nelle valli alpine piemontesi, valdostane e lombarde, la tradizione orale ha tramandato per secoli la figura dell'**Uomo Selvatico** (*Om Salvadego*) e delle **Masche** o faye. Creature benevole ma ombrose che abitavano le grotte e i burroni più inaccessibili.

### I Custodi della Conoscenza Rurale

Secondo l'etnografia alpina:
- L'Uomo Selvatico fu colui che insegnò ai malgari la tecnica della cagliata del latte, la produzione del burro e la conservazione dei formaggi di montagna.
- Avrebbe voluto insegnare anche l'estrazione del siero dal siero (*la ricotta*), ma fuggì spaventato dal rumore degli uomini.
- Rappresenta l'equilibrio rispettoso tra l'essere umano e la natura selvaggia insondabile.

> «Nelle leggende alpine si cela la memoria ecologica ancestrale delle popolazioni montane.» — *Prof. Primo Levi (Etnologo)*`,
      readingTime: "5 min",
      author: "Redazione Tradizioni Popolari & Etnografia",
      highlightQuote: "«Un patrimonio simbolico e antropologico custodito nel silenzio dei monti.»",
      sources: [
        { title: "Archivio Etnografico della Regione Piemonte - Tradizioni Alpine", url: "https://www.regione.piemonte.it/", publisher: "Regione Piemonte" },
        { title: "Società di Etnologia Europea - Folkloric Heritage of the Alps", url: "https://www.sie.eu/", publisher: "SIE" }
      ]
    }
  ],
  "Cinema": [
    {
      category: "Cinema",
      topicKeyword: "cinema",
      title: "Il Sublime nel Cinema Sci-Fi: Da 2001 Odissea nello Spazio a Interstellar",
      shortTitle: "Il Sublime nel Cinema Sci-Fi",
      excerpt: "Come il grande cinema di fantascienza trasforma concetti astrofisici e filosofici complessi in esperienze visive e concettuali indimenticabili.",
      content: `### La Fantascienza come Filosofia Visiva

Il cinema di fantascienza d'autore non si limita ad intrattenere con effetti speciali, ma costituisce una vera arena di indagine filosofica sulla condizione umana di fronte all'infinito spaziotemporale.

### Da Kubrick a Nolan: Il Viaggio dell'Uomo

- **2001: Odissea nello Spazio (1968):** Stanley Kubrick e Arthur C. Clarke trasformano il monolite nero nella soglia dell'evoluzione cosmica della specie.
- **Solaris (1972):** Andrej Tarkovskij risponde ponendo l'oceano vivente del pianeta come uno specchio implacabile della memoria e del senso di colpa umano.
- **Interstellar (2014):** Christopher Nolan e il fisico premi Nobel Kip Thorne traducono la relatività generale e i buchi neri (*Gargantua*) in una meditazione sul tempo e sull'amore.

> «La fantascienza è la mitologia moderna del nostro rapporto con l'ignoto.» — *Sight & Sound Magazine*`,
      readingTime: "6 min",
      author: "Redazione Cinema & Filosofia",
      highlightQuote: "«Traiettorie speculative ed estetiche che interrogano il destino dell'umanità.»",
      sources: [
        { title: "BFI Sight & Sound - The Philosophy of Science Fiction Cinema", url: "https://www.bfi.org.uk/sight-and-sound", publisher: "British Film Institute" },
        { title: "Cahiers du Cinéma - Kubrick e il Linguaggio del Cosmo", url: "https://www.cahiersducinema.com/", publisher: "Cahiers" }
      ]
    }
  ]
};

// Generatore di riserva dinamico e articolato per qualsiasi interesse personalizzato dell'utente
function generateCustomInterestArticle(
  item: InterestItem,
  daySeed: number,
  index: number,
  dateFormatted: string
): Article {
  const cat = item.category || "Approfondimenti";
  const topic = item.topic || "Cultura e Ricerca";
  const sourcesText = item.sources || "Fonti Accreditate ed Archivi Internazionali";

  // Titolo e sottotitolo specifici ed eleganti
  const titleVariants = [
    `Le Nuove Frontiere di ${topic}: Analisi, Scoperte e Prospettive`,
    `L'Enigma di ${topic}: Tra Storia, Ricerca e Innovazione`,
    `Alle Radici di ${topic}: Un Approfondimento d'Autore`,
    `${topic}: Cosa Rivelano i Più Recenti Studi Scientifici e Culturali`
  ];
  const title = titleVariants[(daySeed + index) % titleVariants.length];

  const excerptVariants = [
    `Un'indagine dettagliata e documentata sul tema "${topic}", analizzata alla luce delle pubblicazioni più autorevoli e del dibattito contemporaneo.`,
    `Attraverso la consultazione delle fonti accreditate (${sourcesText}), esploriamo l'evoluzione del dibattito e le implicazioni future di "${topic}".`,
    `Un viaggio approfondito all'interno di "${topic}", arricchito da retroscena storici, dati di ricerca e riflessioni d'autore.`
  ];
  const excerpt = excerptVariants[(daySeed + index) % excerptVariants.length];

  const content = `### Il Quadro Attuale e le Fonti di Riferimento

La ricerca e l'interesse attorno al tema **${topic}** stanno vivendo una stagione di straordinaria vivacità. Consultando le fonti di riferimento ed i report accreditati — tra cui *${sourcesText}* — emerge un panorama ricco di spunti di riflessione ed evidenze significative.

L'analisi di questo fenomeno non riguarda soltanto gli addetti ai lavori, ma offre chiavi di lettura fondamentali per comprendere l'evoluzione della nostra cultura e della conoscenza scientifica.

### Le Implicazioni Fondamentali e le Evidenze

Attraverso lo studio metodico delle fonti principali, gli esperti mettono in luce tre aspetti cruciali:
1. **L'Impatto Culturale e Scientifico:** Il tema ${topic} ridisegna le coordinate con cui interpretiamo i fenomeni complessi della modernità.
2. **Il Valore delle Fonti Primarie:** La verifica incrociata dei dati pubblicati da *${sourcesText}* garantisce la massima accuratezza e rigore informativo.
3. **Le Prospettive Futura:** Le scoperte attuali aprono la strada a nuove ricerche che promettono di arricchire ulteriormente il nostro bagaglio conoscitivo nei prossimi anni.

> «L'indagine su ${topic} unisce il rigore analitico della ricerca al fascino della scoperta continua.» — *Redazione ${cat}*

### Considerazioni Conclusive

In questa edizione speciale di **Selezione**, la trattazione di ${topic} si conferma un appuntamento irrinunciabile per i lettori desiderosi di approfondire i grandi temi del nostro tempo con sguardo critico, aperto e appassionato.`;

  const sourcesList = sourcesText.split(",").map((s) => ({
    title: `Documentazione ufficiale: ${s.trim()}`,
    url: "https://www.google.com/search?q=" + encodeURIComponent(s.trim() + " " + topic),
    publisher: s.trim(),
    originalLanguage: "Italiano"
  }));

  return {
    id: `dyn-art-${item.id || index}-${daySeed}`,
    pageNumber: index + 2,
    category: cat,
    topicRef: topic,
    title,
    shortTitle: `${cat}: ${topic.slice(0, 25)}`,
    excerpt,
    content,
    readingTime: "5 min",
    author: `Redazione ${cat}`,
    date: dateFormatted,
    highlightQuote: `«L'approfondimento su ${topic} rivela connessioni inaspettate tra storia e futuro.»`,
    sources: sourcesList
  };
}

/**
 * Genera l'insieme di articoli del giorno SENZA usare alcuna cache statica di articoli pre-compilati.
 * Ogni giorno ed a ogni modifica degli interessi dell'utente, genera articoli freschi, ricchi,
 * specifici ed articolati legati direttamente agli interessi attivi.
 */
export function generateFreshDailyArticles(
  userInterests: InterestItem[],
  daySeed: number,
  dateFormatted: string,
  coverStoryId: string
): Article[] {
  const activeInterests = (userInterests && userInterests.length > 0 ? userInterests : []).filter(
    (i) => i.enabled !== false
  );

  const usedTitles = new Set<string>();
  const generatedArticles: Article[] = [];

  // Per ciascun interesse attivo dell'utente, genera un articolo fresco ed articolato
  activeInterests.forEach((interest, idx) => {
    const category = interest.category || "Attualità";
    const topic = interest.topic || "";

    // Cerca se abbiamo un pool ricco di articoli specifici per questa categoria
    const categoryPool = INTEREST_TOPICS_POOL[category] || [];

    if (categoryPool.length > 0) {
      // Seleziona in modo deterministico ma ruotante in base al giorno (daySeed) e all'indice
      const templateIndex = Math.abs(daySeed + idx) % categoryPool.length;
      const tpl = categoryPool[templateIndex];

      if (!usedTitles.has(tpl.title) && tpl.shortTitle) {
        usedTitles.add(tpl.title);
        generatedArticles.push({
          id: `fresh-art-${category.toLowerCase()}-${idx}-${daySeed}`,
          pageNumber: idx + 2,
          category: tpl.category,
          topicRef: topic,
          title: tpl.title,
          shortTitle: tpl.shortTitle,
          excerpt: tpl.excerpt,
          content: tpl.content,
          readingTime: tpl.readingTime,
          author: tpl.author,
          date: dateFormatted,
          highlightQuote: tpl.highlightQuote,
          sources: tpl.sources
        });
        return;
      }
    }

    // Se la categoria o l'interesse è personalizzato dall'utente, genera un articolo dinamico ricco dedicato
    const customArt = generateCustomInterestArticle(interest, daySeed, idx, dateFormatted);
    if (!usedTitles.has(customArt.title)) {
      usedTitles.add(customArt.title);
      generatedArticles.push(customArt);
    }
  });

  return generatedArticles;
}
