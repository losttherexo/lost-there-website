import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import Terrain from './Terrain'

const CANVAS_COLOR = '#0b0b0c' // --color-canvas; bg + fog share it so terrain fades into the dark

// Camera rig: eases the camera toward a point driven by the mouse, always looking
// at the map's center. Horizontal mouse = orbit around it; vertical = slight tilt.
// A slow time drift keeps it alive when the mouse is still. Reduced-motion holds
// a fixed bird's-eye and ignores both.
const RADIUS = 54 // fixed distance from map center
const BASE_POLAR = THREE.MathUtils.degToRad(26) // resting tilt (bird's-eye)
const MIN_POLAR = THREE.MathUtils.degToRad(10) // mouse-down limit (near top-down)
const MAX_POLAR = THREE.MathUtils.degToRad(74) // mouse-up limit (almost horizon)

function CameraRig({ reduced }) {
  const target = useRef(new THREE.Vector3())

  useFrame((state) => {
    const { camera, pointer, clock } = state
    // Matched sensitivity so the mouse feels the same in every direction.
    const SENS = 0.68
    // azimuth = slow drift + horizontal mouse (peer around)
    const azimuth = reduced ? 0 : clock.elapsedTime * 0.04 + pointer.x * SENS
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

// The 3D "map" the site lives on. Phase A: terrain + mouse-driven camera.
// Markers, click-to-fly navigation, and the holographic post-processing come next.
export default function Atlas() {
  const reduced = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 50, 22], fov: 46, near: 0.1, far: 200 }}
      gl={{ antialias: true }}
      onCreated={({ scene }) => {
        scene.fog = new THREE.Fog(CANVAS_COLOR, 26, 72)
      }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <color attach="background" args={[CANVAS_COLOR]} />
      <Terrain />
      <CameraRig reduced={reduced} />
    </Canvas>
  )
}
