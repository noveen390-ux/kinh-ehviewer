import { NextApiRequest, NextApiResponse } from 'next'

const { getPopular } = require('../../../server/src/popular/popluarApi')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const list = await getPopular('')
    res.json({ error: false, list })
  } catch (error: any) {
    res.status(200).json({ error: true, message: error.message })
  }
}
