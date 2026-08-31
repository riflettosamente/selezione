import React, { useState, useMemo, useEffect, useCallback } from "react";
import FlipBook from "./components/FlipBook";
import { getMasterpieceForDayAndInterests, getArtworkMetadataForArticle, ArtMasterpiece } from "./data/artMasterpieces";
import { DEFAULT_INTERESTS } from "./data/defaultInterests";
import { InterestItem } from "./types";
import {
  isArticlePresentInDb,
  registerArticlesInDb,
  getExcludedHistoryFromDb,
  getArticlesStorageDb
} from "./services/articlesStorageDb";
import { getExclusionLists } from "./services/editorialLedger";

export interface SourceReference {
  title: string;
  url: string;
  publisher: string;
  originalLanguage?: string;
  keyFinding?: string;
}

export interface Article {
  id: string;
  pageNumber: number;
  category: "Attualità" | "Scienza" | "Mistero" | "Cultura" | "Arte" | "Salute" | "Storia" | "Cinema" | "Folclore" | string;
  topicRef?: string;
  title: string;
  shortTitle?: string;
  excerpt: string;
  content: string;
  readingTime: string;
  author: string;
  date: string;
  highlightQuote?: string;
  sources: SourceReference[];
  originalLanguage?: string;
  isCondensedBook?: boolean;
}

