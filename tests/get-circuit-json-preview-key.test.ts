import { expect, test } from "bun:test"
import { getCircuitJsonPreviewKey } from "../lib/get-circuit-json-preview-key"

test("changes when pcb trace route length changes", () => {
  const baseTrace = {
    type: "pcb_trace",
    pcb_trace_id: "trace1",
    route: [
      { x: 0, y: 0, width: 0.1 },
      { x: 1, y: 1, width: 0.1 },
    ],
  }

  const firstKey = getCircuitJsonPreviewKey([baseTrace])
  const secondKey = getCircuitJsonPreviewKey([
    {
      ...baseTrace,
      route: [
        { x: 0, y: 0, width: 0.1 },
        { x: 0.5, y: 0.5, width: 0.1 },
        { x: 1, y: 1, width: 0.1 },
      ],
    },
  ])

  expect(firstKey).not.toBe(secondKey)
})
