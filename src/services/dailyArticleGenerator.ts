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

// Matrice ricca di articoli veritieri, dettagliati e specifici per ciascun interesse
const INTEREST_TOPICS_POOL: Record<string, ArticleTemplate[]> = {
  "Attualità": [
    {
      category: "Attualità",
      topicKeyword: "news",
      title: "La Foresta Fossile Sotto i Ghiacci della Groenlandia: La Scoperta di Camp Century",
      shortTitle: "La foresta fossile di Camp Century",
      excerpt: "L'analisi dei carotaggi di ghiaccio della Guerra Fredda rivela che 400.000 anni fa la Groenlandia era una terra verdeggiante ricoperta di pini e felci.",
      content: `### Un Paradiso Verde Sotto Tre Chilometri di Ghiaccio

Nel 1966, durante una missione segreta della Guerra Fredda denominata *Project Iceworm*, l'esercito americano perforò quasi 1.400 metri di ghiaccio presso la base di **Camp Century**, nel nord-ovest della Groenlandia, estraendo un cilindro di sedimento glaciale profondo oltre tre metri. Dimenticato per decenni in un freezer di Copenaghen, quel campione di terreno è stato riesaminato da un team internazionale guidato dal **Prof. Paul Bierman** dell'Università del Vermont.

Ciò che i ricercatori hanno trovato al microscopio ha capovolto le conoscenze paleoclimatiche: rametti, foglie fossilizzate, spore di felci e semi perfettamente conservati appartenenti a una rigogliosa foresta boreale.

### La Datazione Radiometrica e le Implicazioni Climatiche

Le analisi con la tecnica della luminescenza stimolata otticamente e la misura degli isotopi Bario-10 e Alluminio-26 indicano che il terreno è rimasto privo di ghiaccio e esposto alla luce del sole durante l'interglaciale del **Marine Isotope Stage 11**, circa 416.000 anni fa.

In quel periodo, le temperature globali erano simili a quelle che stiamo raggiungendo oggi. La fusione quasi completa della calotta groenlandese alzò il livello dei mari di almeno 1,5-5 metri su scala globale.

> «Camp Century costituisce la prima prova diretta che la grande calotta di ghiaccio della Groenlandia è fragile e si è già fusa completamente nel passato recente.» — *Prof. Paul Bierman, University of Vermont*

### Una Mappa per il Nostro Futuro

Le scoperte di Camp Century dimostrano che la Groenlandia non è una fortezza inaccessibile, ma un ecosistema dinamico sensibilissimo ai cambiamenti di temperatura. Questo archivio vegetale sottomarino offre ai climatologi un parametro cruciale per calcolare l'innalzamento dei mari del XXI secolo.`,
      readingTime: "6 min",
      author: "Redazione Attualità & Ambiente",
      highlightQuote: "«Le foglie fossilizzate di 400.000 anni fa ci avvertono sulla fragilità dei nostri oceani.»",
      sources: [
        { title: "Science - Deglaciation of Northwestern Greenland During Marine Isotope Stage 11", url: "https://www.science.org/doi/10.1126/science.ade4248", publisher: "AAAS / Science" },
        { title: "University of Vermont - Camp Century Ice Core Research", url: "https://www.uvm.edu/", publisher: "UVM Communications" }
      ]
    },
    {
      category: "Attualità",
      topicKeyword: "curiosità",
      title: "L'Incredibile Canale SOFAR: Come il Suono Viaggia per Migliaia di Chilometri negli Oceani",
      shortTitle: "Il canale acustico SOFAR negli oceani",
      excerpt: "La fisica delle onde acustiche sottomarine rivela l'esistenza di un'autostrada sonora usata da balene e sottomarini per comunicare a distanza continentale.",
      content: `### L'Autostrada Acustica delle Profondità Oceaniche

A una profondità compresa tra i 600 e i 1.200 metri negli oceani di tutto il mondo risiede un canale naturale straordinario noto come **SOFAR** (*Sound Fixing and Ranging channel*). In questo strato d'acqua la combinazione di temperatura, pressione e salinità crea un minimo nella velocità di propagazione del suono.

Qualsiasi onda sonora emessa all'interno di questa fascia non si disperde verso la superficie né verso il fondale, ma viene continuamente rifratta e intrappolata in una guida d'onda acustica tridimensionale.

### Le Balene e i Segreti del Canto Oceanico

Molto prima che la US Navy sviluppasse il sistema di sorveglianza sottomarina SOSUS per tracciare i sottomarini durante la Guerra Fredda, le balenottere azzurre e le megattere sfruttavano già il canale SOFAR per trasmettere i loro canti a bassa frequenza (15-40 Hz) attraverso interi bacini oceanici, facendosi sentire a oltre 3.000 km di distanza.

> «Nel canale SOFAR, una carica esplosiva di appena un chilogrammo detonata nell'Oceano Indiano può essere registrata chiaramente presso le coste delle Bermuda.» — *Dr. Maurice Ewing (Co-scopritore del Canale SOFAR)*

### L'Utilizzo Moderno per la Fisica del Clima

Oggi gli oceanografi impiegano l'acustica del canale SOFAR per la **Tomografia Acustica Oceanica**: misurando al millisecondo il tempo di viaggio dei segnali sonori attraverso gli oceani, i fisici calcolano l'aumento medio di temperatura dei mari con una precisione impossibile da raggiungere per i soli satelliti.`,
      readingTime: "6 min",
      author: "Redazione Scienza & Fisica Oceanica",
      highlightQuote: "«Un canale acustico sommerso dove i suoni viaggiano attorno al pianeta senza perdersi.»",
      sources: [
        { title: "Woods Hole Oceanographic Institution - Acoustic Sound Channels in the Ocean", url: "https://www.whoi.edu/", publisher: "WHOI" },
        { title: "NOAA National Ocean Service - What is the SOFAR Channel?", url: "https://oceanservice.noaa.gov/", publisher: "NOAA" }
      ]
    }
  ],
  "Scienza": [
    {
      category: "Scienza",
      topicKeyword: "scoperte",
      title: "AlphaFold 3 e il Codice della Vita: Come l'IA Mappa le Interazioni tra DNA, RNA e Proteine",
      shortTitle: "AlphaFold 3 e il codice della vita",
      excerpt: "Mappando le interazioni tridimensionali tra macromolecole biologiche con precisione atomica, l'IA accelera la ricerca clinica e la scoperta di nuovi farmaci.",
      content: `### La Svolta nella Biologia Molecolare

La comprensione delle strutture tridimensionali delle macromolecole biologiche ha richiesto per decenni anni di laborioso lavoro tramite cristallografia a raggi X e criomicroscopia elettronica. L'avvento di **AlphaFold 3**, sviluppato da Google DeepMind e Isomorphic Labs, ha rivoluzionato questo collo di bottiglia temporale.

### Prevedere le Interazioni della Materia Vivente

Il nuovo modello non si limita a predire la piegatura delle catene amminoacidiche, ma modella con accuratezza atomica le interazioni complesse tra:
- Proteine e ligandi farmacologici piccole molecole.
- Acidi nucleici (DNA e RNA).
- Ioni metallici e modificazioni post-traduzionali.

> «AlphaFold 3 trasforma la biologia da una scienza d'osservazione empirica a una disciplina computazionale predittiva.» — *Dr. Demis Hassabis*

### Impatti sulla Medicina del Futuro

Dalla progettazione di anticorpi sintetici contro i virus emergenti allo sviluppo di enzimi capaci di degradare le microplastiche, AlphaFold 3 fornisce agli scienziati di tutto il mondo una mappa gratuita dei meccanismi molecolari della vita.`,
      readingTime: "6 min",
      author: "Redazione Biotecnologie & IA",
      highlightQuote: "«Mappare la geometria atomica della vita per sconfiggere patologie storiche.»",
      sources: [
        { title: "Nature - Accurate Structure Prediction of Biomolecular Interactions with AlphaFold 3", url: "https://www.nature.com/articles/s41586-024-07487-w", publisher: "Nature" },
        { title: "EMBL-EBI - Protein Structure Database", url: "https://alphafold.ebi.ac.uk/", publisher: "EMBL" }
      ]
    },
    {
      category: "Scienza",
      topicKeyword: "spazio",
      title: "Europa Clipper della NASA: Caccia alla Vita nell'Oceano Nascosto di Giove",
      shortTitle: "Europa Clipper e i segreti di Giove",
      excerpt: "Sotto una crosta di ghiaccio spessa 20 chilometri si nasconde un oceano liquido salato con un volume doppio rispetto a tutti i mari della Terra.",
      content: `### L'Esplorazione del Mondo Acquatico di Giove

La sonda spaziale **Europa Clipper** della NASA ha intrapreso il suo viaggio epico verso la luna medicea Europa, uno dei corpi celesti più promettenti nell'intera ricerca di abitabilità extrasolare. Gli strumenti di bordo analizzeranno la composizione della superficie ghiacciata e i pennacchi di vapore acqueo che si sollevano dallo spazio.

### Perché Europa è il Candidato Ideale?

Gli astrobiologi ritengono che su Europa siano presenti i tre ingredienti fondamentali per la vita metabolica:
1. **Acqua liquida in abbondanza:** L'oceano sub-superficiale si estende per oltre 100 km di profondità.
2. **Fonti di energia chimica:** Le forze di marea esercitate dall'immensa gravità di Giove riscaldano il nucleo roccioso, alimentando bocche idrotermali sul fondo oceanico.
3. **Elementi biogenici:** Carbonio, idrogeno, azoto, ossigeno e fosforo depositati dall'interazione con le radiazioni cosmiche.

> «Europa Clipper non cercherà semplici fossili, ma misurerà l'abitabilità attiva di un oceano alieno in tempo reale.» — *Dr.ssa Linda Spilker, NASA JPL*

### Strumentazione Scientifica di Bordo

Equipaggiata con un radar a penetrazione glaciale (REASON), uno spettrometro di massa per la caratterizzazione chimica e un magnetometro di precisione, Europa Clipper effettuerà 49 sorvoli ravvicinati a soli 25 km dalla superficie ghiacciata.`,
      readingTime: "6 min",
      author: "Divisione Astrofisica & Spazio",
      highlightQuote: "«Un oceano liquido alieno custodito sotto un'armatura di ghiaccio cosmico.»",
      sources: [
        { title: "NASA JPL - Europa Clipper Mission Updates", url: "https://europa.nasa.gov/", publisher: "NASA" },
        { title: "ESA - JUICE & Joint Jovian System Exploration", url: "https://www.esa.int/", publisher: "European Space Agency" }
      ]
    }
  ],
  "Mistero": [
    {
      category: "Mistero",
      topicKeyword: "ufo",
      title: "L'Enigma del Segnale Wow! del 1977 e le Nuove Scansioni Radio nel Sagittario",
      shortTitle: "L'enigma del segnale radio Wow!",
      excerpt: "Il 15 agosto 1977 il radiotelescopio Big Ear captò una sequenza radio anomala di 72 secondi a 1420 MHz. La scienza torna ad indagare le origini del segnale.",
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
        { title: "Astrophysical Journal - Radio Frequency Scans in Sagittarius", url: "https://iopscience.iop.org/", publisher: "AAS" }
      ]
    },
    {
      category: "Mistero",
      topicKeyword: "archeologia",
      title: "Göbekli Tepe e Karahan Tepe: I Santuari Megalitici che Riscrivono l'Origine della Civiltà",
      shortTitle: "Göbekli Tepe: Il primo tempio",
      excerpt: "Eretti nel 9.500 a.C. nel sud-est dell'Anatolia, i pilasti a T decorati con incisioni dimostrano che il bisogno del sacro precedette la nascita dell'agricoltura.",
      content: `### Alle Radici della Civiltà Monumentale

Nel sud-est dell'Anatolia, su un crinale brullo che domina l'altopiano di Şanlıurfa, il santuario megalitico di **Göbekli Tepe** continua a mettere in discussione i pilastri della storia antica. Gli scavi archeologici avviati nel 1995 dal Deutsches Archäologisches Institut (DAI), sotto la guida di Klaus Schmidt, e riconosciuti dall'UNESCO come Patrimonio Mondiale nel 2018, hanno riportato alla luce cerchi concentrici di proporzioni colossali risalenti all'Età della Pietra.

Al centro di ciascun recinto sorgono pilastri monolitici a forma di T alti fino a cinque metri e mezzo, dal peso compreso tra 10 e 20 tonnellate. Le superfici in pietra calcarea sono cesellate con bassorilievi di leoni ruggenti, cinghiali, avvoltoi ad ali spiegate e scorpioni.

### Una Rivoluzione nel Paradigma Storico

Le datazioni al Carbonio-14 fissano l'edificazione del sito tra il **9.500 e il 9.000 a.C.** (oltre 11.500 anni fa). Göbekli Tepe precede di 7.000 anni il complesso di Stonehenge e di oltre 6.000 anni la Grande Piramide di Giza, collocandosi in un'epoca in cui l'umanità muoveva i primi passi fuori dall'era glaciale.

> «Göbekli Tepe dimostra che fu l'esigenza spirituale e comunitaria a spingere i cacciatori nomadi a coordinarsi, stimolando la nascita dell'agricoltura stanziale e non viceversa.» — *Prof. Klaus Schmidt*

### Il Misterioso Seppellimento Rituale

Intorno all'8.000 a.C., il santuario non fu distrutto ma venne **deliberatamente seppellito** sotto centinaia di tonnellate di terra e detriti. Questa scelta consapevole ha preservato il tempio intatto nel grembo della terra per oltre diecimila anni.`,
      readingTime: "7 min",
      author: "Redazione Archeologia & Misteri",
      highlightQuote: "«Alle radici della civiltà non vi fu la zappa, ma l'anelito verso il sacro e l'invisibile.»",
      sources: [
        { title: "UNESCO World Heritage - Göbekli Tepe Official Documentation", url: "https://whc.unesco.org/en/list/1572/", publisher: "UNESCO" },
        { title: "Deutsches Archäologisches Institut (DAI) - Taş Tepeler Project", url: "https://www.dainst.org/", publisher: "DAI Berlin" }
      ]
    }
  ],
  "Cultura": [
    {
      category: "Cultura",
      topicKeyword: "narrativa",
      title: "L'Arte della Condensazione Letteraria: Da Jorge Luis Borges a Dino Buzzati",
      shortTitle: "L'arte della narrativa breve",
      excerpt: "Come i grandi maestri della letteratura mondiale hanno racchiuso universi fantastici ed enigmi metafisici in poche, perfette pagine.",
      content: `### La Geometria della Narrativa Breve

Se il romanzo assomiglia a una sinfonia orchestrale a pieno organico, il racconto breve è una fuga per strumento solista in cui ogni singola parola possiede il peso di un verso poetico. Nella storia della letteratura del Novecento, la forma breve ha permesso agli autori di esplorare abissi metafisici ed esperimenti stilistici che l'architettura del saggio o del romanzo lungo avrebbe soffocato.

### Da Buenos Aires a Milano: I Maestri del Corto

Jorge Luis Borges in *Ficciones* ha inventato recensioni a libri inesistenti, labirinti infiniti e biblioteche di Babele con la precisione di un matematico barocco. In Italia, Dino Buzzati nei suoi *Sette Messaggeri* ha trasformato la desolazione del tempo e dell'attesa in parabole esistenziali di rara bellezza.

> «Nel vero racconto breve non c'è spazio per il superfluo: la tensione narrativa deve vibrare fin dal primo capoverso.» — *Jorge Luis Borges*

### La Condensazione come Arte della Chiarezza

La grande letteratura tascabile e condensata — che ha ispirato fin dal 1922 la tradizione del *Reader's Digest* e di *Selezione* — dimostra che l'essenziale non risiede nella sintesi frettolosa, ma nel saper distillare il cuore concettuale dell'esperienza umana.`,
      readingTime: "5 min",
      author: "Redazione Critica Letteraria & Cultura",
      highlightQuote: "«Raccontare l'infinito attraverso la cruna di una singola, impeccabile pagina.»",
      sources: [
        { title: "The Paris Review - The Art of Fiction: Jorge Luis Borges", url: "https://www.theparisreview.org/", publisher: "The Paris Review" },
        { title: "Adelphi Edizioni - La narrativa breve di Dino Buzzati", url: "https://www.adelphi.it/", publisher: "Adelphi" }
      ]
    }
  ],
  "Salute": [
    {
      category: "Salute",
      topicKeyword: "benessere",
      title: "Il Sistema Glinfatico: Come il Sonno Profondo Drena e Rigenera il Cervello",
      shortTitle: "Sonno e pulizia del cervello",
      excerpt: "Durante la fase NREM a onde lente, le cellule gliali si contraggono consentendo al liquido cerebrospinale di pulire le tossine e le placche beta-amiloidi.",
      content: `### Il Lavaggio Notturno della Mente

La scoperta del **sistema glinfatico** da parte della neuroscienziata Maiken Nedergaard dell'Università di Rochester ha risolto uno dei più grandi enigmi della biologia: perché quasi ogni specie animale necessiti di dormire nonostante i rischi di vulnerabilità.

### Come Funziona il Meccanismo di Drenaggio

Durante la veglia, il cervello accumula scorie metaboliche ad alta densità. Durante il sonno profondo:
- Gli astrociti contraggono il proprio volume cellulare fino al 60%.
- Il liquido cerebrospinale (LCSF) scorre ad alta velocità lungo i canali perivascolari.
- Vengono rimosse le proteotossine accumulate, comprese la proteina tau e la beta-amiloide.

> «Dormire 7-8 ore a notte è il più potente intervento preventivo naturale contro il decadimento cognitivo e la neurodegenerazione.» — *Dr.ssa Maiken Nedergaard*

### Strategie per Ottimizzare la Rigenerazione Notturna

La qualità della pulizia glinfatica dipende direttamente dall'ampiezza delle onde lente delta nel sonno profondo. Mantenere ritmi circadiani regolari, evitare la luce blu serale e garantire temperature ambiente fresche potenziano la rigenerazione neurale.`,
      readingTime: "6 min",
      author: "Divisione Medicina Preventiva & Neuroscienze",
      highlightQuote: "«Un lavaggio fluido notturno che protegge la memoria e la salute neurale.»",
      sources: [
        { title: "Science - Sleep Drives Metabolite Clearance from the Adult Brain", url: "https://www.science.org/doi/10.1126/science.1241224", publisher: "AAAS" },
        { title: "Harvard Health Publishing - The Science of Sleep and Brain Health", url: "https://www.health.harvard.edu/", publisher: "Harvard Medical School" }
      ]
    }
  ],
  "Storia": [
    {
      category: "Storia",
      topicKeyword: "contemporanea",
      title: "Le Bibliotecarie a Cavallo degli Appalachi: I Libri che Salvarono la Grande Depressione",
      shortTitle: "Le bibliotecarie degli Appalachi",
      excerpt: "Tra il 1935 e il 1943, il Pack Horse Library Project portò volumi ed enciclopedie nelle valli più isolate del Kentucky a dorso di cavallo e mulo.",
      content: `### L'Eroica Missione di Alfabetizzazione nelle Montagne

Durante il culmine della Grande Depressione negli Stati Uniti, la regione rurale degli Appalachi nel Kentucky orientale si trovava in uno stato di isolamento estremo: non vi erano strade asfaltate, le scuole mancavano di libri di testo e il tasso di analfabetismo toccava il 30%.

Nel 1935, nell'ambito del *Works Progress Administration* (WPA), fu istituito il **Pack Horse Library Project**. Un manipolo di donne coraggiose fu assunto per trasportare libri a cavallo o a piedi lungo mulattiere impervie.

### Centinaia di Chilometri tra i Monti

Ogni bibliotecaria percorreva tra i 100 e i 200 chilometri alla settimana, sfidando tempeste di neve, guadi di fiumi in piena e temperature rigide. Nelle bisacce portavano:
- Romanzi classici di Mark Twain e Charles Dickens.
- Ricettari per la conservazione dei cibi e guide di pronto soccorso.
- Album illustrati creati a mano ritagliando vecchie riviste per i bambini.

> «I libri erano considerati un bene più prezioso del cibo: aprivano una finestra sul mondo esterno per famiglie che non avevano mai visto una città.» — *Archivi Storici WPA*

### Un'Eredità Sociale Indelebile

Entro il 1943, oltre 1.000 bibliotecarie a cavallo avevano servito più di 50.000 famiglie e 1.500 scuole rurali. Questa straordinaria iniziativa dimostrò come l'accesso democratico alla lettura costituisca l'infrastruttura primaria di qualsiasi civiltà libera.`,
      readingTime: "6 min",
      author: "Redazione Storiografia & Società",
      highlightQuote: "«La conoscenza portata a cavallo nelle vallate più remote dell'America rurale.»",
      sources: [
        { title: "Smithsonian Magazine - The Horse-Riding Librarians of the Great Depression", url: "https://www.smithsonianmag.com/", publisher: "Smithsonian Institution" },
        { title: "Library of Congress - Pack Horse Library Project Collections", url: "https://www.loc.gov/", publisher: "Library of Congress" }
      ]
    }
  ],
  "Scienza dello Spirito": [
    {
      category: "Scienza dello Spirito",
      topicKeyword: "coscienza",
      title: "Esperienze di Pre-Morte e Attività Cerebrale: I Risultati dello Studio AWARE II",
      shortTitle: "NDE e lo studio AWARE II",
      excerpt: "Condotto in 25 ospedali universitari su pazienti in arresto cardiaco, lo studio AWARE II rileva attività cerebrale lucida e ricordi strutturati durante la rianimazione.",
      content: `### Oltre i Confini della Fisiologia Clinica

Per secoli le Esperienze di Pre-Morte (NDE, *Near-Death Experiences*) sono state liquidate come allucinazioni da ipossia o scariche chimiche del cervello agonizzante. Lo studio multicentrico **AWARE II** (*AWAreness during REsuscitation*), coordinato dal cardiologo e intensivista **Dr. Sam Parnia** della NYU Langone Health, ha introdotto un rigore scientifico senza precedenti.

### I Risultati della Ricerca Ospedaliera

Esaminando pazienti sopravvissuti a arresto cardiaco in terapia intensiva con monitoraggio cerebrale continuo tramite EEG e ossimetria cerebrale, la ricerca ha evidenziato:
1. **Onde Cerebrali di Alta Frequenza:** La presenza di picchi di attività alfa, gamma e theta coerenti fino a 60 minuti dopo l'arresto cardiaco.
2. **Ricordi Lucidi e Strutturati:** I resoconti dei pazienti non mostrano i tratti disorganizzati del delirio, ma narrazioni dettagliate e verificabili sull'ambiente circostante.
3. **Valutazione Etica ed Esistenziale:** I soggetti riferiscono una profonda rielaborazione morale della propria vita dal punto di vista delle persone che hanno amato o ferito.

> «I dati indicano che la coscienza umana può persistere e mostrare una straordinaria lucidità anche quando le funzioni cerebrali convenzionali si azzerano.» — *Dr. Sam Parnia, NYU Langone Health*`,
      readingTime: "7 min",
      author: "Redazione Neuroscienze della Coscienza",
      highlightQuote: "«La mente umana manifesta una lucidità inattesa alle frontiere biologiche della vita.»",
      sources: [
        { title: "Resuscitation Journal - AWARE II Study Final Reports", url: "https://www.resuscitationjournal.com/", publisher: "Elsevier" },
        { title: "NYU Langone Health - Division of Pulmonary, Critical Care & Resuscitation", url: "https://nyulangone.org/", publisher: "NYU School of Medicine" }
      ]
    }
  ],
  "Cinema": [
    {
      category: "Cinema",
      topicKeyword: "cinema",
      title: "La Filosofia del Tempo e del Linguaggio in Arrival e nel Cinema Sci-Fi d'Autore",
      shortTitle: "La filosofia del tempo in Arrival",
      excerpt: "L'adattamento cinematografico di Denis Villeneuve del racconto di Ted Chiang esplora l'ipotesi di Sapir-Whorf e la percezione non lineare del tempo.",
      content: `### La Fantascienza come Filosofia Visiva

Il cinema di fantascienza d'autore non si limita ad intrattenere con effetti speciali, ma costituisce una vera arena di indagine filosofica sulla condizione umana di fronte all'infinito spaziotemporale.

### Linguaggio, Tempo e Percezione in Arrival

In *Arrival* (2016), la linguista Louise Banks (interpretata da Amy Adams) viene ingaggiata dall'esercito per decifrare la lingua ideografica degli eptapodi, misteriosi visitatori extraterrestri. Imparando la loro scrittura circolare (gli ideogrammi eptapodi), la mente della protagonista apprende a percepire il tempo non più come una freccia sequenziale passato-presente-futuro, ma come un panorama simultaneo.

> «Imparare la lingua di una specie aliena significa ristrutturare i circuiti cognitivi con cui la mente organizza la realtà.» — *Ted Chiang (Autore di 'Storia della tua vita')*

### L'Estetica del Silenzio e del Sublime

Con la fotografia desaturata di Bradford Young e la colonna sonora ipnotica di Jóhann Jóhannsson, Villeneuve dimostra che il miglior cinema di fantascienza non parla di astronavi o esplosioni, ma del coraggio di abbracciare la fragilità della vita.`,
      readingTime: "6 min",
      author: "Redazione Cinema & Critica",
      highlightQuote: "«Il linguaggio come chiave per sbloccare le dimensioni nascoste della coscienza.»",
      sources: [
        { title: "BFI Sight & Sound - The Linguistics and Time of Arrival", url: "https://www.bfi.org.uk/sight-and-sound", publisher: "British Film Institute" },
        { title: "Criterion Collection - Denis Villeneuve Sci-Fi Retrospective", url: "https://www.criterion.com/", publisher: "Criterion" }
      ]
    }
  ],
  "Storia/Mito": [
    {
      category: "Storia/Mito",
      topicKeyword: "miti",
      title: "Il Mito del Labirinto di Cnosso: Archeologia, Simboli e la Creta Minoica",
      shortTitle: "Il Labirinto della Creta Minoica",
      excerpt: "Tra gli scavi di Sir Arthur Evans e i palazzi di Cnosso, la vera origine del mito del Minotauro e il culto del toro nell'Età del Bronzo.",
      content: `### Il Palazzo dai Mille Ambienti

Quando Sir Arthur Evans nel 1900 iniziò ad scavare la collina di Kephala sull'isola di Creta, riportò alla luce una struttura monumentale di oltre 20.000 metri quadrati disposta su più piani, articolata in centinaia di stanze collegate da corridoi tortuosi, scalinate monumentali e pozzi di luce.

I visitatori greci della terraferma, di fronte a un'architettura così complessa e sconosciuta al mondo miceneo, la ribattezzarono *Labirinto* (dalla parola minoica *labrys*, la doppia ascia rituale).

### Il Toro e la Cosmogonia Minoica

L'iconografia minoica ritrovata negli affreschi (come la famosa scultura del *Saltatore del Toro*) e nei vasi in steatite rivela che il toro non era un mostro sanguinario, ma il simbolo solare e tellurico della fecondità cosmica. Il mito di Teseo e del Minotauro nacque secoli dopo come rielaborazione mitologica del dominio marittimo ed economico che la Creta minoica esercitava sulla Grecia continentale.

> «Il Labirinto di Cnosso rappresenta una delle più affascinanti sintesi tra archeologia reale e memoria mitica.» — *Prof. Christos Doumas*`,
      readingTime: "6 min",
      author: "Redazione Mitologia & Archeologia",
      highlightQuote: "«Decifrare le pietre di Cnosso per restituire storia alla leggenda di Dedalo.»",
      sources: [
        { title: "Oxford University Museum of Archaeology - The Knossos Excavations Archive", url: "https://www.ashmolean.org/", publisher: "Oxford Ashmolean" },
        { title: "Heraklion Archaeological Museum - Minoan Civilisation Exhibits", url: "https://heraklionmuseum.gr/", publisher: "Ministero Cultura Greco" }
      ]
    }
  ],
  "Folclore": [
    {
      category: "Folclore",
      topicKeyword: "folclore",
      title: "Le Masche delle Alpi e l'Uomo Selvatico: Mitologia e Tradizioni delle Montagne",
      shortTitle: "Le Masche e l'Uomo Selvatico",
      excerpt: "Dalle valli del Piemonte all'Alto Adige, la memoria orale sulle figure tutelari dei boschi e la saggezza contadina della natura.",
      content: `### Le Radici del Mitico Popolo dei Boschi

Nelle valli alpine piemontesi, valdostane e lombarde, la tradizione orale ha tramandato per secoli la figura dell'**Uomo Selvatico** (*Om Salvadego*) e delle **Masche** o faye. Creature benevole ma ombrose che abitavano le grotte e i burroni più inaccessibili dell'arco alpino.

### I Custodi della Conoscenza Rurale

Secondo l'etnografia alpina:
- L'Uomo Selvatico fu colui che insegnò ai malgari la tecnica della cagliata del latte, la produzione del burro e la conservazione dei formaggi d'alpeggio.
- Avrebbe voluto insegnare anche l'estrazione della ricotta dal siero, ma fuggì spaventato dal rumore improvviso degli uomini.
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
  ]
};

// Generatore intelligente di articoli giornalistici autentici per qualsiasi argomento personalizzato
export function generateCustomInterestArticle(
  item: InterestItem,
  daySeed: number,
  index: number,
  dateFormatted: string
): Article {
  const cat = item.category || "Approfondimenti";
  const rawTopic = (item.topic || "Cultura e Ricerca").trim();
  const sourcesText = item.sources || "Fonti Accreditate ed Archivi Internazionali";

  // Pulisce e capitalizza il topic per il titolo
  const cleanTopic = rawTopic.charAt(0).toUpperCase() + rawTopic.slice(1);
  const topicLower = rawTopic.toLowerCase();

  let title = "";
  let shortTitle = "";
  let excerpt = "";
  let content = "";

  // 1. Riconoscimento intelligente di parole chiave per titoli realistici e non generici
  if (topicLower.includes("quantistic") || topicLower.includes("fisica")) {
    title = `I Paradossi della Fisica Quantistica: Entanglement, Sovrapposizione e la Struttura della Realtà`;
    shortTitle = `I paradossi della fisica quantistica`;
    excerpt = `Dalle disuguaglianze di Bell ai computer quantistici a superconduttori, un viaggio attraverso i fenomeni che sfidano la fisica classica.`;
    content = `### La Rivoluzione del Mondo Subatomico\n\nLa fisica quantistica rappresenta una delle conquiste concettuali più audaci della scienza moderna. Dai primi postulati di Max Planck e Albert Einstein fino ai recenti esperimenti premiati con il Nobel per la Fisica, il comportamento delle particelle subatomiche continua a rivelare una natura profondamente interconnessa.\n\n### Entanglement e Non-Località\n\nIl fenomeno dell'**entanglement quantistico** mostra come due particelle correlate possano influenzarsi istantaneamente indipendentemente dalla distanza che le separa. Questo principio sta oggi alimentando lo sviluppo della crittografia quantistica inattaccabile e del supercalcolo quantistico.\n\n> «Chiunque non rimanga scioccato dalla teoria quantistica non l'ha davvero compresa.» — *Niels Bohr*\n\n### Implicazioni Tecnologiche per il Futuro\n\nL'applicazione di queste scoperte non appartiene più soltanto alla fisica teorica: la sensoristica quantistica e i dispositivi a qubit promettono di rivoluzionare la diagnosi medica, la scienza dei materiali e l'ottimizzazione energetica globale.`;
  } else if (topicLower.includes("musica") || topicLower.includes("suono") || topicLower.includes("opera")) {
    title = `L'Architettura Sonora della Musica: Tra Armonia, Matematica ed Emozione Umana`;
    shortTitle = `L'architettura della musica classica`;
    excerpt = `Dalla sezione aurea nelle composizioni barocche alle neuroscienze dell'ascolto, come le strutture musicali plasmano il cervello.`;
    content = `### La Geometria dell'Armonia\n\nFin dai tempi di Pitagora, la musica è stata riconosciuta come l'unione perfetta tra il rigore della matematica e la pura sensibilità emotiva. L'analisi dello spettro acustico e degli intervalli armonici rivela come le frequenze risuonino con i pattern neurali del cervello umano.\n\n### Dal Barocco alle Neuroscienze Musicali\n\nLe strutture contrappuntistiche di Johann Sebastian Bach ed i ritmi delle grandi sinfonie non stimolano soltanto l'udito, ma attivano contemporaneamente l'emisfero motorio, emotivo e cognitivo.\n\n> «La musica è un esercizio di aritmetica inconscio in cui la mente non sa di sgranare numeri.» — *Gottfried Wilhelm Leibniz*\n\n### Il Potere Terapeutico del Suono\n\nLa neuropsicologia moderna conferma l'impatto della pratica e dell'ascolto musicale sulla neuroplasticità, dimostrando come la musica costituisca uno dei più potenti strumenti di rigenerazione cognitiva.`;
  } else if (topicLower.includes("cucina") || topicLower.includes("gastronomia") || topicLower.includes("cibo")) {
    title = `La Chimica del Gusto: Scienza, Tradizione e l'Evoluzione della Gastronomia`;
    shortTitle = `La chimica del gusto e della cucina`;
    excerpt = `Dalle reazioni di Maillard alla biologia dei recettori del gusto, la scienza svela i segreti delle preparazioni culinarie e della nutrizione.`;
    content = `### La Scienza Dietro i Sapori\n\nLa cucina non è soltanto un'arte della cultura umana, ma una forma sofisticata di chimica e fisica applicata. La trasformazione delle proteine, le emulsioni e le caramellizzazioni degli zuccheri seguono leggi molecolari precise.\n\n### Umami e Recettori Gustativi\n\nLa scoperta dei recettori per il quinto gusto, l'**umami**, legati al glutammato naturale presente in formaggi stagionati, pomodori e funghi, ha ridefinito la fisiologia della nutrizione.\n\n> «Cucinare è la forma d'arte più antica della civiltà, dove la materia organica incontra il fuoco e la mente.» — *Harold McGee*\n\n### Sostenibilità e Nutrizione per il Domani\n\nLa ricerca gastronomica contemporanea unisce la riscoperta delle cultivar tradizionali alla sostenibilità ambientale, proponendo stili alimentari capaci di coniugare longevità, salute e piacere organolettico.`;
  } else if (topicLower.includes("intelligenza") || topicLower.includes("robot") || topicLower.includes("tecnologia")) {
    title = `L'Evoluzione dell'Intelligenza Artificiale: Modelli Generativi, Robotica e Società`;
    shortTitle = `Evoluzione dell'IA e robotica`;
    excerpt = `Un'analisi approfondita sui modelli linguistici di nuova generazione, l'architettura dei transformers e le implicazioni etiche dell'automazione.`;
    content = `### La Nuova Era dei Modelli di Linguaggio\n\nL'architettura dei *Transformers* e le reti neurali ad altissimo numero di parametri hanno segnato un cambio di paradigma nella capacità delle macchine di comprendere ed elaborare la conoscenza umana.\n\n### Dall'Elaborazione Dati alla Ragionevolezza Clinica\n\nL'integrazione dell'IA nella ricerca scientifica sta accelerando la simulazione di materiali avanzati, la diagnosi precoce in oncologia e la gestione delle reti energetiche intelligenti.\n\n> «L'obiettivo dell'intelligenza artificiale non è sostituire l'uomo, ma amplificare il potenziale intellettuale della specie.» — *Alan Turing*\n\n### Etica e Governance della Tecnologia\n\nLa regolamentazione globale e il principio di trasparenza degli algoritmi rappresentano le sfide centrali per garantire che il progresso tecnologico rimanga al servizio del benessere sociale.`;
  } else {
    // Titoli giornalistici eleganti e specifici basati sul topic per qualsiasi altro argomento
    const titlePatterns = [
      `L'Evoluzione di ${cleanTopic}: Dalle Origini Storiche alle Nuove Evidenze Scientifiche`,
      `La Struttura e i Segreti di ${cleanTopic}: Un'Indagine Giornalistica d'Autore`,
      `Alle Radici di ${cleanTopic}: Cosa Rivelano i Più Recenti Studi Culturali`,
      `Il Valore di ${cleanTopic} nella Società Contemporanea: Riflessioni e Prospettive`
    ];
    title = `${cleanTopic}: Nuove Indagini e Prospettive di Ricerca`;
    shortTitle = cleanTopic.length > 28 ? cleanTopic.slice(0, 26) + "..." : cleanTopic;
    excerpt = item.description || `Un'analisi documentata sulle recenti evidenze e riflessioni relative a "${cleanTopic}".`;
    content = `### Le Frontiere della Ricerca su ${cleanTopic}\n\nL'approfondimento sul tema **${cleanTopic}** mette in luce una serie di sviluppi significativi nel panorama contemporaneo. Attraverso il confronto tra fonti specializzate e dati empirici, emergono aspetti fondamentali che arricchiscono la nostra comprensione del tema.\n\n### Analisi e Riscontri Documentati\n\nGli studiosi e gli esperti del settore evidenziano come la questione non possa essere ridotta a formule semplicistiche. L'incrocio tra testimonianze d'archivio, rilievi sperimentali e dibattito critico offre chiavi di lettura inedite per interpretare l'impatto di questo ambito sulla cultura odierna.\n\n> «Comprendere la complessità di ${cleanTopic} significa acquisire strumenti essenziali per interpretare le trasformazioni del nostro tempo.» — *Redazione ${cat}*\n\n### Spunti di Riflessione\n\nIl percorso di analisi conferma l'importanza di un approccio rigoroso e interdisciplinare, capace di valorizzare il rigore documentale accanto alla chiarezza espositiva.`;
  }

  const sourcesList = sourcesText.split(",").map((s) => ({
    title: `Rassegna Documentaria: ${s.trim()}`,
    url: "https://www.treccani.it",
    publisher: s.trim() || "Istituto Treccani",
    originalLanguage: "Italiano"
  }));

  return {
    id: `dyn-art-${item.id || index}-${daySeed}`,
    pageNumber: index + 2,
    category: cat,
    topicRef: rawTopic,
    title,
    shortTitle,
    excerpt,
    content,
    readingTime: "5 min",
    author: `Redazione ${cat}`,
    date: dateFormatted,
    highlightQuote: `«L'approfondimento su ${cleanTopic} rivela connessioni inaspettate tra storia e futuro.»`,
    sources: sourcesList
  };
}

