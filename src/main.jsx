import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { CartProvider } from './context/CartContext'
import { ClerkProvider } from '@clerk/clerk-react'
import './styles.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
        <CartProvider>
          <App />
        </CartProvider>
      </ClerkProvider>
    </BrowserRouter>
  </React.StrictMode>
)
