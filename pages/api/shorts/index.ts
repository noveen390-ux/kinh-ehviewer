import { NextApiRequest, NextApiResponse } from 'next'

const NSFW_BASE = 'https://nsfw-api-p302.onrender.com'
const WH_API = 'https://watchhentai-api.vercel.app'

interface ShortItem {
  id: string
  type: 'direct' | 'lazy'
  url: string
  slug: string
  thumb: string
  title: string
}

function urlToId(url: string): string {
  return url.split('/').pop()?.replace('.mp4', '') || Math.random().toString(36).slice(2)
}

function urlToTitle(url: string): string {
  return url.split('/').pop()?.replace('.mp4', '').replace(/[-_]/g, ' ') || ''
}

async function fetchNsfwSource(): Promise<ShortItem[]> {
  const queries = ['hentai', 'waifu', 'ecchi']
  const seen = new Set<string>()
  const all: ShortItem[] = []

  const results = await Promise.allSettled(
    queries.map((q) =>
      fetch(`${NSFW_BASE}/h/video/search?q=${q}`, {
        signal: AbortSignal.timeout(8000),
      }).then((r) => r.json())
    )
  )

  for (const result of results) {
    if (result.status !== 'fulfilled') continue
    const urls: string[] = result.value
    for (const u of urls) {
      if (typeof u !== 'string' || !u.endsWith('.mp4')) continue
      if (seen.has(u)) continue
      seen.add(u)
      all.push({
        id: urlToId(u),
        type: 'direct',
        url: u,
        slug: '',
        thumb: '',
        title: urlToTitle(u),
      })
    }
  }

  return all
}

async function fetchWatchhentaiAll(): Promise<ShortItem[]> {
  const totalPages = 126
  const seen = new Set<string>()
  const all: ShortItem[] = []

  const results = await Promise.allSettled(
    Array.from({ length: totalPages }, (_, i) => i + 1).map((p) =>
      fetch(`${WH_API}/api/videos?page=${p}`, {
        signal: AbortSignal.timeout(10000),
      })
        .then((r) => r.json())
        .catch(() => null)
    )
  )

  for (const result of results) {
    if (result.status !== 'fulfilled' || !result.value) continue
    const items = result.value?.data?.items || []
    for (const item of items) {
      const url = ((item.url as string) || '').replace(/\/$/, '')
      if (!url || seen.has(url)) continue
      seen.add(url)
      const slug = url.split('/').pop() || ''
      if (!slug) continue
      all.push({
        id: String(item.id || slug),
        type: 'lazy',
        url: '',
        slug,
        thumb: item.thumbnail || '',
        title: item.title || '',
      })
    }
  }

  return all
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const [nsfwItems, whItems] = await Promise.all([fetchNsfwSource(), fetchWatchhentaiAll()])

  const all = [...nsfwItems, ...whItems]

  const seed = Date.now()
  const shuffled = all
    .map((item, i) => ({ item, sort: Math.sin(seed + i) }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item)

  res.json(shuffled)
}
