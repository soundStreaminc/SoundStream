import { useEffect, useState } from 'react'

const FALLBACK_COLOR = '#282828'

function rgbToHex(r, g, b) {
  const toHex = (n) => n.toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

export function usePaletteColor(imgSrc) {
  const [data, setData] = useState({ vibrant: FALLBACK_COLOR })
  const [loading, setLoading] = useState(Boolean(imgSrc))
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!imgSrc) {
      setData({ vibrant: FALLBACK_COLOR })
      setLoading(false)
      setError(null)
      return
    }

    let isCancelled = false
    setLoading(true)
    setError(null)

    const img = new Image()
    img.crossOrigin = 'anonymous'

    img.onload = () => {
      if (isCancelled) return
      try {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d', { willReadFrequently: true })
        if (!ctx) throw new Error('Canvas context unavailable')

        const size = 24
        canvas.width = size
        canvas.height = size
        ctx.drawImage(img, 0, 0, size, size)

        const { data: pixels } = ctx.getImageData(0, 0, size, size)
        let r = 0
        let g = 0
        let b = 0
        let count = 0

        for (let i = 0; i < pixels.length; i += 4) {
          const alpha = pixels[i + 3]
          if (alpha < 128) continue
          r += pixels[i]
          g += pixels[i + 1]
          b += pixels[i + 2]
          count++
        }

        if (!count) throw new Error('No visible pixels found')

        const vibrant = rgbToHex(
          Math.round(r / count),
          Math.round(g / count),
          Math.round(b / count)
        )

        setData({ vibrant })
      } catch (err) {
        setData({ vibrant: FALLBACK_COLOR })
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    img.onerror = () => {
      if (isCancelled) return
      setData({ vibrant: FALLBACK_COLOR })
      setError(new Error('Failed loading image for palette extraction'))
      setLoading(false)
    }

    img.src = imgSrc

    return () => {
      isCancelled = true
    }
  }, [imgSrc])

  return { data, loading, error }
}
