import { Link } from 'react-router-dom'
export default function Home(){
  return (
    <main>
      <section className="hero">
        <h1>✨ 224 — Today · Tomorrow · Forever ✨</h1>
        <p className="mx-auto max-w-2xl">Premium streetwear with cosmic vibes. Limited drops. Fast worldwide shipping.</p>
        <div style={{marginTop:28}}>
          <Link to="/shop" className="btn">Explore Shop</Link>
        </div>
      </section>

      <section className="section-cards">
        <Link to="/new" className="card"><h3>New Arrivals</h3><p>Fresh drops curated for today.</p></Link>
        <Link to="/top" className="card"><h3>Top Sellers</h3><p>Most-loved pieces by customers.</p></Link>
        <Link to="/shop" className="card"><h3>Shop All</h3><p>Browse full catalog.</p></Link>
        <Link to="/deals" className="card"><h3>Exclusive Deals</h3><p>Limited-time offers.</p></Link>
        <Link to="/custom" className="card"><h3>Custom Orders</h3><p>Create your own design.</p></Link>
        <Link to="/admin-login" className="card"><h3>Admin Panel</h3><p>Sign in to manage store.</p></Link>
      </section>

      <footer className="footer">© 224 Today · Tomorrow · Forever</footer>
    </main>
  )
}
