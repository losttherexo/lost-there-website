import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import Terrain from './Terrain'

const CANVAS_COLOR = '#0b0b0c' // --color-canvas; bg + fog share it so terrain fades into the dark

// The 3D "map" that the site lives on. Phase A: terrain + camera + drag-to-orbit.
// Markers, click-to-fly navigation, and the holographic post-processing come next.
export default function Atlas() {
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  return (
    <Canvas
      // dpr cap: sharp on retina, but never above 2x (perf).
      dpr={[1, 2]}
      // Camera positioned high and back, looking down at the landmass.
      camera={{ position: [0, 20, 36], fov: 42, near: 0.1, far: 200 }}
      gl={{ antialias: true }}
      // Fog (same color as the background) makes distant terrain dissolve → depth.
      onCreated={({ scene }) => {
        scene.fog = new THREE.Fog(CANVAS_COLOR, 34, 90)
      }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <color attach="background" args={[CANVAS_COLOR]} />

      <Terrain />

      {/* Drag to orbit the map. Zoom/pan disabled so it stays composed; the polar
          clamps keep the camera in a nice tilted band (never top-down or below). */}
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        autoRotate={!prefersReduced}
        autoRotateSpeed={0.3}
        rotateSpeed={0.4}
        minPolarAngle={Math.PI * 0.16}
        maxPolarAngle={Math.PI * 0.46}
        target={[0, 0, 0]}
      />
    </Canvas>
  )
}
