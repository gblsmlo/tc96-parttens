import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from '@tc96/ui/select'
import type { SettingsOption } from './types'

interface SettingsSelectProps {
  ariaLabel: string
  items: SettingsOption[]
  onValueChange?: (value: string) => void
  value: string
}

export function SettingsSelect({
  ariaLabel,
  items,
  onValueChange,
  value,
}: Readonly<SettingsSelectProps>) {
  return (
    <Select
      items={items}
      onValueChange={(next) => {
        if (next) onValueChange?.(next)
      }}
      value={value}
    >
      <SelectTrigger aria-label={ariaLabel} className="w-44">
        <SelectValue />
      </SelectTrigger>
      <SelectPopup>
        {items.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectPopup>
    </Select>
  )
}