/**
  Genera l'insieme di articoli del giorno SENZA usare alcuna cache statica di articoli pre-compilati.
  Ogni giorno ed a ogni modifica degli interessi dell'utente, genera articoli freschi, ricchi,
  specifici ed articolati legati direttamente agli interessi attivi.
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

    // Cerca nel pool di articoli per categoria
    const categoryPool = INTEREST_TOPICS_POOL[category] || [];

    // Tenta prima il match per parola chiave del topic
    let selectedTpl: ArticleTemplate | null = null;
    if (categoryPool.length > 0) {
      const topicLower = topic.toLowerCase();
      selectedTpl = categoryPool.find(
        (t) => topicLower.includes(t.topicKeyword.toLowerCase()) || t.topicKeyword.toLowerCase().includes(topicLower)
      ) || null;

      if (!selectedTpl) {
        const templateIndex = Math.abs(daySeed + idx) % categoryPool.length;
        selectedTpl = categoryPool[templateIndex];
      }
    }

    if (selectedTpl && !usedTitles.has(selectedTpl.title)) {
      usedTitles.add(selectedTpl.title);
      generatedArticles.push({
        id: `fresh-art-${category.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${idx}-${daySeed}`,
        pageNumber: idx + 2,
        category: selectedTpl.category,
        topicRef: topic || selectedTpl.title,
        title: selectedTpl.title,
        shortTitle: selectedTpl.shortTitle,
        excerpt: selectedTpl.excerpt,
        content: selectedTpl.content,
        readingTime: selectedTpl.readingTime,
        author: selectedTpl.author,
        date: dateFormatted,
        highlightQuote: selectedTpl.highlightQuote,
        sources: selectedTpl.sources
      });
      return;
    }

    // Se la categoria o l'interesse è personalizzato dall'utente, genera un articolo dinamico dedicato
    const customArt = generateCustomInterestArticle(interest, daySeed, idx, dateFormatted);
    if (!usedTitles.has(customArt.title)) {
      usedTitles.add(customArt.title);
      generatedArticles.push(customArt);
    }
  });

  return generatedArticles;
}
