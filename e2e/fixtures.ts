import { test as base, expect, type Page } from "@playwright/test";

type Fixtures = {
  loggedInPage: Page;
};
export const MOCK_PRODUCTS = [
  { id: 1, title: "Essence Mascara Lash Princess", price: 9.99, thumbnail: "" },
  { id: 2, title: "Red Lipstick", price: 12.99, thumbnail: "" },
];

export const test = base.extend<Fixtures>({
  loggedInPage: async ({ page }, use) => {
    await page.route("**/dummyjson.com/products**", (route) =>
      route.fulfill({ json: { products: MOCK_PRODUCTS } }),
    );

    await page.goto("/login");
    await page.getByLabel("Email").fill("demo@shop.test");
    await page.getByLabel("Mot de passe").fill("demo1234");
    await page.getByRole("button", { name: "Se connecter" }).click();
    await expect(page).toHaveURL("/shop");

    await use(page);
  },
});

export { expect };
