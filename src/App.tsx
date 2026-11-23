import { BrowserRouter, Navigate, NavLink, Outlet, Route, Routes } from 'react-router-dom';
import { AuthProvider, RequireAuth, useAuth } from './auth';
import { CartProvider, useCart } from './cart';
import { LoginPage } from './pages/LoginPage';
import { ShopPage } from './pages/ShopPage';
import { CartPage } from './pages/CartPage';
import { ContactPage } from './pages/ContactPage';

function Layout() {
  const { user, signOut } = useAuth();
  const { count } = useCart();

  return (
    <>
      <header className="header">
        <span className="brand">Mini Shop</span>
        {user && (
          <nav aria-label="Navigation principale">
            <NavLink to="/shop">Boutique</NavLink>
            <NavLink to="/cart">
              Panier <span className="badge" aria-label={`${count} article(s)`}>{count}</span>
            </NavLink>
            <NavLink to="/contact">Contact</NavLink>
            <button type="button" className="link-button" onClick={signOut}>
              Déconnexion
            </button>
          </nav>
        )}
      </header>
      <main className="main">
        <Outlet />
      </main>
    </>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/shop" element={<RequireAuth><ShopPage /></RequireAuth>} />
              <Route path="/cart" element={<RequireAuth><CartPage /></RequireAuth>} />
              <Route path="/contact" element={<RequireAuth><ContactPage /></RequireAuth>} />
              <Route path="*" element={<Navigate to="/shop" replace />} />
            </Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
