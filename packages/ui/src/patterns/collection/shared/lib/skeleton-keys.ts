export function skeletonKeys(prefix: string, count: number): string[] {
  return Array.from({ length: count }).map(
    (_, position) => `${prefix}-${position + 1}`,
  )
}
