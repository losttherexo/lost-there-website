import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { heightAt } from './terrainHeight'
import { getSections } from './sections'

const BEAM_H = 3 // beam height above the surface
const REST = '#6b8fb5'
const ACTIVE = '#cfe3ff'
const REST_OPACITY = 0.45

function Marker({ to, label, x, z, onNavigate, reduced }) {
  const [hovered, setHovered] = useState(false)
  const beamMat = useRef()
  const btnRef = useRef()
  const y = heightAt(x, z)
  const color = hovered ? ACTIVE : REST

  // Hover = pulse beam + label brightness together (same clock). Static otherwise.
  useFrame((state) => {
    if (!beamMat.current) return
    if (!hovered) {
      beamMat.current.opacity = REST_OPACITY
      if (btnRef.current) btnRef.current.style.opacity = ''
      return
    }
    const p = reduced ? 1 : 0.5 + 0.5 * Math.sin(state.clock.elapsedTime * 3.5)
    beamMat.current.opacity = 0.4 + p * 0.6
    if (btnRef.current) btnRef.current.style.opacity = String(0.55 + p * 0.45)
  })

  return (
    <group position={[x, y, z]}>
      <mesh position={[0, BEAM_H / 2, 0]}>
        <cylinderGeometry args={[0.06, 0.06, BEAM_H, 6]} />
        <meshBasicMaterial ref={beamMat} color={color} transparent opacity={REST_OPACITY} />
      </mesh>

      <Html position={[0, BEAM_H + 1.1, 0]} center style={{ pointerEvents: 'none' }} zIndexRange={[20, 0]}>
        <button
          ref={btnRef}
          type="button"
          onClick={() => onNavigate(to)}
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

export default function Markers({ onNavigate, reduced, portrait }) {
  return getSections(portrait).map((s) => (
    <Marker key={s.to} onNavigate={onNavigate} reduced={reduced} {...s} />
  ))
}
