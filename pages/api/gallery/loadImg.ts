import { NextApiRequest, NextApiResponse } from 'next'

const { loadImg } = require('../../../server/src/gallery/galleryApi')
const cache = require('../../../server/src/cache')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const url = req.query.url as string
  if (!url) return res.json({ error: true })

  let content = cache.get(url)
  if (!content) {
    try {
      content = await loadImg(url, '')
      cache.set(url, content, 120)
    } catch {
      return res.json({ error: true })
    }
  }

  res.json({ error: false, url: content.url, retryURL: content.retryURL })
}
