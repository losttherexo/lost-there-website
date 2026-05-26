import { useState } from 'react'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { heightAt } from './terrainHeight'

// Section coordinates on the map. (x, z) world position; y is read from the
// terrain so each beam sits flush on the surface.
const SECTIONS = [
  { to: '/music', label: 'music', x: -12, z: -7 },
  { to: '/shows', label: 'shows', x: 9, z: -12 },
  { to: '/lab', label: 'lab', x: 15, z: 5 },
  { to: '/about', label: 'about', x: -3, z: 13 },
  { to: '/contact', label: 'contact', x: -15, z: 9 },
]

const BEAM_H = 3 // beam height above the surface
const REST = '#6b8fb5'
const ACTIVE = '#cfe3ff'

function Marker({ to, label, x, z, onSelect }) {
  const [hovered, setHovered] = useState(false)
  const y = heightAt(x, z)
  const color = hovered ? ACTIVE : REST

  return (
    <group position={[x, y, z]}>
      {/* light beam */}
      <mesh position={[0, BEAM_H / 2, 0]}>
        <cylinderGeometry args={[0.05, 0.05, BEAM_H, 6]} />
        <meshBasicMaterial color={color} transparent opacity={hovered ? 0.85 : 0.4} />
      </mesh>

      {/* node at the top */}
      <mesh position={[0, BEAM_H, 0]}>
        <sphereGeometry args={[hovered ? 0.34 : 0.22, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={hovered ? 1 : 0.85} />
      </mesh>

      {/* ground ring */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.04, 0]}>
        <ringGeometry args={[0.5, 0.62, 40]} />
        <meshBasicMaterial color={color} transparent opacity={hovered ? 0.9 : 0.4} side={THREE.DoubleSide} />
      </mesh>

      {/* label — a real <button> so it's focusable + screen-reader friendly.
          Outer Html ignores pointer events; only the button captures them, so it
          doesn't fight the mouse-camera. */}
      <Html position={[0, BEAM_H + 0.9, 0]} center style={{ pointerEvents: 'none' }} zIndexRange={[20, 0]}>
        <button
          type="button"
          onClick={() => onSelect(to)}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onFocus={() => setHovered(true)}
          onBlur={() => setHovered(false)}
          className="pointer-events-auto cursor-pointer whitespace-nowrap px-2 py-1 text-[11px] uppercase tracking-[0.3em] text-ink/80 transition-colors hover:text-ink focus:text-ink focus:outline-none"
        >
          {label}
        </button>
      </Html>
    </group>
  )
}

export default function Markers({ onSelect }) {
  return SECTIONS.map((s) => <Marker key={s.to} {...s} onSelect={onSelect} />)
}
