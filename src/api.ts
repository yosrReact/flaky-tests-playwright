// Faux backend : chaque appel a une latence aléatoire, comme un vrai réseau.

export const DEMO_USER = {
  email: 'demo@shop.test',
  password: 'demo1234',
  name: 'Démo',
};

function randomDelay(minMs: number, maxMs: number): Promise<void> {
  const ms = minMs + Math.random() * (maxMs - minMs);
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export type User = { email: string; name: string };

export async function login(email: string, password: string): Promise<User> {
  await randomDelay(200, 900);
  if (email.trim().toLowerCase() === DEMO_USER.email && password === DEMO_USER.password) {
    return { email: DEMO_USER.email, name: DEMO_USER.name };
  }
  throw new Error('Email ou mot de passe incorrect');
}

export type ContactPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export async function sendContactMessage(_payload: ContactPayload): Promise<{ ticket: string }> {
  await randomDelay(300, 1200);
  return { ticket: `T-${Math.floor(1000 + Math.random() * 9000)}` };
}

export type Product = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
};

// API externe réelle : volontairement non maîtrisée par l'app.
export const PRODUCTS_URL = 'https://dummyjson.com/products?limit=8&select=title,price,thumbnail';

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(PRODUCTS_URL);
  if (!res.ok) {
    throw new Error(`Erreur API (${res.status})`);
  }
  const data = (await res.json()) as { products: Product[] };
  return data.products;
}

export async function placeOrder(): Promise<{ orderId: string }> {
  await randomDelay(400, 1500);
  return { orderId: `CMD-${Date.now().toString().slice(-6)}` };
}
