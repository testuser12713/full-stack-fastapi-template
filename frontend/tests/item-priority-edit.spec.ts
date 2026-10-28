import { expect, type Page, test } from "@playwright/test"
import { ITEM_PRIORITIES } from "../src/lib/itemPriority"
import { createUser } from "./utils/privateApi"
import { randomEmail, randomItemTitle, randomPassword } from "./utils/random"
import { logInUser } from "./utils/user"

const currentPriority = ITEM_PRIORITIES[2]
const newPriority = ITEM_PRIORITIES[0]

async function createItem(
  page: Page,
  title: string,
  priority: string | undefined,
) {
  if (!priority) {
    throw new Error("Priority is required to create an item")
  }
  const token = await page.evaluate(() => localStorage.getItem("access_token"))
  const response = await page.request.post(
    `${process.env.VITE_API_URL}/api/v1/items/`,
    {
      headers: { Authorization: `Bearer ${token}` },
      data: { title, priority },
    },
  )
  expect(response.status()).toBe(201)
}

test.describe("Item priority in the edit dialog", () => {
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

  test("preselects the item priority and saves a new one", async ({ page }) => {
    const title = randomItemTitle()
    await createItem(page, title, currentPriority.value)
    await page.reload()

    const itemRow = page.getByRole("row").filter({ hasText: title })
    await expect(itemRow).toBeVisible()

    await itemRow.getByRole("button").last().click()
    await page.getByRole("menuitem", { name: "Edit Item" }).click()

    const dialog = page.getByRole("dialog")
    const priorityField = dialog.getByLabel("Priority", { exact: true })
    await expect(priorityField).toContainText(currentPriority.label)

    await priorityField.click()
    await page
      .getByRole("option", { name: newPriority.label, exact: true })
      .click()
    await expect(priorityField).toContainText(newPriority.label)

    await dialog.getByRole("button", { name: "Save" }).click()

    await expect(page.getByText("Item updated successfully")).toBeVisible()
    await expect(dialog).not.toBeVisible()

    await expect(
      itemRow.getByText(newPriority.label, { exact: true }),
    ).toBeVisible()
  })
})
