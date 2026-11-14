import { useEffect } from 'react'

const SITE_NAME = 'TuniVisa'

/**
 * Sets the document title and meta description + Open Graph tags for the page.
 * SPA-friendly SEO for a client-side rendered app.
 */
export function useSeo({ title, description } = {}) {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Visa & Travel Guide for Tunisians`

    const setMeta = (attr, key, content) => {
      let el = document.head.querySelector(`meta[${attr}="${key}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, key)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    if (description) {
      setMeta('name', 'description', description)
      setMeta('property', 'og:description', description)
      setMeta('name', 'twitter:description', description)
    }
  }, [title, description])
}
