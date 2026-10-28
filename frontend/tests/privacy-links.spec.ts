import { expect, test } from "@playwright/test"

test.describe("privacy policy link on unauthenticated pages", () => {
  test.use({ storageState: { cookies: [], origins: [] } })

  for (const path of ["/login", "/signup"]) {
    test(`is visible and opens the privacy policy from ${path}`, async ({
      page,
    }) => {
      await page.goto(path)

      const link = page.getByTestId("privacy-policy-link")
      await expect(link).toBeVisible()
      await expect(link).toHaveAttribute("href", "/privacy")

      await link.click()

      await expect(page).toHaveURL("/privacy")
      await expect(
        page.getByRole("heading", { name: "Privacy policy", level: 1 }),
      ).toBeVisible()
    })
  }
})

test.describe("privacy policy link on signed-in pages", () => {
  test("is placed in the sidebar footer above the user menu", async ({
    page,
  }) => {
    await page.goto("/items")

    const link = page.getByTestId("privacy-policy-link")
    await expect(link).toBeVisible()
    await expect(link).toHaveAttribute("href", "/privacy")

    await link.click()

    await expect(page).toHaveURL("/privacy")
    await expect(
      page.getByRole("heading", { name: "Privacy policy", level: 1 }),
    ).toBeVisible()
  })

  test("is placed in the user menu", async ({ page }) => {
    await page.goto("/items")

    await page.getByTestId("user-menu").click()
    const item = page.getByTestId("user-menu-privacy-policy")
    await expect(item).toBeVisible()

    await item.click()

    await expect(page).toHaveURL("/privacy")
    await expect(
      page.getByRole("heading", { name: "Privacy policy", level: 1 }),
    ).toBeVisible()
  })
})
