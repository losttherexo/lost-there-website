import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { heightAt } from './terrainHeight'

// z is depth: higher = closer to the camera (lower on screen).
// Desktop/landscape: wide horizontal spread.
const SECTIONS_DESKTOP = [
  { to: '/music', label: 'music', x: -15, z: 18 },
  { to: '/shows', label: 'shows', x: -3, z: 18 },
  { to: '/lab', label: 'lab', x: 15, z: 16 },
  { to: '/about', label: 'about', x: 7, z: 8 },
  { to: '/contact', label: 'contact', x: -11, z: 6 },
]

// Portrait: narrower horizontally, spread DOWN the depth axis to use the tall
// space — shows near the horizon (top), about/contact brought forward (bottom).
const SECTIONS_PORTRAIT = [
  { to: '/shows', label: 'shows', x: -6, z: 11 },
  { to: '/lab', label: 'lab', x: 7, z: 15 },
  { to: '/music', label: 'music', x: -8, z: 21 },
  { to: '/about', label: 'about', x: 6, z: 28 },
  { to: '/contact', label: 'contact', x: -5, z: 34 },
]

const BEAM_H = 3 // beam height above the surface
const REST = '#6b8fb5'
const ACTIVE = '#cfe3ff'
const REST_OPACITY = 0.45

function Marker({ to, label, x, z, onSelect, reduced }) {
  const [hovered, setHovered] = useState(false)
  const beamMat = useRef()
  const btnRef = useRef()
  const y = heightAt(x, z)
  const color = hovered ? ACTIVE : REST

  // Hover = pulse beam + label brightness together (same clock). Static otherwise.
  // The camera is never affected here — it always follows the mouse (in Atlas).
  useFrame((state) => {
    if (!hovered) {
      if (beamMat.current) beamMat.current.opacity = REST_OPACITY
      if (btnRef.current) btnRef.current.style.opacity = ''
      return
    }
    const p = reduced ? 1 : 0.5 + 0.5 * Math.sin(state.clock.elapsedTime * 3.5)
    if (beamMat.current) beamMat.current.opacity = 0.4 + p * 0.6 // 0.4 → 1.0
    if (btnRef.current) btnRef.current.style.opacity = String(0.55 + p * 0.45)
  })

  return (
    <group position={[x, y, z]}>
      {/* light beam — the whole pin */}
      <mesh position={[0, BEAM_H / 2, 0]}>
        <cylinderGeometry args={[0.06, 0.06, BEAM_H, 6]} />
        <meshBasicMaterial ref={beamMat} color={color} transparent opacity={REST_OPACITY} />
      </mesh>

      {/* label — focusable <button>; outer Html ignores pointer events so only the
          button captures them (and the window-level mouse tracking keeps the
          camera following even while the cursor is over it). */}
      <Html position={[0, BEAM_H + 1.1, 0]} center style={{ pointerEvents: 'none' }} zIndexRange={[20, 0]}>
        <button
          ref={btnRef}
          type="button"
          onClick={() => onSelect(to)}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onFocus={() => setHovered(true)}
          onBlur={() => setHovered(false)}
          className="pointer-events-auto cursor-pointer whitespace-nowrap px-3 py-1.5 text-base uppercase tracking-[0.25em] text-ink/80 transition-colors hover:text-ink focus:text-ink focus:outline-none"
        >
          {label}
        </button>
      </Html>
    </group>
  )
}

export default function Markers({ onSelect, reduced, portrait }) {
  const sections = portrait ? SECTIONS_PORTRAIT : SECTIONS_DESKTOP
  return sections.map((s) => <Marker key={s.to} onSelect={onSelect} reduced={reduced} {...s} />)
}