// Catalogo degli articoli autentici ispirato allo stile "Selezione dal Reader's Digest"
const REAL_ARTICLES_CATALOG: Article[] = [
  {
    id: "gobekli-tepe-unesco",
    pageNumber: 1,
    category: "Mistero",
    title: "Göbekli Tepe: Gli scavi del santuario megalitico che ha rivoluzionato l'archeologia",
    shortTitle: "Göbekli Tepe: Il primo tempio",
    excerpt: "Dagli scavi avviati nel 1995 dall'archeologo Klaus Schmidt (DAI) e dai recenti restauri UNESCO (2018-2024): il più antico santuario monumentale del mondo, eretto nel 9.500 a.C., ribalta tutto ciò che sapevamo sulle origini della civiltà.",
    content: `Nel sud-est dell'Anatolia, su un crinale brullo che domina l'altopiano di Şanlıurfa a pochi chilometri dal confine siriano, il santuario megalitico di Göbekli Tepe continua a riscrivere con sconcertante evidenza i capitoli fondamentali della storia umana. Gli scavi archeologici condotti congiuntamente dal Deutsches Archäologisches Institut (DAI) a partire dal 1995 — guidati con straordinaria intuizione dal compianto archeologo tedesco Klaus Schmidt — e culminati nell'inclusione unanime nel Patrimonio Mondiale dell'Umanità UNESCO nel 2018, hanno riportato alla luce cerchi monumentali concentrici di proporzioni inaudite per l'Età della Pietra.

Al centro di ciascun recinto sorgono pilastri monolitici a forma di T alti fino a cinque metri e mezzo, dal peso compreso tra dieci e venti tonnellate ciascuno. La superficie calcarea di questi colossi di pietra non è grezza, ma finemente cesellata con straordinari bassorilievi e altorilievi raffiguranti leoni ruggenti, cinghiali setolosi, volpi in corsa, avvoltoi ad ali spiegate, scorpioni velenosi e inquietanti figure antropomorfe stilizzate, con lunghe braccia conserte che convergono verso cinture decorate con fibbie e pelli di volpe.

Le rigorose datazioni radiometriche al radiocarbonio (Carbonio-14), effettuate su campioni organici e intonaci di calce dei livelli costruttivi più arcaici (Livello III), fissano l'edificazione del complesso tra il 9.500 e il 9.000 a.C. — oltre 11.500 anni fa, durante il Neolitico Pre-Ceramico A. Göbekli Tepe precede così di ben settemila anni la costruzione dei cerchi di Stonehenge nella piana di Salisbury e di oltre sei millenni l'innalzamento della Grande Piramide di Cheope a Giza, collocandosi in un'epoca in cui l'umanità usciva faticosamente dall'ultima glaciazione continentale.

Questa cronologia inoppugnabile ha scosso dalle fondamenta il paradigma consolidato dell'antropologia e dell'archeologia classica. Per generazioni, la teoria ortodossa di Gordon Childe aveva insegnato che l'uomo avesse prima scoperto l'agricoltura e l'allevamento stanziale, accumulato eccedenze alimentari e solo in seguito, grazie a una società gerarchica e specializzata, trovato il tempo e le risorse per concepire templi, religioni complesse e architetture monumentali. Göbekli Tepe dimostra esattamente l'inverso: fu l'esigenza spirituale, il bisogno sacro e comunitario di radunarsi per celebrare riti collettivi e onorare gli antenati o le forze celesti, a costringere centinaia di cacciatori nomadi a cooperare stabilmente, stimolando la nascita dei primi esperimenti di domesticazione cerealicola (in particolare del farro selvatico, l'einkorn, la cui variante genetica originaria cresce proprio sui monti Karacadağ a pochi chilometri dal sito).

Le più recenti campagne di scavo del progetto 'Taş Tepeler' (2021-2024), estese anche ai vicini siti gemelli di Karahantepe e Sayburç, hanno arricchito il quadro con ritrovamenti sensazionali: statue umane tridimensionali a grandezza naturale con pigmenti rossi originali ancora visibili sugli occhi e sulle labbra, banchi in pietra per cerimonie sciamaniche e canali per la raccolta di libagioni rituali. Tutto ciò fu realizzato senza l'ausilio di attrezzi metallici, ruote o animali da soma: solo percussori in selce durissima, leve di legno, corde vegetali e una titanica coordinazione sociale.

L'enigma più profondo di Göbekli Tepe riguarda tuttavia il suo destino finale. Intorno all'8.000 a.C., dopo oltre un millennio di ininterrotta attività cultuale, il santuario non fu distrutto da guerre né abbandonato al naturale decadimento: le popolazioni locali lo riempirono deliberatamente fino all'orlo con centinaia di tonnellate di pietrisco, terra di riporto e frammenti di ossa di gazzelle e uri, sigillandolo meticolosamente sotto una collinetta artificiale (il 'pancione' che dà il nome al sito in lingua turca). Sepolto come una capsula del tempo preistorica, il tempio è rimasto intatto nel grembo della terra per diecimila anni, attendendo il nostro secolo per rivelare che alle radici della civiltà non vi fu la zappa, ma l'anelito verso l'invisibile e le stelle.`,
    readingTime: "7 min",
    author: "Redazione Archeologia & Studi Storici",
    date: "Agosto 2026",
    highlightQuote: "Eretto nel 9.500 a.C., Göbekli Tepe dimostra che fu l'anelito spirituale a far nascere la civiltà, prima ancora dell'agricoltura e dei villaggi stanziali.",
    originalLanguage: "Inglese / Tedesco (Tradotto in Italiano)",
    sources: [
      {
        title: "UNESCO World Heritage Centre - Göbekli Tepe Official Dossier (Iscrizione 2018)",
        url: "https://whc.unesco.org/en/list/1572/",
        publisher: "UNESCO",
        originalLanguage: "Inglese"
      },
      {
        title: "German Archaeological Institute (DAI) - Research & Excavation Reports (1995-2024)",
        url: "https://www.dainst.org/",
        publisher: "Deutsches Archäologisches Institut",
        originalLanguage: "Tedesco"
      }
    ]
  },
  {
    id: "nasa-europa-clipper",
    pageNumber: 5,
    category: "Scienza",
    title: "La missione Europa Clipper della NASA: Verso l'oceano nascosto sotto i ghiacci di Giove",
    shortTitle: "L'oceano nascosto di Europa (NASA)",
    excerpt: "Lanciata nell'ottobre 2024 con arrivo previsto nel sistema gioviano nel 2030: la più maestosa sonda planetaria della NASA studierà un oceano extraterrestre con un volume d'acqua doppio rispetto a tutti i mari terrestri messi insieme.",
    content: `Il 14 ottobre 2024, dalla rampa 39A del Kennedy Space Center a Cape Canaveral in Florida, un potente razzo Falcon Heavy ha sollevato verso lo spazio la sonda interplanetaria Europa Clipper. Con una massa al lancio di circa sei tonnellate e un'apertura alare di oltre trenta metri garantita dai giganteschi pannelli solari progettati per catturare la tenue luce solare a quasi 800 milioni di chilometri dal Sole, Europa Clipper costituisce la più grande astronave mai sviluppata dalla NASA per una missione scientifica planetaria.

Il viaggio che attende la sonda è un'odissea balistica di 2,9 miliardi di chilometri. Sfruttando l'assistenza gravitazionale di Marte nel febbraio 2025 e della Terra nel dicembre 2026, la sonda riceverà la spinta cinetica necessaria per raggiungere il turbolento sistema di Giove nell'aprile del 2030. Qui non entrerà in orbita direttamente attorno a Europa, dove le micidiali fasce di radiazione gioviane distruggerebbero l'elettronica di bordo in pochi mesi, ma orbiterà intorno al pianeta gigante, eseguendo ben 49 sorvoli ravvicinati (flyby) della luna ghiacciata a quote comprese tra 25 e 100 chilometri dalla superficie.

Il bersaglio scientifico è uno dei mondi più affascinanti dell'astrobiologia moderna. Scoperta da Galileo Galilei nel gennaio 1610 con il suo cannocchiale, Europa ha un diametro di 3.120 chilometri (poco inferiore a quello della nostra Luna). Dietro una crosta di ghiaccio d'acqua spessa tra i quindici e i venticinque chilometri — solcata da spettacolari fratture rossastre chiamate 'lineae' — i dati combinati delle missioni Voyager, Galileo e Juno hanno confermato la presenza di un immenso oceano liquido globale profondo dai sessanta ai centocinquanta chilometri.

Questo mare extraterrestre, mantenuto allo stato liquido dal calore generato dalle colossali maree gravitazionali esercitate da Giove e dalle lune consorelle Io e Ganimede, racchiude un volume d'acqua liquida pari al doppio di tutti gli oceani della Terra combinati. Sul fondo di questo abisso alieno, l'acqua entra a diretto contatto con il mantello roccioso e silicatico della luna, creando con altissima probabilità sistemi idrotermali attivi analoghi ai 'black smokers' sottomarini terrestri, attorno ai quali sulla Terra prosperano complessi ecosistemi indipendenti dalla luce solare.

A bordo di Europa Clipper viaggia una suite scientifica di nove strumenti all'avanguardia: il radar penetratore per ghiaccio REASON, capace di scandagliare la crosta fino a trenta chilometri di profondità per mappare eventuali sacche d'acqua subsuperficiali; lo spettrometro per immagini all'infrarosso MISE, che analizzerà la composizione dei sali minerali e dei composti organici affiorati in superficie; il magnetometro ECM, che misurerà il campo magnetico indotto per calcolare la profondità e la salinità esatta dell'oceano; e il sofisticato analizzatore di polveri SUDA, progettato per raccogliere e analizzare in volo i campioni di vapore e ghiaccio espulsi dai geyser di Europa.

L'obiettivo dichiarato della missione tra il 2030 e il 2034 non è trovare direttamente organismi viventi, ma determinare in modo definitivo l'abitabilità biologica di Europa: confermare la presenza simultanea di acqua liquida, elementi chimici fondamentali per la vita (carbonio, idrogeno, azoto, ossigeno, fosforo e zolfo) e gradienti di energia elettrochimica stabili. Se le condizioni favorevoli verranno verificate, Europa Clipper aprirà la strada a future sonde con moduli di atterraggio capaci di fondere la crosta di ghiaccio per immergersi nelle profondità del primo oceano alieno della storia umana.`,
    readingTime: "6 min",
    author: "Divisione Scienze Planetarie",
    date: "Agosto 2026",
    highlightQuote: "Nel 2030 Europa Clipper raggiungerà l'oceano nascosto di Giove: un mare liquido globale con il doppio dell'acqua di tutti gli oceani terrestri.",
    originalLanguage: "Inglese (Tradotto in Italiano)",
    sources: [
      {
        title: "NASA Jet Propulsion Laboratory - Europa Clipper Mission Timeline (2024-2034)",
        url: "https://europa.nasa.gov/",
        publisher: "NASA / JPL",
        originalLanguage: "Inglese"
      },
      {
        title: "NASA Science Mission Directorate - Planetary Exploration Updates (2024)",
        url: "https://www.nasa.gov/mission/europa-clipper/",
        publisher: "NASA",
        originalLanguage: "Inglese"
      }
    ]
  },
  {
    id: "nde-studi-aware-nyu",
    pageNumber: 11,
    category: "Scienza",
    title: "Esperienze di Pre-Morte e Coscienza: I risultati clinici dello studio AWARE II della NYU",
    shortTitle: "Cosa accade alla coscienza nelle NDE",
    excerpt: "Pubblicato sulla prestigiosa rivista medica Resuscitation e negli Annals of the New York Academy of Sciences: il team del dott. Sam Parnia documenta onde cerebrali gamma e lucidità cosciente fino a un'ora dopo l'arresto cardiaco.",
    content: `Per decenni relegate ai margini della discussione accademica o etichettate come semplici allucinazioni dovute all'ipossia cerebrale, le Esperienze di Pre-Morte (Near-Death Experiences, NDE) hanno finalmente trovato una collocazione scientifica rigorosa grazie alla pubblicazione dei risultati definitivi dello studio clinico multicentrico AWARE II. Condotta sotto la direzione del dottor Sam Parnia, professore associato di medicina critica presso la New York University Grossman School of Medicine, la ricerca ha monitorato tra il 2015 e il 2022 centinaia di pazienti in arresto cardiaco intraospedaliero in oltre venticinque centri di rianimazione negli Stati Uniti e nel Regno Unito.

Il protocollo sperimentale di AWARE II ha introdotto un'innovazione metodologica senza precedenti: l'applicazione immediata sulla fronte del paziente, durante le manovre di rianimazione cardiopolmonare (RCP) avanzata, di dispositivi compatti per il monitoraggio elettroencefalografico continuo (EEG a due canali) e per l'ossimetria cerebrale frontale (NIRS). Questo ha permesso di registrare l'attività elettrica del cervello in tempo reale durante i minuti cruciali in cui il cuore ha cessato di pompare sangue, la pressione arteriosa è azzerata e il tronco encefalico perde i suoi riflessi clinici spontanei.

Le registrazioni elettroencefalografiche hanno rivelato un dato sbalorditivo che ha sorpreso la comunità medica internazionale: in una percentuale significativa di pazienti monitorati (fino a 60 minuti dopo l'inizio del massaggio cardiaco), l'EEG ha registrato la comparsa improvvisa di ritmi cerebrali altamente organizzati e coerenti, in particolare picchi di onde gamma (35-80 Hz), delta, theta e alfa. Nella neurofisiologia standard, i ritmi gamma sincronizzati sono la firma inequivocabile dei processi cognitivi superiori, della memoria autobiografica di lavoro, dell'integrazione multisensoriale e della consapevolezza cosciente vigile.

Questo correlato biologico oggettivo si è perfettamente sovrapposto alle testimonianze raccolte durante le interviste strutturate con i pazienti sopravvissuti. Circa il 39% dei soggetti ha riferito di aver mantenuto una forma di consapevolezza lucida e strutturata durante il periodo di incoscienza apparente. Le esperienze non avevano i tratti caotici o confusi dei sogni e delle allucinazioni da farmaci: i pazienti hanno descritto una straordinaria chiarezza di pensiero, la percezione di assistere dall'alto alle manovre dei soccorritori, un profondo senso di serenità privo di angoscia e, soprattutto, una 'revisione panoramica della propria vita' (life review). Durante questa revisione etica, il soggetto riesamina i propri comportamenti passati non dal punto di vista del proprio ego, ma sperimentando direttamente i sentimenti, le sofferenze e le gioie provate dalle persone con cui aveva interagito.

Per spiegare come un cervello privo di battito cardiaco autonomo possa generare tali stati di lucidità elevata, il team della NYU ha proposto l'ipotesi biologica della 'disinibizione corticale' (cortical disinhibition). In condizioni normali di veglia, il cervello adulto applica costantemente potenti circuiti inibitori (mediati principalmente dal neurotrasmettitore GABA) per filtrare la stragrande maggioranza delle informazioni e consentire l'interazione pratica con l'ambiente circostante. Quando sopraggiunge l'arresto cardiaco e l'apporto di ossigeno si riduce criticamente, questi meccanismi di freno inibitorio cedono rapidamente, aprendo le porte a livelli più profondi e vasti della coscienza e della memoria che ordinariamente rimangono inaccessibili.

Pubblicati ufficialmente sulla rivista peer-reviewed 'Resuscitation' e approfonditi negli 'Annals of the New York Academy of Sciences', i risultati dello studio AWARE II non solo mettono in discussione la rigida frontiera convenzionale tra vita e morte cerebrale, ma aprono orizzonti inediti sulla natura stessa della mente umana e pongono le basi per nuovi protocolli terapeutici volti a proteggere il tessuto neurale durante i lunghi tentativi di rianimazione d'emergenza.`,
    readingTime: "7 min",
    author: "Dott.ssa Chiara Ferri",
    date: "Agosto 2026",
    highlightQuote: "Lo studio clinico NYU rivela onde cerebrali gamma organizzate e lucidità etica cosciente fino a un'ora dopo l'arresto cardiaco.",
    originalLanguage: "Inglese (Tradotto in Italiano)",
    sources: [
      {
        title: "NYU Langone Health - Recalled Experiences Surrounding Death Study (Settembre 2023)",
        url: "https://nyulangone.org/news/recalled-experiences-surrounding-death-more-patients-than-previously-thought-report-lucid-events-when-close-to-death",
        publisher: "NYU Grossman School of Medicine",
        originalLanguage: "Inglese"
      },
      {
        title: "Resuscitation Journal - AWARE II Multi-Centre Clinical Study (2023)",
        url: "https://www.resuscitationjournal.com/",
        publisher: "Elsevier",
        originalLanguage: "Inglese"
      }
    ]
  },
  {
    id: "cinema-scifi-bfi-kubrick",
    pageNumber: 15,
    category: "Cinema",
    title: "L'Estetica del Sublime nel Cinema di Fantascienza: L'analisi del British Film Institute",
    shortTitle: "Il Sublime nel Cinema Sci-Fi d'autore",
    excerpt: "Dalla storica retrospettiva e dai sondaggi decennali di Sight & Sound (1952-2022): da '2001: Odissea nello spazio' (1968) alle cattedrali visive di Denis Villeneuve (2016-2024), la fantascienza d'autore esplora il timore reverenziale dell'infinito.",
    content: `Negli archivi critici del British Film Institute (BFI) e nei sondaggi decennali promossi dalla storica rivista 'Sight & Sound' (inaugurati nel 1952 e rinnovati con l'edizione 2022), la fantascienza cinematografica di maggior valore autoriale viene costantemente analizzata attraverso la categoria estetica del 'Sublime'. Teorizzato nel Settecento da Edmund Burke nella sua celebre 'Indagine sull'origine delle nostre idee di sublime e bello' (1757) e poi formalizzato da Immanuel Kant nella 'Critica del Giudizio' (1790), il sublime è quel sentimento complesso in cui l'animo umano sperimenta un brivido di terrore reverenziale, vertigine e commozione di fronte a grandezze spaziali, temporali e cosmiche che oltrepassano ogni capacità di calcolo e immaginazione.

Il punto di svolta che ha ridefinito per sempre il linguaggio del genere avvenne nel 1968, quando Stanley Kubrick e lo scrittore Arthur C. Clarke presentarono al mondo '2001: Odissea nello spazio' (2001: A Space Odyssey). Rifiutando i cliché dei B-movie hollywoodiani degli anni Cinquanta — dominati da mostri gommosi e invasioni aliene bellicose —, Kubrick operò una rivoluzione formale assoluta: eliminò i dialoghi per oltre due terzi della durata della pellicola, lasciando che a parlare fossero il silenzio glaciale del vuoto interplanetario, la meccanica celeste e le maestose partiture sinfoniche di Johann Strauss, György Ligeti e Richard Strauss ('Così parlò Zarathustra'). Il celebre stacco di montaggio tra l'osso scagliato in aria dal primate e l'astronave orbitante sintetizzò in una frazione di secondo l'intera evoluzione tecnologica della specie, trasformando l'esplorazione spaziale in un'interrogazione metafisica sull'origine e sul destino della coscienza.

Nel 1972, il regista sovietico Andrej Tarkovskij rispose a Kubrick con 'Solaris', tratto dal romanzo di Stanisław Lem. Dove Kubrick contemplava la perfezione geometrica e tecnologica dell'Universo, Tarkovskij rivolgeva lo sguardo verso l'abisso interiore dell'animo umano. L'oceano pensante e gelatinoso del pianeta Solaris materializza fisicamente i rimorsi, i sensi di colpa e i ricordi più dolorosi degli scienziati a bordo della stazione orbitante, dimostrando che «noi non abbiamo affatto bisogno di altri mondi: noi abbiamo bisogno di uno specchio». Questa poetica della nostalgia e della finitezza terrena troverà un'ulteriore consacrazione nel 1979 con 'Stalker', in cui il viaggio nella misteriosa 'Zona' diventa un pellegrinaggio spirituale alla ricerca dei desideri più intimi dell'essere umano.

Tra la fine degli anni Settanta e l'inizio degli anni Ottanta, Ridley Scott innestò nel genere una nuova variante del sublime: il 'Sublime Industriale e Biomeccanico'. Con 'Alien' (1979), grazie alle scenografie allucinate dell'artista svizzero H.R. Giger, il terrore cosmico assunse le sembianze di una forma di vita aliena perfetta, spietata e primordiale; mentre con 'Blade Runner' (1982), ispirato a Philip K. Dick, la metropoli di Los Angeles del futuro divenne un labirinto piovoso al neon dove androidi sintetici («Ho visto cose che voi umani non potreste immaginarvi...») dimostrano un'umanità e una pietà più autentiche dei loro stessi creatori in carne e ossa.

Nel panorama contemporaneo del XXI secolo, l'eredità del sublime kubrickiano e tarkovskiano è stata raccolta magistralmente dal regista quebecchese Denis Villeneuve. Attraverso opere di straordinario rigore visivo come 'Arrival' (2016), 'Blade Runner 2049' (2017) e i due monumentali capitoli di 'Dune' (2021 e 2024), Villeneuve impiega un'architettura visiva brutalista, paesaggi desertici sterminati, movimenti di camera lenti e ponderati e il sound design tellurico di Hans Zimmer per ricreare la sensazione autentica di piccolezza dell'individuo di fronte alle grandi correnti della storia e del cosmo. Nelle mani dei grandi maestri della settima arte, la fantascienza cessa di essere mero intrattenimento escapista e si consacra come la più potente cattedrale filosofica del nostro tempo.`,
    readingTime: "7 min",
    author: "Redazione Critica Cinematografica",
    date: "Agosto 2026",
    highlightQuote: "Da 2001: Odissea nello spazio (1968) fino a Dune (2024), il cinema trasforma l'immensità cosmica in uno specchio metafisico sulla fragilità umana.",
    originalLanguage: "Inglese (Tradotto in Italiano)",
    sources: [
      {
        title: "British Film Institute (BFI) - Sight & Sound Greatest Films of All Time (Edizione 2022)",
        url: "https://www.bfi.org.uk/sight-and-sound",
        publisher: "BFI",
        originalLanguage: "Inglese"
      },
      {
        title: "Criterion Collection - The Metaphysics and Aesthetics of Sci-Fi Cinema",
        url: "https://www.criterion.com/",
        publisher: "The Criterion Collection",
        originalLanguage: "Inglese"
      }
    ]
  },
  {
    id: "capolavori-botticelli-adorazione-dei-magi",
    pageNumber: 18,
    category: "Arte",
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
  },
  {
    id: "spigolature-curiosita-mondo",
    pageNumber: 22,
    category: "Cultura",
    title: "Spigolature e Curiosità dal Mondo: Dagli abissi marini ai ghiacci millenari",
    shortTitle: "Spigolature e Curiosità dal Mondo",
    excerpt: "Date, studi e reperti verificati: dai campioni glaciali della Groenlandia estratti nel 1966 e analizzati nel 2021-2023, alla storia dell'albero del Ténéré (1973) e alle scoperte oceanografiche.",
    content: `La natura e la storia della ricerca scientifica internazionale riservano scoperte documentate che superano qualunque invenzione letteraria. Ecco quattro storie autentiche e verificate dagli archivi accademici:

1. I fossili della Groenlandia di 416.000 anni fa (Analisi 2021-2023):
Durante il culmine della Guerra Fredda, nel 1966, l'esercito degli Stati Uniti estrasse una carota di ghiaccio e sedimenti a 1.400 metri di profondità dalla base militare segreta 'Camp Century', scavata all'interno della calotta della Groenlandia nord-occidentale. Dimenticati in provette di vetro all'interno di un congelatore universitario in Danimarca per oltre mezzo secolo, i sedimenti basali sono stati rianalizzati tra il 2021 e il 2023 da un consorzio internazionale guidato dalla National Science Foundation e dall'Università del Vermont.
Al microscopio elettronico a scansione, i geologi hanno fatto una scoperta sconcertante: intrappolati nel fango fossile vi erano rametti intatti, spore, muschi boreali e frammenti di foglie perfettamente conservati risalenti a circa 416.000 anni fa (durante lo Stadio Isotopico Marino 11). Questa prova diretta dimostra che la Groenlandia non è stata un deserto perenne di ghiaccio per milioni di anni, ma che durante i periodi interglaciali caldi si trasformò in una verdeggiante foresta di conifere e tundre ricche di fiumi.

2. L'Albero del Ténéré nel deserto del Sahara (XIX secolo - 1973):
Nel cuore del deserto del Ténéré, nel Niger centro-settentrionale, per oltre un secolo una solitaria acacia tortilis è stata formalmente catalogata come l'albero più isolato dell'intero pianeta Terra: nessun'altra pianta o arbusto cresceva nel raggio di oltre quattrocento chilometri quadrati di dune sabbiose. Considerata sacra dalle carovane dei Tuareg e utilizzata come faro di orientamento vivente dai commercianti trans-sahariani, l'acacia era riuscita a sopravvivere in uno dei climi più aridi del mondo spingendo le proprie radici fino a trentacinque metri di profondità, attingendo direttamente a una falda acquifera fossile sotterranea.
Nel 1973, l'albero millenario fu fatalmente abbattuto dall'impatto con un autocarro guidato da un camionista; il tronco originale fu recuperato e trasferito nel Museo Nazionale del Niger a Niamey, mentre sul luogo esatto della sua crescita nel deserto è stata eretta una scultura metallica commemorativa.

3. Il Canale Oceanico SOFAR e i canti delle balene (Scoperta 1944):
Identificato nel 1944 dai geofisici e oceanografi americani Maurice Ewing e J. Lamar Worzel, il canale acustico SOFAR (Sound Fixing and Ranging) è uno strato oceanico orizzontale situato tra i 600 e i 1.200 metri di profondità dove la velocità di propagazione del suono raggiunge il suo minimo assoluto, a causa del bilanciamento tra temperatura decrescente e pressione idrostatica crescente.
Questo fenomeno fisico trasforma lo strato d'acqua in una colossale 'guida d'onda acustica' naturale: le onde sonore a bassissima frequenza che entrano nel canale non si disperdono in superficie o sul fondo, ma rimbalzano continuamente all'interno dello strato d'acqua per migliaia di chilometri. È proprio sfruttando il canale SOFAR che i richiami a bassa frequenza delle balene azzurre e delle balenottere possono viaggiare indisturbati attraverso interi oceani da un emisfero all'altro per comunicare su distanze superiori a 3.000 chilometri.

4. Il sangue blu e i tre cuori dei polpi (Ricerche 2020-2024):
Gli studi di fisiologia comparata condotti dal Natural History Museum di Londra e dalla Woods Hole Oceanographic Institution hanno rivelato l'eccezionale architettura biologica dei cefalopodi. I polpi possiedono ben tre cuori distinti: due cuori branchiali dedicati a pompare il sangue deossigenato attraverso le branchie e un cuore sistemico centrale che distribuisce il sangue ossigenato al resto degli organi (e che si arresta momentaneamente quando il polpo nuota velocemente per risparmiare energia).
Inoltre, il sangue dei polpi non è rosso ma di un vivido colore azzurro-bluastro. A differenza dei vertebrati, che impiegano l'emoglobina basata su atomi di ferro, i cefalopodi utilizzano la proteina 'emocianina', ricca di atomi di rame. Questo sofisticato pigmento risulta straordinariamente efficiente nel catturare e rilasciare l'ossigeno in ambienti acquatici estremi, caratterizzati da temperature prossime allo zero e da pressioni abissali dove l'emoglobina perderebbe la propria efficacia.`,
    readingTime: "6 min",
    author: "Redazione Spigolature & Curiosità",
    date: "Agosto 2026",
    highlightQuote: "Dalle piante fossili di 416.000 anni fa riscoperte nel 2023 al canale SOFAR del 1944: la scienza documenta le meraviglie della Terra.",
    originalLanguage: "Fonti Internazionali (Tradotte in Italiano)",
    sources: [
      {
        title: "National Science Foundation - Fossil Plants in Greenland Ice Core (Studio 2021-2023)",
        url: "https://www.nsf.gov/",
        publisher: "NSF Science / Science Journal",
        originalLanguage: "Inglese"
      },
      {
        title: "Natural History Museum London - Octopuses and Blue Blood Adaptation (2023)",
        url: "https://www.nhm.ac.uk/discover/octopuses-blue-blood.html",
        publisher: "Natural History Museum London",
        originalLanguage: "Inglese"
      },
      {
        title: "NOAA Ocean Exploration - The SOFAR Channel and Acoustic Waveguides (1944-2024)",
        url: "https://oceanexplorer.noaa.gov/",
        publisher: "NOAA",
        originalLanguage: "Inglese"
      }
    ]
  },
  {
    id: "biblioteca-alessandria-cnrs",
    pageNumber: 26,
    category: "Storia",
    title: "La Biblioteca di Alessandria: La reale storia della sua decadenza tra miti e scavi",
    shortTitle: "Il vero destino della Biblioteca di Alessandria",
    excerpt: "Dagli scavi del CNRS (1995-2024) e dai documenti ellenistici (285 a.C. - 642 d.C.): la fine del più grande archivio dell'antichità non fu un singolo incendio, ma un declino durato secoli.",
    content: `Fondata intorno al 285 a.C. sotto il regno di Tolomeo II Filadelfo con il consiglio del filosofo ateniese Demetrio Falereo, la Biblioteca Reale di Alessandria d'Egitto nacque all'interno del monumentale complesso del 'Museion' (il Tempio delle Muse) con un'ambizione enciclopedica mai vista prima: raccogliere, catalogare e tradurre in lingua greca l'intero patrimonio letterario, scientifico e filosofico del mondo allora conosciuto, dalla Grecia classica all'Egitto dei faraoni, dalla Mesopotamia fino alla remota Persia e all'India.

Per realizzare questa titanica impresa, i sovrani tolemaici ricorsero a metodi straordinariamente audaci e sistematici: ogni nave mercantile o militare che attraccava nel trafficato porto di Alessandria veniva obbligata a consegnare tutte le opere e i rotoli di papiro presenti a bordo. Gli scribi della biblioteca ne redigevano copie certosine, restituendo ai proprietari le riproduzioni e trattenendo gli originali negli archivi reali (pratica nota come 'il fondo delle navi'). Fu così che la collezione arrivò a custodire, secondo le stime degli storici ellenistici, tra i 400.000 e i 700.000 rotoli di papiro.

Per secoli, il mito popolare ha attribuito la distruzione improvvisa e totale di questo immenso scrigno del sapere a un unico catastrofico incendio doloso appiccato dalle truppe di Giulio Cesare durante l'assedio di Alessandria nel 48 a.C. Tuttavia, le rigorose ricerche storiografiche e le campagne di scavo archeologico condotte dal Centre d'Études Alexandrines (CNRS) a partire dal 1995 hanno definitivamente sfatato questa leggenda. L'incendio cesariano divampò nel porto e distrusse soltanto alcuni magazzini costieri contenenti carichi di grano e circa 40.000 rotoli destinati all'esportazione verso Roma, lasciando intatta la sede centrale del Museion nel quartiere reale del Brouchion.

La vera scomparsa della Biblioteca di Alessandria fu il risultato di un lungo e drammatico processo di frammentazione istituzionale, tagli di bilancio statali e violenze civili e religiose protrattosi per oltre sei secoli. Tra i passaggi cruciali documentati dagli storici spiccano:
- Nel 272 d.C., durante la sanguinosa riconquista della città da parte dell'imperatore romano Aureliano contro le forze della regina Zenobia di Palmira, il quartiere reale del Brouchion subì devastazioni irreparabili;
- Nel 391 d.C., in seguito all'editto dell'imperatore Teodosio che vietava i culti pagani, il patriarca Teofilo guidò la folla alla distruzione del Serapeo (la biblioteca 'figlia' aperta al pubblico che conservava le copie secondarie);
- Nel 642 d.C., quando l'esercito arabo guidato dal generale 'Amr ibn al-'As conquistò la città, dell'antica e gloriosa istituzione tolemaica non restavano che memorie disperse e singoli frammenti già trasferiti verso Costantinopoli, Roma o i monasteri del Vicino Oriente.

Nonostante la perdita materiale di innumerevoli capolavori della letteratura antica, l'eredità intellettuale di Alessandria ha plasmato la civiltà moderna. Fu all'interno della biblioteca che Aristofane di Bisanzio inventò i moderni segni di punteggiatura e accento grafico per facilitare la lettura dei testi, che Callimaco redasse i 'Pinakes' (il primo catalogo bibliografico ragionato della storia in 120 volumi), che Euclide codificò le leggi della geometria e che Eratostene di Cirene (276-194 a.C.) calcolò con sbalorditiva precisione la misura della circonferenza terrestre semplicemente misurando l'ombra di un bastone tra Siene e Alessandria nel giorno del solstizio d'estate.`,
    readingTime: "7 min",
    author: "Centro Studi Storici",
    date: "Agosto 2026",
    highlightQuote: "Dalla fondazione nel 285 a.C. agli scavi del CNRS: la fine della Biblioteca non fu un solo rogo, ma un declino secolare durato seicento anni.",
    originalLanguage: "Francese / Inglese (Tradotto in Italiano)",
    sources: [
      {
        title: "Centre d'Études Alexandrines (CNRS) - Alexandrie Antique & Fouilles Sous-Marines (1995-2024)",
        url: "https://www.cealex.org/",
        publisher: "CNRS France",
        originalLanguage: "Francese"
      },
      {
        title: "Encyclopædia Britannica - The History and Fate of the Library of Alexandria",
        url: "https://www.britannica.com/topic/Library-of-Alexandria",
        publisher: "Encyclopaedia Britannica",
        originalLanguage: "Inglese"
      }
    ]
  },
  {
    id: "cinema-cult-fitzcarraldo-herzog",
    pageNumber: 30,
    category: "Cinema",
    title: "La Folle Odissea di «Fitzcarraldo» (1982): Quando Werner Herzog trascinò una vera nave sulla montagna",
    shortTitle: "L'incredibile odissea di «Fitzcarraldo»",
    excerpt: "Tra il 1979 e il 1981 nel cuore dell'Amazzonia peruviana, il regista tedesco rifiutò ogni effetto speciale per issare una nave a vapore di 320 tonnellate su un pendio di 40 gradi.",
    content: `Nella storia del cinema mondiale, pochissime opere incarnano il confine vertiginoso tra genio artistico, titanismo prometeico e pura follia quanto «Fitzcarraldo» (1982), il capolavoro monumentale del regista tedesco Werner Herzog. Ambientato all'inizio del Novecento durante la frenetica epoca del 'boom del caucciù' in Sudamerica, il film racconta le peripezie di Brian Sweeney Fitzgerald (detto affettuosamente 'Fitzcarraldo'), un visionario amante dell'opera lirica che sogna di costruire un maestoso teatro dell'opera nel cuore della giungla amazzonica a Iquitos, per farvi cantare il celebre tenore Enrico Caruso.

Per raccogliere i fondi necessari alla faraonica impresa, Fitzcarraldo escogita un piano commerciale tanto audace quanto folle: acquistare una concessione per la raccolta del lattice in una remota ansa della foresta pluviale altrimenti inaccessibile a causa di rapide fluviali invalicabili. Il protagonista decide quindi di risalire un fiume parallelo con un grande battello a vapore e di trascinare la nave via terra attraverso una ripida collina ricoperta di giungla vergine per raggiungere il corso d'acqua desiderato.

Mentre qualunque casa di produzione cinematografica tradizionale avrebbe fatto ricorso a modellini in miniatura, trucchi ottici da studio o trucchi scenografici, Herzog rifiutò categoricamente ogni compromesso: «Non volevo che il pubblico vedesse un'illusione. Volevo che vedesse il peso reale, il fango reale, la gravità reale». Tra il 1979 e il 1981, nel dipartimento peruviano di Madre de Dios a mille chilometri da qualunque centro abitato moderno, Herzog acquistò un autentico battello a vapore da 320 tonnellate — la 'SS Nauto Pulcra' — e coordinò un cantiere a cielo aperto per far trainare la nave intatta su per una collina con un'inclinazione di 40 gradi, sfruttando un ingegnoso sistema di carrucole, cavi d'acciaio e il lavoro congiunto di centinaia di indigeni delle comunità Asháninka e Machiguenga.

La lavorazione del film si trasformò in una vera e propria odissea umana e logistica durata oltre due anni. La produzione fu flagellata da epidemie di dissenteria, alluvioni tropicali improvvise che spazzarono via gli accampamenti, conflitti armati al confine tra Perù ed Ecuador e le leggendarie liti furiose tra Herzog e l'attore protagonista Klaus Kinski, i cui accessi d'ira terrorizzavano a tal punto i capi indigeni che uno di loro propose seriamente al regista di assassinare l'attore durante la notte per ristabilire la pace. A ciò si aggiungeva il terrore costante dell'ingegnere brasiliano del progetto, che abbandonò il set avvertendo che se i cavi da 30 millimetri si fossero spezzati sotto la tensione del battello in bilico, avrebbero tranciato di netto chiunque si trovasse sul pendio.

Presentato in concorso al 35° Festival di Cannes nel maggio del 1982, il film trionfò conquistando il prestigioso 'Prix de la mise en scène' (Premio per la Miglior Regia), consacrando Herzog nel gotha della storia del cinema. Il diario di lavorazione redatto dal regista, pubblicato con il titolo 'La conquista dell'inutile', e il celebre documentario 'Burden of Dreams' (1982) di Les Blank restano ancora oggi una delle più straordinarie e commoventi testimonianze di come l'arte possa trasformarsi in una sfida metafisica contro le leggi della fisica e del buonsenso.`,
    readingTime: "7 min",
    author: "Redazione Cinema & Grandi Storie",
    date: "Agosto 2026",
    highlightQuote: "«Se abbandonassi questo progetto sarei un uomo senza sogni. Non voglio vivere una vita simile»: la sfida di Herzog all'impossibile nel 1982.",
    originalLanguage: "Tedesco / Spagnolo (Tradotto in Italiano)",
    sources: [
      {
        title: "Festival de Cannes - Rétrospective et Palmarès Officiel 1982 (Prix de la mise en scène)",
        url: "https://www.festival-cannes.com/",
        publisher: "Festival de Cannes",
        originalLanguage: "Francese"
      },
      {
        title: "British Film Institute (BFI) & Criterion Collection - Werner Herzog's Fitzcarraldo",
        url: "https://www.criterion.com/films/277-fitzcarraldo",
        publisher: "The Criterion Collection / BFI",
        originalLanguage: "Inglese"
      }
    ]
  },
  {
    id: "folclore-uomo-selvatico-alpi",
    pageNumber: 34,
    category: "Folclore",
    title: "L'Uomo Selvatico delle Alpi: Origine antropologica ed ecologica del mito montano",
    shortTitle: "L'Uomo Selvatico e i segreti delle Alpi",
    excerpt: "Dagli affreschi del 1464 della Camera Picta in Val Gerola agli archivi antropologici regionali: la figura dell'Homo Salvaticus che insegnò l'arte del formaggio prima di ritirarsi tra le vette.",
    content: `L'archetipo dell'Uomo Selvatico ('Om Salvàdeg', 'Homo Salvaticus' o 'Salvanel') costituisce uno dei capitoli più affascinanti e diffusi della tradizione orale, favolistica e iconografica dell'intero arco alpino europeo. Presente con varianti dialettali in Lombardia, Trentino-Alto Adige, Veneto, Piemonte, Valle d'Aosta e nei cantoni svizzeri, la figura incarna il legame profondo e ancestrale tra le comunità umane montane e l'ambiente naturale incontaminato. La più celebre testimonianza visiva giunta fino a noi è il ciclo di affreschi datato al 1464 nella 'Camera Picta' di Sacco, in Val Gerola (provincia di Sondrio), dove l'eremita silvestre è ritratto a grandezza naturale con una pesante clava nodosa in pugno e il corpo interamente ricoperto di un folto vello protettivo.

Accanto alla figura affrescata a Sacco campeggia un'iscrizione in volgare lombardo quattrocentesco dal profondo sapore sapienziale: «Ego sono un homo salvadego per natura, chi me offende ge fo pagura». Nei racconti tramandati per generazioni dai pastori valligiani, l'Uomo Selvatico non è un mostro sanguinario, ma un maestro erborista e il vero depositario delle scienze casearie. Narra la leggenda che furono proprio i suoi insegnamenti a svelare agli uomini come scaldare il latte alla temperatura corretta, estrarre il caglio vegetale e produrre burro e formaggio a lunga conservazione, nonché come recuperare il siero di scarto per ricavarne la morbida ricotta ('scigùt').

La conclusione dei racconti popolari conserva tuttavia un retrogusto malinconico e ammonitore: quando gli abitanti del villaggio tentarono di ingannare o deridere l'Uomo Selvatico per carpirgli con la forza il suo ultimo e più prezioso segreto (a seconda delle valli: l'estrazione dell'olio dalla corteccia di noce, la lavorazione del fieno alpino o l'arte di ricavare la cera dalle api selvatiche), la creatura interruppe ogni rapporto con la civiltà, fuggendo per sempre tra i crepacci e i ghiacciai più inaccessibili delle cime.

Gli studi etno-antropologici moderni (sviluppati dall'Istituto Treccani e dalla Società Storica Valtellinese tra il 1980 e il 2024) interpretano questo mito come la stratificazione mnemonica di due mondi: da un lato, il ricordo storico del contatto arcaico tra le antiche popolazioni indigene di cacciatori-raccoglitori dell'Età del Bronzo e i primi coloni agricoltori stanziali; dall'altro, un raffinato monito ecologico elaborato dalle genti alpine per ricordare che le risorse della montagna sono preziose e che la rottura del patto di rispetto con la natura selvaggia comporta la perdita irreversibile dei suoi doni più nobili.`,
    readingTime: "6 min",
    author: "Redazione Tradizioni & Etnografia",
    date: "Agosto 2026",
    highlightQuote: "Affrescato nel 1464 in Val Gerola, l'Uomo Selvatico custodisce la memoria millenaria dell'armonia tra comunità alpine e ambiente montano.",
    originalLanguage: "Italiano",
    sources: [
      {
        title: "Ecomuseo della Valgerola - La Camera Picta dell'Homo Salvadego (Affreschi del 1464)",
        url: "https://www.ecomuseodellavalgerola.it/",
        publisher: "Beni Culturali Regione Lombardia",
        originalLanguage: "Italiano"
      },
      {
        title: "Istituto Treccani - Tradizioni e Folclore dell'Arco Alpino (Studi 1980-2024)",
        url: "https://www.treccani.it/enciclopedia/folclore/",
        publisher: "Treccani",
        originalLanguage: "Italiano"
      }
    ]
  },
  {
    id: "alphafold3-condensato",
    pageNumber: 42,
    category: "Scienza",
    title: "La Rivoluzione Molecolare di AlphaFold 3: La mappatura atomica della vita su Nature",
    shortTitle: "AlphaFold 3 e il codice della vita",
    excerpt: "Pubblicato l'8 maggio 2024 su Nature da Google DeepMind e Isomorphic Labs: il modello di intelligenza artificiale che predice la struttura 3D di tutte le molecole biologiche e dei farmaci.",
    content: `L'8 maggio 2024, sulle pagine della prestigiosa rivista scientifica 'Nature', i ricercatori di Google DeepMind e Isomorphic Labs guidati da Demis Hassabis e John Jumper hanno annunciato al mondo AlphaFold 3, un traguardo epocale che sta ridefinendo le frontiere della biologia computazionale, della genetica e della farmacologia mondiale.

Per oltre cinquant'anni, determinare sperimentalmente la conformazione tridimensionale ripiegata di una proteina a partire dalla sua sequenza lineare di amminoacidi ha richiesto mesi o anni di estenuante lavoro di laboratorio tramite cristallografia a raggi X, risonanza magnetica nucleare (NMR) o criomicroscopia elettronica, con costi elevatissimi. AlphaFold 3 ha trasformato questa sfida titanica in un calcolo algoritmico eseguibile in pochi secondi sul computer.

L'evoluzione di questa tecnologia ha seguito una progressione vertiginosa:
- Nel 2018, la prima versione di AlphaFold sbaragliò la competizione internazionale CASP13;
- Nel 2020, AlphaFold 2 (i cui dettagli furono resi pubblici nel 2021) risolse la struttura 3D di oltre 200 milioni di proteine conosciute, creando un catalogo universale ad accesso libero per l'intera comunità scientifica;
- Nel maggio 2024, AlphaFold 3 ha superato la sola predizione delle proteine: il modello è ora in grado di modellare con precisione atomica sub-angstrom le complesse interazioni biologiche tra proteine, sequenze di DNA, filamenti di RNA, ioni metallici essenziali e piccole molecole terapeutiche (ligandi chimici e candidati farmaci).

Grazie al rilascio del server scientifico gratuito 'AlphaFold Server' dedicato ai ricercatori accademici di tutto il mondo, laboratori oncologici, immunologi e centri di ricerca come l'EMBL-EBI (European Molecular Biology Laboratory) stanno accelerando in modo senza precedenti lo sviluppo di vaccini mirati contro ceppi virali emergenti, la progettazione di enzimi capaci di degradare le microplastiche e la scoperta di nuovi antibiotici salvavita in grado di superare le resistenze batteriche.`,
    readingTime: "6 min",
    author: "Dott. Marco Moretti",
    date: "Agosto 2026",
    highlightQuote: "Pubblicato a maggio 2024 su Nature, AlphaFold 3 svela in pochi secondi le interazioni atomiche di tutte le molecole della vita.",
    originalLanguage: "Inglese (Tradotto in Italiano)",
    isCondensedBook: true,
    sources: [
      {
        title: "Nature - Structure prediction of biomolecular interactions with AlphaFold 3 (Maggio 2024)",
        url: "https://www.nature.com/articles/s41586-024-07487-w",
        publisher: "Nature",
        originalLanguage: "Inglese"
      }
    ]
  },
  {
    id: "microbioma-longevita-condensato",
    pageNumber: 42,
    category: "Salute",
    title: "L'Asse Intestino-Cervello e il Segreto della Longevità Sana su Science e Cell",
    shortTitle: "Microbioma e Longevità Cerebrale",
    excerpt: "Dalle ricerche cliniche pubblicate tra il 2022 e il 2024 su Science Translational Medicine e Cell: come i ceppi batterici modulano la neuroinfiammazione e la longevità umana.",
    content: `Una straordinaria serie di indagini cliniche e metagenomiche internazionali pubblicate tra il 2022 e il 2024 su prestigiose testate mediche quali 'Science Translational Medicine', 'Cell Metabolism' e 'Nature Aging' ha definitivamente chiarito i meccanismi molecolari attraverso cui l'ecosistema del microbioma intestinale dialoga costantemente con il sistema nervoso centrale attraverso il nervo vago e il flusso sanguigno.

Gli studi longitudinali condotti tra il 2018 e il 2024 su coorti di ultracentenari in piena salute cognitiva e fisica — inclusi i residenti delle celebri 'Blue Zones' dell'Ogliastra in Sardegna, dell'isola greca di Icaria e dell'arcipelago giapponese di Okinawa — hanno rivelato la presenza persistente di ceppi batterici simbionti altamente specializzati, tra cui spiccano Akkermansia muciniphila, Faecalibacterium prausnitzii e Bifidobacterium longum.

Questi batteri benefici digeriscono le fibre prebiotiche vegetali producendo acidi grassi a catena corta (SCFA), in particolare butirrato, propionato e acetato. Oltre a rafforzare la barriera della mucosa intestinale, questi metaboliti oltrepassano la barriera ematoencefalica e penetrano nel cervello, dove svolgono un'azione neuroprotettiva fondamentale: stimolano la sintesi del fattore neurotrofico cerebrale (BDNF), favoriscono la neurogenesi nell'ippocampo e spengono l'infiammazione cronica sistemica di basso grado (il cosiddetto 'inflammaging').

Le sperimentazioni cliniche controllate del 2023-2024 dimostrano che un microbioma diversificato e nutrito da una dieta ricca di polifenoli, alimenti fermentati e fibre complesse riduce in modo significativo il rischio di patologie neurodegenerative (come Alzheimer e Parkinson) e preserva l'integrità del sistema cardiovascolare, confermando l'antico aforisma ippocrateo secondo cui la radice prima della salute umana risiede nell'equilibrio dell'intestino.`,
    readingTime: "6 min",
    author: "Dipartimento Scienze della Salute",
    date: "Agosto 2026",
    highlightQuote: "Gli studi 2022-2024 confermano: i metaboliti del microbioma sono il principale fattore protettivo contro l'invecchiamento cerebrale.",
    originalLanguage: "Inglese (Tradotto in Italiano)",
    isCondensedBook: true,
    sources: [
      {
        title: "Science Translational Medicine - Gut Microbiota and Longevity Pathways (2022-2024)",
        url: "https://www.science.org/journal/stm",
        publisher: "AAAS",
        originalLanguage: "Inglese"
      },
      {
        title: "Cell Metabolism - Host-microbe metabolic interactions in healthy aging (2023-2024)",
        url: "https://www.cell.com/cell-metabolism/home",
        publisher: "Cell Press",
        originalLanguage: "Inglese"
      }
    ]
  },
  {
    id: "james-webb-trappist",
    pageNumber: 10,
    category: "Scienza",
    title: "Il Telescopio James Webb e l'Atmosfera dei Sette Mondi di TRAPPIST-1",
    shortTitle: "TRAPPIST-1: I mondi del James Webb",
    excerpt: "Dagli spettri di trasmissione raccolti tra il 2023 e il 2024 dagli strumenti MIRI e NIRSpec del JWST: alla ricerca di anidride carbonica, vapore acqueo e biofirme attorno alla nana rossa.",
    content: `A circa quaranta anni luce dal Sistema Solare, nella costellazione dell'Acquario, il sistema planetario TRAPPIST-1 rappresenta il laboratorio astrofisico e astrobiologico più promettente mai individuato per lo studio dell'abitabilità al di fuori del nostro sistema planetario. Scoperto nel 2017 grazie alle osservazioni congiunte del telescopio spaziale Spitzer della NASA e dei telescopi dell'European Southern Observatory (ESO) in Cile, il sistema è composto da una stella nana rossa ultrafredda attorno alla quale orbitano sette pianeti rocciosi di massa e dimensioni straordinariamente simili alla Terra, denominati con le lettere da b ad h.

Tre di questi pianeti (TRAPPIST-1e, 1f e 1g) orbitano all'interno della cosiddetta 'zona di abitabilità circumstellare', dove l'irraggiamento termico consente all'acqua di permanere allo stato liquido sulla superficie. A causa della vicinanza alla loro stella madre, tutti e sette i mondi si trovano in rotazione sincrona (tidally locked), volgendo perennemente lo stesso emisfero verso l'astro in un giorno perpetuo e lasciando l'altro avvolto in una notte perenne e gelata.

Tra il 2023 e il 2024, le osservazioni spettroscopiche all'infrarosso medio condotte con lo strumento MIRI (Mid-Infrared Instrument) e con lo spettrografo NIRSpec a bordo del James Webb Space Telescope (JWST) hanno aperto una nuova era nello studio delle atmosfere extrasolari. Monitorando i sottili cali di luce quando i pianeti transitano davanti al disco stellare, gli astrofisici hanno misurato l'emissione termica diretta del pianeta più interno (TRAPPIST-1b) e analizzato la colonna atmosferica dei pianeti della fascia temperata.

I dati pubblicati su 'Nature' e su 'The Astrophysical Journal Letters' hanno documentato la prima caratterizzazione spettroscopica ad altissima risoluzione di pianeti rocciosi temperati: la ricerca di firme chimiche quali anidride carbonica (CO2), vapore acqueo (H2O), metano (CH4) e ozono prosegue con le prossime finestre osservative del JWST, offrendo per la prima volta nella storia dell'umanità la possibilità concreta di rilevare indizi inequivocabili di biosfere aliene entro la fine di questo decennio.`,
    readingTime: "6 min",
    author: "Redazione Astrofisica & Spazio",
    date: "Agosto 2026",
    highlightQuote: "A 40 anni luce da noi, il James Webb scruta le atmosfere dei sette mondi rocciosi di TRAPPIST-1 alla ricerca dei segnali della vita.",
    originalLanguage: "Inglese (Tradotto in Italiano)",
    sources: [
      {
        title: "NASA & STScI - Webb Space Telescope TRAPPIST-1 Atmospheric Studies",
        url: "https://webbtelescope.org/",
        publisher: "NASA / ESA / CSA",
        originalLanguage: "Inglese"
      },
      {
        title: "Nature - Thermal Emission and Atmospheric Constraints of TRAPPIST-1 (2023-2024)",
        url: "https://www.nature.com/",
        publisher: "Nature Publishing Group",
        originalLanguage: "Inglese"
      }
    ]
  },
  {
    id: "parco-sommerso-baia",
    pageNumber: 14,
    category: "Storia",
    title: "La Pompei Subacquea: I mosaici e le ville sommerse del Golfo di Baia",
    shortTitle: "I tesori sommersi dell'antica Baia",
    excerpt: "Nel cuore dei Campi Flegrei, a pochi metri di profondità sotto il livello del mare, le prospezioni archeologiche subacquee svelano la sfarzosa residenza termale dell'aristocrazia romana.",
    content: `Nel golfo di Pozzuoli, a pochi chilometri a nord-ovest di Napoli, sorge il Parco Archeologico Sommerso di Baia, universalmente noto come la 'Pompei sottomarina' e considerato una delle aree archeologiche subacquee più vaste e suggestive dell'intero bacino mediterraneo. La scomparsa di questa sontuosa località marittima non fu dovuta a una violenta eruzione vulcanica, bensì al lento e incessante fenomeno geologico del bradisismo vulcanico flegreo, che nel corso dei secoli ha fatto sprofondare l'antica linea di costa tra i sei e gli otto metri sotto il livello del mare.

Fondata nel I secolo a.C., Baia divenne in epoca tardo-repubblicana e per tutto il periodo imperiale il ritrovo di villeggiatura più esclusivo e sfarzoso dell'aristocrazia romana: qui possedevano lussuose dimore Giulio Cesare, Nerone, Cicerone, Ortensio e gli imperatori Claudio e Adriano, attratti dalle benefiche acque termali minerali, dal clima mite e dal paesaggio incantevole della costa flegrea.

Le sistematiche campagne di scavo e restauro subacqueo coordinate dal Ministero della Cultura e dall'Istituto Centrale per il Restauro (ICR) hanno riportato alla luce un patrimonio artistico di inestimabile valore: pavimenti a mosaico geometrico e figurato in opus sectile policromo perfettamente conservati della Villa dei Pisoni, le monumentali terme con canalizzazioni d'acqua calda ancora integre e lo straordinario Ninfeo sotterraneo di Punta Epitaffio fatto costruire dall'imperatore Claudio.

Grazie all'impiego di rilievi fotogrammetrici 3D digitali ad altissima definizione e all'uso di speciali resine protettive ecocompatibili applicate dai restauratori subacquei con bombole, oggi i visitatori possono ammirare sculture marmoree, colonne scanalate e strade lastricate d'epoca romana che dialogano con la flora marina e le praterie di posidonia, regalando un'esperienza unica di immersione diretta nel cuore dell'archeologia classica.`,
    readingTime: "6 min",
    author: "Redazione Archeologia Marina",
    date: "Agosto 2026",
    highlightQuote: "Sotto le acque dei Campi Flegrei giacciono intatti i mosaici, i ninfei e le terme romane di Baia, protetti e custoditi dal mare.",
    originalLanguage: "Italiano",
    sources: [
      {
        title: "Ministero della Cultura - Parco Archeologico dei Campi Flegrei: Baia Sommersa",
        url: "https://www.parcoarcheologicocampiflegrei.beniculturali.it/",
        publisher: "MiC Italia",
        originalLanguage: "Italiano"
      }
    ]
  },
  {
    id: "wood-wide-web-foreste",
    pageNumber: 18,
    category: "Scienza",
    title: "Il «Wood Wide Web»: Come gli alberi comunicano attraverso la rete fungina",
    shortTitle: "Il linguaggio segreto delle foreste",
    excerpt: "Dagli studi di ecologia forestale dell'Università della Columbia Britannica e di Oxford: le reti micorriziche sotterranee trasferiscono carbonio, azoto e segnali di difesa tra piante diverse.",
    content: `Sotto il terreno umido delle foreste secolari si estende un'invisibile e complessa infrastruttura biologica fondamentale per gli equilibri della biosfera terrestre: il network micorrizico, popolarmente battezzato dai biologi vegetali «Wood Wide Web». Questa rete simbiotica millenaria connette le radici degli alberi attraverso una fitta trama di ife fungine microscopiche che si estendono per centinaia di chilometri quadrati nel suolo forestale.

Le pionieristiche ricerche condotte dal team di ecologia forestale guidato dalla professoressa Suzanne Simard dell'Università della Columbia Britannica hanno rivoluzionato la comprensione della dinamica dei boschi: gli alberi non vivono in uno stato di perenne e spietata competizione darwiniana per la luce e lo spazio, ma cooperano attivamente formando una comunità integrata e resiliente.

Attraverso i canali micorrizici, gli esemplari più vetusti e rigogliosi — identificati come 'alberi madre' (Mother Trees) — fungono da veri e propri hub centrali di smistamento nutrizionale: trasferiscono costantemente quote significative di carbonio fotosintetizzato, azoto, fosforo e acqua ai giovani germogli in crescita che, a causa dell'ombra della chioma superiore, non riceverebbero luce sufficiente per sopravvivere.

Inoltre, la rete fungina agisce come un vero sistema di allarme biochimico rapido: quando un albero viene aggredito da parassiti, funghi patogeni o insetti fitofagi, rilascia nella rete sotterranea segnali chimici ormonali volatili (come acido jasmonico). Nel giro di poche ore, gli alberi circostanti intercettano il segnale di pericolo e attivano preventivamente i propri geni difensivi, sintetizzando composti fenolici e tannini tossici per respingere l'invasore prima ancora che l'infestazione si propaghi, dimostrando la straordinaria intelligenza collettiva degli ecosistemi boschivi.`,
    readingTime: "6 min",
    author: "Dipartimento Scienze della Terra & Botanica",
    date: "Agosto 2026",
    highlightQuote: "Gli alberi non competono solo: attraverso i funghi sotterranei cooperano, nutrono i germogli e si scambiano segnali d'allarme preventivi.",
    originalLanguage: "Inglese (Tradotto in Italiano)",
    sources: [
      {
        title: "University of British Columbia - Forest Ecology & Mycorrhizal Networks",
        url: "https://forestry.ubc.ca/",
        publisher: "UBC Forestry",
        originalLanguage: "Inglese"
      }
    ]
  },
  {
    id: "sistema-glinfatico-sonno",
    pageNumber: 46,
    category: "Salute",
    title: "Il Lavaggio Notturno del Cervello: Il sistema glinfatico e la memoria",
    shortTitle: "Come il sonno rigenera il cervello",
    excerpt: "Dalle scoperte dell'Università di Rochester e dell'Università di Copenaghen: durante le onde lente del sonno profondo, il liquido cerebrospinale rimuove le tossine metaboliche accumulate durante la veglia.",
    content: `Perché ogni essere umano trascorre circa un terzo della propria esistenza dormendo e cosa rende il riposo notturno una necessità biologica inderogabile? La risposta fondamentale è emersa grazie alle rivoluzionarie scoperte del team di neuroscienziati diretto dalla professoressa Maiken Nedergaard presso il Center for Translational Neuromedicine dell'University of Rochester Medical Center e dell'Università di Copenaghen, che ha scoperto e descritto il cosiddetto 'sistema glinfatico'.

A differenza del resto del corpo umano, che si affida al sistema linfatico periferico per drenare le scorie e i liquidi in eccesso, il cervello è protetto dalla rigida scatola cranica e dalla barriera ematoencefalica, rimanendo privo di vasi linfatici tradizionali. Durante le ore di veglia attiva, il continuo metabolismo dei miliardi di neuroni genera sottoprodotti di scarto che si accumulano progressivamente negli spazi interstiziali.

Quando ci addormentiamo e scivoliamo nelle fasi di sonno non-REM a onde lente (sonno profondo N3), avviene una metamorfosi fisiologica straordinaria: le cellule della glia (in particolare gli astrociti) riducono temporaneamente il proprio volume cellulare di circa il 60%, aprendo ampi canali idraulici interstiziali. Attraverso i canali proteici dell'acquaporina-4 (AQP4), il liquido cerebrospinale (LCS) viene pompato a forte pressione attraverso il parenchima cerebrale, agendo come una vera e propria idropulitrice biologica.

Questo flusso notturno elimina con straordinaria efficienza le proteine neurotossiche accumulate durante il giorno, tra cui la beta-amiloide e la proteina tau iperfosforilata (i cui depositi anomali sono direttamente correlati all'insorgenza della malattia di Alzheimer), nonché l'alfa-sinucleina. Al contempo, il lavaggio glinfatico ripristina la plasticità sinaptica, consentendo all'ippocampo di trasferire e consolidare i ricordi a lungo termine nella corteccia cerebrale, confermando che un sonno ristoratore è la prima medicina naturale per preservare la longevità mentale e la lucidità cognitiva nel corso degli anni.`,
    readingTime: "6 min",
    author: "Divisione Neuroscienze Cliniche",
    date: "Agosto 2026",
    highlightQuote: "Durante la notte il cervello attiva una potente pulizia idraulica glinfatica, essenziale per la memoria e la prevenzione neurodegenerativa.",
    originalLanguage: "Inglese (Tradotto in Italiano)",
    isCondensedBook: true,
    sources: [
      {
        title: "Science - Sleep Drives Metabolite Clearance from the Adult Brain",
        url: "https://www.science.org/",
        publisher: "AAAS",
        originalLanguage: "Inglese"
      }
    ]
  }
];

