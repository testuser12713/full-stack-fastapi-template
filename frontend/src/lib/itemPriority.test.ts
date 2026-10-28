import assert from "node:assert/strict"
import { test } from "node:test"

import { ITEM_PRIORITIES, priorityLabel } from "./itemPriority.ts"

test("ITEM_PRIORITIES lists the three generated priorities in order", () => {
  assert.equal(ITEM_PRIORITIES.length, 3)
  assert.deepEqual(
    ITEM_PRIORITIES.map((priority) => priority.label),
    ["Low", "Medium", "High"],
  )
})

test("priorityLabel returns the label of every generated priority", () => {
  for (const priority of ITEM_PRIORITIES) {
    assert.equal(priorityLabel(priority.value), priority.label)
  }
})

test("priorityLabel falls back to Medium when the value is missing", () => {
  assert.equal(priorityLabel(undefined), "Medium")
})
