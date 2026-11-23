import { test, expect } from "@playwright/test";

test.describe("Flaky 03 : API externe", () => {
  test("la boutique affiche les produits du catalogue", async ({ page }) => {
    // await page.route("**/dummyjson.com/**", (route) => route.abort());
    await page.goto("/login");
    await page.getByLabel("Email").fill("demo@shop.test");
    await page.getByLabel("Mot de passe").fill("demo1234");
    await page.getByRole("button", { name: "Se connecter" }).click();
    await expect(page).toHaveURL("/shop");
    await expect(page.getByRole("listitem")).toHaveCount(8);
    await expect(page.getByRole("heading", { level: 2 }).first()).toHaveText(
      "Essence Mascara Lash Princess",
    );
  });
});
