import { useEffect, useState } from 'react';
import { fetchProducts, type Product } from '../api';
import { useCart } from '../cart';
import { formatPrice } from '../promo';

type State =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; products: Product[] };

export function ShopPage() {
  const { add } = useCart();
  const [state, setState] = useState<State>({ status: 'loading' });
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchProducts()
      .then((products) => !cancelled && setState({ status: 'success', products }))
      .catch((err: unknown) => {
        if (!cancelled) {
          setState({ status: 'error', message: err instanceof Error ? err.message : 'Erreur inconnue' });
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Le toast disparaît tout seul après 1,5 s.
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 1500);
    return () => clearTimeout(id);
  }, [toast]);

  function handleAdd(product: Product) {
    add(product);
    setToast(`${product.title} ajouté au panier`);
  }

  return (
    <section>
      <h1>Boutique</h1>

      {state.status === 'loading' && <p aria-busy="true">Chargement des produits…</p>}

      {state.status === 'error' && (
        <p role="alert" className="error">
          Impossible de charger les produits : {state.message}
        </p>
      )}

      {state.status === 'success' && (
        <ul className="grid" aria-label="Produits">
          {state.products.map((product) => (
            <li key={product.id} className="card product">
              <img src={product.thumbnail} alt="" width={120} height={120} loading="lazy" />
              <h2>{product.title}</h2>
              <p className="price">{formatPrice(product.price)}</p>
              <button type="button" onClick={() => handleAdd(product)} aria-label={`Ajouter ${product.title} au panier`}>
                Ajouter au panier
              </button>
            </li>
          ))}
        </ul>
      )}

      {toast && (
        <div role="status" className="toast">
          {toast}
        </div>
      )}
    </section>
  );
}
