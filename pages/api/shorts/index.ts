import { NextApiRequest, NextApiResponse } from 'next'

const APIS = [
  'https://nekobot.xyz/api/image?type=hentai',
  'https://api.waifu.pics/nsfw/waifu',
  'https://nekos.life/api/v2/img/lewd',
  'https://nekobot.xyz/api/image?type=thigh',
  'https://nekobot.xyz/api/image?type=ass',
]

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const api = APIS[Math.floor(Math.random() * APIS.length)]
    const response = await fetch(api)
    const data = await response.json()
    let url = ''
    if (api.includes('nekobot')) {
      url = data.message
    } else if (api.includes('waifu.pics')) {
      url = data.url
    } else if (api.includes('nekos.life')) {
      url = data.url
    }
    if (!url) throw new Error('No URL found')
    res.json({ url, source: api })
  } catch {
    res.json({ url: '', source: '' })
  }
}
