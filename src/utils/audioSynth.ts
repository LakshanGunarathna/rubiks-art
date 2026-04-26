// Web Audio API synthesizer for cube rotation sounds
let audioCtx: AudioContext | null = null;

export const playRotationSound = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  // Create a mechanical "click" sound
  oscillator.type = 'square';
  oscillator.frequency.setValueAtTime(150, audioCtx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.05);

  gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start(audioCtx.currentTime);
  oscillator.stop(audioCtx.currentTime + 0.05);
};
