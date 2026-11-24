import { MagnifyingGlassIcon } from '@phosphor-icons/react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@tc96/ui/input-group'

export interface DashboardSearchProps {
  label: string
  onValueChange: (value: string) => void
  value: string
}

export function DashboardSearch({
  label,
  onValueChange,
  value,
}: Readonly<DashboardSearchProps>) {
  return (
    <InputGroup className="w-full sm:w-64">
      <InputGroupAddon>
        <MagnifyingGlassIcon aria-hidden="true" />
      </InputGroupAddon>
      <InputGroupInput
        aria-label={label}
        onValueChange={(next) => onValueChange(next)}
        placeholder={label}
        type="search"
        value={value}
      />
    </InputGroup>
  )
}
