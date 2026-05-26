import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { heightAt } from './terrainHeight'

// z is depth: higher = closer to the camera (lower on screen).
const SECTIONS = [
  { to: '/music', label: 'music', x: -15, z: 18 },
  { to: '/shows', label: 'shows', x: -3, z: 18 },
  { to: '/lab', label: 'lab', x: 15, z: 16 },
  { to: '/about', label: 'about', x: 7, z: 8 },
  { to: '/contact', label: 'contact', x: -11, z: 6 },
]

const BEAM_H = 3 // beam height above the surface
const REST = '#6b8fb5'
const ACTIVE = '#cfe3ff'

// Rest opacities (static when not hovered)
const REST_OPACITY = { beam: 0.45, node: 0.85, ring: 0.45 }

function Marker({ to, label, x, z, onSelect, onHover, reduced }) {
  const [hovered, setHovered] = useState(false)
  const beamMat = useRef()
  const nodeMat = useRef()
  const ringMat = useRef()
  const y = heightAt(x, z)
  const color = hovered ? ACTIVE : REST

  // Hover = pulse the pin's brightness (opacity), nothing else. Static otherwise.
  useFrame((state) => {
    if (!beamMat.current || !nodeMat.current || !ringMat.current) return
    let { beam, node, ring } = REST_OPACITY
    if (hovered) {
      const p = reduced ? 1 : 0.5 + 0.5 * Math.sin(state.clock.elapsedTime * 3.2)
      beam = 0.45 + p * 0.5
      node = 0.7 + p * 0.3
      ring = 0.45 + p * 0.5
    }
    beamMat.current.opacity = beam
    nodeMat.current.opacity = node
    ringMat.current.opacity = ring
  })

  const enter = () => {
    setHovered(true)
    onHover(1)
  }
  const leave = () => {
    setHovered(false)
    onHover(-1)
  }

  return (
    <group position={[x, y, z]}>
      {/* light beam */}
      <mesh position={[0, BEAM_H / 2, 0]}>
        <cylinderGeometry args={[0.05, 0.05, BEAM_H, 6]} />
        <meshBasicMaterial ref={beamMat} color={color} transparent opacity={REST_OPACITY.beam} />
      </mesh>

      {/* node at the top */}
      <mesh position={[0, BEAM_H, 0]}>
        <sphereGeometry args={[0.24, 16, 16]} />
        <meshBasicMaterial ref={nodeMat} color={color} transparent opacity={REST_OPACITY.node} />
      </mesh>

      {/* ground ring */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.04, 0]}>
        <ringGeometry args={[0.5, 0.62, 40]} />
        <meshBasicMaterial ref={ringMat} color={color} transparent opacity={REST_OPACITY.ring} side={THREE.DoubleSide} />
      </mesh>

      {/* label — focusable <button>; outer Html ignores pointer events so only
          the button captures them. */}
      <Html position={[0, BEAM_H + 0.9, 0]} center style={{ pointerEvents: 'none' }} zIndexRange={[20, 0]}>
        <button
          type="button"
          onClick={() => onSelect(to)}
          onPointerOver={enter}
          onPointerOut={leave}
          onFocus={enter}
          onBlur={leave}
          className="pointer-events-auto cursor-pointer whitespace-nowrap px-2 py-1 text-[11px] uppercase tracking-[0.3em] text-ink/80 transition-colors hover:text-ink focus:text-ink focus:outline-none"
        >
          {label}
        </button>
      </Html>
    </group>
  )
}

export default function Markers({ onSelect, onHover, reduced }) {
  return SECTIONS.map((s) => (
    <Marker key={s.to} onSelect={onSelect} onHover={onHover} reduced={reduced} {...s} />
  ))
}
