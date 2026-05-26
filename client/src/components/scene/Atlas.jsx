import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import Terrain from './Terrain'
import Markers from './Markers'

const CANVAS_COLOR = '#0b0b0c' // --color-canvas; bg + fog share it so terrain fades into the dark

// Keep a roughly constant HORIZONTAL field of view across aspect ratios.
const TARGET_H_FOV = THREE.MathUtils.degToRad(64)

function ResponsiveCamera({ portrait }) {
  const camera = useThree((s) => s.camera)
  const size = useThree((s) => s.size)
  useEffect(() => {
    const aspect = size.width / Math.max(size.height, 1)
    let vFov = 2 * Math.atan(Math.tan(TARGET_H_FOV / 2) / Math.max(aspect, 0.0001))
    const maxFov = THREE.MathUtils.degToRad(portrait ? 112 : 92)
    vFov = THREE.MathUtils.clamp(vFov, THREE.MathUtils.degToRad(44), maxFov)
    camera.fov = THREE.MathUtils.radToDeg(vFov)
    camera.updateProjectionMatrix()
  }, [camera, size.width, size.height, portrait])
  return null
}

// Camera rig: mouse-driven by default; when `flight.current` is set (a clicked
// marker), it flies down toward that coordinate instead.
const RADIUS = 54
const BASE_POLAR = THREE.MathUtils.degToRad(62)
const MIN_POLAR = THREE.MathUtils.degToRad(48)
const MAX_POLAR = THREE.MathUtils.degToRad(74)
const SENS = 0.16

function CameraRig({ reduced, mouse, portrait, flight }) {
  const target = useRef(new THREE.Vector3(0, 25, 48))
  const look = useRef(new THREE.Vector3(0, 0, 0))
  const flyPos = useRef(new THREE.Vector3())
  const flyLook = useRef(new THREE.Vector3())

  useFrame((state) => {
    const { camera } = state

    // ── Flight: descend toward the clicked marker ──
    if (flight.current) {
      const m = flight.current
      flyPos.current.set(m.x, m.y + 14, m.z + 10) // above + slightly back
      flyLook.current.set(m.x, m.y + 1, m.z)
      camera.position.lerp(flyPos.current, reduced ? 1 : 0.06) // ease in
      look.current.lerp(flyLook.current, reduced ? 1 : 0.08)
      camera.lookAt(look.current)
      return
    }

    // ── Mouse mode ──
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
    camera.position.lerp(target.current, 0.05)
    look.current.set(0, portrait ? -30 : 0, 0) // kept in sync for a smooth flight hand-off
    camera.lookAt(look.current)
  })

  return null
}

// The 3D "map" the site lives on: terrain + mouse-driven camera + section markers,
// with click-to-fly navigation.
export default function Atlas({ onNavigate }) {
  const reduced = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  // Portrait gets its own marker layout + framing. Switches live on orientation.
  const [portrait, setPortrait] = useState(
    () => typeof window !== 'undefined' && window.matchMedia?.('(orientation: portrait)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(orientation: portrait)')
    const onChange = () => setPortrait(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // Mouse at the WINDOW level so the camera follows even over DOM labels.
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

  // Flight: clicking a marker flies the camera there, fades to dark, then routes.
  const flight = useRef(null)
  const [flying, setFlying] = useState(false)
  const FLIGHT_MS = reduced ? 350 : 1400
  const handleSelect = (marker) => {
    if (flight.current) return // already flying
    flight.current = marker // { to, x, y, z }
    setFlying(true)
    window.setTimeout(() => onNavigate(marker.to), FLIGHT_MS)
  }

  return (
    <>
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
        <Markers onSelect={handleSelect} reduced={reduced} portrait={portrait} />
        <CameraRig reduced={reduced} mouse={mouse} portrait={portrait} flight={flight} />
      </Canvas>

      {/* Fade-to-dark that covers the flight → route hand-off. */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 bg-canvas transition-opacity ease-in ${
          flying ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transitionDuration: `${FLIGHT_MS}ms` }}
      />
    </>
  )
}
