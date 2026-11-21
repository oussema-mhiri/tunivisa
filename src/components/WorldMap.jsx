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
import { useI18n } from '../i18n/LanguageContext'
import { cn } from '../utils/formatters'

const STATUS_FILTERS = ['all', 'visa_free', 'visa_on_arrival', 'evisa_eta', 'visa_required', 'no_admission']
const HOME_COLOR = 'var(--color-warning-400)'

function MapTooltip({ tooltip }) {
  const { t } = useI18n()
  if (!tooltip) return null
  const { country, x, y } = tooltip
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
        className="zc-tooltip p-3"
      >
        <div className="flex items-center gap-2">
          <Flag code={country.code} size="md" />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-ink-900">{country.name}</p>
            {country.home ? (
              <p className="text-xs font-medium text-ink-500">{t('map.homeTooltip')}</p>
            ) : (
              <p className="text-xs text-ink-400">{t(`region.${country.region}`)}</p>
            )}
          </div>
        </div>
        {!country.home && (
          <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-ink-100 pt-2">
            <VisaStatusBadge status={country.status || 'unknown'} />
            <span className="text-xs font-semibold text-ink-500">
              {country.maxStayDays ? t('map.daysShort', { count: country.maxStayDays }) : t('country.notSpecified')}
            </span>
          </div>
        )}
        {country.detailed && (
          <p className="mt-2 text-[11px] font-medium text-brand-600">{t('map.fullGuidance')}</p>
        )}
        {!country.home && <p className="mt-1.5 text-[11px] leading-snug text-ink-400">{t(`statusDescription.${country.status || 'unknown'}`)}</p>}
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
            fill: entry ? (entry.home ? HOME_COLOR : meta.color) : dark ? '#1a2a3a' : '#d2cabc',
            stroke: entry?.home ? (dark ? '#f4efe4' : '#0b2545') : dark ? '#2c4054' : '#0b2545',
            strokeWidth: entry?.home ? 0.9 : 0.45,
            outline: 'none',
            opacity: dimmed ? (dark ? 0.22 : 0.18) : 1,
            transition: 'opacity 200ms ease, fill 200ms ease',
          },
          hover: {
            fill: 'var(--color-brand-700)',
            stroke: dark ? '#f4efe4' : '#0b2545',
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
  const { t } = useI18n()
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

  const chipBase = 'inline-flex items-center rounded-full border px-3 py-1.5 text-[10px] font-bold tracking-[0.07em] uppercase transition-all duration-150'

  return (
    <div className="zc-map relative overflow-hidden bg-white">
      <div className="relative">
        {!mapData && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 backdrop-blur-[2px]">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" aria-hidden="true" />
              <p className="text-sm font-medium text-ink-500">{t('map.loading')}</p>
            </div>
          </div>
        )}

        <svg className="h-[240px] w-full sm:h-auto" viewBox="0 0 800 450" role="img" aria-label={t('map.aria')}>
          <ComposableMap projection="geoEqualEarth" projectionConfig={{ scale: 147, center: [0, 15] }}>
            <Sphere fill={dark ? '#0b1420' : '#e7e1d6'} stroke={dark ? '#2c4054' : '#0b2545'} strokeWidth={0.6} />
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
            className="zc-map-control flex h-9 w-9 items-center justify-center text-ink-600 transition-all active:translate-y-0.5 sm:h-10 sm:w-10"
            aria-label={t('map.zoomIn')}
          >
            <Plus className="h-4.5 w-4.5" />
          </button>
          <button
            type="button"
            onClick={() => zoomBy(1 / 1.5)}
            className="zc-map-control flex h-9 w-9 items-center justify-center text-ink-600 transition-all active:translate-y-0.5 sm:h-10 sm:w-10"
            aria-label={t('map.zoomOut')}
          >
            <Minus className="h-4.5 w-4.5" />
          </button>
          <button
            type="button"
            onClick={resetView}
            className="zc-map-control flex h-9 w-9 items-center justify-center text-ink-600 transition-all active:translate-y-0.5 sm:h-10 sm:w-10"
            aria-label={t('map.resetView')}
          >
            <RotateCcw className="h-4.5 w-4.5" />
          </button>
        </div>

        <div className="zc-map-control absolute top-4 right-4 hidden items-center gap-1.5 px-3 py-2 text-[10px] font-bold tracking-[0.06em] text-ink-700 uppercase sm:flex">
          <Crosshair className="h-3.5 w-3.5 text-brand-600" aria-hidden="true" />
          {t('map.fullGuides', { count: stats.detailed })}
        </div>
      </div>

      <div className="grid gap-6 border-t border-ink-100 bg-ink-50/60 px-5 py-4 lg:grid-cols-[1fr_auto] lg:items-start">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <VisaStatusLegend compact />
          <span className="hidden h-6 w-px bg-ink-200 lg:block" aria-hidden="true" />
          <div className="flex items-center gap-2.5">
            <span className="h-3 w-3 rounded-full border border-ink-200" style={{ backgroundColor: HOME_COLOR }} aria-hidden="true" />
            <span className="text-sm font-medium text-ink-700">{t('map.home')}</span>
          </div>
        </div>
        <p className="text-xs leading-snug text-ink-400 lg:max-w-xs lg:text-right">
          {t('map.legendNote')}
        </p>
      </div>

      {showFilters && (
        <div className="space-y-3 border-t border-ink-100 px-5 py-4">
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label={t('map.filterStatus')}>
            <span className="mr-1 text-xs font-semibold tracking-wide text-ink-400 uppercase">{t('map.status')}</span>
            {STATUS_FILTERS.map((key) => {
              const label = key === 'all' ? t('common.all') : t(`status.${key}`)
              const active = statusFilter === key
              return (
                <button
                  key={key}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setStatusFilter(key)}
                  className={cn(
                    chipBase,
                    active && key === 'all' && 'border-transparent bg-ink-900 text-white',
                    active && key !== 'all' && cn('border-transparent ring-2 ring-brand-500/25', visaStatusMeta(key).chip),
                    !active && 'border-ink-200 bg-white text-ink-600 hover:border-ink-300 hover:bg-ink-50',
                  )}
                >
                  {label}
                </button>
              )
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2" role="group" aria-label={t('map.filterRegion')}>
            <span className="mr-1 text-xs font-semibold tracking-wide text-ink-400 uppercase">{t('map.region')}</span>
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
                      ? 'border-transparent bg-brand-600 text-white'
                      : 'border-ink-200 bg-white text-ink-600 hover:border-ink-300 hover:bg-ink-50',
                  )}
                >
                  {key === 'all' ? t('common.all') : t(`region.${key}`)}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
