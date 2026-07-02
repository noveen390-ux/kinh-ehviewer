import useIsIosStandalone from '@/hooks/useIsIosStandalone'
import ComicConfig from '@/widgets/comic/ComicConfig'
import { StyledEngineProvider } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import { appWithTranslation } from 'next-i18next'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter, Router } from 'next/router'
import Script from 'next/script'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import React, { useEffect, useState } from 'react'
import ThemeProvider from 'src/theme'
import { SWRConfig } from 'swr'

Router.events.on('routeChangeStart', (url) => {
  NProgress.start()
  console.log(url)
})
Router.events.on('routeChangeComplete', () => {
  NProgress.done()
})
Router.events.on('routeChangeError', () => NProgress.done())

function MyApp(props: AppProps) {
  const { Component, pageProps } = props
  const matches = useIsIosStandalone()
  const router = useRouter()
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    const isValid = sessionStorage.getItem('auth') === 'valid'
    if (router.pathname === '/login') {
      if (isValid) {
        const params = new URLSearchParams(window.location.search)
        const redirect = params.get('redirect') || '/'
        router.replace(redirect)
      } else setAuthChecked(true)
      return
    }
    if (!isValid) {
      router.replace(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`)
    } else {
      setAuthChecked(true)
    }
  }, [router.pathname])

  React.useEffect(() => {
    document.documentElement.dir = router.locale === 'ar' ? 'rtl' : 'ltr'
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement!.removeChild(jssStyles)
    }
  }, [])

  if (!authChecked && router.pathname !== '/login') {
    return <div style={{ background: '#111', height: '100vh' }} />
  }

  return (
    <React.Fragment>
      <Head>
        <title>Kinh EhViewer</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, viewport-fit=cover"
        />
      </Head>
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-MEASUREMENT_ID"
      ></Script>
      <Script id="google-analytics">
        {`window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-MEASUREMENT_ID');`}
      </Script>
      <SWRConfig value={{ errorRetryInterval: 1000, errorRetryCount: 1 }}>
        <ComicConfig>
          <StyledEngineProvider injectFirst>
            <ThemeProvider>
              <CssBaseline />
              <Component {...pageProps} />
              <style jsx global>
                {`
                  a {
                    text-decoration: none;
                    color: unset;
                  }
                  body {
                    padding-bottom: ${matches
                      ? '30px'
                      : 'env(safe-area-inset-bottom)'};
                  }
                `}
              </style>
            </ThemeProvider>
          </StyledEngineProvider>
        </ComicConfig>
      </SWRConfig>
    </React.Fragment>
  )
}

export default appWithTranslation(MyApp)
