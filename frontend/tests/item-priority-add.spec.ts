import { expect, test } from "@playwright/test"
import { createUser } from "./utils/privateApi"
import { randomEmail, randomItemTitle, randomPassword } from "./utils/random"
import { logInUser } from "./utils/user"

test.describe("Add item priority", () => {
  test.use({ storageState: { cookies: [], origins: [] } })
  let email: string
  const password = randomPassword()

  test.beforeAll(async () => {
    email = randomEmail()
    await createUser({ email, password })
  })

  test.beforeEach(async ({ page }) => {
    await logInUser(page, email, password)
    await page.goto("/items")
  })

  test("preselects Medium in the add-item dialog", async ({ page }) => {
    await page.getByRole("button", { name: "Add Item" }).click()

    const prioritySelect = page.getByRole("combobox", { name: "Priority" })
    await expect(prioritySelect).toBeVisible()
    await expect(prioritySelect).toContainText("Medium")
  })

  test("creates an item with the selected High priority and shows its badge", async ({
    page,
  }) => {
    const title = randomItemTitle()

    await page.getByRole("button", { name: "Add Item" }).click()
    await page.getByRole("combobox", { name: "Priority" }).click()
    await page.getByRole("option", { name: "High", exact: true }).click()
    await page.getByLabel("Title").fill(title)
    await page.getByRole("button", { name: "Save" }).click()

    await expect(page.getByText("Item created successfully")).toBeVisible()
    await expect(page.getByRole("dialog")).not.toBeVisible()
    await expect(page.getByText(title)).toBeVisible()

    const itemRow = page.getByRole("row").filter({ hasText: title })
    await expect(itemRow.getByText("High", { exact: true })).toBeVisible()
  })
})
