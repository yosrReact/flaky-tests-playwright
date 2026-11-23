import { test, expect } from "@playwright/test";

test.describe("Connexion", () => {
  test("un utilisateur valide arrive sur la boutique", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("demo@shop.test");
    await page.getByLabel("Mot de passe").fill("demo1234");
    await page.getByRole("button", { name: "Se connecter" }).click();
    await expect(page).toHaveURL("/shop");
    await expect(page.getByRole("heading", { name: "Boutique" })).toBeVisible();
  });

  test("un mauvais mot de passe affiche une erreur", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("demo@shop.test");
    await page.getByLabel("Mot de passe").fill("mauvais");
    await page.getByRole("button", { name: "Se connecter" }).click();

    await expect(page.getByRole("alert")).toHaveText(
      "Email ou mot de passe incorrect",
    );
    await expect(page).toHaveURL("/login");
  });
});
