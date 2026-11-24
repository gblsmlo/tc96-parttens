import type { ArgTypes } from '@storybook/react-vite'
import type { AttachmentType } from '@tc96/ui/patterns'

export const attachmentTypes = [
  'pdf',
  'doc',
  'audio',
  'link',
] as const satisfies readonly AttachmentType[]

export interface AttachmentsControls {
  action: boolean
  actionDisabled: boolean
  actionIcon: boolean
  actionLabel: string
  ariaLabel: string
  empty: boolean
  remove: boolean
  type: AttachmentType
  typeIcon: boolean
}

export const attachmentsControlArgs: AttachmentsControls = {
  action: true,
  actionDisabled: false,
  actionIcon: true,
  actionLabel: 'Attach file',
  ariaLabel: 'Files',
  empty: false,
  remove: true,
  type: 'pdf',
  typeIcon: true,
}

export const attachmentsControlArgTypes: Partial<
  ArgTypes<AttachmentsControls>
> = {
  action: {
    control: 'boolean',
    description:
      'Passes `action` to `AttachmentsProperty`: adds the add trigger after the chips. A click adds a sample file.',
  },
  actionDisabled: {
    control: 'boolean',
    description: 'The `disabled` of `action`. Acts only with `action`.',
  },
  actionIcon: {
    control: 'boolean',
    description:
      'Passes a paperclip as the `icon` of `action`; it shows only while the row is empty.',
  },
  actionLabel: {
    control: 'text',
    description:
      'The `label` of `action`: the text of the trigger while the row is empty, and its name.',
  },
  ariaLabel: {
    control: 'text',
    description: 'The `ariaLabel` of `AttachmentsProperty`: names the row.',
  },
  empty: {
    control: 'boolean',
    description: 'Renders the row with no `AttachmentProperty`.',
  },
  remove: {
    control: 'boolean',
    description:
      'Passes `onRemove` to every `AttachmentProperty`: adds the remove button. A click removes the chip.',
  },
  type: {
    control: 'select',
    description:
      'The `type` of every `AttachmentProperty`. Acts only with `typeIcon`.',
    options: attachmentTypes,
  },
  typeIcon: {
    control: 'boolean',
    description:
      'Passes `type` to every `AttachmentProperty`; off leaves it out, and the chip shows no type icon.',
  },
}
