import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: true, message: 'Method not allowed' })

  const { password } = req.body
  if (password === '12345') {
    res.setHeader('Set-Cookie', 'auth=12345; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000')
    return res.json({ error: false })
  }

  res.json({ error: true, message: 'Wrong password' })
}
