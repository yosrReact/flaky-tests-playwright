import { useState } from 'react';
import { Link } from 'react-router-dom';
import { placeOrder } from '../api';
import { useCart } from '../cart';
import { computeTotals, formatPrice, isWeekend } from '../promo';

export function CartPage() {
  const { items, subtotal, increment, decrement, remove, clear } = useCart();
  const [ordering, setOrdering] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  if (orderId) {
    return (
      <section className="card narrow">
        <h1>Merci !</h1>
        <p role="status">Commande confirmée : {orderId}</p>
        <Link to="/shop">Retour à la boutique</Link>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="card narrow">
        <h1>Panier</h1>
        <p>Votre panier est vide.</p>
        <Link to="/shop">Voir les produits</Link>
      </section>
    );
  }

  const totals = computeTotals(subtotal);

  async function handleOrder() {
    setOrdering(true);
    const { orderId: id } = await placeOrder();
    setOrderId(id);
    clear();
  }

  return (
    <section className="card">
      <h1>Panier</h1>

      {isWeekend(new Date()) && <p className="promo">Promo week-end : -10 % sur tout le panier</p>}

      <table className="cart-table">
        <thead>
          <tr>
            <th scope="col">Produit</th>
            <th scope="col">Prix</th>
            <th scope="col">Quantité</th>
            <th scope="col">Total</th>
            <th scope="col"><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody>
          {items.map(({ product, quantity }) => (
            <tr key={product.id}>
              <td>{product.title}</td>
              <td>{formatPrice(product.price)}</td>
              <td className="qty">
                <button type="button" onClick={() => decrement(product.id)} aria-label={`Retirer un ${product.title}`}>
                  −
                </button>
                <span aria-label={`Quantité de ${product.title}`}>{quantity}</span>
                <button type="button" onClick={() => increment(product.id)} aria-label={`Ajouter un ${product.title}`}>
                  +
                </button>
              </td>
              <td>{formatPrice(product.price * quantity)}</td>
              <td>
                <button type="button" className="link-button" onClick={() => remove(product.id)}>
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <dl className="totals">
        <dt>Sous-total</dt>
        <dd>{formatPrice(totals.subtotal)}</dd>
        {totals.discount > 0 && (
          <>
            <dt>Remise week-end</dt>
            <dd>−{formatPrice(totals.discount)}</dd>
          </>
        )}
        <dt>Total</dt>
        <dd data-testid="cart-total">{formatPrice(totals.total)}</dd>
      </dl>

      <button type="button" onClick={handleOrder} disabled={ordering}>
        {ordering ? 'Commande en cours…' : 'Commander'}
      </button>
    </section>
  );
}
