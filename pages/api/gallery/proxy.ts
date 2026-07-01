import { NextApiRequest, NextApiResponse } from 'next'

const axios = require('../../../server/src/axios')

export const config = {
  api: { responseLimit: false },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const url = req.query.url as string
  if (!url) return res.status(400).send('Missing url')

  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    Object.entries(response.headers).forEach(([key, value]) => {
      if (typeof value === 'string') res.setHeader(key, value)
    })
    res.setHeader('cache-control', 'max-age=31536000, public, immutable')
    res.end(Buffer.from(response.data))
  } catch (err: any) {
    res.status(500).send(err.message)
  }
}
