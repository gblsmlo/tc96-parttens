import type { ArgTypes } from '@storybook/react-vite'
import {
  type OTPFieldSizeName,
  otpFieldSizeNames,
} from './otp-field-variants.ts'

export interface OTPFieldControls {
  defaultValue: string
  description: string
  disabled: boolean
  invalid: boolean
  label: string
  mask: boolean
  placeholder: string
  readOnly: boolean
  separator: boolean
  size: OTPFieldSizeName
}

export const otpFieldControlArgs: OTPFieldControls = {
  defaultValue: '',
  description: '',
  disabled: false,
  invalid: false,
  label: 'Verification code',
  mask: false,
  placeholder: '',
  readOnly: false,
  separator: false,
  size: 'default',
}

export const otpFieldControlArgTypes: Partial<ArgTypes<OTPFieldControls>> = {
  defaultValue: {
    control: 'text',
    description:
      'Starting value, through `defaultValue`; digits only, cut to six characters.',
  },
  description: {
    control: 'text',
    description:
      'Text of a `FieldDescription` under the slots; empty removes it.',
  },
  disabled: {
    control: 'boolean',
    description: 'The `disabled` of `OTPField`.',
  },
  invalid: {
    control: 'boolean',
    description:
      'The `invalid` of the enclosing `Field`, which sets `aria-invalid` on every slot.',
  },
  label: {
    control: 'text',
    description:
      'Text of the `FieldLabel` above the slots; empty hides the label visually and keeps "Verification code" for screen readers.',
  },
  mask: {
    control: 'boolean',
    description:
      'The `mask` of `OTPField`: shows each character as a dot; type a value to see it.',
  },
  placeholder: {
    control: 'text',
    description:
      'The `placeholder` of every `OTPFieldInput`; empty removes it.',
  },
  readOnly: {
    control: 'boolean',
    description:
      'The `readOnly` of `OTPField`: keeps the value, so set a starting value and try to type.',
  },
  separator: {
    control: 'boolean',
    description:
      'Adds an `OTPFieldSeparator` between the third and fourth slots.',
  },
  size: {
    control: 'inline-radio',
    description: 'The `size` of `OTPField`.',
    options: otpFieldSizeNames,
  },
}
