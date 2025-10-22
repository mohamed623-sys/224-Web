import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase'

export default function Shop(){
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { add } = useCart()

  useEffect(()=>{
    setLoading(true)
    getDocs(collection(db,'products')).then(snap=>{
      setProducts(snap.docs.map(d=> ({ id: d.id, ...d.data() })))
    }).catch(e=> setError(e.message || 'Failed to load')).finally(()=> setLoading(false))
  },[])

  return (
    <main className="p-8">
      <h2 className="text-3xl mb-4">Shop</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-400">Error: {error}</div>}
      <div className="section-cards">
        {products.map(p=>(
          <div key={p.id} className="card">
            {p.image && <img src={p.image} alt={p.name} style={{width:'100%', borderRadius:8, height:160, objectFit:'cover'}} />}
            <h3 className="mt-3 font-semibold">{p.name}</h3>
            <p className="text-cyan-200">${p.price}</p>
            <div style={{marginTop:8}} className="flex gap-2">
              <Link to={`/product/${p.id}`} className="btn">View</Link>
              <button onClick={()=>{ const product = { id: p.id, name: p.name, price: p.price }; add(product) }} className="btn bg-emerald-500">Add to cart</button>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
