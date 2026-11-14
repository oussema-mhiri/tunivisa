import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ComposableMap, Geographies, Geography, ZoomableGroup, Sphere } from 'react-simple-maps'
import worldAtlas from 'world-atlas/countries-110m.json'
import { motion } from 'framer-motion'
import { Crosshair, Minus, Plus, RotateCcw } from 'lucide-react'
import Flag from './Flag'
import VisaStatusBadge from './VisaStatusBadge'
import VisaStatusLegend from './VisaStatusLegend'
import { getMapData } from '../services/api'
import { visaStatusMeta, REGIONS } from '../utils/countryMeta'
import { useTheme } from '../context/ThemeContext'
import { cn } from '../utils/formatters'

const STATUS_FILTERS = ['all', 'visa_free', 'visa_on_arrival', 'evisa_eta', 'visa_required']
const HOME_COLOR = '#e6ff32'

function MapTooltip({ tooltip }) {
  if (!tooltip) return null
  const { country, x, y } = tooltip
  const meta = visaStatusMeta(country.status || 'unknown')
  return (
    <div
      className="pointer-events-none fixed z-50 w-56 -translate-x-1/2 -translate-y-full"
      style={{ left: x, top: y - 12 }}
      role="tooltip"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 4 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.12 }}
        className="rounded-xl border border-ink-200 bg-white/95 p-3 shadow-pop backdrop-blur"
      >
        <div className="flex items-center gap-2">
          <Flag code={country.code} size="md" />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-ink-900">{country.name}</p>
            {country.home ? (
              <p className="text-xs font-medium text-ink-500">Your home country</p>
            ) : (
              <p className="text-xs text-ink-400">{country.region}</p>
            )}
          </div>
        </div>
        {!country.home && (
          <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-ink-100 pt-2">
            <VisaStatusBadge status={country.status || 'unknown'} />
            <span className="text-xs font-semibold text-ink-500">
              {country.maxStayDays ? `≤ ${country.maxStayDays} days` : 'Varies'}
            </span>
          </div>
        )}
        {country.detailed && (
          <p className="mt-2 text-[11px] font-medium text-brand-600">Click for full guidance →</p>
        )}
        {!country.home && <p className="mt-1.5 text-[11px] leading-snug text-ink-400">{meta.description}</p>}
      </motion.div>
    </div>
  )
}

