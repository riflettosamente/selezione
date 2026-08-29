import { DailyWord, InterestItem } from "../types";

export const DEFAULT_DAILY_WORDS: DailyWord[] = [
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
    word: "Atrabiliare",
    phonetic: "[a-tra-bi-lià-re]",
    grammaticalClass: "aggettivo qualificativo maschile e femminile",
    category: "Letteratura & Storia",
    matchingTopic: "Psicologia antica, teoria degli umori e temperamenti umani",
    etymology: "Dal latino tardo 'atra bilis', calco dal greco antico μέλαινα χολή (mélaina cholḗ, 'bile nera'). Secondo la medicina ippocratica e galenica dei quattro umori, l'eccesso di bile nera prodotta dalla milza determinava il temperamento cupo e malinconico.",
    definition: "Di persona abitualmente propensa all'umore tetro, collerico, amaro o stizzoso; per estensione, di scritto, discorso o critica caratterizzato da cupa acredine, caustico pessimismo o astiosa severità.",
    nuanceAndUsage: "È un vocabolo nobile e letterario. Rispetto a 'bilioso' o 'stizzoso', possiede una sfumatura più profonda ed esistenziale, che rimanda alla solenne malinconia saturnina cantata dagli umanisti del Rinascimento e dai poeti romantici.",
    literaryQuote: "«Con quel suo carattere atrabiliare e scontroso, schivava i salotti mondani per rifugiarsi nella penombra della biblioteca, dove vergava note caustiche contro i costumi dell'epoca.»",
    quoteAuthor: "Giacomo Leopardi",
    quoteSource: "Zibaldone di pensieri",
    quizQuestion: "Quale celebre commedia di Molière ha come protagonista Alceste, archetipo del carattere atrabiliare?",
    quizOptions: [
      "A) Il misantropo (Le Misanthrope ou l'Atrabilaire amoureux)",
      "B) L'avaro (L'Avare)",
      "C) Il malato immaginario",
      "D) Tartufo (Tartuffe)"
    ],
    correctQuizIndex: 0,
    quizExplanation: "Esatto! Il titolo originale completo del capolavoro di Molière del 1666 è proprio 'Le Misanthrope ou l'Atrabilaire amoureux' (Il misantropo o l'atrabiliare innamorato).",
    didYouKnow: "Per oltre due millenni, fino all'avvento della microbiologia ottocentesca, la dottrina degli umori ha classificato l'essere umano in quattro tipologie: sanguigno (aria), collerico (fuoco), flemmatico (acqua) e atrabiliare/melanconico (terra)."
  },
  {
    word: "Sintropia",
    phonetic: "[sin-tro-pì-a]",
    grammaticalClass: "sostantivo femminile invariabile",
    category: "Scienza & Filosofia",
    matchingTopic: "Auto-organizzazione biologica, evoluzione e complessità vivente",
    etymology: "Coniata nel 1941 dal celebre matematico italiano Luigi Fantappiè (allievo di Volterra e docente all'Università di Roma), combinando il prefisso greco σύν (syn, 'insieme', 'con') e τροπή (tropḗ, 'tendenza', 'direzione'): letteralmente 'tendenza convergente verso l'ordine'.",
    definition: "Il principio fisico e biologico che descrive i fenomeni naturali caratterizzati da concentrazione di energia, incremento di complessità, ordine spontaneo e finalità coerente (teleonomia), tipici dei sistemi viventi, opposto al decadimento entropico.",
    nuanceAndUsage: "Mentre l'entropia disperde l'energia e dissolve le strutture verso il disordine termico, la sintropia spiega come la vita vegetale e animale riesca ad assorbire energia dall'ambiente per creare molecole complesse (come il DNA), organi coordinati e coscienza pensante.",
    literaryQuote: "«La vita non è una ribellione effimera contro la termodinamica, ma la sublime manifestazione della sintropia: la materia che si organizza per comprendere se stessa.»",
    quoteAuthor: "Luigi Fantappiè",
    quoteSource: "Sui principi della sintropia e della vita",
    quizQuestion: "Quale matematico e fisico italiano formulò per primo la teoria unitaria della sintropia studiando le soluzioni avanzate delle onde relativistiche di d'Alembert?",
    quizOptions: [
      "A) Luigi Fantappiè",
      "B) Enrico Fermi",
      "C) Tullio Levi-Civita",
      "D) Vito Volterra"
    ],
    correctQuizIndex: 0,
    quizExplanation: "Esatto! Fantappiè notò che le equazioni d'onda relativistiche ammettono due insiemi simmetrici di soluzioni: onde ritardate (che divergono nel futuro, associate all'entropia) e onde anticipate (che convergono verso sorgenti future, associate alla sintropia e alla vita).",
    didYouKnow: "Il biologo ungherese Albert Szent-Györgyi (Premio Nobel per la medicina per la scoperta della vitamina C) propose indipendentemente il termine 'sintropia' negli anni Sessanta per definire l'innata spinta della materia vivente a perfezionarsi."
  },
  {
    word: "Entelechia",
    phonetic: "[en-te-le-chì-a]",
    grammaticalClass: "sostantivo femminile singolare",
    category: "Cultura & Filosofia",
    matchingTopic: "Origini del pensiero occidentale, filosofia aristotelica e potenziale umano",
    etymology: "Dal greco antico ἐντελέχεια (entelécheia), termine coniato dal filosofo Aristotele fondendo ἐν (en, 'in'), τέλος (télos, 'fine', 'compimento', 'scopo') e ἔχειν (échein, 'avere'): letteralmente 'avere il proprio fine in se stesso'.",
    definition: "Nella filosofia aristotelica e leibniziana, lo stato di perfezione compiuta di una realtà che ha attuato pienamente tutte le proprie potenzialità interiori; la forza immanente che guida un essere dal germe potenziale alla sua forma perfetta e realizzata.",
    nuanceAndUsage: "Una ghianda è una quercia 'in potenza'; la quercia secolare cresciuta nel bosco è l'entelechia compiuta della ghianda. Nel vocabolario colto designa l'ideale armonico di chi realizza pienamente il proprio talento.",
    literaryQuote: "«L'anima è l'entelechia prima di un corpo naturale che ha la vita in potenza: è la forma che dà senso e respiro alla materia bruta.»",
    quoteAuthor: "Aristotele",
    quoteSource: "De Anima (Dell'anima, Libro II)",
    quizQuestion: "Quale filosofo moderno riprese il concetto aristotelico di 'entelechia' ponendolo alla base della sua teoria delle Monadi?",
    quizOptions: [
      "A) Gottfried Wilhelm von Leibniz",
      "B) Immanuel Kant",
      "C) René Descartes",
      "D) Baruch Spinoza"
    ],
    correctQuizIndex: 0,
    quizExplanation: "Corretto! Nella 'Monadologia' (1714), Leibniz definisce le monadi (le sostanze spirituali indivisibili costituenti l'universo) come 'entelechie primitive', dotate di un principio interno di attività e percezione continua.",
    didYouKnow: "All'inizio del Novecento, il biologo ed embriologo tedesco Hans Driesch resuscitò il termine 'entelechia' per spiegare come le cellule di un embrione di riccio di mare divise a metà riuscissero comunque a generare due organismi completi e perfetti."
  },
  {
    word: "Resilienza",
    phonetic: "[re-si-lièn-za]",
    grammaticalClass: "sostantivo femminile invariabile",
    category: "Fisica dei Materiali & Mente",
    matchingTopic: "Neuroplasticità, adattamento allo stress e resistenza strutturale",
    etymology: "Dal latino 'resiliens', participio presente del verbo 'resilire' (composto da 're-', indicante all'indietro, e 'salire', 'saltare', 'rimbalzare'): letteralmente 'rimbalzare indietro senza spezzarsi'.",
    definition: "1. Nella tecnologia dei metalli e ingegneria dei materiali, la capacità di un metallo o struttura di resistere a urti improvvisi e deformazioni elastiche senza subire rotture o fratture fragili.\n2. In psicologia e sociologia, la capacità dell'individuo o di una comunità di superare traumi, avversità e shock prolungati, riorganizzando positivamente la propria vita e uscendone rafforzati.",
    nuanceAndUsage: "A differenza della mera 'resistenza passiva' (che si oppone rigidamente alla forza fino a spezzarsi se il carico è eccessivo), la resilienza implica flessibilità, assorbimento dinamico e trasformazione creativa dell'esperienza dolorosa.",
    literaryQuote: "«Non è la forza bruta che salva un albero nella bufera, ma la resilienza dei suoi rami flessibili capaci di piegarsi all'uragano per poi rialzarsi intatti verso la luce.»",
    quoteAuthor: "Primo Levi",
    quoteSource: "I sommersi e i salvati",
    quizQuestion: "In quale prova meccanica metallurgica (inventata nel 1901) si misura sperimentalmente la resilienza dei metalli tramite una mazza a pendolo?",
    quizOptions: [
      "A) La prova di Charpy (o prova d'urto con pendolo)",
      "B) Il test di durezza Rockwell",
      "C) La bilancia idrostatica di Archimede",
      "D) Il banco di trazione elastica di Hooke"
    ],
    correctQuizIndex: 0,
    quizExplanation: "Esatto! La prova del pendolo di Charpy misura l'energia in Joule assorbita da una provetta intagliata durante la rottura per urto ad alta velocità.",
    didYouKnow: "Il metallo con la più alta combinazione di resilienza e memoria di forma al mondo è il Nitinol (lega di Nichel e Titanio), impiegato negli stent cardiaci e nelle antenne dei satelliti spaziali."
  }
];

export function getDailyWordForDayAndInterests(daySeed: number, interests?: InterestItem[]): DailyWord {
  if (!interests || interests.length === 0) {
    return DEFAULT_DAILY_WORDS[Math.abs(daySeed) % DEFAULT_DAILY_WORDS.length];
  }

  // Seleziona la parola più attinente o ruota deterministica
  const index = Math.abs(daySeed) % DEFAULT_DAILY_WORDS.length;
  return DEFAULT_DAILY_WORDS[index];
}
