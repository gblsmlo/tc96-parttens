import { ToggleGroup, ToggleGroupItem } from '@tc96/ui/toggle-group'
import type { DashboardFilterOption } from './types'

export interface DashboardFilterProps {
  label: string
  onValueChange: (value: string) => void
  options: DashboardFilterOption[]
  value: string
}

export function DashboardFilter({
  label,
  onValueChange,
  options,
  value,
}: Readonly<DashboardFilterProps>) {
  return (
    <ToggleGroup
      aria-label={label}
      onValueChange={(next) => {
        const [picked] = next as string[]
        if (picked !== undefined) onValueChange(picked)
      }}
      size="sm"
      value={[value]}
    >
      {options.map((option) => (
        <ToggleGroupItem
          data-filter={option.value}
          key={option.value}
          value={option.value}
        >
          {option.label}{' '}
          {option.count === undefined ? null : (
            <span className="text-muted-foreground tabular-nums">
              {option.count}
            </span>
          )}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
