import { expect, type Page, test } from "@playwright/test"

import { ITEM_PRIORITIES } from "../src/lib/itemPriority"
import { createUser } from "./utils/privateApi"
import { randomEmail, randomItemTitle, randomPassword } from "./utils/random"
import { logInUser } from "./utils/user"

function priorityValueForLabel(label: string): string {
  const entry = ITEM_PRIORITIES.find((priority) => priority.label === label)
  if (!entry?.value) {
    throw new Error(`Unknown item priority label: ${label}`)
  }
  return entry.value
}

async function createItemWithPriority(
  page: Page,
  title: string,
  label: string,
) {
  const token = await page.evaluate(() => localStorage.getItem("access_token"))
  const apiBase = process.env.VITE_API_URL?.replace(/\/$/, "")
  if (!apiBase) {
    throw new Error("Environment variable VITE_API_URL is undefined")
  }

  const response = await page.request.post(`${apiBase}/api/v1/items/`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { title, priority: priorityValueForLabel(label) },
  })

  expect(response.status()).toBe(201)
}

test.describe("Item priority filter", () => {
  test.use({ storageState: { cookies: [], origins: [] } })

  test.beforeEach(async ({ page }) => {
    const email = randomEmail()
    const password = randomPassword()
    await createUser({ email, password })
    await logInUser(page, email, password)
  })

  test("offers All priorities, Low, Medium and High", async ({ page }) => {
    await page.goto("/items")

    const filter = page.getByRole("combobox", { name: "Filter by priority" })
    await expect(filter).toBeVisible()
    await expect(filter).toContainText("All priorities")

    await filter.click()
    const options = page.getByRole("listbox").getByRole("option")
    await expect(options).toHaveCount(4)
    for (const label of ["All priorities", "Low", "Medium", "High"]) {
      await expect(
        page.getByRole("listbox").getByRole("option", { name: label }),
      ).toBeVisible()
    }
  })

  test("filters by priority and returns to all items", async ({ page }) => {
    const highTitle = randomItemTitle()
    const mediumTitle = randomItemTitle()
    const lowTitle = randomItemTitle()

    await createItemWithPriority(page, highTitle, "High")
    await createItemWithPriority(page, mediumTitle, "Medium")
    await createItemWithPriority(page, lowTitle, "Low")

    await page.goto("/items")
    await expect(page.getByText(highTitle)).toBeVisible()
    await expect(page.getByText(mediumTitle)).toBeVisible()
    await expect(page.getByText(lowTitle)).toBeVisible()

    const filter = page.getByRole("combobox", { name: "Filter by priority" })
    await filter.click()
    await page.getByRole("option", { name: "High" }).click()

    await expect(filter).toContainText("High")
    await expect(page.getByText(highTitle)).toBeVisible()
    await expect(page.getByText(mediumTitle)).toHaveCount(0)
    await expect(page.getByText(lowTitle)).toHaveCount(0)

    await filter.click()
    await page.getByRole("option", { name: "All priorities" }).click()

    await expect(filter).toContainText("All priorities")
    await expect(page.getByText(highTitle)).toBeVisible()
    await expect(page.getByText(mediumTitle)).toBeVisible()
    await expect(page.getByText(lowTitle)).toBeVisible()
  })

  test("resets the table to page 1 when the filter changes", async ({
    page,
  }) => {
    const highPrefix = randomItemTitle()
    const lowTitle = randomItemTitle()

    const seededItems = [
      ...Array.from({ length: 26 }, (_, index) => ({
        title: `${highPrefix} ${index}`,
        label: "High",
      })),
      { title: lowTitle, label: "Low" },
    ]

    for (const item of seededItems) {
      await createItemWithPriority(page, item.title, item.label)
    }

    await page.goto("/items")

    const firstPageButton = page.getByRole("button", {
      name: "Go to first page",
    })
    await expect(firstPageButton).toBeVisible()
    await expect(firstPageButton).toBeDisabled()

    await page.getByRole("button", { name: "Go to next page" }).click()
    await expect(firstPageButton).toBeEnabled()

    const filter = page.getByRole("combobox", { name: "Filter by priority" })
    await filter.click()
    await page.getByRole("option", { name: "High" }).click()

    await expect(filter).toContainText("High")
    await expect(firstPageButton).toBeDisabled()
  })
})
