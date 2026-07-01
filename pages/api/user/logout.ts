import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Set-Cookie', 'auth=; Path=/; SameSite=Lax; Max-Age=0')
  res.json({ error: false })
}
