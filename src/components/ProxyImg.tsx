import { ImgHTMLAttributes, forwardRef, useMemo, useState } from 'react'

const ProxyImg = forwardRef<
  HTMLImageElement,
  ImgHTMLAttributes<HTMLImageElement>
>((props, ref) => {
  const { src, alt, ...rest } = props
  const [failed, setFailed] = useState(false)

  const finalSrc = useMemo(() => {
    if (!src) return ''
    if (!src.startsWith('http')) return src
    if (failed) return '/api/gallery/proxy?url=' + encodeURIComponent(src)
    return src
  }, [src, failed])

  return <img ref={ref} {...rest} src={finalSrc} alt={alt} onError={() => setFailed(true)} />
})

ProxyImg.displayName = 'ProxyImg'

export default ProxyImg
