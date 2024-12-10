class NotesPlayer {
  constructor() {
    this.NOTES = {
      PAUSE: 0.1,
      C: 261.63,
      "C#": 277.18,
      Db: 277.18,
      D: 293.66,
      "D#": 311.13,
      Eb: 311.13,
      E: 329.63,
      F: 349.23,
      "F#": 369.99,
      Gb: 369.99,
      G: 392,
      "G#": 415.3,
      Ab: 415.3,
      A: 440,
      "A#": 466.16,
      Bb: 466.16,
      B: 493.88,
    };

    let audioContextClass = window.AudioContext || window.webkitAudioContext;
    this.context = new audioContextClass();
  }

  /**
   * @function
   * Apply ADSR envelope to a sound for a piano-like attack, decay, sustain, and release.
   */
  applyADSR(envelope, gainNode) {
    const { attack, decay, sustain, release } = envelope;
    const now = this.context.currentTime;

    // Attack: Increase volume from 0 to 1
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.3, now + attack); // Reduced peak volume

    // Decay: Decrease volume to sustain level
    gainNode.gain.linearRampToValueAtTime(sustain, now + attack + decay);

    // Sustain: Keep the volume at sustain level
    gainNode.gain.setValueAtTime(sustain, now + attack + decay);

    // Release: Decrease volume to 0
    gainNode.gain.linearRampToValueAtTime(
      0,
      now + attack + decay + sustain + release
    );
  }

  /**
   * @function
   * Play a chord with piano-like sound using waveform shaping and ADSR.
   *
   * @param {Array<string>} notes - Array of musical notes (eg. ["A", "C#", "E"]).
   * @param {integer} octave - Octave shift (eg. -2, -1, 0, 1, 2).
   * @param {integer} bpm - Beats per minute (eg. 60).
   * @param {float} durationSecondsPerBeat - Duration per beat (optional, default is 1/(bpm/60)).
   */
  playChord(notes, octave, bpm = 60, durationSecondsPerBeat = 1 / (bpm / 60)) {
    let context = this.context;

    // Log chord information
    console.log(
      `Playing chord: ${notes.join(
        ", "
      )} at octave ${octave} for ${durationSecondsPerBeat} seconds at ${bpm} bpm`
    );

    // Define ADSR envelope parameters (in seconds)
    const envelope = {
      attack: 0.02, // Fast attack
      decay: 0.1, // Short decay
      sustain: 0.4, // Sustain level reduced for smoother sound
      release: 0.3, // Release time
    };

    // Create oscillator and gain for each note in the chord
    notes.forEach((note) => {
      let freq = this.NOTES[note];
      if (!isFinite(freq)) {
        console.error(`Invalid note: ${note}`);
        return;
      }
      let octaveFactor = Math.pow(2, octave);

      let oscillator = context.createOscillator();
      let gainNode = context.createGain();

      // Choose a smoother waveform (blend of sine and sawtooth)
      oscillator.type = "triangle"; // Triangle wave is smoother and more rounded than sawtooth

      oscillator.frequency.setTargetAtTime(
        freq * octaveFactor,
        context.currentTime,
        0
      );
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      // Apply ADSR to the gain node for shaping the sound
      this.applyADSR(envelope, gainNode);

      // Start and stop the oscillator
      oscillator.start();
      oscillator.stop(context.currentTime + durationSecondsPerBeat);
    });
  }

  /**
   * @function
   * Play a sequence of notes (a melody) with a 500ms delay between them.
   *
   * @param {Array<string>} notes - Array of notes to play.
   */
  playMelody(notes) {
    const context = this.context;
    notes.forEach((note, index) => {
      let freq = this.NOTES[note];
      if (!isFinite(freq)) {
        console.error(`Invalid note: ${note}`);
        return;
      }

      let octave = 1; // Default octave
      let duration = 300; // 500ms for each note

      let oscillator = context.createOscillator();
      let gainNode = context.createGain();
      // Use triangle wave for smoother, more natural sound
      oscillator.type = "triangle";
      oscillator.frequency.setTargetAtTime(
        freq * Math.pow(2, octave),
        context.currentTime,
        0
      );
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      // Apply ADSR to each note
      const envelope = {
        attack: 0.02,
        decay: 0.1,
        sustain: 0.4,
        release: 12,
      };
      this.applyADSR(envelope, gainNode);

      // Start and stop the oscillator with a 500ms delay
      oscillator.start(context.currentTime + (index * duration) / 1000);
      oscillator.stop(context.currentTime + ((index + 1) * duration) / 1000);
    });
  }
}

/**
 * Use Examples:
 * var player1 = new NotesPlayer();
 * player1.playChord(["A", "C#", "E"], 0, 60);  // Play a chord at 60 bpm
 * player1.playMelody(["A", "B", "C", "D", "E"]); // Play a melody with 500ms delay between notes
 */
