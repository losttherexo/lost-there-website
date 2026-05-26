import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import Terrain from './Terrain'
import Markers from './Markers'

const CANVAS_COLOR = '#0b0b0c' // --color-canvas; bg + fog share it so terrain fades into the dark

// Camera rig: eases the camera toward a point driven by the mouse, always looking
// at the map's center. Default sits low toward the horizon; the mouse only nudges
// it a little (~15% each way). Reduced-motion holds the fixed default.
const RADIUS = 54 // fixed distance from map center
const BASE_POLAR = THREE.MathUtils.degToRad(62) // resting tilt — looking toward the horizon
const MIN_POLAR = THREE.MathUtils.degToRad(48) // mouse-down limit
const MAX_POLAR = THREE.MathUtils.degToRad(74) // mouse-up limit (almost flat to horizon)
const SENS = 0.16 // mouse swing per axis (~±9°, gentle parallax)

function CameraRig({ reduced }) {
  const target = useRef(new THREE.Vector3())

  useFrame((state) => {
    const { camera, pointer } = state
    // azimuth = horizontal mouse only (no idle rotation — the map itself moves now)
    const azimuth = reduced ? 0 : pointer.x * SENS
    // polar = tilt; mouse UP (pointer.y → +1) tilts toward the horizon
    const polar = reduced
      ? BASE_POLAR
      : THREE.MathUtils.clamp(BASE_POLAR + pointer.y * SENS, MIN_POLAR, MAX_POLAR)

    const sinP = Math.sin(polar)
    target.current.set(
      RADIUS * sinP * Math.sin(azimuth),
      RADIUS * Math.cos(polar),
      RADIUS * sinP * Math.cos(azimuth),
    )
    camera.position.lerp(target.current, 0.05) // ease (higher = snappier)
    camera.lookAt(0, 0, 0)
  })

  return null
}

// The 3D "map" the site lives on: terrain + mouse-driven camera + section markers.
// Click-to-fly navigation and holographic post-processing come next.
export default function Atlas({ onSelect }) {
  const reduced = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  return (
    <Canvas
      dpr={[1, 2]}
      // Initial position matches the resting horizon view so it loads without a swing.
      camera={{ position: [0, 25, 48], fov: 46, near: 0.1, far: 200 }}
      gl={{ antialias: true }}
      onCreated={({ scene }) => {
        scene.fog = new THREE.Fog(CANVAS_COLOR, 26, 72)
      }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <color attach="background" args={[CANVAS_COLOR]} />
      <Terrain reduced={reduced} />
      <Markers onSelect={onSelect} />
      <CameraRig reduced={reduced} />
    </Canvas>
  )
}
