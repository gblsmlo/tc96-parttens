import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@tc96/ui/input-group'
import { Spinner } from '@tc96/ui/spinner'
import type { ComponentProps } from 'react'
import { type SpinnerControls, spinnerControlArgs } from './spinner-controls.ts'

type ComposedSpinnerProps = SpinnerControls &
  Omit<ComponentProps<typeof Spinner>, 'size'>

export const ComposedSpinner = ({
  className,
  size,
  ...props
}: Readonly<ComposedSpinnerProps>) => (
  <Spinner
    className={size === 'none' ? className : `${size} ${className ?? ''}`}
    {...props}
  />
)

export const BesideLabelSpinner = () => (
  <p className="flex items-center gap-2 text-sm">
    <ComposedSpinner {...spinnerControlArgs} aria-hidden="true" />
    Label
  </p>
)

export const InputAddonSpinner = () => (
  <div className="w-80">
    <InputGroup>
      <InputGroupInput aria-label="Input" type="search" />
      <InputGroupAddon align="inline-end">
        <ComposedSpinner {...spinnerControlArgs} />
      </InputGroupAddon>
    </InputGroup>
  </div>
)

export const InPlaceOfContentSpinner = () => (
  <div className="flex h-40 w-80 items-center justify-center rounded-lg border">
    <ComposedSpinner {...spinnerControlArgs} />
  </div>
)
