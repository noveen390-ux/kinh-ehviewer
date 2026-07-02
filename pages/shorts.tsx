import { NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

interface ShortItem {
  id: string
  url: string
  thumb: string
  title: string
}

const Shorts: NextPage = () => {
  const router = useRouter()
  const [items, setItems] = useState<ShortItem[]>([])
  const [loading, setLoading] = useState(true)
  const [playing, setPlaying] = useState<ShortItem | null>(null)

  const goBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.replace('/')
    }
  }

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetch('/api/shorts?_=' + Date.now())
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return
        const seen = new Set<string>()
        const unique = data.filter((item: ShortItem) => {
          if (seen.has(item.url)) return false
          seen.add(item.url)
          return true
        })
        setItems(unique)
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#0d0d0d', color: '#fff' }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px', background: '#1a1a1a', position: 'sticky', top: 0, zIndex: 100,
      }}>
        <h1 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>مقاطع قصيرة</h1>
        <button
          onClick={goBack}
          style={{
            width: 34, height: 34, borderRadius: '50%', border: 'none',
            background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: 18,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          ✕
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: 10, padding: 12,
      }}>
        {items.map((item, i) => (
          <div
            key={item.id || i}
            onClick={() => setPlaying(item)}
            style={{
              cursor: 'pointer', borderRadius: 8, overflow: 'hidden',
              background: '#1e1e1e', transition: 'transform 0.15s',
            }}
          >
            <div style={{
              position: 'relative', width: '100%', paddingTop: '56.25%',
              background: '#2a2a2a', overflow: 'hidden',
            }}>
              {item.thumb ? (
                <img
                  src={item.thumb}
                  alt=""
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                  loading="lazy"
                />
              ) : (
                <div style={{
                  position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 32, color: '#555',
                }}>
                  ▶
                </div>
              )}
            </div>
            <div style={{ padding: '8px 10px', fontSize: 13, lineHeight: 1.3, color: '#ccc' }}>
              {item.title || 'بدون عنوان'}
            </div>
          </div>
        ))}
      </div>

      {loading && (
        <div style={{ height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#888', fontSize: 14 }}>جارٍ التحميل...</span>
        </div>
      )}

      {playing && (
        <div
          onClick={() => { setPlaying(null) }}
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.92)', zIndex: 1000,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: 20,
          }}
        >
          <button
            onClick={() => setPlaying(null)}
            style={{
              position: 'absolute', top: 16, right: 16, zIndex: 1001,
              width: 36, height: 36, borderRadius: '50%', border: 'none',
              background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: 20,
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
          <div style={{ width: '100%', maxWidth: 600 }} onClick={(e) => e.stopPropagation()}>
            <video
              src={playing.url}
              controls
              autoPlay
              playsInline
              style={{ width: '100%', borderRadius: 8, maxHeight: '80vh' }}
            />
            <p style={{ margin: '12px 0 0', fontSize: 14, textAlign: 'center', color: '#ccc' }}>
              {playing.title}
            </p>
          </div>
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
