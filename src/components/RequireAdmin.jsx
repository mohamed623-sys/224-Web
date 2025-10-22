import { Navigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'

export default function RequireAdmin({ children }){
  const { user } = useUser()
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL
  const email = user?.primaryEmailAddress?.emailAddress || user?.email
  if(!email || email !== adminEmail) return <Navigate to="/admin-login" replace />
  return children
}
