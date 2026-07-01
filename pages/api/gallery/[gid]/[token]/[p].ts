import { NextApiRequest, NextApiResponse } from 'next'

const { galleryDetailPage } = require('../../../../../server/src/gallery/galleryApi')
const cache = require('../../../../../server/src/cache')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { gid, token, p } = req.query as { gid: string; token: string; p: string }

  const cacheKey = `/${gid}/${token}/${p}`
  let content = cache.get(cacheKey)

  if (!content) {
    try {
      content = await galleryDetailPage({ gid, token, p }, '')
      cache.set(cacheKey, content)
    } catch (error: any) {
      return res.status(200).json({ error: true, message: error.message })
    }
  }

  res.json({ error: false, list: content.list, total: content.total })
}
