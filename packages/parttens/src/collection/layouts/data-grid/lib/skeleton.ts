export function createSkeletonRowIds(count: number) {
  const ids: string[] = []
  for (let position = 1; position <= count; position += 1) {
    ids.push(`skeleton-${position}`)
  }
  return ids
}
