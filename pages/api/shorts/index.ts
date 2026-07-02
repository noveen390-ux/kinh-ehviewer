import { NextApiRequest, NextApiResponse } from 'next'

const WATCHHENTAI_API = 'https://watchhentai-api.vercel.app'
const NSFW_API = 'https://nsfw-api-p302.onrender.com/h/video/search?q=hentai'

async function fetchNsfwSource(): Promise<string[]> {
  try {
    const resp = await fetch(NSFW_API, { signal: AbortSignal.timeout(12000) })
    const urls: string[] = await resp.json()
    const seen = new Set<string>()
    return urls.filter((u: string) => u.endsWith('.mp4') && !seen.has(u) && seen.add(u))
  } catch {
    return []
  }
}

async function fetchWatchhentaiVideos(): Promise<{ url: string; title: string; thumb: string }[]> {
  try {
    const listResp = await fetch(`${WATCHHENTAI_API}/api/videos`, {
      signal: AbortSignal.timeout(8000),
    })
    if (!listResp.ok) return []
    const listData = await listResp.json()
    const items = listData?.data?.items || []
    const slugs = items
      .slice(0, 8)
      .map((i: any) => (i.url as string).replace(/\/$/, '').split('/').pop())
      .filter(Boolean)

    const results = await Promise.allSettled(
      slugs.map((slug: string) =>
        fetch(`${WATCHHENTAI_API}/api/watch/${slug}`, {
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
