import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetails from './pages/ProductDetails'
import NewArrivals from './pages/NewArrivals'
import TopSellers from './pages/TopSellers'
import Deals from './pages/Deals'
import CustomOrders from './pages/CustomOrders'
import AdminLogin from './pages/AdminLogin'
import AdminPanel from './pages/AdminPanel'
import Cart from './pages/Cart'
import Login from './pages/Login'
import RequireAdmin from './components/RequireAdmin'

export default function App(){
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="bg-galaxy absolute inset-0 opacity-40"></div>
        <div className="stars absolute inset-0"></div>
        {/* animated planets */}
        <div className="planet p1" aria-hidden="true"></div>
        <div className="planet p2" aria-hidden="true"></div>
        <div className="planet p3" aria-hidden="true"></div>
      </div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/shop" element={<Shop/>} />
        <Route path="/product/:id" element={<ProductDetails/>} />
        <Route path="/new" element={<NewArrivals/>} />
        <Route path="/top" element={<TopSellers/>} />
        <Route path="/deals" element={<Deals/>} />
  <Route path="/custom" element={<CustomOrders/>} />
  <Route path="/cart" element={<Cart/>} />
  <Route path="/login" element={<Login/>} />
        <Route path="/admin-login" element={<AdminLogin/>} />
  <Route path="/admin" element={<RequireAdmin><AdminPanel/></RequireAdmin>} />
      </Routes>
    </div>
  )
}
