import { useState } from 'react'
import {
  MapContainer,
  TileLayer,
  WMSTileLayer,
  LayersControl,
  Marker,
  Popup,
  useMapEvents,
} from 'react-leaflet'
import L, { type LatLng, type Map as LeafletMap } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import { locations } from '../data/locations'
import { translations, type Language } from '../translations'
import FloodLayer, { type FloodStatus } from './FloodLayer'

// Fix default marker icons under bundlers (Vite)
const defaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

// PDOK BRT Achtergrondkaart (web mercator), free to use, no API key required
const PDOK_URL =
  'https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0/standaard/EPSG:3857/{z}/{x}/{y}.png'
const AERIAL_PHOTO_URL =
  'https://service.pdok.nl/hwh/luchtfotorgb/wmts/v1_0/Actueel_ortho25/EPSG:3857/{z}/{x}/{y}.jpeg'
// PDOK AHN (Actueel Hoogtebestand Nederland) WMS — 0,5 m resolutie hoogteraster
const AHN_WMS_URL = 'https://service.pdok.nl/rws/ahn/wms/v1_0'

// Haarsteeg — startweergave; zoom 12 houdt Waalwijk én Den Bosch in beeld
const HAARSTEEG: [number, number] = [51.7114, 5.1972]

interface HeightResult {
  position: LatLng
  loading: boolean
  dtm?: number | null // maaiveld (terrein)
  dsm?: number | null // oppervlakte (incl. gebouwen/bomen)
  error?: boolean
}

function buildGetFeatureInfoUrl(map: LeafletMap, latlng: LatLng, layer: string): string {
  const size = map.getSize()
  const bounds = map.getBounds()
  const sw = L.CRS.EPSG3857.project(bounds.getSouthWest())
  const ne = L.CRS.EPSG3857.project(bounds.getNorthEast())
  const point = map.latLngToContainerPoint(latlng).round()
  const params = new URLSearchParams({
    SERVICE: 'WMS',
    VERSION: '1.3.0',
    REQUEST: 'GetFeatureInfo',
    LAYERS: layer,
    QUERY_LAYERS: layer,
    STYLES: '',
    FORMAT: 'image/png',
    INFO_FORMAT: 'application/json',
    CRS: 'EPSG:3857',
    BBOX: `${sw.x},${sw.y},${ne.x},${ne.y}`,
    WIDTH: String(size.x),
    HEIGHT: String(size.y),
    I: String(point.x),
    J: String(point.y),
  })
  return `${AHN_WMS_URL}?${params}`
}

async function fetchHeight(map: LeafletMap, latlng: LatLng, layer: string): Promise<number | null> {
  const res = await fetch(buildGetFeatureInfoUrl(map, latlng, layer))
  if (!res.ok) throw new Error(`AHN request failed: ${res.status}`)
  const json = await res.json()
  const value = json?.features?.[0]?.properties?.value_list
  const height = Number.parseFloat(value)
  return Number.isFinite(height) ? height : null
}

function formatHeight(h: number | null | undefined, noDataLabel: string): string {
  return h == null ? noDataLabel : `${h.toFixed(2)} m NAP`
}

/** Click anywhere on the map to query the AHN elevation at that point. */
function HeightProbe({ language }: { language: Language }) {
  const [result, setResult] = useState<HeightResult | null>(null)
  const map = useMapEvents({
    click(e) {
      setResult({ position: e.latlng, loading: true })
      Promise.all([
        fetchHeight(map, e.latlng, 'dtm_05m'),
        fetchHeight(map, e.latlng, 'dsm_05m'),
      ])
        .then(([dtm, dsm]) => setResult({ position: e.latlng, loading: false, dtm, dsm }))
        .catch(() => setResult({ position: e.latlng, loading: false, error: true }))
    },
  })

  if (!result) return null
  const t = translations[language]

  return (
    <Popup position={result.position}>
      {result.loading ? (
        t.queryingElevation
      ) : result.error ? (
        t.elevationQueryError
      ) : (
        <div className="height-popup">
          <strong>{t.elevationTitle}</strong>
          <table>
            <tbody>
              <tr>
                <td>{t.groundSurface}</td>
                <td>{formatHeight(result.dtm, t.noData)}</td>
              </tr>
              <tr>
                <td>{t.surface}</td>
                <td>{formatHeight(result.dsm, t.noData)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </Popup>
  )
}

interface PdokMapProps {
  language: Language
  floodEnabled: boolean
  floodLevel: number
  onFloodStatusChange?: (status: FloodStatus) => void
}

type BaseMap = 'standard' | 'aerial'

function MapLayerChangeListener({
  language,
  onBaseMapChange,
  onElevationChange,
}: {
  language: Language
  onBaseMapChange: (baseMap: BaseMap) => void
  onElevationChange: (visible: boolean) => void
}) {
  useMapEvents({
    baselayerchange(event) {
      onBaseMapChange(event.name === translations[language].aerialPhoto ? 'aerial' : 'standard')
    },
    overlayadd(event) {
      if (event.name === translations[language].elevationOverlay) onElevationChange(true)
    },
    overlayremove(event) {
      if (event.name === translations[language].elevationOverlay) onElevationChange(false)
    },
  })
  return null
}

export default function PdokMap({
  language,
  floodEnabled,
  floodLevel,
  onFloodStatusChange,
}: PdokMapProps) {
  const [baseMap, setBaseMap] = useState<BaseMap>('standard')
  const [elevationVisible, setElevationVisible] = useState(false)
  const t = translations[language]
  const mapAttribution = `${t.mapAttribution} &copy; <a href="https://www.kadaster.nl">Kadaster</a> | <a href="https://www.pdok.nl">PDOK</a>`
  const elevationAttribution = `${t.elevationAttribution}: <a href="https://www.ahn.nl">AHN</a>`

  return (
    <MapContainer
      center={HAARSTEEG}
      zoom={12}
      minZoom={6}
      maxZoom={19}
      className="pdok-map"
    >
      <LayersControl key={language} position="topright">
        <LayersControl.BaseLayer checked={baseMap === 'standard'} name={t.standardMap}>
          <TileLayer url={PDOK_URL} attribution={mapAttribution} />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer checked={baseMap === 'aerial'} name={t.aerialPhoto}>
          <TileLayer url={AERIAL_PHOTO_URL} attribution={mapAttribution} />
        </LayersControl.BaseLayer>
        <LayersControl.Overlay checked={elevationVisible} name={t.elevationOverlay}>
          <WMSTileLayer
            url={AHN_WMS_URL}
            params={{ layers: 'dsm_05m', format: 'image/png', transparent: true }}
            opacity={0.55}
            maxZoom={19}
            attribution={elevationAttribution}
          />
        </LayersControl.Overlay>
      </LayersControl>
      <MapLayerChangeListener
        language={language}
        onBaseMapChange={setBaseMap}
        onElevationChange={setElevationVisible}
      />
      <HeightProbe language={language} />
      <FloodLayer
        enabled={floodEnabled}
        level={floodLevel}
        onStatusChange={onFloodStatusChange}
      />
      {locations.map((loc) => (
        <Marker key={loc.id} position={loc.position} icon={defaultIcon}>
          <Popup>
            <strong>{loc.name}</strong>
            <br />
            {t.locationDescriptions[loc.id] ?? loc.description}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
