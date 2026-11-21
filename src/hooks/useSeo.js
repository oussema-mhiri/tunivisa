import { useEffect } from 'react'

const SITE_NAME = 'TuniVisa'
const SITE_URL = 'https://oussema-mhiri.github.io/tunivisa'
const DEFAULT_IMAGE = `${SITE_URL}/og-image.svg`

export function useSeo({ title, documentTitle, description, path = '', image, noindex = false } = {}) {
  useEffect(() => {
    const fullTitle = documentTitle || (title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Visa & Travel Guide for Tunisians`)
    document.title = fullTitle

    const setMeta = (attr, key, content) => {
      if (content == null || content === '') return
      let el = document.head.querySelector(`meta[${attr}="${key}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, key)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }
    const setLink = (rel, href) => {
      if (!href) return
      let el = document.head.querySelector(`link[rel="${rel}"]`)
      if (!el) {
        el = document.createElement('link')
        el.setAttribute('rel', rel)
        document.head.appendChild(el)
      }
      el.setAttribute('href', href)
    }

    const desc = description || 'Visa information, requirements and travel guidance for Tunisian passport holders.'
    const normalized = path ? (path.startsWith('/') ? path : `/${path}`) : '/'
    const url = `${SITE_URL}${normalized}`
    const img = image || DEFAULT_IMAGE

    setMeta('name', 'description', desc)
    setMeta('name', 'robots', noindex ? 'noindex,nofollow' : 'index,follow')
    setMeta('property', 'og:type', 'website')
    setMeta('property', 'og:site_name', SITE_NAME)
    setMeta('property', 'og:title', fullTitle)
    setMeta('property', 'og:description', desc)
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:image', img)
    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', fullTitle)
    setMeta('name', 'twitter:description', desc)
    setMeta('name', 'twitter:image', img)
    setLink('canonical', url)
  }, [title, documentTitle, description, path, image, noindex])
}
