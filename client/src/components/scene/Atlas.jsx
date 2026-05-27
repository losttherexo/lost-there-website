import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import Terrain from './Terrain'
import Markers from './Markers'
import { heightAt } from './terrainHeight'
import { findSection } from './sections'

const CANVAS_COLOR = '#0b0b0c' // --color-canvas; bg + fog share it so terrain fades into the dark
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

// Camera rig. Two modes, chosen by the active route:
//  - overview (activeTo = null): mouse-driven, looking at the whole map.
//  - section (activeTo = '/music'…): flown in low at that coordinate, looking
//    forward across the terrain so the contours recede behind the content.
const RADIUS = 54
const BASE_POLAR = THREE.MathUtils.degToRad(62)
const MIN_POLAR = THREE.MathUtils.degToRad(48)
const MAX_POLAR = THREE.MathUtils.degToRad(74)
const SENS = 0.16

function CameraRig({ reduced, mouse, portrait, activeTo }) {
  const target = useRef(new THREE.Vector3(0, 25, 48))
  const look = useRef(new THREE.Vector3(0, portrait ? -30 : 0, 0))
  const tmpPos = useRef(new THREE.Vector3())
  const tmpLook = useRef(new THREE.Vector3())

  useFrame((state) => {
    const { camera } = state
    const section = activeTo ? findSection(portrait, activeTo) : null

    if (section) {
      // Flown-in: low near the pin, looking forward into the landscape.
      const h = heightAt(section.x, section.z)
      tmpPos.current.set(section.x, h + 8, section.z + 16)
      tmpLook.current.set(section.x, h + 4, section.z - 26)
      camera.position.lerp(tmpPos.current, reduced ? 1 : 0.045)
      look.current.lerp(tmpLook.current, reduced ? 1 : 0.05)
      camera.lookAt(look.current)
      return
    }

    // Overview, mouse-driven.
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
    camera.position.lerp(target.current, reduced ? 1 : 0.05)
    tmpLook.current.set(0, portrait ? -30 : 0, 0)
    look.current.lerp(tmpLook.current, reduced ? 1 : 0.06)
    camera.lookAt(look.current)
  })

  return null
}

// Persistent 3D backdrop. Mounted once in Layout; the active route drives the
// camera. `activeTo` = current section path (or null on the overview/home).
export default function Atlas({ activeTo, onNavigate }) {
  const reduced = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  const [portrait, setPortrait] = useState(
    () => typeof window !== 'undefined' && window.matchMedia?.('(orientation: portrait)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(orientation: portrait)')
    const onChange = () => setPortrait(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

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
      {!activeTo && <Markers onNavigate={onNavigate} reduced={reduced} portrait={portrait} />}
      <CameraRig reduced={reduced} mouse={mouse} portrait={portrait} activeTo={activeTo} />
    </Canvas>
  )
}
