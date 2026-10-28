import { expect, type Page, test } from "@playwright/test"
import { ITEM_PRIORITIES } from "../src/lib/itemPriority"
import { createUser } from "./utils/privateApi"
import { randomEmail, randomItemTitle, randomPassword } from "./utils/random"
import { logInUser } from "./utils/user"

const API_URL = process.env.VITE_API_URL ?? "http://localhost:8000"

async function createItemWithPriority(
  page: Page,
  token: string,
  title: string,
  priority: (typeof ITEM_PRIORITIES)[number]["value"],
) {
  const response = await page.request.post(`${API_URL}/api/v1/items/`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { title, priority },
  })
  expect(response.status()).toBe(201)
}

test.describe("Item priority badges", () => {
  test.use({ storageState: { cookies: [], origins: [] } })
  let email: string
  const password = randomPassword()

  test.beforeAll(async () => {
    email = randomEmail()
    await createUser({ email, password })
  })

  test.beforeEach(async ({ page }) => {
    await logInUser(page, email, password)
  })

  test("shows the Priority column with a matching badge for each level", async ({
    page,
  }) => {
    const token = await page.evaluate(() =>
      localStorage.getItem("access_token"),
    )
    expect(token).toBeTruthy()

    const items = ITEM_PRIORITIES.map((priority) => ({
      label: priority.label,
      title: randomItemTitle(),
      value: priority.value,
    }))

    for (const item of items) {
      await createItemWithPriority(
        page,
        token as string,
        item.title,
        item.value,
      )
    }

    await page.goto("/items")

    await expect(
      page.getByRole("columnheader", { name: "Priority" }),
    ).toBeVisible()

    const badgeStyles: string[] = []
    for (const item of items) {
      const row = page.getByRole("row").filter({ hasText: item.title })
      await expect(row).toBeVisible()

      const badge = row.getByText(item.label, { exact: true })
      await expect(badge).toBeVisible()

      badgeStyles.push(
        await badge.evaluate((element) => {
          const computed = window.getComputedStyle(element)
          return `${computed.backgroundColor} ${computed.color}`
        }),
      )
    }

    expect(new Set(badgeStyles).size).toBe(items.length)
  })
})
