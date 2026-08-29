// Generatore di suono realistico di carta sfogliata via Web Audio API
let audioCtx: AudioContext | null = null;

export function playPageFlipSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    const duration = 0.22;
    const bufferSize = audioCtx.sampleRate * duration;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = buffer.getChannelData(0);

    // Genera rumore bianco modulato per simulare l'attrito della carta
    for (let i = 0; i < bufferSize; i++) {
      const progress = i / bufferSize;
      const envelope = Math.sin(progress * Math.PI) * Math.exp(-progress * 3);
      output[i] = (Math.random() * 2 - 1) * envelope;
    }

    const whiteNoise = audioCtx.createBufferSource();
    whiteNoise.buffer = buffer;

    // Filtro passa-banda dinamico per dare il timbro morbido della carta stampata
    const filter = audioCtx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1200, audioCtx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(450, audioCtx.currentTime + duration);
    filter.Q.setValueAtTime(1.5, audioCtx.currentTime);

    const gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.35, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);

    whiteNoise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    whiteNoise.start();
  } catch (e) {
    // Audio opzionale non bloccante
  }
}
