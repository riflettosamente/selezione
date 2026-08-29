import { DigestEdition } from "../types";

export const SAMPLE_DIGEST: DigestEdition = {
  id: "issue-1-fondazione",
  issueNumber: 1,
  editionTitle: "Enigmi Sommersi & Orizzonti Quantistici",
  editionSubtitle: "Un viaggio tra le pietre dimenticate del passato remoto e le invisibili trame della fisica contemporanea",
  publicationDate: "Agosto 2026",
  readingTimeMinutes: 12,
  topicsUsedCount: 6,
  editorial: {
    title: "Dalla Scrivania dell'Editor Capo: La Sete dell'Invisibile",
    author: "L'Editor Capo",
    role: "Direttore Editoriale, Personal Digest",
    content: "Benvenuti al primo numero di questo digest personale, pensato non per inseguire il frastuono delle notizie effimere, ma per nutrire quella curiosità profonda e contemplativa che contraddistingue gli spiriti più attenti.\n\nIn questa uscita abbiamo selezionato per voi i temi a più alta risonanza: dai misteri delle ciclopiche architetture megalitiche sommerse che sfidano i manuali di cronologia convenzionale, fino agli enigmi indecifrati come il manoscritto Voynich, passando per le vertigini concettuali della meccanica quantistica e i segnali dagli esopianeti lontani. Buona lettura e buona esplorazione.",
    quote: "La mente non è un vaso da riempire, ma un fuoco da accendere.",
  },
  sections: [
    {
      category: "Archeologia Misteriosa",
      iconSuggestion: "Scroll",
      articles: [
        {
          id: "art-1",
          title: "L'enigma di Gunung Padang: Quando il sottosuolo riscrive la preistoria",
          subtitle: "Le nuove indagini con georadar e tomografia sismica svelano camere nascoste sotto la collina di Giava",
          topicRef: "Megaliti, strutture sommerse e civiltà antiche antidiluviane",
          priority: 5,
          readTime: "4 min",
          badge: "Scoperte & Controversie",
          content: "Immersa nella lussureggiante vegetazione dell'isola di Giava occidentale, la collina terrazzata di Gunung Padang continua a scuotere la comunità accademica internazionale. Non si tratta di una semplice collina naturale con lastre basaltiche sovrapposte, bensì di una stratificazione artificiale complessa sviluppatasi in molteplici ere.\n\nI più recenti carotaggi profondi e le scansioni tridimensionali del sottosuolo hanno confermato la presenza di cavità regolari e strati lavorati a mano che risalgono a ben oltre 10.000 anni fa, collocandosi nel periodo tardo-pleistocenico. Se queste datazioni dovessero trovare unanime consenso, significherebbe che società umane complesse possedevano capacità ingegneristiche monumentali ben prima della nascita ufficiale dell'agricoltura in Mesopotamia.",
          keyTakeaway: "La civiltà umana potrebbe aver conosciuto cicli di fioritura e collasso molto più arcaici e complessi di quanto la storiografia lineare abbia finora ammesso.",
          sourceContext: "Rilievi tomografici e studi multidisciplinari condotti da team geologici e archeologici internazionali."
        },
        {
          id: "art-2",
          title: "Le terrazze sommerse di Yonaguni: Geologia bizzarra o opera d'uomo?",
          subtitle: "A trenta metri sotto le acque delle isole Ryukyu, scalinate e monoliti ad angolo retto sfidano le correnti oceaniche",
          topicRef: "Megaliti, strutture sommerse e civiltà antiche antidiluviane",
          priority: 5,
          readTime: "3 min",
          badge: "Misteri Oceanici",
          content: "Scoperte casualmente da un subacqueo locale a caccia di squali martello negli anni Ottanta, le formazioni sottomarine di Yonaguni sembrano una città pietrificata inghiottita dal mare. Piattaforme terrazzate, scanalature geometriche e scalini apparentemente tagliati con regolarità millimetrica emergono dai fondali nipponici.\n\nSebbene i geologi più scettici vi ravvisino l'azione di fratture naturali nell'arenaria dovute all'intensa attività sismica della faglia pacifica, molti ricercatori evidenziano dettagli difficilmente attribuibili al moto ondoso, come fori circolari di alloggiamento per pali e due pietre monumentali parallele ribattezzate 'le rocce sentinella'. Il mistero rimane aperto: opera naturale scolpita dal caso o vestigia di quando quelle terre erano all'asciutto durante l'ultima glaciazione?",
          keyTakeaway: "Il fondale marino custodisce oltre il 90% delle terre emerse dell'ultima era glaciale: l'archeologia marina è la vera frontiera del nostro passato.",
          sourceContext: "Archivi di Oceanografia e spedizioni marine dell'Università delle Ryukyu."
        }
      ]
    },
    {
      category: "Frontiere della Fisica",
      iconSuggestion: "Atom",
      articles: [
        {
          id: "art-3",
          title: "Entanglement e Spaziotempo: La realtà è tessuta dall'informazione quantistica?",
          subtitle: "La celebre congettura ER=EPR suggerisce che i ponti di Einstein-Rosen e l'intreccio quantistico siano la stessa cosa",
          topicRef: "Fisica quantistica, multiverso e anomalie nello spaziotempo",
          priority: 5,
          readTime: "4 min",
          badge: "Fisica Teorica",
          content: "Quando Albert Einstein definì l'entanglement 'una spettrale azione a distanza', intendeva evidenziare un paradosso insostenibile per la fisica classica. Oggi, invece, i teorici più all'avanguardia ritengono che questo fenomeno non sia un'eccezione stravagante, ma il mattone fondamentale su cui si regge l'intero tessuto dello spazio e del tempo.\n\nSecondo l'ipotesi formulata da fisici di spicco, la continuità dello spaziotempo geometrico non è una proprietà primitiva della natura, ma un effetto emergente generato da miliardi di particelle quantisticamente correlate tra loro. Rimuovendo l'entanglement, lo spazio stesso si dissolverebbe in frammenti disconnessi, aprendo una porta senza precedenti verso la tanto agognata Gravità Quantistica.",
          keyTakeaway: "Ciò che percepiamo come 'spazio' e 'distanza' potrebbe essere un'illusione ottica della nostra scala macroscopica: al fondo dell'universo risiede solo informazione pura.",
          sourceContext: "Rielaborazione da recenti pubblicazioni su Physical Review e Nature Physics."
        }
      ]
    },
    {
      category: "Misteri & Criptografia",
      iconSuggestion: "Compass",
      articles: [
        {
          id: "art-4",
          title: "Il Codice Voynich: L'algoritmo genetico e l'ombra del linguaggio sintetico",
          subtitle: "Centoventiquattro pagine miniate di piante inesistenti e costellazioni immaginarie che continuano a beffare i decrittatori",
          topicRef: "Manoscritti indecifrati, manufatti anomali e codici storici",
          priority: 5,
          readTime: "3 min",
          badge: "Enigma Storico",
          content: "Custodito nel caveau della Beinecke Rare Book & Manuscript Library dell'Università di Yale, il manoscritto Voynich risale con certezza al primo Quattrocento, secondo la datazione al radiocarbonio della pergamena. Eppure, le sue eleganti scritture corsive non appartengono ad alcun alfabeto conosciuto.\n\nLe analisi computazionali sulla frequenza delle lettere e la legge di Zipf dimostrano inequivocabilmente che non si tratta di una sequenza casuale di scarabocchi: il testo possiede una struttura sintattica e grammaticale più rigida e complessa di quella del latino o del tedesco medievale. Alcuni ipotizzano un dialetto proto-romanzo estinto, altri un sofisticato cifrario a griglia o un'enciclopedia di medicina ermetica scritta per proteggere formule proibite.",
          keyTakeaway: "Il Voynich rimane il più grande monumento alla segretezza del Rinascimento, ricordandoci che il passato sapeva celare i propri misteri con ingegno insuperato.",
          sourceContext: "Studi filologici e crittografici computazionali della Beinecke Rare Book Library."
        }
      ]
    },
    {
      category: "Astronomia & Cosmo",
      iconSuggestion: "Telescope",
      articles: [
        {
          id: "art-5",
          title: "K2-18b e il vapore di dimetilsolfuro: La prima firma biologica aliena?",
          subtitle: "Il telescopio spaziale James Webb analizza l'atmosfera di un mondo oceano a 120 anni luce da noi",
          topicRef: "Esopianeti abitabili, segnali dallo spazio profondo e James Webb",
          priority: 4,
          readTime: "3 min",
          badge: "Astrobiologia",
          content: "A oltre cento anni luce nella costellazione del Leone, orbita un pianeta circa otto volte più massiccio della Terra che potrebbe cambiare per sempre il nostro posto nel cosmo. Gli spettroscopi a infrarossi del James Webb hanno rilevato metano, anidride carbonica e una scarsità di ammoniaca, confermando la presenza di un'atmosfera ricca di idrogeno sovrastante un vasto oceano globale (mondo 'Hycean').\n\nMa ciò che ha scatenato l'entusiasmo della comunità scientifica è una debole traccia attribuita al dimetilsolfuro (DMS): sulla Terra, questa molecola solforosa è prodotta quasi esclusivamente dal fitoplancton negli ambienti marini. Nuove osservazioni ad altissima risoluzione sono già programmate per verificare se ci troviamo davvero di fronte al primo battito vitale extrasolare.",
          keyTakeaway: "Non stiamo più cercando se la vita esista altrove, ma dove raccogliere la conferma definitiva del suo respiro chimico.",
          sourceContext: "Dati spettroscopici NASA/ESA JWST pubblicati su The Astrophysical Journal Letters."
        }
      ]
    }
  ],
  specialFeature: {
    title: "La 'Città delle 50.000 Corone' di ferro nel lago svedese",
    rubricName: "La Chicca dell'Editor: Curiosità Bizzarre dal Mondo",
    story: "Nelle profondità torbose del lago Vättern, in Svezia, i pescatori hanno tramandato per generazioni la leggenda di una campana sommersa che risuonava nei giorni di tempesta. Recenti immersioni archeologiche hanno scoperto che non si trattava di una campana, ma di un enorme deposito di oltre 50.000 minuscole corone votive in ferro battuto, realizzate a mano nel XIV secolo con una precisione microscopica inaudita per l'epoca.\n\nNessun documento dell'epoca menziona chi le abbia forgiate o perché un intero villaggio di fabbri abbia gettato anni di produzione metallurgica nelle acque glaciali, sigillando per sempre un rito apotropaico che gli storici non riescono ancora a catalogare.",
    whyItMatters: "Mostra come l'animo umano, prima della rivoluzione industriale, esprimesse devozioni e timori attraverso imprese artigianali ciclopiche ma destinate a rimanere nell'ombra.",
    triviaFact: "Ogni singola corona pesa esattamente 4,2 grammi e reca un'incisione invisibile a occhio nudo a forma di trifoglio rovesciato."
  },
  htmlContent: "",
  generatedAt: new Date().toISOString(),
};
