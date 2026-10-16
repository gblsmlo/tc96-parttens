export const rowsOf = (canvasElement: HTMLElement) =>
  Array.from(
    canvasElement.querySelectorAll<HTMLElement>(
      '[data-slot="record-group-row"]',
    ),
  )

export const part = (row: HTMLElement, slot: 'label' | 'value') =>
  row.querySelector(`[data-slot="record-group-row-${slot}"]`) as HTMLElement
