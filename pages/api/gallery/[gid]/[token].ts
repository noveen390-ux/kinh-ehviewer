import { NextApiRequest, NextApiResponse } from 'next'

const { galleryDetail, gallerytorrentsList } = require('../../../../server/src/gallery/galleryApi')
const cache = require('../../../../server/src/cache')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { gid, token } = req.query as { gid: string; token: string }

  try {
    const content = await galleryDetail({ gid, token }, '')

    const cacheKey = `/${gid}/${token}/0`
    cache.set(cacheKey, content.list)
    content.list = content.list.list

    res.json(content)
  } catch (error: any) {
    res.status(200).json({ error: true, message: error.message })
  }
}
