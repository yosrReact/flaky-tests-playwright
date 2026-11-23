# Mini Shop : terrain de jeu pour les flaky tests

[![E2E Playwright](https://github.com/yosrReact/flaky-tests-playwright/actions/workflows/playwright.yml/badge.svg)](https://github.com/yosrReact/flaky-tests-playwright/actions/workflows/playwright.yml)

Petite application React (Vite + TypeScript) qui sert de support à un projet pratique :
reproduire les causes classiques de tests flaky avec Playwright, les observer en CI, puis les corriger.

## Lancer l'app

```bash
npm install
npm run dev
```

Puis ouvrir http://localhost:5180.

Compte de démo : `demo@shop.test` / `demo1234`

## Lancer les tests

```bash
npx playwright install chromium
npm run test:e2e          # toute la suite
npm run test:e2e:ui       # mode UI, pas à pas
npx playwright test --repeat-each=20   # vérifier la stabilité
```

Playwright démarre l'app tout seul (`webServer` dans `playwright.config.ts`).

## Parcours

| Parcours  | Route      | Contenu                                                                |
| --------- | ---------- | ---------------------------------------------------------------------- |
| Connexion | `/login`   | Formulaire email + mot de passe, message d'erreur si identifiants faux |
| Boutique  | `/shop`    | Liste de produits chargée depuis une API externe, ajout au panier      |
| Panier    | `/cart`    | Quantités, suppression, promo week-end, commande                       |
| Contact   | `/contact` | Formulaire avec validation, envoi asynchrone, numéro de ticket         |

Toutes les pages sauf `/login` demandent d'être connecté.

## Pièges intégrés (volontaires)

L'app est écrite normalement, mais elle contient les ingrédients qui rendent les tests fragiles :

| Piège                | Où                                                                                         | Ce qui peut casser un test                                 |
| -------------------- | ------------------------------------------------------------------------------------------ | ---------------------------------------------------------- |
| Latence aléatoire    | `src/api.ts` : connexion (200 à 900 ms), contact (300 à 1200 ms), commande (400 à 1500 ms) | Les attentes fixes (`waitForTimeout`)                      |
| Dépendance à la date | `src/promo.ts` : -10 % le samedi et le dimanche                                            | Un total attendu qui change selon le jour                  |
| API externe réelle   | `src/api.ts` : `https://dummyjson.com/products`                                            | Lenteur, panne ou données qui changent                     |
| Élément éphémère     | `src/pages/ShopPage.tsx` : toast qui disparaît après 1,5 s                                 | Une assertion qui arrive trop tard                         |
| Valeur aléatoire     | Numéro de ticket du contact, numéro de commande                                            | Une assertion sur le texte exact                           |
| État en mémoire      | Session et panier perdus au rechargement                                                   | Des tests qui comptent sur l'état laissé par un autre test |
| Format des prix      | `Intl.NumberFormat('fr-FR')` utilise des espaces insécables                                | Une comparaison de texte avec un espace normal             |

Les quatre premiers sont reproduits et corrigés ci-dessous.

## Flaky tests : reproduire, diagnostiquer, corriger

| #   | Cause                 | Symptôme                                                | Preuve                                                         | Correction                                            | Commit                                                                                                    |
| --- | --------------------- | ------------------------------------------------------- | -------------------------------------------------------------- | ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| 01  | Attente fixe          | Environ 57 % d'échecs, statut « flaky » en CI           | Trace : le bouton affiche encore « Connexion… » à l'assertion  | Assertion web-first (`toHaveURL`)                     | [b7892bd](https://github.com/yosrReact/flaky-tests-playwright/commit/b7892bd8a8b0bca4dca5094bc9f19057a69ef305) |
| 02  | Dépendance à la date  | Passe en semaine, échoue le week-end                    | Horloge réglée sur un samedi avec `page.clock` → 8,99 €        | `page.clock.setFixedTime` + test du cas week-end      | [4b36c3f](https://github.com/yosrReact/flaky-tests-playwright/commit/4b36c3f5ba4853b290a0444cd2dfbe0be76c8fb2) |
| 03  | API externe           | Échoue quand dummyjson est en panne ou que ses données changent | `route.abort()` → message d'erreur à la place des produits | Mock de l'API avec `page.route` dans la fixture       | [58c6a92](https://github.com/yosrReact/flaky-tests-playwright/commit/58c6a92fa42bd1077fcbf5eb8c32164516b21630) |
| 04  | Tests dépendants      | Échoue en parallèle ou quand le test est lancé seul     | Passe avec `--workers=1`, échoue avec `-g "B :"`               | Chaque test prépare son propre état via la fixture    | [6f3bd37](https://github.com/yosrReact/flaky-tests-playwright/commit/6f3bd3740580de210828537018d197eee9167287) |

## Démarche

1. **Détection en CI** : retries, statut « flaky » dans le rapport, avertissement GitHub quand un test est flaky.
2. **Quarantaine avec un ticket** : le test 04 B bloquait la CI, il a été tagué `@quarantine` et exclu du quality gate ([issue #1](https://github.com/yosrReact/flaky-tests-playwright/issues/1), [commit](https://github.com/yosrReact/flaky-tests-playwright/commit/44c3b4bf1cc7ae0e2794dd7117cf646cd809b353)).
3. **Diagnostic avec le trace viewer** : traces récupérées depuis les artefacts GitHub Actions.
4. **Correction**, un commit par cause.
5. **Validation** avec `--repeat-each=20`.
6. **Quality gate durci** avec `--fail-on-flaky-tests` : la CI refuse désormais toute nouvelle flakiness.

## CI

Le workflow [`.github/workflows/playwright.yml`](.github/workflows/playwright.yml) lance à chaque push et pull request :

- la vérification TypeScript ;
- les tests Playwright hors quarantaine, avec échec du job si un test échoue ou s'il est flaky ;
- les tests en quarantaine, sans bloquer le job ;
- l'envoi du rapport HTML et des traces en artefact.
