import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Missing url parameter' })
  }
  try {
    const response = await axios.get(url, { responseType: 'stream' })
    response.data.pipe(res)
  } catch {
    res.redirect(url)
  }
}
