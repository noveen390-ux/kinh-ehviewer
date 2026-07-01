import { NextApiRequest, NextApiResponse } from 'next'

const { galleryList } = require('../../../server/src/gallery/galleryApi')
const { getCookieString } = require('../../../server/src/utils/cookies')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const page = parseInt((req.query.page as string) || '0')
  const f_search = (req.query.f_search as string) || ''

  try {
    const content = await galleryList({ page, f_search }, '')

    // Cache in db if on Vercel (optional)
    res.json(content)
  } catch (error: any) {
    res.status(200).json({ error: true, message: error.message })
  }
}
