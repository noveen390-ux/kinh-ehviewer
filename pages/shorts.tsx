import { NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import React, { useCallback, useEffect, useRef, useState } from 'react'

const Shorts: NextPage = () => {
  const [t] = useTranslation()
  const [items, setItems] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const fetchMore = useCallback(async () => {
    if (loading) return
    setLoading(true)
    try {
      const res = await fetch('/api/shorts')
      const data = await res.json()
      if (data.url) setItems(prev => [...prev, data.url])
    } catch {}
    setLoading(false)
  }, [loading])

  useEffect(() => { fetchMore() }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const onScroll = () => {
      if (el.scrollHeight - el.scrollTop - el.clientHeight < 400) fetchMore()
    }
    el.addEventListener('scroll', onScroll)
    return () => el.removeEventListener('scroll', onScroll)
  }, [fetchMore])

  return (
    <div ref={containerRef} style={{
      height: '100vh',
      overflowY: 'scroll',
      scrollSnapType: 'y mandatory',
      background: '#000',
    }}>
      {items.length === 0 && (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
          <p>جارٍ التحميل...</p>
        </div>
      )}
      {items.map((url, i) => (
        <div key={i} style={{
          height: '100vh',
          scrollSnapAlign: 'start',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#111',
          position: 'relative',
        }}>
          <img
            src={url}
            alt={`short-${i}`}
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
            loading="lazy"
          />
          <div style={{
            position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)',
            color: '#fff', background: 'rgba(0,0,0,0.6)', padding: '4px 12px', borderRadius: 12,
            fontSize: 12,
          }}>
            {i + 1}
          </div>
        </div>
      ))}
    </div>
  )
}

export default Shorts

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  }
}
