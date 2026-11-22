import type { ArgTypes } from '@storybook/react-vite'

export const editableToolbarOrientations = ['horizontal', 'vertical'] as const

export type EditableToolbarOrientation =
  (typeof editableToolbarOrientations)[number]

export interface EditableControls {
  autosize: boolean
  disabled: boolean
  editing: boolean
  field: boolean
  label: string
  multiline: boolean
  orientation: EditableToolbarOrientation
  placeholder: string
  readOnly: boolean
  required: boolean
  toolbar: boolean
  trigger: boolean
  value: string
}

export const editableControlArgs: EditableControls = {
  autosize: false,
  disabled: false,
  editing: false,
  field: false,
  label: 'Title',
  multiline: false,
  orientation: 'horizontal',
  placeholder: 'Add a title',
  readOnly: false,
  required: false,
  toolbar: true,
  trigger: true,
  value: 'Quarterly report',
}

export const editableControlArgTypes: Partial<ArgTypes<EditableControls>> = {
  autosize: {
    control: 'boolean',
    description:
      'The `autosize` of `Editable`: the input grows with its text while editing.',
  },
  disabled: {
    control: 'boolean',
    description: 'The `disabled` of `Editable`.',
  },
  editing: {
    control: 'boolean',
    description:
      'The `defaultEditing` of `Editable`: starts in the editing state. Does nothing with `field`.',
  },
  field: {
    control: 'boolean',
    description:
      'Renders `EditableField` in place of the area, the trigger and the toolbar.',
  },
  label: {
    control: 'text',
    description:
      'Text of `EditableLabel`; empty hides the label visually and keeps "Title" as the name of the input.',
  },
  multiline: {
    control: 'boolean',
    description:
      'The `multiline` of `EditableField`: a `textarea`. Acts only with `field`.',
  },
  orientation: {
    control: 'inline-radio',
    description:
      'The `orientation` of `EditableToolbar`; the toolbar shows only while editing.',
    options: editableToolbarOrientations,
  },
  placeholder: {
    control: 'text',
    description:
      'The `placeholder` of `Editable`, shown while the value is empty.',
  },
  readOnly: {
    control: 'boolean',
    description: 'The `readOnly` of `Editable`.',
  },
  required: {
    control: 'boolean',
    description: 'The `required` of `Editable`: adds the `*` after the label.',
  },
  toolbar: {
    control: 'boolean',
    description:
      'Adds an `EditableToolbar` with `EditableSubmit` and `EditableCancel`; it shows only while editing.',
  },
  trigger: {
    control: 'boolean',
    description: 'Adds an `EditableTrigger` that starts editing.',
  },
  value: {
    control: 'text',
    description:
      'The `defaultValue` of `Editable`; empty shows the placeholder.',
  },
}
