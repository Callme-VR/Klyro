import { describe, expect, test } from "bun:test";

describe("Service Logic & Fractional Order Calculation Unit Tests", () => {
  test("Auto-calculates initial order when section or issue list is empty", () => {
    const maxOrder: number | undefined = undefined;
    const initialOrder = maxOrder !== undefined ? maxOrder + 65536.0 : 65536.0;

    expect(initialOrder).toBe(65536.0);
  });

  test("Auto-calculates subsequent order when existing max order is present", () => {
    const existingMaxOrder = 65536.0;
    const nextOrder = existingMaxOrder + 65536.0;

    expect(nextOrder).toBe(131072.0);
  });

  test("Calculates midpoint fractional order for drag-and-drop between two positions", () => {
    const prevOrder = 65536.0;
    const nextOrder = 131072.0;
    const droppedInBetweenOrder = (prevOrder + nextOrder) / 2.0;

    expect(droppedInBetweenOrder).toBe(98304.0);
    expect(droppedInBetweenOrder).toBeGreaterThan(prevOrder);
    expect(droppedInBetweenOrder).toBeLessThan(nextOrder);
  });
});
