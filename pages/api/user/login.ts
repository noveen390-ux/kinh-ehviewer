import { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: true, message: 'Method not allowed' })

  const { password } = req.body
  if (!password) return res.status(400).json({ error: true, message: 'Password required' })

  const hashedPassword = process.env.KINH_VIEW_PASSWORD
  if (!hashedPassword) {
    return res.status(500).json({ error: true, message: 'Server not configured' })
  }

  const valid = await bcrypt.compare(password, hashedPassword)
  if (valid) {
    res.setHeader(
      'Set-Cookie',
      'auth=valid; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=2592000'
    )
    return res.json({ error: false })
  }

  res.json({ error: true, message: 'Wrong password' })
}
