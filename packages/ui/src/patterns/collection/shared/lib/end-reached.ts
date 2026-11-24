export const DEFAULT_END_REACHED_THRESHOLD = 5

interface NearEndInput {
  bottomInset: number
  clientHeight: number
  rowHeight: number
  scrollHeight: number
  scrollTop: number
  threshold: number
}

export function isNearEnd({
  bottomInset,
  clientHeight,
  rowHeight,
  scrollHeight,
  scrollTop,
  threshold,
}: NearEndInput) {
  if (clientHeight <= 0) return false
  const remaining = scrollHeight - scrollTop - clientHeight - bottomInset
  return remaining <= Math.max(0, threshold) * rowHeight
}

interface FireEndReachedInput {
  firedForCount: number | undefined
  loading: boolean
  nearEnd: boolean
  rowCount: number
}

export function shouldFireEndReached({
  firedForCount,
  loading,
  nearEnd,
  rowCount,
}: FireEndReachedInput) {
  return nearEnd && !loading && rowCount > 0 && firedForCount !== rowCount
}
