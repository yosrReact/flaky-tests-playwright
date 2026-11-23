import { test as base, expect, type Page } from "@playwright/test";

type Fixtures = {
  loggedInPage: Page;
};

export const test = base.extend<Fixtures>({
  loggedInPage: async ({ page }, use) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("demo@shop.test");
    await page.getByLabel("Mot de passe").fill("demo1234");
    await page.getByRole("button", { name: "Se connecter" }).click();
    await expect(page).toHaveURL("/shop");

    await use(page);
  },
});

export { expect };
