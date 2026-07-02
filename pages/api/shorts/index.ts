import { NextApiRequest, NextApiResponse } from 'next'

const NSFW_BASE = 'https://nsfw-api-p302.onrender.com'
const WH_API = 'https://watchhentai-api.vercel.app'

async function fetchNsfwSource(): Promise<string[]> {
  const queries = ['hentai', 'waifu', 'ecchi']
  const seen = new Set<string>()
  const all: string[] = []
  for (const q of queries) {
    try {
      const resp = await fetch(`${NSFW_BASE}/h/video/search?q=${q}`, {
        signal: AbortSignal.timeout(8000),
      })
      const urls: string[] = await resp.json()
      for (const u of urls) {
        if (u.endsWith('.mp4') && !seen.has(u)) {
          seen.add(u)
          all.push(u)
        }
      }
    } catch {}
  }
  return all
}

async function fetchWatchhentaiVideos(): Promise<{ url: string; title: string; thumb: string }[]> {
  try {
    const pages = await Promise.allSettled(
      [1, 2].map((p) =>
        fetch(`${WH_API}/api/videos?page=${p}`, { signal: AbortSignal.timeout(8000) }).then((r) => r.json())
      )
    )
    const slugs: string[] = []
    for (const p of pages) {
      if (p.status !== 'fulfilled') continue
      const items = p.value?.data?.items || []
      for (const i of items) {
        const slug = (i.url as string).replace(/\/$/, '').split('/').pop()
        if (slug) slugs.push(slug)
      }
    }

    const uniqueSlugs = [...new Set(slugs)].slice(0, 16)

    const results = await Promise.allSettled(
      uniqueSlugs.map((slug) =>
        fetch(`${WH_API}/api/watch/${slug}`, {
          signal: AbortSignal.timeout(8000),
        }).then((r) => r.json())
      )
    )

    const out: { url: string; title: string; thumb: string }[] = []
    const seen = new Set<string>()
    for (const r of results) {
      if (r.status !== 'fulfilled') continue
      const d = r.value?.data
      if (!d?.player?.src) continue
      if (seen.has(d.player.src)) continue
      seen.add(d.player.src)
      out.push({
        url: d.player.src,
        title: d.title || '',
        thumb: d.thumbnail || '',
      })
    }
    return out
  } catch {
    return []
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const [nsfwUrls, whVideos] = await Promise.all([fetchNsfwSource(), fetchWatchhentaiVideos()])

  const seen = new Set<string>()
  const items: { id: string; url: string; thumb: string; title: string }[] = []

  for (const url of nsfwUrls) {
    if (seen.has(url)) continue
    seen.add(url)
    items.push({
      id: url.split('/').pop()?.replace('.mp4', '') || Math.random().toString(36).slice(2),
      url,
      thumb: '',
      title: url.split('/').pop()?.replace('.mp4', '').replace(/[-_]/g, ' ') || '',
    })
  }

  for (const v of whVideos) {
    if (seen.has(v.url)) continue
    seen.add(v.url)
    items.push({
      id: v.url.split('/').pop()?.replace('.mp4', '') || Math.random().toString(36).slice(2),
      url: v.url,
      thumb: v.thumb,
      title: v.title,
    })
  }

  const seed = Date.now()
  const shuffled = items
    .map((item, i) => ({ item, sort: Math.sin(seed + i) }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item)

  res.json(shuffled)
}
