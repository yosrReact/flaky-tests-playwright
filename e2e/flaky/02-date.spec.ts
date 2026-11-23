import { test, expect } from "../fixtures";

test.describe("Flaky 02 : dépendance à la date", () => {
  test("le total du panier est égal au prix du produit", async ({
    loggedInPage,
  }) => {
    // await page.clock.setFixedTime(new Date("2026-11-28T10:00:00"));
    await loggedInPage
      .getByRole("button", {
        name: "Ajouter Essence Mascara Lash Princess au panier",
      })
      .click();
    await loggedInPage.getByRole("link", { name: /Panier/ }).click();
    await expect(loggedInPage.getByTestId("cart-total")).toHaveText("9,99 €");
  });
});
