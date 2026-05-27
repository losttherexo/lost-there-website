import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { displace, SIZE, SEGMENTS } from './terrainHeight'

// Contour shader: draws a glowing line each time the surface crosses an elevation
// step (like a topo map's iso-lines), plus a faint surface fill. fwidth keeps the
// lines a consistent width regardless of slope. Distance fade replaces fog.
const vertexShader = /* glsl */ `
  varying float vHeight;
  varying float vViewZ;
  varying vec2 vWorld;
  void main() {
    vHeight = position.z;                       // displaced elevation (pre-rotation)
    vWorld = position.xy;                        // map-plane coords (for spatial randomness)
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vViewZ = -mv.z;                             // distance from camera
    gl_Position = projectionMatrix * mv;
  }
`

const fragmentShader = /* glsl */ `
  precision highp float;
  varying float vHeight;
  varying float vViewZ;
  varying vec2 vWorld;
  uniform vec3 uColor;
  uniform float uInterval;   // elevation between contour lines
  uniform float uFogNear;
  uniform float uFogFar;
  uniform float uTime;

  void main() {
    // ── contour lines ──
    float h = vHeight / uInterval;
    float dist = min(fract(h), 1.0 - fract(h));  // distance to nearest contour
    float w = fwidth(h) * 1.25;                  // anti-aliased line width
    float line = 1.0 - smoothstep(0.0, w, dist);

    // ── traveling waves: bands of brightness sweep across the map; two waves at
    //    different angles/speeds interfere for an organic, holographic flow ──
    float wave = sin(dot(vWorld, vec2(0.7, 0.35)) * 0.22 - uTime * 1.1)
               + sin(dot(vWorld, vec2(-0.3, 0.9)) * 0.16 - uTime * 0.7);
    float crest = smoothstep(0.4, 1.6, wave);

    float fade = 1.0 - smoothstep(uFogNear, uFogFar, vViewZ);
    // base 1.3 = brighter resting lines; crest adds the wave pop; 0.08 = faint surface glow
    float alpha = (line * (1.3 + crest * 1.8) + 0.08) * fade;
    if (alpha < 0.002) discard;
    gl_FragColor = vec4(uColor, alpha);
  }
`

export default function Terrain({ reduced = false, portrait = false, ...props }) {
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
      pos.setZ(i, displace(x, y))
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
      uTime: { value: 0 },
    }),
    [],
  )

  // Drive the shader clock (the pulsing lines). Frozen under reduced-motion.
  // Push the fog back in portrait so more terrain shows before it dissolves
  // (raises the visible horizon).
  useFrame((state) => {
    if (!reduced) uniforms.uTime.value = state.clock.elapsedTime
    uniforms.uFogFar.value = portrait ? 130 : 72
    // Tighter contour interval in landscape so the lines are as dense as the
    // steep portrait view makes them look.
    uniforms.uInterval.value = portrait ? 0.4 : 0.22
  })

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
