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

const SIZE = 240 // world units across — far bigger than the camera can see, so
const SEGMENTS = 420 //   the real edge never enters frame; fog fades it to dark first
const HEIGHT = 7 // max elevation

// Contour shader: draws a glowing line each time the surface crosses an elevation
// step (like a topo map's iso-lines), plus a faint surface fill. fwidth keeps the
// lines a consistent width regardless of slope. Distance fade replaces fog.
const vertexShader = /* glsl */ `
  varying float vHeight;
  varying float vViewZ;
  void main() {
    vHeight = position.z;                       // displaced elevation (pre-rotation)
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vViewZ = -mv.z;                             // distance from camera
    gl_Position = projectionMatrix * mv;
  }
`

const fragmentShader = /* glsl */ `
  precision highp float;
  varying float vHeight;
  varying float vViewZ;
  uniform vec3 uColor;
  uniform float uInterval;   // elevation between contour lines
  uniform float uFogNear;
  uniform float uFogFar;
  void main() {
    float h = vHeight / uInterval;
    float dist = min(fract(h), 1.0 - fract(h));  // distance to nearest contour
    float w = fwidth(h) * 1.25;                  // anti-aliased line width
    float line = 1.0 - smoothstep(0.0, w, dist);
    float fade = 1.0 - smoothstep(uFogNear, uFogFar, vViewZ);
    float alpha = (line * 0.85 + 0.05) * fade;   // bright lines + faint fill
    if (alpha < 0.002) discard;
    gl_FragColor = vec4(uColor, alpha);
  }
`

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
      // Continuous topography everywhere (no island falloff); the camera only
      // ever sees the middle, and fog dissolves the rest before the edge.
      const h = fbm(x * 0.06 + 100, y * 0.06 + 100) * HEIGHT
      pos.setZ(i, h)
    }
    geo.computeVertexNormals()
    return geo
  }, [])

  const uniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color('#6b8fb5') },
      uInterval: { value: 0.4 },
      uFogNear: { value: 26 },
      uFogFar: { value: 72 },
    }),
    [],
  )

  // Laid flat (plane is born in XY; rotate so displaced Z becomes up).
  return (
    <mesh geometry={geometry} rotation-x={-Math.PI / 2} {...props}>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        extensions={{ derivatives: true }}
      />
    </mesh>
  )
}
