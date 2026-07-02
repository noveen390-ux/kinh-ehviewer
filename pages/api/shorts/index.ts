import { NextApiRequest, NextApiResponse } from 'next'

const BASE = 'https://nsfw-api-p302.onrender.com'
const QUERIES = ['hentai', 'anime', 'waifu', 'ecchi', 'nsfw']
const TYPES = ['h', 'r']

async function fetchSource(type: string, query: string, signal: AbortSignal): Promise<string[]> {
  try {
    const url = `${BASE}/${type}/video/search?q=${encodeURIComponent(query)}`
    const resp = await fetch(url, { signal })
    if (!resp.ok) return []
    const data: string[] = await resp.json()
    return data.filter((u: string) => u.endsWith('.mp4'))
  } catch {
    return []
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 12000)

  try {
    const promises = TYPES.flatMap((t) =>
      QUERIES.map((q) => fetchSource(t, q, controller.signal))
    )
    const results = await Promise.allSettled(promises)
    const allUrls: string[] = results
      .flatMap((r) => (r.status === 'fulfilled' ? r.value : []))
      .filter(Boolean)

    const seen = new Set<string>()
    const unique = allUrls.filter((url) => {
      if (seen.has(url)) return false
      seen.add(url)
      return true
    })

    const shuffled = unique.sort(() => Math.random() - 0.5)

    const items = shuffled.map((url: string) => ({
      id: url.split('/').pop()?.replace('.mp4', '') || Math.random().toString(36).slice(2),
      url,
      thumb: '',
      title: url.split('/').pop()?.replace('.mp4', '').replace(/[-_]/g, ' ') || '',
    }))

    res.json(items)
  } catch {
    res.json([])
  } finally {
    clearTimeout(timer)
  }
}
