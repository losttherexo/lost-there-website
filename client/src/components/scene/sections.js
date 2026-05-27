// Single source for the section coordinates — used by both the markers (pins)
// and the route-driven camera (where it flies / sits for each section).
// z is depth: higher = closer to the camera.

export const SECTIONS_DESKTOP = [
  { to: '/music', label: 'music', x: -15, z: 18 },
  { to: '/shows', label: 'shows', x: -3, z: 18 },
  { to: '/lab', label: 'lab', x: 15, z: 16 },
  { to: '/about', label: 'about', x: 7, z: 8 },
  { to: '/contact', label: 'contact', x: -11, z: 3 },
]

// Portrait: spread down the depth axis (top→bottom = far→near).
export const SECTIONS_PORTRAIT = [
  { to: '/music', label: 'music', x: -7, z: -12 },
  { to: '/shows', label: 'shows', x: 8, z: 6 },
  { to: '/lab', label: 'lab', x: -9, z: 20 },
  { to: '/about', label: 'about', x: 7, z: 32 },
  { to: '/contact', label: 'contact', x: -5, z: 38 },
]

export function getSections(portrait) {
  return portrait ? SECTIONS_PORTRAIT : SECTIONS_DESKTOP
}

export function findSection(portrait, to) {
  return getSections(portrait).find((s) => s.to === to) ?? null
}