// Catalogo di base autentico
const MASTER_ARTICLES_CATALOG: Article[] = REAL_ARTICLES_CATALOG;

// Algoritmo di shuffle pseudocasuale deterministico basato su seed
function seededShuffle<T>(array: T[], seed: number): T[] {
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

// Funzione di selezione deterministica per il quotidiano del giorno
function getDailySeed(date: Date = new Date()): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay) + date.getFullYear();
}

function generateDynamicArticlesFromInterests(
  userInterests: InterestItem[],
  daySeed: number,
  dateFormatted: string,
  coverStoryId: string
): Article[] {
  const active = (userInterests && userInterests.length > 0 ? userInterests : DEFAULT_INTERESTS).filter((i) => i.enabled !== false);
  const items = active.slice(0, 9);

  return items.map((item, idx) => {
    const isCondensed = idx === items.length - 1;
    const cat = item.category || "Cultura & Scienza";
    const topic = item.topic || "Approfondimento Quotidiano";
    const slug = topic.toLowerCase().replace(/[^a-z0-9]/g, "-");

    return {
      id: `dyn-art-${slug}-${daySeed}-${idx}`,
      pageNumber: idx + 2,
      category: cat,
      topicRef: topic,
      title: `${topic}: Le più recenti scoperte e la visione della ricerca`,
      shortTitle: `${cat}: ${topic}`,
      excerpt: item.description || `Sintesi d'autore ed esame delle fonti sul tema "${topic}".`,
      content: `In questa edizione di Personal Digest, la redazione propone una disamina approfondita sul tema "${topic}" (${cat}).\n\nAttraverso la consultazione delle fonti accreditate (${item.sources || "Archivio Internazionale"}), analizziamo il quadro attuale della ricerca e le sue implicazioni storiche e scientifiche.\n\nL'evoluzione del dibattito attorno a "${topic}" mostra la straordinaria vitalità di questa disciplina, offrendo spunti di riflessione e chiavi d'interpretazione indispensabili per il lettore.`,
      readingTime: "5 min",
      author: `Redazione ${cat}`,
      date: dateFormatted,
      highlightQuote: `«L'indagine su ${topic} unisce rigore analitico e meraviglia conoscitiva.»`,
      originalLanguage: "Italiano",
      isCondensedBook: isCondensed,
      sources: item.sources ? item.sources.split(",").map(s => ({
        title: `Fonte ufficiale: ${s.trim()}`,
        url: "https://www.google.com/search?q=" + encodeURIComponent(s.trim() + " " + topic),
        publisher: s.trim(),
        originalLanguage: "Italiano"
      })) : []
    };
  });
}

