import React from 'react'
import { useCart } from '../context/CartContext'
import axios from 'axios'
import { useUser } from '@clerk/clerk-react'

const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'

export default function Cart(){
  const { items, remove, updateQty, clear } = useCart()
  const { user } = useUser()

  const total = items.reduce((s,i)=> s + (Number(i.price)||0) * i.qty, 0)

  const checkout = async ()=>{
    if(!user){
      alert('Please sign in before checkout')
      window.location.href = '/sign-in'
      return
    }
    try{
      const res = await axios.post(`${backend}/api/checkout`, { items, successUrl: window.location.origin, cancelUrl: window.location.origin })
      if(res.data?.paymentUrl) window.location.href = res.data.paymentUrl
    }catch(err){
      console.error('Checkout failed', err?.response?.data || err.message)
      alert('Checkout failed, try again later')
    }
  }

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl mb-4">Your Cart</h2>
      {items.length===0 && <div>Your cart is empty</div>}
      {items.map(i=> (
        <div key={i.id} className="flex items-center gap-4 p-4 border-b">
          <div className="flex-1">
            <div className="font-semibold">{i.name}</div>
            <div className="text-sm text-gray-300">${i.price}</div>
          </div>
          <div>
            <input type="number" value={i.qty} onChange={e=> updateQty(i.id, Math.max(1, Number(e.target.value)||1))} className="w-20 p-1 rounded bg-gray-900" />
          </div>
          <div>
            <button onClick={()=> remove(i.id)} className="text-red-500">Remove</button>
          </div>
        </div>
      ))}

      <div className="mt-6 text-right">
        <div className="text-lg">Total: ${total.toFixed(2)}</div>
        <div className="mt-3 flex justify-end gap-3">
          <button onClick={clear} className="px-4 py-2 bg-gray-700 rounded">Clear</button>
          <button onClick={checkout} className="px-4 py-2 bg-emerald-500 rounded">Checkout</button>
        </div>
      </div>
    </main>
  )
}
