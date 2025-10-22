// src/pages/AdminPanel.jsx
import { useEffect, useState } from "react";
import { useUser, useClerk } from '@clerk/clerk-react'
import axios from 'axios'

export default function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const { user } = useUser()
  const clerk = useClerk()

  useEffect(() => { fetchProducts() }, [])

  const fetchProducts = async ()=>{
    try{
      const res = await axios.get('/api/products')
      setProducts(res.data || [])
    }catch(e){ console.error('Failed to fetch products', e?.response?.data || e.message) }
  }

  const addProduct = async (e) => {
    e.preventDefault();
    // if no image was provided, use an Unsplash source photo by query
    const payload = { ...form }
    if (!payload.image || payload.image.trim() === ''){
      const query = encodeURIComponent(payload.name || 'product')
      payload.image = `https://source.unsplash.com/featured/?${query}`
    }
    try{
      if(editingId){
        await axios.put(`/api/products/${editingId}`, payload)
        setEditingId(null)
      }else{
        await axios.post('/api/products', payload)
      }
      setForm({ name: "", price: "", description: "" })
      fetchProducts()
    }catch(e){ console.error('Failed to save product', e?.response?.data || e.message) }
  }

  const deleteProduct = async (id) => {
    try{ await axios.delete(`/api/products/${id}`); fetchProducts() }catch(e){ console.error('Failed delete', e) }
  }

  const startEdit = (p) => {
    setEditingId(p.id);
    setForm({ name: p.name || '', price: p.price || '', description: p.description || '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ name: "", price: "", description: "" });
  }

  const logout = async () => {
    try{ await clerk.signOut() }catch{}
    window.location.href = '/';
  }
  return (
    <div className="min-h-screen bg-[url('/assets/galaxy-bg.jpg')] bg-cover bg-center text-white p-10">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Admin Panel – Manage 224 Products
      </h1>

      <form
        onSubmit={addProduct}
        className="bg-black/60 p-6 rounded-xl flex flex-col gap-3 max-w-md mx-auto mb-8"
      >
        <input
          type="text"
          placeholder="Product Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="p-3 bg-gray-800 rounded-lg text-white"
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="p-3 bg-gray-800 rounded-lg text-white"
          required
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="p-3 bg-gray-800 rounded-lg text-white"
        />
        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-800 py-3 rounded-lg font-semibold"
        >
          {editingId ? 'Update Product' : 'Add Product'}
        </button>
      </form>
      {editingId && (
        <div className="max-w-md mx-auto mb-6 text-center">
          <button onClick={cancelEdit} className="text-sm text-gray-300 underline">Cancel edit</button>
        </div>
      )}

      <div className="max-w-md mx-auto mb-6 text-right">
        <button onClick={logout} className="bg-red-600 hover:bg-red-800 text-white px-4 py-2 rounded">Logout</button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {products.map((p) => (
          <div key={p.id} className="card">
            {p.image && <img src={p.image} alt={p.name} />}
            <div className="meta">
              <div>
                <h2 className="text-xl font-semibold">{p.name}</h2>
                <div className="text-gray-300">${p.price}</div>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => startEdit(p)} className="px-3 py-1 bg-yellow-500 rounded">Edit</button>
                <button onClick={() => deleteProduct(p.id)} className="px-3 py-1 bg-red-600 rounded">Delete</button>
              </div>
            </div>
            <p className="text-sm mt-2">{p.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
