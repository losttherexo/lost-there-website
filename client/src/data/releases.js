// ---------------------------------------------------------------------------
// lost,there — release catalog. Drives the Music page grid (<ReleaseCard>).
//
// `embed.url` is a normal Spotify share URL; <Embed> turns it into the iframe
// player (the cover crossfades into it on click). Swap the provider/url to use
// SoundCloud / untitled.stream / etc. `cover` is artwork (path or URL); null
// shows a placeholder tile until played — the Spotify player shows the art too.
//
// Source: open.spotify.com/artist/27dTdSe8fBtCAle3kuMaOB
// ---------------------------------------------------------------------------

export const releases = [
  {
    id: 'how-did-i-get-here',
    title: 'how did i get here?',
    year: 2022,
    type: 'EP',
    cover: '/covers/how-did-i-get-here.jpg',
    coverAlt: 'Cover artwork for the EP “how did i get here?”',
    embed: { provider: 'spotify', url: 'https://open.spotify.com/album/4CPO1oZKyQ3Zr2o7YFvjjZ' },
  },
  {
    id: 'idwbs',
    title: 'idwbs',
    year: 2022,
    type: 'Album',
    cover: '/covers/idwbs.jpg',
    coverAlt: 'Cover artwork for the album “idwbs”',
    embed: { provider: 'spotify', url: 'https://open.spotify.com/album/2vGjS22IrAfIeudWlrbcQk' },
  },
  {
    id: 'shared-space',
    title: 'shared space',
    year: 2021,
    type: 'Album',
    cover: '/covers/shared-space.jpg',
    coverAlt: 'Cover artwork for the album “shared space”',
    embed: { provider: 'spotify', url: 'https://open.spotify.com/album/2iQ0KLrblkI2X9Kd00qetv' },
  },
  {
    id: 'you-in-my-car',
    title: 'you in my car',
    year: 2021,
    type: 'Album',
    cover: '/covers/you-in-my-car.jpg',
    coverAlt: 'Cover artwork for the album “you in my car”',
    embed: { provider: 'spotify', url: 'https://open.spotify.com/album/0ncI0RnwZ5VzVkF1GBDbUh' },
  },
]

// Available if a featured block returns later; nothing imports it right now.
export const featuredRelease = releases[0]
