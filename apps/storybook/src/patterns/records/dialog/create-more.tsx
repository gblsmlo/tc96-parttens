import { Switch } from '@tc96/ui/switch'
import { useId } from 'react'

export function CreateMoreSwitch({
  checked,
  label = 'Create more',
  onCheckedChange,
}: Readonly<{
  checked: boolean
  label?: string
  onCheckedChange: (checked: boolean) => void
}>) {
  const id = useId()

  return (
    <div className="flex items-center gap-2">
      <Switch checked={checked} id={id} onCheckedChange={onCheckedChange} />
      <label className="text-sm" htmlFor={id}>
        {label}
      </label>
    </div>
  )
}
