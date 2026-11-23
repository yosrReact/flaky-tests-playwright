import { test, expect } from "@playwright/test";

test.describe("Flaky 02 : dépendance à la date", () => {
  test("le total du panier est égal au prix du produit", async ({ page }) => {
    // await page.clock.setFixedTime(new Date("2026-11-28T10:00:00"));
    await page.goto("/login");
    await page.getByLabel("Email").fill("demo@shop.test");
    await page.getByLabel("Mot de passe").fill("demo1234");
    await page.getByRole("button", { name: "Se connecter" }).click();
    await expect(page).toHaveURL("/shop");
    await page
      .getByRole("button", {
        name: "Ajouter Essence Mascara Lash Princess au panier",
      })
      .click();
    await page.getByRole("link", { name: /Panier/ }).click();
    await expect(page.getByTestId("cart-total")).toHaveText("9,99 €");
  });
});
