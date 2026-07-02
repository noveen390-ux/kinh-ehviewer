import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
const { validateUrl } = require('../../../utils/ssrfGuard')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Missing url parameter' })
  }
  try {
    await validateUrl(url)
    const response = await axios.get(url, { responseType: 'stream' })
    const allowed = new Set(['content-type', 'content-length'])
    Object.entries(response.headers).forEach(([key, value]) => {
      if (typeof value === 'string' && allowed.has(key.toLowerCase())) {
        res.setHeader(key, value)
      }
    })
    response.data.pipe(res)
  } catch {
    res.status(400).json({ error: 'Failed to fetch URL' })
  }
}
