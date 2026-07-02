import { NextApiRequest, NextApiResponse } from 'next'
const { validateUrl } = require('../../../utils/ssrfGuard')

const axios = require('../../../server/src/axios')

export const config = {
  api: { responseLimit: false },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const url = req.query.url as string
  if (!url) return res.status(400).send('Missing url')

  try {
    await validateUrl(url)
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    const allowed = new Set(['content-type', 'content-length', 'etag', 'last-modified', 'accept-ranges'])
    Object.entries(response.headers).forEach(([key, value]) => {
      if (typeof value === 'string' && allowed.has(key.toLowerCase())) {
        res.setHeader(key, value)
      }
    })
    res.setHeader('cache-control', 'private, max-age=600')
    res.end(Buffer.from(response.data))
  } catch (err: any) {
    res.status(err.message.includes('not in whitelist') || err.message.includes('private IP') ? 403 : 500).send(err.message)
  }
}
