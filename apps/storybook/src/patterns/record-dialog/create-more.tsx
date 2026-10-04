import { Switch } from '@tc96/ui/switch'
import { useId } from 'react'

export function CreateMoreSwitch({
  checked,
  onCheckedChange,
}: Readonly<{
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}>) {
  const id = useId()

  return (
    <div className="flex items-center gap-2">
      <Switch checked={checked} id={id} onCheckedChange={onCheckedChange} />
      <label className="text-sm" htmlFor={id}>
        Create more
      </label>
    </div>
  )
}
