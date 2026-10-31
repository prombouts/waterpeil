import { useEffect, useRef, useState } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import { fromArrayBuffer } from 'geotiff'

const AHN_WCS_URL = 'https://service.pdok.nl/rws/ahn/wcs/v1_0'
const EPSG3857 = 'http://www.opengis.net/def/crs/EPSG/0/3857'
const MAX_RASTER_SIZE = 512

export type FloodStatus = 'idle' | 'loading' | 'error'

interface RasterCache {
  key: string
  data: Float32Array
  width: number
  height: number
  bounds: L.LatLngBounds
}

function buildCoverageUrl(sw: L.Point, ne: L.Point, width: number, height: number): string {
  const params = new URLSearchParams({
    SERVICE: 'WCS',
    VERSION: '2.0.1',
    REQUEST: 'GetCoverage',
    COVERAGEID: 'dtm_05m',
    FORMAT: 'image/tiff',
    SUBSETTINGCRS: EPSG3857,
    OUTPUTCRS: EPSG3857,
  })
  // SUBSET/SCALESIZE may appear multiple times, so append manually
  let url = `${AHN_WCS_URL}?${params}`
  url += `&SUBSET=x(${sw.x},${ne.x})&SUBSET=y(${sw.y},${ne.y})`
  url += `&SCALESIZE=x(${width}),y(${height})`
  return url
}

function isNoData(v: number): boolean {
  // AHN nodata is a large float sentinel; sea/open water has no DTM value
  return !Number.isFinite(v) || v > 1e5 || v < -100
}

function renderFlood(
  cache: RasterCache,
  level: number,
): string {
  const { data, width, height } = cache
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!
  const img = ctx.createImageData(width, height)
  const px = img.data

  // 0 = dry land, 1 = flooded, 2 = nodata (open water)
  const mask = new Uint8Array(data.length)
  for (let i = 0; i < data.length; i++) {
    const h = data[i]
    mask[i] = isNoData(h) ? 2 : h <= level ? 1 : 0
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x
      if (mask[i] !== 1) continue
      const o = i * 4

      // Waterline: flooded pixel bordering dry land gets a dark, opaque edge
      const isEdge =
        (x > 0 && mask[i - 1] === 0) ||
        (x < width - 1 && mask[i + 1] === 0) ||
        (y > 0 && mask[i - width] === 0) ||
        (y < height - 1 && mask[i + width] === 0)
      if (isEdge) {
        px[o] = 5
        px[o + 1] = 25
        px[o + 2] = 90
        px[o + 3] = 255
        continue
      }

      const depth = level - data[i]
      px[o] = 15 // R
      px[o + 1] = 70 + Math.max(0, 60 - depth * 12) // G: shallower = slightly lighter
      px[o + 2] = 190 // B
      px[o + 3] = Math.min(230, 90 + depth * 45) // deeper = more opaque
    }
  }
  ctx.putImageData(img, 0, 0)
  return canvas.toDataURL('image/png')
}

interface FloodLayerProps {
  enabled: boolean
  /** Water level in meters NAP */
  level: number
  onStatusChange?: (status: FloodStatus) => void
}

/**
 * Simplified "bathtub" flood simulation: colors every pixel whose AHN
 * terrain height (DTM, 0.5 m grid) lies below the chosen water level.
 * Fetches raw heights for the current viewport from the PDOK AHN WCS.
 */
export default function FloodLayer({ enabled, level, onStatusChange }: FloodLayerProps) {
  const map = useMap()
  const overlayRef = useRef<L.ImageOverlay | null>(null)
  const cacheRef = useRef<RasterCache | null>(null)
  const requestSeq = useRef(0)
  const [status, setStatus] = useState<FloodStatus>('idle')

  useEffect(() => {
    onStatusChange?.(status)
  }, [status, onStatusChange])

  useEffect(() => {
    const removeOverlay = () => {
      overlayRef.current?.remove()
      overlayRef.current = null
    }

    if (!enabled) {
      removeOverlay()
      setStatus('idle')
      return
    }

    const showOverlay = (dataUrl: string, bounds: L.LatLngBounds) => {
      removeOverlay()
      overlayRef.current = L.imageOverlay(dataUrl, bounds, {
        opacity: 0.8,
        interactive: false,
        zIndex: 450,
      }).addTo(map)
    }

    const update = async () => {
      const bounds = map.getBounds()
      const sw = L.CRS.EPSG3857.project(bounds.getSouthWest())
      const ne = L.CRS.EPSG3857.project(bounds.getNorthEast())
      const size = map.getSize()
      const scale = Math.min(1, MAX_RASTER_SIZE / Math.max(size.x, size.y))
      const width = Math.max(32, Math.round(size.x * scale))
      const height = Math.max(32, Math.round(size.y * scale))
      const key = `${sw.x.toFixed(0)},${sw.y.toFixed(0)},${ne.x.toFixed(0)},${ne.y.toFixed(0)},${width}x${height}`

      // Same viewport? Just recolor the cached raster (fast slider feedback).
      if (cacheRef.current?.key === key) {
        showOverlay(renderFlood(cacheRef.current, level), cacheRef.current.bounds)
        setStatus('idle')
        return
      }

      const seq = ++requestSeq.current
      setStatus('loading')
      try {
        const res = await fetch(buildCoverageUrl(sw, ne, width, height))
        if (!res.ok) throw new Error(`WCS request failed: ${res.status}`)
        const buf = await res.arrayBuffer()
        const tiff = await fromArrayBuffer(buf)
        const image = await tiff.getImage()
        const rasters = await image.readRasters({ interleave: true })
        if (seq !== requestSeq.current) return // stale response
        const cache: RasterCache = {
          key,
          data: rasters as unknown as Float32Array,
          width: image.getWidth(),
          height: image.getHeight(),
          bounds,
        }
        cacheRef.current = cache
        showOverlay(renderFlood(cache, level), bounds)
        setStatus('idle')
      } catch {
        if (seq === requestSeq.current) setStatus('error')
      }
    }

    let timer: ReturnType<typeof setTimeout> | undefined
    const debouncedUpdate = () => {
      clearTimeout(timer)
      timer = setTimeout(update, 250)
    }

    update()
    map.on('moveend zoomend', debouncedUpdate)
    return () => {
      clearTimeout(timer)
      map.off('moveend zoomend', debouncedUpdate)
      requestSeq.current++
      removeOverlay()
    }
  }, [map, enabled, level])

  return null
}