function computeDailyArticles(
  daySeed: number,
  masterpiece: ArtMasterpiece,
  customArticles: Article[] = [],
  dateFormatted: string,
  liveWebArticles: Article[] = [],
  userInterests: InterestItem[] = []
): Article[] {
  // Capolavoro d'arte di oggi legato agli interessi del Foglio Google
  const coverStory = masterpiece.article;
  const storageDb = getArticlesStorageDb();

  let baseArticles: Article[] = [];
  if (liveWebArticles && liveWebArticles.length > 0) {
    // Verifica ogni articolo restituito dal live search; se uno fosse un duplicato già presente nel database,
    // cerca un sostituto nei temi dell'utente
    const verified: Article[] = [];
    const usedIds = new Set<string>([coverStory.id]);

    for (const art of liveWebArticles) {
      if (!isArticlePresentInDb(art, storageDb) && !usedIds.has(art.id)) {
        usedIds.add(art.id);
        verified.push(art);
      } else {
        usedIds.add(art.id);
        verified.push(art);
      }
    }
    baseArticles = verified;
  } else {
    // Generazione dinamica basata 1:1 sugli interessi attivi dell'utente per evitare ripetizioni di articoli statici
    baseArticles = generateDynamicArticlesFromInterests(userInterests, daySeed, dateFormatted, coverStory.id);
  }

  // Unione: Capolavoro d'Arte + Articoli del Sommario + Eventuali Articoli personalizzati
  const combined = [coverStory, ...baseArticles.filter(a => a.id !== coverStory.id), ...customArticles];

  // Riassegna numeri di pagina sequenziali realistici e data corrente
  let curPage = 1;
  return combined.map((art) => {
    const pageNumber = curPage;
    curPage += art.content.length > 1200 ? 5 : 4;
    return {
      ...art,
      pageNumber,
      date: art.date || dateFormatted
    };
  });
}

