import type { ArgTypes } from '@storybook/react-vite'
import {
  type ComposerInputName,
  type ComposerLayoutName,
  type ComposerTokenVariantName,
  composerInputNames,
  composerLayoutNames,
  composerTokenVariantNames,
} from './composer-variants.ts'

export interface ComposerControls {
  defaultText: string
  disabled: boolean
  input: ComposerInputName
  layout: ComposerLayoutName
  leading: boolean
  placeholder: string
  readOnly: boolean
  submitDisabled: boolean
  suggestions: boolean
  tokenVariant: ComposerTokenVariantName
}

export const composerControlArgs: ComposerControls = {
  defaultText: '',
  disabled: false,
  input: 'contenteditable',
  layout: 'stacked',
  leading: false,
  placeholder: 'Write a message…',
  readOnly: false,
  submitDisabled: false,
  suggestions: false,
  tokenVariant: 'default',
}

export const composerControlArgTypes: Partial<ArgTypes<ComposerControls>> = {
  defaultText: {
    control: 'text',
    description:
      'Text of the `defaultValue` of `Composer`; the composer remounts when it changes.',
  },
  disabled: {
    control: 'boolean',
    description: 'The `disabled` of `Composer`.',
  },
  input: {
    control: 'inline-radio',
    description:
      'The element of `ComposerInput`: the default `div`, or a `textarea` through `render`.',
    options: composerInputNames,
  },
  layout: {
    control: 'inline-radio',
    description: 'The `layout` of `Composer`.',
    options: composerLayoutNames,
  },
  leading: {
    control: 'boolean',
    description: 'Adds a start `ComposerActionGroup` with an attach button.',
  },
  placeholder: {
    control: 'text',
    description: 'The `placeholder` of `ComposerInput`.',
  },
  readOnly: {
    control: 'boolean',
    description: 'The `readOnly` of `Composer`.',
  },
  submitDisabled: {
    control: 'boolean',
    description: 'The `submitDisabled` of `Composer`.',
  },
  suggestions: {
    control: 'boolean',
    description:
      'Adds `@` and `/` triggers, a `ComposerPopup` and a mention button; needs the `contenteditable` input.',
  },
  tokenVariant: {
    control: 'inline-radio',
    description:
      'The `variant` of the `ComposerToken` that `renderToken` draws, for tokens picked from the suggestions.',
    options: composerTokenVariantNames,
  },
}
