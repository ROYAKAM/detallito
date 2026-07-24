// ponytail: all SFX generated via Web Audio API, zero audio files needed
// 8-bit retro sounds that match Stardew Valley aesthetic

let ctx = null
function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function osc(type, freq, duration, volume = 0.15) {
  const c = getCtx()
  const o = c.createOscillator()
  const g = c.createGain()
  o.type = type
  o.frequency.value = freq
  g.gain.value = volume
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration)
  o.connect(g).connect(c.destination)
  o.start()
  o.stop(c.currentTime + duration)
}

function noise(duration, volume = 0.05) {
  const c = getCtx()
  const bufferSize = c.sampleRate * duration
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1
  const src = c.createBufferSource()
  const g = c.createGain()
  const f = c.createBiquadFilter()
  src.buffer = buffer
  f.type = 'highpass'
  f.frequency.value = 3000
  g.gain.value = volume
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration)
  src.connect(f).connect(g).connect(c.destination)
  src.start()
}

const sfx = {
  // Button/menu click - short blip
  click() {
    osc('square', 660, 0.08, 0.1)
  },

  // Page/screen transition - descending sweep
  transition() {
    const c = getCtx()
    const o = c.createOscillator()
    const g = c.createGain()
    o.type = 'sine'
    o.frequency.setValueAtTime(400, c.currentTime)
    o.frequency.exponentialRampToValueAtTime(150, c.currentTime + 0.3)
    g.gain.setValueAtTime(0.12, c.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.35)
    o.connect(g).connect(c.destination)
    o.start()
    o.stop(c.currentTime + 0.35)
  },

  // Dialogue typing tick - very short, soft
  dialogueTick() {
    osc('square', 440 + Math.random() * 60, 0.03, 0.04)
  },

  // Dialogue advance / next line
  dialogueAdvance() {
    osc('square', 520, 0.06, 0.08)
    setTimeout(() => osc('square', 660, 0.06, 0.08), 60)
  },

  // Quiz correct answer - ascending chime
  correct() {
    osc('square', 523, 0.12, 0.12)
    setTimeout(() => osc('square', 659, 0.12, 0.12), 100)
    setTimeout(() => osc('square', 784, 0.18, 0.12), 200)
  },

  // Quiz wrong answer - descending buzz
  wrong() {
    osc('square', 220, 0.15, 0.1)
    setTimeout(() => osc('square', 165, 0.2, 0.1), 120)
  },

  // Item unlock / card reveal - sparkle arpeggio
  unlock() {
    osc('square', 523, 0.08, 0.1)
    setTimeout(() => osc('square', 659, 0.08, 0.1), 70)
    setTimeout(() => osc('square', 784, 0.08, 0.1), 140)
    setTimeout(() => osc('square', 1047, 0.15, 0.1), 210)
  },

  // Card flip - short swoosh
  flip() {
    noise(0.12, 0.06)
    osc('sine', 300, 0.1, 0.06)
  },

  // Confetti / celebration
  celebration() {
    osc('square', 523, 0.1, 0.1)
    setTimeout(() => osc('square', 659, 0.1, 0.1), 80)
    setTimeout(() => osc('square', 784, 0.1, 0.1), 160)
    setTimeout(() => osc('square', 1047, 0.2, 0.12), 240)
    setTimeout(() => noise(0.15, 0.04), 300)
  },

  // Envelope open - paper unfold
  envelopeOpen() {
    noise(0.2, 0.04)
    const c = getCtx()
    const o = c.createOscillator()
    const g = c.createGain()
    o.type = 'sine'
    o.frequency.setValueAtTime(200, c.currentTime)
    o.frequency.exponentialRampToValueAtTime(500, c.currentTime + 0.3)
    g.gain.setValueAtTime(0.08, c.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.35)
    o.connect(g).connect(c.destination)
    o.start()
    o.stop(c.currentTime + 0.35)
  },

  // Login success - happy double chime
  loginSuccess() {
    osc('square', 523, 0.1, 0.1)
    setTimeout(() => osc('square', 784, 0.15, 0.12), 120)
    setTimeout(() => osc('square', 1047, 0.2, 0.12), 260)
  },

  // Te amo counter - cute pop
  pop() {
    osc('sine', 880, 0.06, 0.1)
    osc('square', 1200, 0.04, 0.04)
  },

  // Countdown tick
  tick() {
    osc('square', 880, 0.03, 0.03)
  },

  // Hint reveal
  hint() {
    osc('triangle', 440, 0.1, 0.08)
    setTimeout(() => osc('triangle', 550, 0.12, 0.08), 80)
  },

  // Error / locked
  locked() {
    osc('square', 150, 0.12, 0.08)
    setTimeout(() => osc('square', 120, 0.15, 0.08), 100)
  },
}

export default sfx
