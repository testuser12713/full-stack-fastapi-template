import { expect, test } from "@playwright/test"

test.describe("Privacy policy", () => {
  test.use({ storageState: { cookies: [], origins: [] } })

  test("is reachable from the login page", async ({ page }) => {
    await page.goto("/login")
    await page.getByRole("link", { name: "Privacy policy" }).click()
    await expect(page).toHaveURL(/\/privacy$/)
    await expect(
      page.getByRole("heading", { name: "Privacy policy", level: 1 }),
    ).toBeVisible()
  })

  test("names controller, processing activities, rights and open operator details", async ({
    page,
  }) => {
    await page.goto("/privacy")
    await expect(
      page.getByRole("heading", { name: "Privacy policy", level: 1 }),
    ).toBeVisible()
    await expect(
      page.getByRole("heading", { name: "Controller" }),
    ).toBeVisible()
    await expect(
      page.getByRole("heading", { name: "Processing activities" }),
    ).toBeVisible()
    await expect(
      page.getByRole("heading", {
        name: "Recipients and third-country transfers",
      }),
    ).toBeVisible()
    await expect(
      page.getByRole("heading", { name: "Your rights" }),
    ).toBeVisible()
    await expect(
      page.getByRole("heading", { name: "Right to complain" }),
    ).toBeVisible()
    await expect(page.getByRole("cell", { name: /Registration/ })).toBeVisible()
    await expect(page.getByRole("cell", { name: /Login/ })).toBeVisible()
    await expect(page.getByRole("cell", { name: /Server logs/ })).toBeVisible()
    await expect(
      page.getByText("[By the operator to complete]").first(),
    ).toBeVisible()
  })
})
