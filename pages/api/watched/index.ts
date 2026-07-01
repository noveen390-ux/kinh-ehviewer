import { NextApiRequest, NextApiResponse } from 'next'

const { getWatched } = require('../../../server/src/watched/watchedApi')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const list = await getWatched('')
    res.json({ error: false, list })
  } catch (error: any) {
    res.status(200).json({ error: true, message: error.message })
  }
}
