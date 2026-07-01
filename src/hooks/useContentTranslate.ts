import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { translateTag, translateCategory } from '@/utils/arabicDict'

const titleCache = new Map<string, string>()

export function useIsArabic(): boolean {
  const { locale } = useRouter()
  return locale === 'ar'
}

export function useTranslatedCategory(cat: string): string {
  const isArabic = useIsArabic()
  return isArabic ? translateCategory(cat) : cat
}

export function useTranslatedTag(tag: string): string {
  const isArabic = useIsArabic()
  return isArabic ? translateTag(tag) : tag
}

export function useTranslatedTitle(title: string): string {
  const isArabic = useIsArabic()
  const [translated, setTranslated] = useState(title)

  useEffect(() => {
    if (!isArabic || !title) { setTranslated(title); return }
    if (titleCache.has(title)) { setTranslated(titleCache.get(title)!); return }
    let cancelled = false
    fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(title.slice(0, 500))}&langpair=en|ar`
    )
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return
        const t = data?.responseData?.translatedText
        if (t && !t.includes('MYMEMORY')) {
          titleCache.set(title, t)
          setTranslated(t)
        }
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [title, isArabic])

  return translated
}
