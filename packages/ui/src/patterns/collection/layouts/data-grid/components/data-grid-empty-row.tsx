// biome-ignore-all lint/a11y/useSemanticElements: the WAI-ARIA grid pattern is used instead of table layout elements so the body can be virtualized

'use client'

export function DataGridEmptyRow({
  ariaRowIndex,
  message,
}: {
  ariaRowIndex: number
  message: string
}) {
  return (
    <div
      aria-rowindex={ariaRowIndex}
      className="flex min-h-24 items-center justify-center text-muted-foreground"
      role="row"
      tabIndex={-1}
    >
      <div aria-colindex={1} role="gridcell" tabIndex={-1}>
        {message}
      </div>
    </div>
  )
}
