import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const resp = await fetch('https://nsfw-api-p302.onrender.com/h/video/search?q=hentai', {
      signal: AbortSignal.timeout(15000),
    })
    const urls: string[] = await resp.json()
    const results = urls
      .filter((url: string) => url.endsWith('.mp4'))
      .map((url: string) => ({
        id: url.split('/').pop()?.replace('.mp4', '') || Math.random().toString(36).slice(2),
        url,
        thumb: '',
        title: url.split('/').pop()?.replace('.mp4', '').replace(/[-_]/g, ' ') || '',
      }))
    res.json(results)
  } catch {
    res.json([])
  }
}
