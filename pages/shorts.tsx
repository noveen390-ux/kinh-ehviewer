import { NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useRef, useState } from 'react'

interface ShortItem {
  id: string
  url: string
  thumb: string
  title: string
}

const Shorts: NextPage = () => {
  const [t] = useTranslation()
  const router = useRouter()
  const [items, setItems] = useState<ShortItem[]>([])
  const [loading, setLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const fetchMore = useCallback(async () => {
    if (loading) return
    setLoading(true)
    try {
      const res = await fetch('/api/shorts')
      const data = await res.json()
      if (data.length) setItems(prev => [...prev, ...data])
    } catch {}
    setLoading(false)
  }, [loading])

  useEffect(() => { fetchMore() }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const onScroll = () => {
      if (el.scrollHeight - el.scrollTop - el.clientHeight < 600) fetchMore()
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
      position: 'relative',
    }}>
      <button
        onClick={() => router.back()}
        style={{
          position: 'fixed',
          top: 12,
          right: 12,
          zIndex: 999,
          width: 36,
          height: 36,
          borderRadius: '50%',
          border: 'none',
          background: 'rgba(0,0,0,0.6)',
          color: '#fff',
          fontSize: 20,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          lineHeight: 1,
        }}
        aria-label="Close"
      >
        ✕
      </button>
      {items.length === 0 && !loading && (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
          <p>جارٍ التحميل...</p>
        </div>
      )}
      {items.map((item, i) => (
        <div key={item.id || i} style={{
          height: '100vh',
          scrollSnapAlign: 'start',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#111',
          position: 'relative',
        }}>
          <video
            src={item.url}
            controls
            autoPlay={i === 0}
            muted
            loop
            playsInline
            style={{ maxWidth: '100%', maxHeight: '100%' }}
          />
          {item.title && (
            <div style={{
              position: 'absolute', bottom: 20, left: 16, right: 16,
              color: '#fff', background: 'rgba(0,0,0,0.6)', padding: '8px 12px', borderRadius: 8,
              fontSize: 13, textAlign: 'center',
            }}>
              {item.title}
            </div>
          )}
        </div>
      ))}
      {loading && (
        <div style={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
          جارٍ التحميل...
        </div>
      )}
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
