/**
 * Calculates a new fractional order index when an item is moved within or between columns.
 * 
 * @param items Array of items sorted ascending by order
 * @param destinationIndex The target array index where the item was dropped
 * @returns Floating point order value for the database
 * */



export function calculateNewOrder<T extends { order?: number }>(
  items: T[],
  destinationIndex: number
): number {
  if (items.length === 0) {
    return 1000.0;
  }

  const validItems = items.map((item, idx) => ({
    ...item,
    order: typeof item.order === "number" && !isNaN(item.order) ? item.order : (idx + 1) * 1000.0,
  }));

  // Dropped at top of list
  if (destinationIndex <= 0) {
    const firstOrder = validItems[0].order;
    return firstOrder > 0 ? firstOrder / 2.0 : firstOrder - 1000.0;
  }

  // Dropped at bottom of list
  if (destinationIndex >= validItems.length) {
    const lastOrder = validItems[validItems.length - 1].order;
    return lastOrder + 1000.0;
  }

  // Dropped between two items
  const prevOrder = validItems[destinationIndex - 1].order;
  const nextOrder = validItems[destinationIndex].order;

  const result = (prevOrder + nextOrder) / 2.0;
  return isNaN(result) ? 1000.0 : result;
}

// Alias for pluralization compatibility
export const calculatesNewOrder = calculateNewOrder;
