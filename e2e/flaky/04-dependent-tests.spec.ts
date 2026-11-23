import { test, expect } from "../fixtures";

test.describe("Flaky 04 : tests dépendants", () => {
  test("A : ajouter le mascara au panier", async ({ loggedInPage: page }) => {
    await page
      .getByRole("button", {
        name: "Ajouter Essence Mascara Lash Princess au panier",
      })
      .click();

    await expect(page.getByRole("link", { name: /Panier/ })).toContainText("1");
  });

  test("B : le panier contient le mascara", async ({ loggedInPage: page }) => {
    // B prepares its own state instead of relying on A
    await page
      .getByRole("button", {
        name: "Ajouter Essence Mascara Lash Princess au panier",
      })
      .click();
    await page.getByRole("link", { name: /Panier/ }).click();

    await expect(
      page.getByRole("cell", {
        name: "Essence Mascara Lash Princess",
        exact: true,
      }),
    ).toBeVisible();
  });
});
