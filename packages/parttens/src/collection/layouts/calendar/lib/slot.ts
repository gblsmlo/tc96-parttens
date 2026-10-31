const MINUTES_PER_DAY = 1440

export function slotFromOffset({
  height,
  offsetY,
  snapMinutes,
}: {
  height: number
  offsetY: number
  snapMinutes: number
}) {
  const ratio = height > 0 ? Math.min(Math.max(offsetY / height, 0), 1) : 0
  const snapped = Math.floor((ratio * MINUTES_PER_DAY) / snapMinutes)
  const startMinutes = Math.min(
    snapped * snapMinutes,
    MINUTES_PER_DAY - snapMinutes,
  )

  return { endMinutes: startMinutes + snapMinutes, startMinutes }
}
