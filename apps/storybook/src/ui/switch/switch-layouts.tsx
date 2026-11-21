import { Field, FieldDescription, FieldError, FieldLabel } from '@tc96/ui/field'
import { Label } from '@tc96/ui/label'
import { Switch } from '@tc96/ui/switch'
import { useId } from 'react'
import type { SwitchControls } from './switch-controls.ts'
import { switchSizeClasses } from './switch-variants.ts'

interface ComposedSwitchProps extends SwitchControls {
  onCheckedChange?: (checked: boolean) => void
}

interface FieldSwitchProps {
  required?: boolean
}

export const ComposedSwitch = ({
  checked,
  description,
  disabled,
  label,
  onCheckedChange,
  readOnly,
  size,
}: Readonly<ComposedSwitchProps>) => {
  const id = useId()
  const descriptionId = `${id}-description`
  return (
    <div className="flex max-w-xs items-start gap-2">
      <Switch
        aria-describedby={description ? descriptionId : undefined}
        className={switchSizeClasses[size]}
        defaultChecked={checked}
        disabled={disabled}
        id={id}
        onCheckedChange={onCheckedChange}
        readOnly={readOnly}
      />
      <div className="flex flex-col gap-1">
        <Label htmlFor={id}>{label}</Label>
        {description ? (
          <p className="text-muted-foreground text-xs" id={descriptionId}>
            {description}
          </p>
        ) : null}
      </div>
    </div>
  )
}

export const WrappedLabelSwitch = () => (
  <Label>
    <Switch />
    Label text
  </Label>
)

export const SwitchAtEnd = () => {
  const id = useId()
  const descriptionId = `${id}-description`
  return (
    <div className="flex w-80 items-start justify-between gap-6">
      <div className="flex flex-col gap-1">
        <Label htmlFor={id}>Label text</Label>
        <p className="text-muted-foreground text-xs" id={descriptionId}>
          Describe what turning the switch on does.
        </p>
      </div>
      <Switch aria-describedby={descriptionId} id={id} />
    </div>
  )
}

export const AriaLabelSwitch = () => <Switch aria-label="Airplane mode" />

export const CardSwitch = () => (
  <Label className="flex w-80 items-start justify-between gap-6 rounded-lg border p-3 has-data-checked:bg-accent/50">
    <span className="flex flex-col gap-1">
      Label text
      <span className="font-normal text-muted-foreground text-xs">
        Describe what turning the switch on does.
      </span>
    </span>
    <Switch />
  </Label>
)

export const FieldSwitch = ({
  required = false,
}: Readonly<FieldSwitchProps>) => (
  <Field name="option">
    <FieldLabel>
      <Switch required={required} />
      Label text
    </FieldLabel>
    <FieldDescription>
      Describe what turning the switch on does.
    </FieldDescription>
    <FieldError match="valueMissing">
      Turn the switch on to continue.
    </FieldError>
  </Field>
)
