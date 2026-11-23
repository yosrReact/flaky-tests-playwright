import { test, expect } from "../fixtures";

test.describe("Flaky 02 : dépendance à la date", () => {
  test("en semaine, pas de remise", async ({ loggedInPage: page }) => {
    await page.clock.setFixedTime(new Date("2026-11-23T10:00:00")); // Monday
    await page
      .getByRole("button", {
        name: "Ajouter Essence Mascara Lash Princess au panier",
      })
      .click();
    await page.getByRole("link", { name: /Panier/ }).click();

    await expect(page.getByTestId("cart-total")).toHaveText("9,99 €");
  });

  test("le week-end, remise de 10 %", async ({ loggedInPage: page }) => {
    await page.clock.setFixedTime(new Date("2026-11-28T10:00:00")); // Saturday
    await page
      .getByRole("button", {
        name: "Ajouter Essence Mascara Lash Princess au panier",
      })
      .click();
    await page.getByRole("link", { name: /Panier/ }).click();

    await expect(page.getByText("Promo week-end")).toBeVisible();
    await expect(page.getByTestId("cart-total")).toHaveText("8,99 €");
  });
});