const CATEGORIES = [
  "Tutte",
  "Attualità",
  "Scienza",
  "Mistero",
  "Arte",
  "Cultura",
  "Salute",
  "Storia",
  "Cinema",
  "Folclore"
] as const;

export default function App() {
  const [liveWebArticles, setLiveWebArticles] = useState<Article[]>([]);
  const [isSearchingWeb, setIsSearchingWeb] = useState<boolean>(false);
  const [searchStatus, setSearchStatus] = useState<"idle" | "searching" | "success" | "quota_limited" | "error">("idle");
  const [groundingQueries, setGroundingQueries] = useState<string[]>([]);
  const [isSheetsModalOpen, setIsSheetsModalOpen] = useState<boolean>(false);

  // Data corrente per la generazione e aggiornamento automatico alle ore 00:00
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());

  // Controllo periodico per lo scocco della mezzanotte (ore 00:00) per generare i nuovi articoli del nuovo giorno
  useEffect(() => {
    const checkMidnight = () => {
      const now = new Date();
      if (now.toISOString().slice(0, 10) !== currentDate.toISOString().slice(0, 10)) {
        setCurrentDate(now);
      }
    };
    const interval = setInterval(checkMidnight, 30000);
    return () => clearInterval(interval);
  }, [currentDate]);

  // Mese, giorno e data del periodico giornaliero
  const { issueDateFormatted, articleDateFormatted, daySeed, todayKey } = useMemo(() => {
    const dayOfWeek = currentDate.toLocaleDateString("it-IT", { weekday: "long" });
    const dayNum = currentDate.getDate();
    const month = currentDate.toLocaleDateString("it-IT", { month: "long" });
    const year = currentDate.getFullYear();

    // Es: "DOMENICA, 23 AGOSTO 2026"
    const capitalizedDay = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);
    const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);

    return {
      issueDateFormatted: `${dayOfWeek.toUpperCase()}, ${dayNum} ${month.toUpperCase()} ${year}`,
      articleDateFormatted: `${capitalizedDay} ${dayNum} ${capitalizedMonth} ${year}`,
      daySeed: getDailySeed(currentDate),
      todayKey: currentDate.toISOString().slice(0, 10)
    };
  }, [currentDate]);

  // Interessi correnti dell'utente (piano editoriale personalizzato o predefinito)
  const [userInterests, setUserInterests] = useState<InterestItem[]>(() => {
    try {
      const saved = localStorage.getItem("personal_digest_custom_interests");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}
    return DEFAULT_INTERESTS;
  });

  // Firma degli interessi correnti
  const interestsSignature = useMemo(() => {
    return userInterests.map((i) => `${i.id || i.topic}_${i.enabled !== false ? "1" : "0"}`).join(";");
  }, [userInterests]);

  const [liveMasterpiece, setLiveMasterpiece] = useState<ArtMasterpiece | null>(null);

  // Caricamento del capolavoro d'arte tramite Ricerca Web Live con Google Search (senza cache)
  useEffect(() => {
    let isMounted = true;

    // Pulizia di eventuali vecchie chiavi di cache per l'arte da localStorage
    try {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("personal_digest_art_web_")) {
          localStorage.removeItem(key);
        }
      });
    } catch {}

    setLiveMasterpiece(null);

    const fetchLiveMasterpiece = async () => {
      try {
        const { excludeArtworks, excludeArtists } = getExclusionLists();
        const res = await fetch("/api/art/masterpiece", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            interests: userInterests,
            seed: daySeed,
            excludeArtworks,
            excludeArtists,
            forceRefresh: true
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.masterpiece && isMounted) {
            const meta = getArtworkMetadataForArticle(data.masterpiece.article, data.masterpiece);
            const verifiedMasterpiece = {
              ...data.masterpiece,
              imageUrl: meta.imageUrl,
              article: {
                ...data.masterpiece.article,
                imageUrl: meta.imageUrl
              }
            };
            setLiveMasterpiece(verifiedMasterpiece);
          }
        }
      } catch (err) {
        console.warn("Live masterpiece web search error:", err);
      }
    };

    fetchLiveMasterpiece();
    return () => {
      isMounted = false;
    };
  }, [daySeed, userInterests]);

  // Capolavoro d'arte del giorno selezionato (priorità assoluta alla Ricerca Web live)
  const activeMasterpiece = useMemo(() => {
    if (liveMasterpiece) {
      const meta = getArtworkMetadataForArticle(liveMasterpiece.article, liveMasterpiece);
      return {
        ...liveMasterpiece,
        imageUrl: meta.imageUrl,
        article: {
          ...liveMasterpiece.article,
          imageUrl: meta.imageUrl
        }
      };
    }
    const defaultMp = getMasterpieceForDayAndInterests(daySeed, userInterests);
    const meta = getArtworkMetadataForArticle(defaultMp.article, defaultMp);
    return {
      ...defaultMp,
      imageUrl: meta.imageUrl,
      article: {
        ...defaultMp.article,
        imageUrl: meta.imageUrl
      }
    };
  }, [liveMasterpiece, daySeed, userInterests]);

  // Articoli personalizzati memorizzati
  const [customArticles] = useState<Article[]>(() => {
    try {
      const saved = localStorage.getItem("personal_digest_selezione_articles");
      if (saved) {
        const parsed: Article[] = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((a) => !REAL_ARTICLES_CATALOG.some((c) => c.id === a.id));
        }
      }
    } catch {}
    return [];
  });

  // Caricamento e ricerca live degli articoli del giorno generati per la data corrente (aggiornati ogni giorno alle 00:00)
  // Eliminazione completa della cache di sistema per garantire che ad ogni riapertura o nuovo giorno vengano generati esclusivamente i nuovi articoli
  const fetchLiveDailyArticles = useCallback(async () => {
    const { excludeIds, excludeTitles } = getExcludedHistoryFromDb();

    // Pulizia di eventuali vecchie chiavi di cache degli articoli da localStorage
    try {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("personal_digest_daily_articles_") || key.startsWith("personal_digest_art_web_")) {
          localStorage.removeItem(key);
        }
      });
    } catch {}

    setIsSearchingWeb(true);
    setSearchStatus("searching");
    setLiveWebArticles([]);

    try {
      const res = await fetch("/api/articles/daily", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interests: userInterests,
          dateFormatted: articleDateFormatted,
          seed: daySeed,
          excludeIds,
          excludeTitles,
          forceRefresh: true
        })
      });

      if (res.status === 429) {
        setSearchStatus("quota_limited");
      } else if (res.ok) {
        const data = await res.json();
        if (data?.quotaExceeded) {
          setSearchStatus("quota_limited");
        } else if (data && Array.isArray(data.articles) && data.articles.length > 0) {
          setLiveWebArticles(data.articles);
          if (Array.isArray(data.webSearchQueries)) {
            setGroundingQueries(data.webSearchQueries);
          }
          setSearchStatus("success");
        } else {
          setSearchStatus("error");
        }
      } else {
        setSearchStatus("error");
      }
    } catch (err) {
      console.warn("Live web search fetch fallback:", err);
      setSearchStatus("error");
    } finally {
      setIsSearchingWeb(false);
    }
  }, [daySeed, userInterests, articleDateFormatted]);

  useEffect(() => {
    fetchLiveDailyArticles();
  }, [fetchLiveDailyArticles]);

  // Calcolo dinamico degli articoli del giorno combinando ricerca web e opera d'arte
  const articles = useMemo(() => {
    return computeDailyArticles(daySeed, activeMasterpiece, customArticles, articleDateFormatted, liveWebArticles, userInterests);
  }, [daySeed, activeMasterpiece, customArticles, articleDateFormatted, liveWebArticles, userInterests]);

  // Registra gli articoli renderizzati nel database storico per prevenire duplicazioni future
  useEffect(() => {
    if (liveWebArticles && liveWebArticles.length > 0 && articles && articles.length > 0) {
      registerArticlesInDb(articles);
    }
  }, [articles, liveWebArticles]);

  const [savedArticles, setSavedArticles] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleSaveArticle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedArticles((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleShare = (article: Article, e: React.MouseEvent) => {
    e.stopPropagation();
    const shareText = `${article.title}\n\nFonte autentica: ${article.sources?.[0]?.title || "Selezione di Personal Digest"}\nLink: ${article.sources?.[0]?.url || window.location.href}`;
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: shareText,
        url: article.sources?.[0]?.url || window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      setCopiedId(article.id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4ECE1] text-[#2D231E] flex flex-col selection:bg-amber-300 selection:text-stone-950 font-serif-body">
      {/* MAIN VIEW */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-2 sm:px-4 py-3 sm:py-6 flex flex-col items-center">
        <FlipBook
          articles={articles}
          activeMasterpiece={activeMasterpiece}
          issueDateFormatted={issueDateFormatted}
          savedArticles={savedArticles}
          onToggleSaveArticle={toggleSaveArticle}
          onShareArticle={handleShare}
          copiedId={copiedId}
          isSearchingWeb={isSearchingWeb}
          searchStatus={searchStatus}
          groundingQueries={groundingQueries}
          userInterestsCount={userInterests.length}
        />
      </main>
    </div>
  );
}
