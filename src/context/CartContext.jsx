import React, { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }){
  const [items, setItems] = useState(()=>{
    try{ return JSON.parse(localStorage.getItem('cart')||'[]') }catch{ return [] }
  })

  useEffect(()=>{
    localStorage.setItem('cart', JSON.stringify(items))
  },[items])

  const add = (product, qty=1)=>{
    setItems(prev=>{
      const existing = prev.find(p=>p.id===product.id)
      if(existing) return prev.map(p=> p.id===product.id ? {...p, qty: p.qty + qty} : p)
      return [...prev, {...product, qty}]
    })
  }
  const remove = (id)=> setItems(prev=> prev.filter(p=>p.id!==id))
  const updateQty = (id, qty)=> setItems(prev=> prev.map(p=> p.id===id ? {...p, qty} : p))
  const clear = ()=> setItems([])

  return <CartContext.Provider value={{ items, add, remove, updateQty, clear }}>{children}</CartContext.Provider>
}

export const useCart = ()=> useContext(CartContext)
