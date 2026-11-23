import { test, expect, type Page } from "@playwright/test";

let page: Page;
// We don't use the loggedInPage fixture here: it gives each test a fresh page,
// which is exactly the isolation we want to break.
test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  await page.goto("/login");
  await page.getByLabel("Email").fill("demo@shop.test");
  await page.getByLabel("Mot de passe").fill("demo1234");
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page).toHaveURL("/shop");
});

test("A : ajouter le mascara au panier", async () => {
  await page
    .getByRole("button", {
      name: "Ajouter Essence Mascara Lash Princess au panier",
    })
    .click();
  await expect(page.getByRole("link", { name: /Panier/ })).toContainText("1");
});

test("B : le panier contient le mascara", async () => {
  await page.getByRole("link", { name: /Panier/ }).click();
  await expect(
    page.getByRole("cell", {
      name: "Essence Mascara Lash Princess",
      exact: true,
    }),
  ).toBeVisible();
});

test.afterAll(async () => {
  await page.close();
});
