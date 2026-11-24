import type { Icon as PhosphorIcon } from '@phosphor-icons/react'
import { Field, FieldLabel } from '@tc96/ui/field'
import {
  NumberField,
  NumberFieldGroup,
  NumberFieldInput,
} from '@tc96/ui/number-field'
import { Slider, SliderValue } from '@tc96/ui/slider'
import { type ComponentProps, useId, useState } from 'react'
import type { SliderControls } from './slider-controls.ts'
import { rangeDefaultValue, singleDefaultValue } from './slider-variants.ts'

type SliderProps = ComponentProps<typeof Slider>

type ComposedSliderProps = SliderControls &
  Omit<SliderProps, keyof SliderControls | 'children'>

export const captionClassName =
  'font-medium text-base/4.5 text-foreground sm:text-sm/4'

export const rangeThumbLabel = (index: number) =>
  index === 0 ? 'Minimum' : 'Maximum'

const unlabeledThumb = () => 'Value'

export const ComposedSlider = ({
  defaultValue,
  disabled,
  label,
  orientation,
  range,
  showValue,
  thumbAlignment,
  ...props
}: Readonly<ComposedSliderProps>) => (
  <Field>
    <Slider
      defaultValue={
        defaultValue ?? (range ? rangeDefaultValue : singleDefaultValue)
      }
      disabled={disabled}
      getAriaLabel={
        range ? rangeThumbLabel : label ? undefined : unlabeledThumb
      }
      key={String(range)}
      orientation={orientation}
      thumbAlignment={thumbAlignment}
      {...props}
    >
      {label || showValue ? (
        <div
          className={`mb-2 flex items-center gap-1 ${label ? 'justify-between' : 'justify-end'}`}
        >
          {label ? <FieldLabel>{label}</FieldLabel> : null}
          {showValue ? <SliderValue /> : null}
        </div>
      ) : null}
    </Slider>
  </Field>
)

interface IconSliderProps {
  defaultValue: number
  endIcon: PhosphorIcon
  label: string
  startIcon: PhosphorIcon
}

export const IconSlider = ({
  defaultValue,
  endIcon: EndIcon,
  label,
  startIcon: StartIcon,
}: Readonly<IconSliderProps>) => (
  <Field>
    <Slider
      className="grid grid-cols-[auto_1fr_auto] items-center gap-x-2"
      defaultValue={defaultValue}
    >
      <div className="col-span-3 mb-2 flex items-center justify-between gap-1">
        <FieldLabel>{label}</FieldLabel>
        <SliderValue />
      </div>
      <StartIcon aria-hidden="true" className="size-4 shrink-0" />
      <EndIcon aria-hidden="true" className="order-1 size-4 shrink-0" />
    </Slider>
  </Field>
)

interface ScaleSliderProps {
  defaultValue: number
  label: string
  marks: readonly string[]
}

export const ScaleSlider = ({
  defaultValue,
  label,
  marks,
}: Readonly<ScaleSliderProps>) => (
  <Field>
    <Slider defaultValue={defaultValue}>
      <div className="mb-2 flex items-center justify-between gap-1">
        <FieldLabel>{label}</FieldLabel>
        <SliderValue />
      </div>
    </Slider>
    <div
      aria-hidden="true"
      className="flex w-full items-center justify-between px-2.5 font-medium text-muted-foreground text-xs sm:px-2"
    >
      {marks.map((mark) => (
        <span className="flex w-0 justify-center" key={mark}>
          {mark}
        </span>
      ))}
    </div>
  </Field>
)

export const SliderWithInput = () => {
  const labelId = useId()
  const [value, setValue] = useState(singleDefaultValue)

  return (
    <div className="flex flex-col gap-2">
      <div className={captionClassName} id={labelId}>
        Opacity
      </div>
      <div className="flex items-center gap-4">
        <Slider
          aria-labelledby={labelId}
          className="flex-1"
          onValueChange={(next) =>
            setValue(typeof next === 'number' ? next : (next[0] ?? 0))
          }
          value={value}
        />
        <NumberField
          className="w-16"
          max={100}
          min={0}
          onValueChange={(next) => setValue(next ?? 0)}
          size="sm"
          value={value}
        >
          <NumberFieldGroup>
            <NumberFieldInput aria-labelledby={labelId} />
          </NumberFieldGroup>
        </NumberField>
      </div>
    </div>
  )
}
