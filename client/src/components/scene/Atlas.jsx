import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import Terrain from './Terrain'
import Markers from './Markers'

const CANVAS_COLOR = '#0b0b0c' // --color-canvas; bg + fog share it so terrain fades into the dark

// Camera rig: eases toward a point driven by the mouse, always looking at the
// map's center. Default sits low toward the horizon; the mouse nudges it ~15%
// each way. Always follows (never freezes). Reduced-motion holds the default.
const RADIUS = 54
const BASE_POLAR = THREE.MathUtils.degToRad(62) // resting tilt — toward the horizon
const MIN_POLAR = THREE.MathUtils.degToRad(48)
const MAX_POLAR = THREE.MathUtils.degToRad(74)
const SENS = 0.16 // mouse swing per axis (~±9°)

function CameraRig({ reduced, mouse }) {
  const target = useRef(new THREE.Vector3(0, 25, 48)) // matches the load position

  useFrame((state) => {
    const { camera } = state
    const azimuth = reduced ? 0 : mouse.current.x * SENS
    const polar = reduced
      ? BASE_POLAR
      : THREE.MathUtils.clamp(BASE_POLAR + mouse.current.y * SENS, MIN_POLAR, MAX_POLAR)
    const sinP = Math.sin(polar)
    target.current.set(
      RADIUS * sinP * Math.sin(azimuth),
      RADIUS * Math.cos(polar),
      RADIUS * sinP * Math.cos(azimuth),
    )
    camera.position.lerp(target.current, 0.05) // smooth follow / natural decay
    camera.lookAt(0, 0, 0)
  })

  return null
}

// The 3D "map" the site lives on: terrain + mouse-driven camera + section markers.
export default function Atlas({ onSelect }) {
  const reduced = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  // Track the mouse at the WINDOW level (not the canvas) so the camera keeps
  // following even when the cursor is over a label/DOM element.
  const mouse = useRef({ x: 0, y: 0 })
  useEffect(() => {
    if (reduced) return
    const onMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [reduced])

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 25, 48], fov: 46, near: 0.1, far: 200 }}
      gl={{ antialias: true }}
      onCreated={({ scene }) => {
        scene.fog = new THREE.Fog(CANVAS_COLOR, 26, 72)
      }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <color attach="background" args={[CANVAS_COLOR]} />
      <Terrain reduced={reduced} />
      <Markers onSelect={onSelect} reduced={reduced} />
      <CameraRig reduced={reduced} mouse={mouse} />
    </Canvas>
  )
}
