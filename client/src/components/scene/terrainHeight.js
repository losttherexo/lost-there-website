// Shared terrain shape. Both the Terrain mesh (geometry displacement) and the
// Markers (so beams sit on the surface) derive elevation from this one source.

export const SIZE = 240 // world units across
export const SEGMENTS = 420 // grid resolution
export const HEIGHT = 7 // max elevation
const NOISE = 0.06 // horizontal noise frequency

function hash(x, y) {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
  return n - Math.floor(n)
}
function lerp(a, b, t) {
  return a + (b - a) * t
}
function noise(x, y) {
  const xi = Math.floor(x)
  const yi = Math.floor(y)
  const xf = x - xi
  const yf = y - yi
  const u = xf * xf * (3 - 2 * xf)
  const v = yf * yf * (3 - 2 * yf)
  const a = hash(xi, yi)
  const b = hash(xi + 1, yi)
  const c = hash(xi, yi + 1)
  const d = hash(xi + 1, yi + 1)
  return lerp(lerp(a, b, u), lerp(c, d, u), v)
}
function fbm(x, y) {
  let amp = 1
  let freq = 1
  let sum = 0
  let norm = 0
  for (let i = 0; i < 4; i++) {
    sum += amp * noise(x * freq, y * freq)
    norm += amp
    amp *= 0.5
    freq *= 2
  }
  return sum / norm
}

// Displacement for a plane-local vertex (used when building the geometry).
export function displace(px, py) {
  return fbm(px * NOISE + 100, py * NOISE + 100) * HEIGHT
}

// World-space surface height at (x, z). The plane is rotated -90° about X, so
// world Z maps to plane -Y — hence the sign flip. Markers use this to sit flush.
export function heightAt(x, z) {
  return fbm(x * NOISE + 100, -z * NOISE + 100) * HEIGHT
}
