import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { useCart } from '../context/CartContext'
import { useUser } from '@clerk/clerk-react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'

const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'

export default function ProductDetails(){
  const { id } = useParams()
  const [p,setP]=useState(null)
  const [loading,setLoading]=useState(true)

  useEffect(()=>{
    setLoading(true)
    (async ()=>{
      try{
        const d = await getDoc(doc(db, 'products', id))
        setP(d.exists() ? { id: d.id, ...d.data() } : null)
      }catch(e){ console.error(e) }
      setLoading(false)
    })()
  },[id])

  if(loading) return <div className="p-8">Loading...</div>
  if(!p) return <div className="p-8">Product not found</div>
  const { add } = useCart()
  const { user } = useUser()

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <div className="grid md:grid-cols-2 gap-6">
        {p.image && <img src={p.image} alt={p.name} style={{width:'100%', borderRadius:12}} />}
        <div>
          <h1 className="text-2xl font-bold">{p.name}</h1>
          <p className="mt-3">{p.description}</p>
          <p className="mt-3 text-cyan-300">${p.price}</p>
          <div className="mt-6 flex gap-3">
            <button onClick={()=> add({ id: p.id, name: p.name, price: p.price })} className="bg-emerald-600 px-4 py-2 rounded text-black font-semibold">Add to Cart</button>
            <button onClick={async ()=>{
              if(!user){ alert('Please sign in first'); window.location.href = '/sign-in'; return }
              // use the server's /api/checkout mock which returns a paymentUrl
              try{
                const res = await axios.post(`${backend}/api/checkout`, { items: [{ id: p.id, price: p.price, qty: 1 }], successUrl: window.location.origin, cancelUrl: window.location.origin })
                if(res.data?.paymentUrl) window.location.href = res.data.paymentUrl
              }catch(err){
                console.error('Checkout failed', err?.response?.data || err.message)
                alert('Checkout failed, try again later')
              }
            }} className="bg-emerald-500 px-4 py-2 rounded text-black font-semibold">Buy Now</button>
          </div>
        </div>
      </div>
    </main>
  )
}
