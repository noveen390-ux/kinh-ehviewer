import { NextApiRequest, NextApiResponse } from 'next'

const BASE = 'https://nsfw-api-p302.onrender.com'
const SOURCES = [
  `${BASE}/h/video/search?q=hentai`,
  `${BASE}/h/video/search?q=anime`,
  `${BASE}/h/video/search?q=waifu`,
]

async function fetchWithTimeout(url: string, timeoutMs: number): Promise<string[]> {
  try {
    const resp = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) })
    if (!resp.ok) return []
    const data: string[] = await resp.json()
    return data.filter((u: string) => u.endsWith('.mp4'))
  } catch {
    return []
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const results: string[] = []

  for (const url of SOURCES) {
    const urls = await fetchWithTimeout(url, 10000)
    for (const u of urls) {
      if (!results.includes(u)) results.push(u)
    }
  }

  const shuffled = results.sort(() => Math.random() - 0.5)

  const items = shuffled.map((url: string) => ({
    id: url.split('/').pop()?.replace('.mp4', '') || Math.random().toString(36).slice(2),
    url,
    thumb: '',
    title: url.split('/').pop()?.replace('.mp4', '').replace(/[-_]/g, ' ') || '',
  }))

  res.json(items)
}
