# Mini Shop : terrain de jeu pour les flaky tests

Petite application React (Vite + TypeScript) qui sert de support à un projet pratique :
reproduire les causes classiques de tests flaky avec Playwright, les observer en CI, puis les corriger.

## Lancer l'app

```bash
npm install
npm run dev
```

Puis ouvrir http://localhost:5180.

Compte de démo : `demo@shop.test` / `demo1234`

## Parcours

| Parcours | Route | Contenu |
|---|---|---|
| Connexion | `/login` | Formulaire email + mot de passe, message d'erreur si identifiants faux |
| Boutique | `/shop` | Liste de produits chargée depuis une API externe, ajout au panier |
| Panier | `/cart` | Quantités, suppression, promo week-end, commande |
| Contact | `/contact` | Formulaire avec validation, envoi asynchrone, numéro de ticket |

Toutes les pages sauf `/login` demandent d'être connecté.

## Pièges intégrés (volontaires)

L'app est écrite normalement, mais elle contient les ingrédients qui rendent les tests fragiles :

| Piège | Où | Ce qui peut casser un test |
|---|---|---|
| Latence aléatoire | `src/api.ts` : connexion (200 à 900 ms), contact (300 à 1200 ms), commande (400 à 1500 ms) | Les attentes fixes (`waitForTimeout`) |
| Dépendance à la date | `src/promo.ts` : -10 % le samedi et le dimanche | Un total attendu qui change selon le jour |
| API externe réelle | `src/api.ts` : `https://dummyjson.com/products` | Lenteur, panne ou données qui changent |
| Élément éphémère | `src/pages/ShopPage.tsx` : toast qui disparaît après 1,5 s | Une assertion qui arrive trop tard |
| Valeur aléatoire | Numéro de ticket du contact, numéro de commande | Une assertion sur le texte exact |
| État en mémoire | Session et panier perdus au rechargement | Des tests qui comptent sur l'état laissé par un autre test |
| Format des prix | `Intl.NumberFormat('fr-FR')` utilise des espaces insécables | Une comparaison de texte avec un espace normal |
