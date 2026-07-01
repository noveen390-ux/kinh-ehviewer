const catMap: Record<string, string> = {
  'Doujinshi': 'دوجينشي',
  'Manga': 'مانجا',
  'Artist CG': 'CG فنان',
  'Game CG': 'CG لعبة',
  'Western': 'غربي',
  'Non-H': 'غير جنسي',
  'Image Set': 'مجموعة صور',
  'Cosplay': 'كوسبلاي',
  'Asian Porn': 'إباحي آسيوي',
  'Misc': 'متنوع',
}

const apiCache = new Map<string, string>()
const apiPending = new Map<string, Promise<string>>()

let tagDict: Record<string, string> = {}
export async function loadTagDict() {
  try {
    const res = await fetch('/locales/ar/tags.json')
    tagDict = await res.json()
  } catch { /* ignore */ }
}

export function getCachedTranslation(text: string): string | undefined {
  if (catMap[text]) return catMap[text]
  if (tagDict[text.toLowerCase()]) return tagDict[text.toLowerCase()]
  if (apiCache.has(text)) return apiCache.get(text)
  return undefined
}

export async function translateText(text: string): Promise<string> {
  if (!text || text.length < 2) return text
  const cached = getCachedTranslation(text)
  if (cached) return cached
  if (apiPending.has(text)) return apiPending.get(text)!
  const p = _apiTranslate(text)
  apiPending.set(text, p)
  const r = await p
  apiPending.delete(text)
  apiCache.set(text, r)
  return r
}

async function _apiTranslate(text: string): Promise<string> {
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text.slice(0, 500))}&langpair=en|ar`
    const res = await fetch(url)
    const data = await res.json()
    const t = data?.responseData?.translatedText || text
    return t.includes('MYMEMORY') ? text : t
  } catch { return text }
}
