import { Readable } from 'node:stream'
import server from '../dist/server/server.js'

const STATIC_FILES = {
  '/robots.txt': {
    type: 'text/plain',
    body: 'User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /checkout\n\nSitemap: https://fruteriaslyamarket.com/sitemap.xml\n',
  },
  '/sitemap.xml': {
    type: 'application/xml; charset=utf-8',
    body: '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>https://fruteriaslyamarket.com/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>\n  <url><loc>https://fruteriaslyamarket.com/tienda</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>\n  <url><loc>https://fruteriaslyamarket.com/ofertas</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>\n  <url><loc>https://fruteriaslyamarket.com/contacto</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>\n</urlset>\n',
  },
  '/google15088541c54d2645.html': {
    type: 'text/html',
    body: 'google-site-verification: google15088541c54d2645.html',
  },
}

export default async function handler(req, res) {
  const path = req.url?.split('?')[0]
  if (STATIC_FILES[path]) {
    const file = STATIC_FILES[path]
    res.statusCode = 200
    res.setHeader('Content-Type', file.type)
    res.end(file.body)
    return
  }

  const protocol = req.headers['x-forwarded-proto'] || 'https'
  const host = req.headers['x-forwarded-host'] || req.headers.host
  const url = new URL(req.url, `${protocol}://${host}`)

  const headers = new Headers()
  for (const [key, value] of Object.entries(req.headers)) {
    if (Array.isArray(value)) {
      value.forEach((v) => headers.append(key, v))
    } else if (value !== undefined) {
      headers.set(key, value)
    }
  }

  let body = null
  if (!['GET', 'HEAD'].includes(req.method)) {
    body = await new Promise((resolve, reject) => {
      const chunks = []
      req.on('data', (chunk) => chunks.push(chunk))
      req.on('end', () => resolve(Buffer.concat(chunks)))
      req.on('error', reject)
    })
  }

  const request = new Request(url, { method: req.method, headers, body })
  const response = await server.fetch(request)

  res.statusCode = response.status
  for (const [key, value] of response.headers.entries()) {
    res.setHeader(key, value)
  }

  if (response.body) {
    Readable.fromWeb(response.body).pipe(res)
  } else {
    res.end()
  }
}
