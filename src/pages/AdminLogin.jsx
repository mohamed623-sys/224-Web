// src/pages/AdminLogin.jsx
import { useUser } from '@clerk/clerk-react'
import { Navigate } from 'react-router-dom'

export default function AdminLogin(){
  const { user } = useUser()
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL
  // If already signed in and is admin, redirect
  if(user && (user.primaryEmailAddress?.emailAddress === adminEmail || user.email === adminEmail)){
    return <Navigate to="/admin" replace />
  }
  // Otherwise instruct to sign in with Clerk
  return (
    <div className="min-h-screen bg-[url('/assets/galaxy-bg.jpg')] bg-cover bg-center flex items-center justify-center text-white">
      <div className="bg-black/70 p-10 rounded-2xl shadow-lg w-[480px] text-center">
        <h1 className="text-3xl font-bold mb-6">Admin Login</h1>
        <p className="mb-4">Please sign in using the Clerk sign-in page. Use the admin email configured in the environment.</p>
        <a className="inline-block px-6 py-3 bg-purple-600 rounded font-semibold" href="/sign-in">Open Clerk Sign In</a>
      </div>
    </div>
  )
}
