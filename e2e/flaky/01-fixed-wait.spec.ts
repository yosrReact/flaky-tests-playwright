import { test, expect } from "@playwright/test";

test.describe("Connexion", () => {
  test("un utilisateur valide arrive sur la boutique", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("demo@shop.test");
    await page.getByLabel("Mot de passe").fill("demo1234");
    await page.getByRole("button", { name: "Se connecter" }).click();
    await page.waitForTimeout(500);
    expect(page.url()).toContain("/shop");
    await expect(page.getByRole("heading", { name: "Boutique" })).toBeVisible();
  });
});
