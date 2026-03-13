'use client';

// A brutalist, physics-driven audio engine using raw Web Audio API oscillators.
// No MP3s. No compressed garbage. Pure mathematical waveforms.

class Synthesizer {
  constructor() {
    this.context = null;
    this.masterGain = null;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    
    this.context = new AudioContext();
    this.masterGain = this.context.createGain();
    this.masterGain.gain.value = 0.5; // Master Volume
    this.masterGain.connect(this.context.destination);
    this.initialized = true;
  }

  resume() {
    if (this.context && this.context.state === 'suspended') {
      this.context.resume();
    }
  }

  // 1. Sub-Bass Hum (Deep, psychological frequency)
  playSubHum() {
    if (!this.initialized) this.init();
    this.resume();

    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(45, this.context.currentTime); // 45hz - felt more than heard
    
    gain.gain.setValueAtTime(0, this.context.currentTime);
    gain.gain.linearRampToValueAtTime(0.3, this.context.currentTime + 2); // Fade in over 2s
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start();
    return { osc, gain }; // Return to allow stopping it later
  }

  stopSubHum(humRef) {
    if (!humRef) return;
    const { osc, gain } = humRef;
    gain.gain.linearRampToValueAtTime(0, this.context.currentTime + 3); // Fade out over 3s
    osc.stop(this.context.currentTime + 3);
  }

  // 2. Airlock Hiss (White noise)
  playHiss() {
    if (!this.initialized) this.init();
    this.resume();

    const bufferSize = this.context.sampleRate * 3; // 3 seconds of noise
    const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1; // Pure White Noise
    }

    const noise = this.context.createBufferSource();
    noise.buffer = buffer;

    // Filter the noise to sound like heavy pressurized air (high pass + low pass)
    const bandpass = this.context.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = 1000;
    bandpass.Q.value = 0.5;

    const gain = this.context.createGain();
    gain.gain.setValueAtTime(0, this.context.currentTime);
    gain.gain.linearRampToValueAtTime(0.8, this.context.currentTime + 0.1); // Explosive start
    gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 2.5); // Slow decay

    noise.connect(bandpass);
    bandpass.connect(gain);
    gain.connect(this.masterGain);

    noise.start();
  }

  // 3. Tactile UI Click (Heavy, metallic thud)
  playClick() {
    if (!this.initialized) this.init();
    this.resume();

    const osc = this.context.createOscillator();
    const gain = this.context.createGain();

    osc.type = 'square';
    // Pitch envelope: drops rapidly for a "thud" sound
    osc.frequency.setValueAtTime(150, this.context.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, this.context.currentTime + 0.05);

    // Amplitude envelope: sharp attack, quick decay
    gain.gain.setValueAtTime(1, this.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.context.currentTime + 0.1);
  }
}

// Singleton instance
const audioEngine = new Synthesizer();
export default audioEngine;
