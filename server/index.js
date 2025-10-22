require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { nanoid } = require('nanoid')
const axios = require('axios')
const fs = require('fs')
const path = require('path')

const app = express()
app.use(cors())
app.use(express.json())

const PRODUCTS_FILE = path.resolve(__dirname, 'products.json')

function loadProducts(){
  try{
    const raw = fs.readFileSync(PRODUCTS_FILE, 'utf8')
    return JSON.parse(raw || '[]')
  }catch(e){
    // initialize with a sample product
    const initial = [{ id: 'p1', name: 'Sample Shirt', price: 29.99, description: 'A comfy sample shirt', image: '' }]
    try{ fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(initial, null, 2)) }catch(_){}
    return initial
  }
}

function saveProducts(list){
  try{ fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(list, null, 2)) }catch(e){ console.error('Failed to save products', e) }
}

let products = loadProducts()

app.get('/api/products', (req, res) => {
  products = loadProducts()
  res.json(products)
})

app.post('/api/products', (req, res) => {
  const p = { id: nanoid(), ...req.body }
  products = loadProducts()
  products.push(p)
  saveProducts(products)
  res.json(p)
})

app.put('/api/products/:id', (req, res) => {
  const { id } = req.params
  products = loadProducts().map(p => p.id === id ? { ...p, ...req.body } : p)
  saveProducts(products)
  res.json({ ok: true })
})

app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params
  products = loadProducts().filter(p => p.id !== id)
  saveProducts(products)
  res.json({ ok: true })
})

// simple mock checkout - returns a fake payment URL
app.post('/api/checkout', (req, res) => {
  const { items, successUrl, cancelUrl } = req.body
  // If configured, forward to Paymob flow on the server (USE_PAYMOB=true)
  const usePaymob = process.env.USE_PAYMOB === 'true' || false
  if(usePaymob){
    // proxy to internal Paymob endpoint
    ;(async ()=>{
      try{
        const resp = await axios.post(`http://localhost:${process.env.PORT||4000}/api/paymob/checkout`, { items, userEmail: req.body.userEmail })
        return res.json(resp.data)
      }catch(e){
        console.error('Proxy to paymob failed', e?.response?.data || e.message)
        return res.status(500).json({ error: 'Paymob proxy failed', details: e?.response?.data || e.message })
      }
    })()
    return
  }
  // fallback: local mock payment URL
  const sessionId = nanoid()
  const paymentUrl = `${successUrl || 'http://localhost:5173'}/?payment_session=${sessionId}`
  res.json({ paymentUrl })
})

// Placeholder Paymob checkout endpoint - returns an iframe-like URL
app.post('/api/paymob/checkout', (req, res) => {
  const { items, userEmail } = req.body
  // Real Paymob flow requires server-side auth and multiple requests. Here we return a simulated iframe URL.
  ;(async ()=>{
    try{
      // prefer server-side env var names (do NOT put secret keys in client VITE_ vars for production)
  // Read only server-side Paymob environment variables. Do NOT fall back to client-exposed VITE_ variables.
  const PAYMOB_API_KEY = process.env.PAYMOB_API_KEY
  const PAYMOB_INTEGRATION_ID = process.env.PAYMOB_INTEGRATION_ID
  const PAYMOB_IFRAME_ID = process.env.PAYMOB_IFRAME_ID
  console.info('Using Paymob integration id:', PAYMOB_INTEGRATION_ID ? '(provided)' : '(missing)')
  if(!PAYMOB_API_KEY) return res.status(500).json({ error: 'Paymob key not configured on server (set PAYMOB_API_KEY env var on the server)' })

      // Step 1: get auth token
      let authRes
      try{
        authRes = await axios.post('https://accept.paymob.com/api/auth/tokens', { api_key: PAYMOB_API_KEY })
      }catch(e){
        console.error('Paymob auth failed:', e?.response?.data || e.message)
        return res.status(500).json({ error: 'Paymob auth failed', details: e?.response?.data || e.message })
      }
      const token = authRes.data.token

      // Step 2: create order
      const total = items.reduce((s,i)=> s + (Number(i.price)||0) * (i.qty||1), 0)
      const orderRes = await axios.post('https://accept.paymob.com/api/ecommerce/orders', { amount_cents: Math.round(total*100), currency: 'EGP', items: items.map(it=>({name:it.name, amount_cents: Math.round((Number(it.price)||0)*100), quantity: it.qty||1})) }, { headers:{ Authorization: `Bearer ${token}` } })
      const orderId = orderRes.data.id

      // Step 3: request payment key (integration id from env)
      const integration_id = PAYMOB_INTEGRATION_ID
      if(!integration_id) return res.status(500).json({ error: 'Paymob integration id not configured on server (set PAYMOB_INTEGRATION_ID env var)' })
      let paymentKeyRes
      try{
        paymentKeyRes = await axios.post('https://accept.paymob.com/api/acceptance/payment_keys', {
          amount_cents: Math.round(total*100), expiration: 3600, order_id: orderId, billing_data: { email: userEmail || '' }, integration_id: integration_id
        }, { headers:{ Authorization: `Bearer ${token}` } })
      }catch(e){
        console.error('Paymob payment key request failed:', e?.response?.data || e.message)
        return res.status(500).json({ error: 'Paymob payment key request failed', details: e?.response?.data || e.message })
      }

      const paymentKey = paymentKeyRes.data.token
      // construct iframe URL
      const iframeId = PAYMOB_IFRAME_ID
      if(!iframeId) return res.status(500).json({ error: 'Paymob iframe id missing on server (set PAYMOB_IFRAME_ID env var)' })
      const iframeUrl = `https://accept.paymobsolutions.com/api/acceptance/iframes/${iframeId}?payment_token=${paymentKey}`
      res.json({ iframeUrl })
    }catch(err){
      console.error('Paymob checkout error', err?.response?.data || err.message || err)
      res.status(500).json({ error: 'Paymob integration failed', details: err?.response?.data || err.message })
    }
  })()
})

const port = process.env.PORT || 4000
app.listen(port, ()=> console.log('Mock API listening on', port))
