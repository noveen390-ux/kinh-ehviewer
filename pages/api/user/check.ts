import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookie = req.headers.cookie || ''
  const valid = cookie.split('; ').some(c => c === 'auth=12345')
  res.json({ valid })
}
