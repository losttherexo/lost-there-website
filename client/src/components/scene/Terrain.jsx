import { useMemo } from 'react'
import * as THREE from 'three'

// ── Cheap, dependency-free value noise → layered (fbm) for rolling hills. ──────
// Real shader-based noise comes in the "look" phase (the TouchDesigner port);
// this is enough to read as topography.
function hash(x, y) {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
  return n - Math.floor(n)
}
function noise(x, y) {
  const xi = Math.floor(x)
  const yi = Math.floor(y)
  const xf = x - xi
  const yf = y - yi
  const u = xf * xf * (3 - 2 * xf) // smoothstep
  const v = yf * yf * (3 - 2 * yf)
  const a = hash(xi, yi)
  const b = hash(xi + 1, yi)
  const c = hash(xi, yi + 1)
  const d = hash(xi + 1, yi + 1)
  return THREE.MathUtils.lerp(THREE.MathUtils.lerp(a, b, u), THREE.MathUtils.lerp(c, d, u), v)
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

const SIZE = 60 // world units across
const SEGMENTS = 120 // grid resolution (more = finer contours, heavier)
const HEIGHT = 7 // max elevation

export default function Terrain(props) {
  // Build the displaced geometry once. A flat plane's vertices get pushed up the
  // Z axis by the noise; a radial falloff drops the edges so it reads as a
  // landmass fading into the dark rather than a tabletop.
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(SIZE, SIZE, SEGMENTS, SEGMENTS)
    const pos = geo.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      const dist = Math.sqrt(x * x + y * y) / (SIZE / 2)
      const falloff = Math.max(0, 1 - dist * dist)
      const h = fbm(x * 0.06 + 100, y * 0.06 + 100) * HEIGHT * falloff
      pos.setZ(i, h)
    }
    geo.computeVertexNormals()
    return geo
  }, [])

  // Rotate flat (plane is born in the XY plane; lay it down so Z-height becomes
  // up). Wireframe + partial opacity gives the holographic contour read.
  return (
    <mesh geometry={geometry} rotation-x={-Math.PI / 2} {...props}>
      <meshBasicMaterial color="#6b8fb5" wireframe transparent opacity={0.55} />
    </mesh>
  )
}
