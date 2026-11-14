import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import CountryCard from '../components/CountryCard'
import EmptyState from '../components/EmptyState'
import { SkeletonList } from '../components/Skeleton'
import { useApp } from '../context/AppContext'
import { getCountries } from '../services/api'
import { useSeo } from '../hooks/useSeo'

export default function SavedPage() {
  useSeo({ title: 'Saved destinations', description: 'Your saved visa guides and destinations on TuniVisa.' })
  const { saved } = useApp()
  const [countries, setCountries] = useState(null)

  useEffect(() => {
    let cancelled = false
    getCountries().then((all) => {
      if (!cancelled) setCountries(all.filter((c) => saved.includes(c.code)))
    })
    return () => {
      cancelled = true
    }
  }, [saved])

  return (
    <div className="container-page py-10 sm:py-14">
      <p className="text-sm font-semibold tracking-wide text-brand-600 uppercase">Saved for later</p>
      <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
        Saved destinations
      </h1>
      <p className="mt-2 text-sm text-ink-500 sm:text-base">
        Countries you&apos;ve bookmarked with the heart icon. Your list is stored on this device.
      </p>

      <div className="mt-8">
        {!countries && <SkeletonList items={6} />}

        {countries && countries.length === 0 && (
          <EmptyState
            icon={Heart}
            title="No saved destinations"
            text="Tap the heart icon on any country card or map page to build your personal travel shortlist."
            action={
              <Link to="/countries" className="btn-primary">
                Explore countries
              </Link>
            }
          />
        )}

        {countries && countries.length > 0 && (
          <>
            <p className="mb-4 text-sm font-medium text-ink-500">
              {countries.length} saved {countries.length === 1 ? 'destination' : 'destinations'}
            </p>
            <div className="zc-country-grid grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {countries.map((country, i) => (
                <CountryCard key={country.code} country={country} index={i} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
