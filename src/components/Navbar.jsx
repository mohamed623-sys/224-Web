import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { SignIn, SignOutButton, useUser } from '@clerk/clerk-react'

export default function Navbar(){
  const { items } = useCart()
  const { user } = useUser()
  const count = items.reduce((s,i)=> s + (i.qty||0), 0)
  return (
    <header className="header">
      <div className="brand">224 — Today · Tomorrow · Forever</div>
      <nav className="navlinks">
        <Link to="/">Home</Link>
        <Link to="/shop">Shop</Link>
        <Link to="/new">New</Link>
        <Link to="/top">Top</Link>
        <Link to="/deals">Deals</Link>
        <Link to="/custom">Custom</Link>
        <Link to="/cart" className="ml-2">Cart {count>0 && `(${count})`}</Link>
  <Link to="/admin-login" className="ml-4 text-red-400">Admin</Link>
  {user ? <div className="ml-2"><SignOutButton><button className="px-3 py-1 bg-gray-700 rounded">Sign out</button></SignOutButton></div> : <div className="ml-2"><Link to="/login" className="px-3 py-1 bg-blue-600 rounded">Sign in</Link></div>}
      </nav>
    </header>
  )
}
