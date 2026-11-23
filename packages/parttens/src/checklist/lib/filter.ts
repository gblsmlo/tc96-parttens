import type { RecordGroupFilterProps } from '../../records/group/core'

export function checklistFilterNarrows(
  filter: RecordGroupFilterProps | undefined,
): boolean {
  if (!filter) return false
  const narrowsOptions =
    filter.filterOptions !== undefined &&
    filter.filterValue !== undefined &&
    filter.filterValue.length < filter.filterOptions.length
  return (
    narrowsOptions ||
    (filter.sections ?? []).some(
      (section) => section.value.length < section.options.length,
    )
  )
}
