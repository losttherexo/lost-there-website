// ---------------------------------------------------------------------------
// Placeholder release data — edit this freely; it drives the Music page grid
// (<ReleaseCard>) and the featured block on Home.
//
// To wire a real player: drop a share URL into `embed.url`. Empty string ''
// renders a labeled placeholder box instead of an iframe. Supported providers:
// 'spotify' | 'soundcloud' | 'untitled' | 'apple' | 'bandcamp' | 'youtube'.
//
// `cover`: path/URL to artwork (e.g. '/covers/foo.jpg' in public/), or null for
// a placeholder tile. Titles / track names are placeholder copy — swap for real.
// ---------------------------------------------------------------------------

export const releases = [
  {
    id: 'release-1',
    title: 'Release One',
    year: 2025,
    type: 'LP',
    cover: null,
    coverAlt: 'Cover artwork for Release One',
    blurb: '[Short note — context, collaborators, the feeling behind it.]',
    embed: { provider: 'spotify', url: '' },
    tracks: [
      { n: 1, title: 'Opening Track', duration: '0:00' },
      { n: 2, title: 'Second Track', duration: '0:00' },
      { n: 3, title: 'Third Track', duration: '0:00' },
      { n: 4, title: 'Fourth Track', duration: '0:00' },
      { n: 5, title: 'Fifth Track', duration: '0:00' },
      { n: 6, title: 'Closing Track', duration: '0:00' },
    ],
  },
  {
    id: 'release-2',
    title: 'Release Two',
    year: 2024,
    type: 'EP',
    cover: null,
    coverAlt: 'Cover artwork for Release Two',
    blurb: '[Short note about this EP.]',
    embed: { provider: 'soundcloud', url: '' },
    tracks: [
      { n: 1, title: 'Track One', duration: '0:00' },
      { n: 2, title: 'Track Two', duration: '0:00' },
      { n: 3, title: 'Track Three', duration: '0:00' },
      { n: 4, title: 'Track Four', duration: '0:00' },
    ],
  },
  {
    id: 'release-3',
    title: 'Single — A Side',
    year: 2024,
    type: 'Single',
    cover: null,
    coverAlt: 'Cover artwork for the A-Side single',
    blurb: '[The story behind the single.]',
    embed: { provider: 'untitled', url: '' },
    tracks: [
      { n: 1, title: 'A Side', duration: '0:00' },
      { n: 2, title: 'B Side', duration: '0:00' },
    ],
  },
  {
    id: 'release-4',
    title: 'Release Four',
    year: 2023,
    type: 'EP',
    cover: null,
    coverAlt: 'Cover artwork for Release Four',
    blurb: '[Short note.]',
    embed: { provider: 'spotify', url: '' },
    tracks: [
      { n: 1, title: 'Track One', duration: '0:00' },
      { n: 2, title: 'Track Two', duration: '0:00' },
      { n: 3, title: 'Track Three', duration: '0:00' },
      { n: 4, title: 'Track Four', duration: '0:00' },
      { n: 5, title: 'Track Five', duration: '0:00' },
    ],
  },
  {
    id: 'release-5',
    title: 'Live Session',
    year: 2023,
    type: 'Live',
    cover: null,
    coverAlt: 'Cover artwork for the Live Session',
    blurb: '[Recorded live — where and with whom.]',
    embed: { provider: 'youtube', url: '' },
    tracks: [
      { n: 1, title: 'Live Track One', duration: '0:00' },
      { n: 2, title: 'Live Track Two', duration: '0:00' },
      { n: 3, title: 'Live Track Three', duration: '0:00' },
    ],
  },
  {
    id: 'release-6',
    title: 'Early Demos',
    year: 2022,
    type: 'Demo',
    cover: null,
    coverAlt: 'Cover artwork for Early Demos',
    blurb: '[Where it started.]',
    embed: { provider: 'bandcamp', url: '' },
    tracks: [
      { n: 1, title: 'Demo One', duration: '0:00' },
      { n: 2, title: 'Demo Two', duration: '0:00' },
      { n: 3, title: 'Demo Three', duration: '0:00' },
      { n: 4, title: 'Demo Four', duration: '0:00' },
    ],
  },
]

// Home features the first release by default. Change this id to feature another.
export const featuredRelease =
  releases.find((r) => r.id === 'release-1') ?? releases[0]
