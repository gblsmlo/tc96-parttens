interface VirtualScrollInput {
  bottomHeight: number
  headerHeight: number
  rowHeight: number
  rowIndex: number
  scrollTop: number
  viewportHeight: number
}

export function resolveVirtualScrollTop({
  bottomHeight,
  headerHeight,
  rowHeight,
  rowIndex,
  scrollTop,
  viewportHeight,
}: VirtualScrollInput): number | undefined {
  const bodyViewportHeight = Math.max(
    rowHeight,
    viewportHeight - headerHeight - bottomHeight,
  )
  const rowStart = rowIndex * rowHeight
  const rowEnd = rowStart + rowHeight
  const bodyScrollStart = Math.max(0, scrollTop - headerHeight)

  if (rowStart < bodyScrollStart) return rowStart
  if (rowEnd > bodyScrollStart + bodyViewportHeight) {
    return rowEnd - bodyViewportHeight + headerHeight
  }
  return undefined
}
