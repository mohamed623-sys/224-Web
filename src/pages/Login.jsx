import React from 'react'

export default function Login(){
  return (
    <main className="p-8 max-w-md mx-auto text-center">
      <h2 className="text-2xl mb-4">Sign in</h2>
      <p className="mb-4">This app uses Clerk for authentication. Click the button below to open the Clerk sign-in page.</p>
      <a href="/sign-in" className="inline-block px-6 py-3 bg-emerald-500 rounded font-semibold">Open Clerk Sign In</a>
    </main>
  )
}