function CountryPath({ geo, mapData, statusFilter, regionFilter, dark, onHover, onLeave, onMove, onClick }) {
  const id = String(geo.id)
  const entry = mapData ? mapData[id] : null
  const status = entry ? entry.status : 'unknown'
  const meta = visaStatusMeta(status)
  const matchesStatus = statusFilter === 'all' || status === statusFilter
  const matchesRegion = regionFilter === 'all' || entry?.region === regionFilter
  const active = matchesStatus && matchesRegion
  const dimmed = !mapData || !active

  return (
    <g
      onClick={(event) => {
        if (entry) {
          event.stopPropagation()
          onClick(entry)
        }
      }}
      onMouseEnter={(event) => {
        if (entry) {
          onHover(entry)
          onMove(event)
        }
      }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={entry ? 'cursor-pointer' : undefined}
    >
      <Geography
        geography={geo}
        className="tunivisa-country"
        style={{
          default: {
            fill: entry ? (entry.home ? HOME_COLOR : meta.color) : dark ? '#2a2824' : '#c6bfb2',
            stroke: dark ? '#0d0d0b' : '#0d0d0b',
            strokeWidth: 0.45,
            outline: 'none',
            opacity: dimmed ? (dark ? 0.22 : 0.18) : 1,
            transition: 'opacity 200ms ease, fill 200ms ease',
          },
          hover: {
            fill: '#e6ff32',
            stroke: '#0d0d0b',
            strokeWidth: 0.7,
            outline: 'none',
            cursor: 'pointer',
          },
          pressed: { outline: 'none' },
        }}
      />
    </g>
  )
}

const MemoizedCountryPath = memo(CountryPath)

export default function WorldMap({ showFilters = true }) {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const dark = theme === 'dark'
  const [mapData, setMapData] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [regionFilter, setRegionFilter] = useState('all')
  const [zoom, setZoom] = useState(1)
  const [center, setCenter] = useState([0, 12])
  const [tooltip, setTooltip] = useState(null)

  useEffect(() => {
    let cancelled = false
    getMapData().then((data) => {
      if (!cancelled) setMapData(data)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const resetView = useCallback(() => {
    setZoom(1)
    setCenter([0, 12])
    setTooltip(null)
  }, [])

  useEffect(() => {
    if (statusFilter !== 'all' || regionFilter !== 'all') resetView()
  }, [statusFilter, regionFilter, resetView])

  const handleHover = useCallback((entry) => {
    setTooltip((prev) => (prev?.country?.code === entry.code ? prev : { country: entry, x: 0, y: 0 }))
  }, [])

  const handleMove = useCallback((event) => {
    setTooltip((prev) => (prev ? { ...prev, x: event.clientX, y: event.clientY } : prev))
  }, [])

  const handleLeave = useCallback(() => setTooltip(null), [])

  const handleClick = useCallback(
    (entry) => {
      if (entry.detailed || entry.code) navigate(`/countries/${entry.code}`)
    },
    [navigate],
  )

  const zoomBy = useCallback((factor) => {
    setZoom((z) => Math.min(8, Math.max(1, Math.round(z * factor * 10) / 10)))
  }, [])

  const stats = useMemo(() => {
    if (!mapData) return { total: 0, detailed: 0 }
    const entries = Object.values(mapData)
    return { total: entries.length, detailed: entries.filter((entry) => entry.detailed).length }
  }, [mapData])

  const chipBase = 'inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-150'

  return (
    <div className="relative overflow-hidden rounded-3xl border border-ink-200/80 bg-white shadow-card">
      <div className="relative">
        {!mapData && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 backdrop-blur-[2px]">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" aria-hidden="true" />
              <p className="text-sm font-medium text-ink-500">Loading world map…</p>
            </div>
          </div>
        )}

        <svg className="h-[240px] w-full sm:h-auto" viewBox="0 0 800 450" role="img" aria-label="Interactive world map of visa requirements for Tunisian passport holders">
          <ComposableMap projection="geoEqualEarth" projectionConfig={{ scale: 147, center: [0, 15] }}>
            <Sphere fill={dark ? '#161512' : '#e8e3d6'} stroke={dark ? '#4a463f' : '#0d0d0b'} strokeWidth={0.6} />
            <ZoomableGroup zoom={zoom} center={center} minZoom={1} maxZoom={8} translateExtent={[[-400, -225], [1200, 675]]}>
              <Geographies geography={worldAtlas}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <MemoizedCountryPath
                      key={geo.rsmKey}
                      geo={geo}
                      mapData={mapData}
                      statusFilter={statusFilter}
                      regionFilter={regionFilter}
                      dark={dark}
                      onHover={handleHover}
                      onLeave={handleLeave}
                      onMove={handleMove}
                      onClick={handleClick}
                    />
                  ))
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>
        </svg>

        <MapTooltip tooltip={tooltip} />

        <div className="absolute top-3 left-3 flex flex-col gap-1.5 sm:top-4 sm:left-4">
          <button
            type="button"
            onClick={() => zoomBy(1.5)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-ink-200 bg-white text-ink-600 shadow-sm transition-all hover:bg-ink-50 hover:text-ink-900 active:scale-95 sm:h-10 sm:w-10"
            aria-label="Zoom in"
          >
            <Plus className="h-4.5 w-4.5" />
          </button>
          <button
            type="button"
            onClick={() => zoomBy(1 / 1.5)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-ink-200 bg-white text-ink-600 shadow-sm transition-all hover:bg-ink-50 hover:text-ink-900 active:scale-95 sm:h-10 sm:w-10"
            aria-label="Zoom out"
          >
            <Minus className="h-4.5 w-4.5" />
          </button>
          <button
            type="button"
            onClick={resetView}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-ink-200 bg-white text-ink-600 shadow-sm transition-all hover:bg-ink-50 hover:text-ink-900 active:scale-95 sm:h-10 sm:w-10"
            aria-label="Reset map view"
          >
            <RotateCcw className="h-4.5 w-4.5" />
          </button>
        </div>

        <div className="absolute top-4 right-4 hidden items-center gap-1.5 rounded-xl border border-ink-200 bg-white/90 px-3 py-2 text-xs font-medium text-ink-600 shadow-sm backdrop-blur sm:flex">
          <Crosshair className="h-3.5 w-3.5 text-brand-600" aria-hidden="true" />
          {stats.detailed} full visa guides verified
        </div>
      </div>

      <div className="grid gap-6 border-t border-ink-100 bg-ink-50/60 px-5 py-4 lg:grid-cols-[1fr_auto] lg:items-start">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <VisaStatusLegend compact />
          <span className="hidden h-6 w-px bg-ink-200 lg:block" aria-hidden="true" />
          <div className="flex items-center gap-2.5">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: HOME_COLOR }} aria-hidden="true" />
            <span className="text-sm font-medium text-ink-700">Home (Tunisia)</span>
          </div>
        </div>
        <p className="text-xs leading-snug text-ink-400 lg:max-w-xs lg:text-right">
          Full guides are verified; other country colours are illustrative. Hover for details, click to open a guide.
        </p>
      </div>

      {showFilters && (
        <div className="space-y-3 border-t border-ink-100 px-5 py-4">
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by visa status">
            <span className="mr-1 text-xs font-semibold tracking-wide text-ink-400 uppercase">Status</span>
            {STATUS_FILTERS.map((key) => {
              const label = key === 'all' ? 'All' : visaStatusMeta(key).label
              const active = statusFilter === key
              const color = visaStatusMeta(key).color
              return (
                <button
                  key={key}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setStatusFilter(key)}
                  className={cn(
                    chipBase,
                    active && key === 'all' && 'border-ink-900 bg-ink-900 text-white',
                    active && key !== 'all' && 'border-transparent text-white',
                    !active && 'border-ink-200 bg-white text-ink-600 hover:border-ink-300 hover:bg-ink-50',
                  )}
                  style={active && key !== 'all' ? { backgroundColor: color } : undefined}
                >
                  {label}
                </button>
              )
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by region">
            <span className="mr-1 text-xs font-semibold tracking-wide text-ink-400 uppercase">Region</span>
            {['all', ...REGIONS].map((key) => {
              const active = regionFilter === key
              return (
                <button
                  key={key}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setRegionFilter(key)}
                  className={cn(
                    chipBase,
                    active
                      ? 'border-brand-600 bg-brand-600 text-white'
                      : 'border-ink-200 bg-white text-ink-600 hover:border-ink-300 hover:bg-ink-50',
                  )}
                >
                  {key === 'all' ? 'All' : key}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
