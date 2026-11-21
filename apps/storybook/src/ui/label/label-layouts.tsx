import { Checkbox } from '@tc96/ui/checkbox'
import { Input } from '@tc96/ui/input'
import { Label } from '@tc96/ui/label'
import { Radio, RadioGroup } from '@tc96/ui/radio-group'
import { Switch } from '@tc96/ui/switch'
import { useId } from 'react'
import type { LabelControls } from './label-controls.ts'

export const RequiredMarker = () => (
  <span aria-hidden className="text-destructive-foreground">
    *
  </span>
)

export const ComposedLabel = ({
  element,
  label,
  required,
}: Readonly<LabelControls>) => {
  const id = useId()
  const labelId = `${id}-label`
  const content = (
    <>
      {label}
      {required ? <RequiredMarker /> : null}
    </>
  )
  return (
    <div className="flex flex-col items-start gap-2">
      {element === 'span' ? (
        <Label id={labelId} render={<span />}>
          {content}
        </Label>
      ) : (
        <Label htmlFor={id}>{content}</Label>
      )}
      <Input
        aria-labelledby={element === 'span' ? labelId : undefined}
        id={id}
        placeholder="you@example.com"
        required={required}
        type="email"
      />
    </div>
  )
}

export const CheckboxInLabel = () => (
  <Label>
    <Checkbox />
    Label text
  </Label>
)

export const LabelBesideSwitch = () => {
  const id = useId()
  return (
    <div className="flex items-center justify-between gap-4">
      <Label htmlFor={id}>Label text</Label>
      <Switch id={id} />
    </div>
  )
}

export const GroupCaptionLabel = () => {
  const id = useId()
  return (
    <div className="flex flex-col gap-3">
      <Label id={id} render={<span />}>
        Group caption
      </Label>
      <RadioGroup aria-labelledby={id} defaultValue="one">
        <Label className="font-normal">
          <Radio value="one" />
          Option one
        </Label>
        <Label className="font-normal">
          <Radio value="two" />
          Option two
        </Label>
      </RadioGroup>
    </div>
  )
}
