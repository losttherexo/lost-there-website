import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import Terrain from './Terrain'
import Markers from './Markers'

// Keep a roughly constant HORIZONTAL field of view across aspect ratios. three's
// fov is vertical, so on a tall/narrow (portrait) screen we widen it — that keeps
// the full marker spread in frame without moving the camera past the fog.
const TARGET_H_FOV = THREE.MathUtils.degToRad(64)

function ResponsiveCamera({ portrait }) {
  const camera = useThree((s) => s.camera)
  const size = useThree((s) => s.size)
  useEffect(() => {
    const aspect = size.width / Math.max(size.height, 1)
    let vFov = 2 * Math.atan(Math.tan(TARGET_H_FOV / 2) / Math.max(aspect, 0.0001))
    // Portrait gets a higher cap so more of the map is shown.
    const maxFov = THREE.MathUtils.degToRad(portrait ? 112 : 92)
    vFov = THREE.MathUtils.clamp(vFov, THREE.MathUtils.degToRad(44), maxFov)
    camera.fov = THREE.MathUtils.radToDeg(vFov)
    camera.updateProjectionMatrix()
  }, [camera, size.width, size.height, portrait])
  return null
}

const CANVAS_COLOR = '#0b0b0c' // --color-canvas; bg + fog share it so terrain fades into the dark

// Camera rig: eases toward a point driven by the mouse, always looking at the
// map's center. Default sits low toward the horizon; the mouse nudges it ~15%
// each way. Always follows (never freezes). Reduced-motion holds the default.
const RADIUS = 54
const BASE_POLAR = THREE.MathUtils.degToRad(62) // resting tilt — toward the horizon
const MIN_POLAR = THREE.MathUtils.degToRad(48)
const MAX_POLAR = THREE.MathUtils.degToRad(74)
const SENS = 0.16 // mouse swing per axis (~±9°)

function CameraRig({ reduced, mouse, portrait }) {
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
    // Portrait: aim lower so the horizon rides up high (~80% of the screen) and
    // more ground fills the frame.
    camera.lookAt(0, portrait ? -14 : 0, 0)
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

  // Portrait gets its own marker layout (uses the tall space). Switches live on
  // orientation change.
  const [portrait, setPortrait] = useState(
    () => typeof window !== 'undefined' && window.matchMedia?.('(orientation: portrait)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(orientation: portrait)')
    const onChange = () => setPortrait(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // Track the mouse at the WINDOW level (not the canvas) so the camera keeps
  // following even when the cursor is over a label/DOM element.
  const mouse = useRef({ x: 0, y: 0 })
  useEffect(() => {
    if (reduced) return
    const set = (clientX, clientY) => {
      mouse.current.x = (clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -((clientY / window.innerHeight) * 2 - 1)
    }
    const onMove = (e) => set(e.clientX, e.clientY)
    const onTouch = (e) => {
      if (e.touches[0]) set(e.touches[0].clientX, e.touches[0].clientY)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('touchmove', onTouch, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('touchmove', onTouch)
    }
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
      <ResponsiveCamera portrait={portrait} />
      <Terrain reduced={reduced} portrait={portrait} />
      <Markers onSelect={onSelect} reduced={reduced} portrait={portrait} />
      <CameraRig reduced={reduced} mouse={mouse} portrait={portrait} />
    </Canvas>
  )
}
