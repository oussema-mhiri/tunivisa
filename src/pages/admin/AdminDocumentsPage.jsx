import { useMemo, useState } from 'react'
import { FileCheck2, SearchX } from 'lucide-react'
import Badge from '../../components/Badge'
import SearchBar from '../../components/SearchBar'
import EmptyState from '../../components/EmptyState'
import { DOCUMENTS } from '../../data/documents'
import { DOCS_BY_TYPE } from '../../data/visaRules'
import { VISA_TYPES } from '../../data/visaTypes'
import { useToast } from '../../context/ToastContext'
import { useDebounce } from '../../hooks/useDebounce'
import { useSeo } from '../../hooks/useSeo'

const TOTAL_PURPOSES = VISA_TYPES.length

export default function AdminDocumentsPage() {
  useSeo({ title: 'Admin — Documents', description: 'Review the document checklist registry.' })
  const toast = useToast()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const debouncedQuery = useDebounce(query, 200)

  const rows = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase()
    return DOCUMENTS
      .map((doc) => {
        const usedIn = VISA_TYPES.filter((t) => DOCS_BY_TYPE[t.id].includes(doc.id)).length
        return { ...doc, usedIn }
      })
      .filter((doc) => (q ? doc.label.toLowerCase().includes(q) || doc.description.toLowerCase().includes(q) : true))
      .filter((doc) => (filter === 'all' ? true : filter === 'required' ? doc.required : !doc.required))
      .sort((a, b) => b.usedIn - a.usedIn)
  }, [debouncedQuery, filter])

  const requiredCount = DOCUMENTS.filter((d) => d.required).length

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar value={query} onChange={setQuery} placeholder="Search documents…" className="sm:max-w-xs" />
        <div className="flex items-center gap-2" role="group" aria-label="Filter documents">
          {[
            { key: 'all', label: `All (${DOCUMENTS.length})` },
            { key: 'required', label: `Required (${requiredCount})` },
            { key: 'optional', label: `Optional (${DOCUMENTS.length - requiredCount})` },
          ].map((opt) => (
            <button
              key={opt.key}
              type="button"
              aria-pressed={filter === opt.key}
              onClick={() => setFilter(opt.key)}
              className={`inline-flex items-center rounded-none border px-3 py-1.5 text-xs font-semibold transition-colors ${
                filter === opt.key
                  ? 'border-ink-900 bg-ink-900 text-white'
                  : 'border-ink-200 bg-white text-ink-600 hover:bg-ink-50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {rows.length === 0 && (
        <EmptyState
          icon={SearchX}
          title="No documents match"
          text="Try a different search term or filter."
          action={
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                setQuery('')
                setFilter('all')
              }}
            >
              Clear filters
            </button>
          }
        />
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((doc, i) => (
          <article key={doc.id} className="card flex flex-col p-5 transition-shadow duration-200 hover:shadow-card-hover">
            <div className="flex items-start justify-between gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-none bg-brand-50 text-brand-600">
                <FileCheck2 className="h-5 w-5" aria-hidden="true" />
              </span>
              <Badge tone={doc.required ? 'brand' : 'gray'}>
                {doc.required ? 'Required' : 'Optional'}
              </Badge>
            </div>
            <h2 className="mt-4 font-display text-base font-bold text-ink-900">{doc.label}</h2>
            <p className="mt-1.5 flex-1 text-sm leading-relaxed text-ink-500">{doc.description}</p>
            <div className="mt-4 flex items-center justify-between border-t border-ink-100 pt-3">
              <span className="text-xs font-medium text-ink-400">
                Used in {doc.usedIn} of {TOTAL_PURPOSES} purposes
              </span>
              <button
                type="button"
                onClick={() => toast.info(`"${doc.label}": editing is not persisted in this preview.`)}
                className="text-xs font-semibold text-brand-600 hover:text-brand-700"
              >
                Edit →
              </button>
            </div>
          </article>
        ))}
      </div>

      <p className="text-xs text-ink-400">
        {rows.length} of {DOCUMENTS.length} documents shown. Catalogue is general guidance — confirm the official checklist per destination.
      </p>
    </div>
  )
}
