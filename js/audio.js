/**
 * Eternal Bloom - Romantic Ambient Soundscape Engine (Web Audio API)
 */

class RomanticSoundEngine {
  constructor() {
    this.isPlaying = false;
    this.audioCtx = null;
    this.timer = null;
    this.step = 0;

    // Romantic Canon / Wedding inspired arpeggio chord frequencies (Hz)
    // Key: D Major / F# Minor gentle progression
    this.chords = [
      [293.66, 369.99, 440.00, 587.33], // D Major (D4, F#4, A4, D5)
      [220.00, 329.63, 440.00, 554.37], // A Major (A3, E4, A4, C#5)
      [246.94, 293.66, 369.99, 493.88], // B Minor (B3, D4, F#4, B4)
      [185.00, 277.18, 369.99, 440.00], // F# Minor (F#3, C#4, F#4, A4)
      [196.00, 293.66, 392.00, 493.88], // G Major (G3, D4, G4, B4)
      [146.83, 220.00, 293.66, 369.99]  // D Major low
    ];

    this.initUI();
  }

  initUI() {
    const soundBtn = document.getElementById('soundToggleBtn');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => this.toggleSound());
    }
  }

  initAudioContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  playNote(freq, startTime, duration = 2.5) {
    if (!this.audioCtx) return;

    // Gentle soft bell/piano envelope
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    const filter = this.audioCtx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    // Warm low-pass filter
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, startTime);
    filter.frequency.exponentialRampToValueAtTime(400, startTime + duration);

    // Soft attack & romantic decaying release
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(0.045, startTime + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  startSequence() {
    if (!this.audioCtx) this.initAudioContext();
    this.isPlaying = true;
    this.updateUIState();

    let chordIdx = 0;
    let noteIdx = 0;

    const playNext = () => {
      if (!this.isPlaying || !this.audioCtx) return;

      const currentChord = this.chords[chordIdx];
      const freq = currentChord[noteIdx];
      const now = this.audioCtx.currentTime;

      this.playNote(freq, now, 2.2);

      noteIdx++;
      if (noteIdx >= currentChord.length) {
        noteIdx = 0;
        chordIdx = (chordIdx + 1) % this.chords.length;
      }

      this.timer = setTimeout(playNext, 480);
    };

    playNext();
  }

  stopSequence() {
    this.isPlaying = false;
    if (this.timer) clearTimeout(this.timer);
    this.updateUIState();
  }

  toggleSound() {
    if (this.isPlaying) {
      this.stopSequence();
    } else {
      this.startSequence();
    }
  }

  updateUIState() {
    const dock = document.querySelector('.floating-dock');
    const soundBtn = document.getElementById('soundToggleBtn');
    if (!soundBtn) return;

    if (this.isPlaying) {
      soundBtn.classList.add('audio-playing');
      soundBtn.setAttribute('title', 'Mute Music');
      if (dock) dock.classList.add('audio-active');
    } else {
      soundBtn.classList.remove('audio-playing');
      soundBtn.setAttribute('title', 'Play Romantic Music');
      if (dock) dock.classList.remove('audio-active');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.romanticSound = new RomanticSoundEngine();
});
