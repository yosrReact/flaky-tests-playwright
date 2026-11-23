import { test, expect } from "../fixtures";

test.describe("Flaky 03 : API externe", () => {
  test("la boutique affiche les produits du catalogue", async ({
    loggedInPage,
  }) => {
    // await loggedInPage.route("**/dummyjson.com/**", (route) => route.abort());

    await expect(loggedInPage.getByRole("listitem")).toHaveCount(2);
    await expect(
      loggedInPage.getByRole("heading", { level: 2 }).first(),
    ).toHaveText("Essence Mascara Lash Princess");
  });
});
