import { Readable } from 'node:stream'
import Stripe from 'stripe'
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

  if (path === '/api/redeploy' && req.method === 'POST') {
    const token = process.env.VERCEL_TOKEN
    const projectId = 'prj_Dx5spDJuRE3RPK15U7pQxuaWuJe4'
    const teamId = 'team_JI6HIEdbLnS8IuGNROlhcMhz'
    if (!token) {
      res.statusCode = 500
      res.end(JSON.stringify({ error: 'VERCEL_TOKEN no configurado' }))
      return
    }
    const deploymentsRes = await fetch(
      `https://api.vercel.com/v6/deployments?projectId=${projectId}&teamId=${teamId}&target=production&limit=1`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    const { deployments } = await deploymentsRes.json()
    if (!deployments?.length) {
      res.statusCode = 500
      res.end(JSON.stringify({ error: 'No se encontró despliegue previo' }))
      return
    }
    const redeployRes = await fetch(
      `https://api.vercel.com/v13/deployments/${deployments[0].uid}/redeploy?teamId=${teamId}`,
      { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: '{}' }
    )
    const result = await redeployRes.json()
    res.statusCode = redeployRes.ok ? 200 : 500
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ ok: redeployRes.ok, url: result.url }))
    return
  }

  if (path === '/api/create-checkout-session' && req.method === 'POST') {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    const bodyBuffer = await new Promise((resolve, reject) => {
      const chunks = []
      req.on('data', chunk => chunks.push(chunk))
      req.on('end', () => resolve(Buffer.concat(chunks)))
      req.on('error', reject)
    })
    const { items, customer } = JSON.parse(bodyBuffer.toString())
    const protocol = req.headers['x-forwarded-proto'] || 'https'
    const host = req.headers['x-forwarded-host'] || req.headers.host
    const origin = `${protocol}://${host}`
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      automatic_payment_methods: { enabled: true },
      line_items: items.map(item => ({
        price_data: {
          currency: 'eur',
          product_data: { name: `${item.name} (${item.unit})` },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.qty,
      })),
      customer_email: customer.email || undefined,
      metadata: {
        name: customer.name,
        phone: customer.phone,
        address: customer.address,
        zone: customer.zone,
        slot: customer.slot,
        notes: (customer.notes || '').slice(0, 500),
      },
      payment_intent_data: {
        description: `Pedido Lya Market — ${customer.name} — ${customer.phone}`,
      },
      success_url: `${origin}/pago-exitoso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout`,
    })
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ url: session.url }))
    return
  }

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
