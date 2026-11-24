import type { ArgTypes } from '@storybook/react-vite'
import type { PropertyVariant } from '@tc96/ui/patterns'
import { tagOptionLabels, tagOptions } from './tags-data.ts'

export const tagsDisplays = ['chips', 'count'] as const

export type TagsDisplay = (typeof tagsDisplays)[number]

export const tagsVariants = ['badge', 'plain'] as const

export interface TagsControls {
  ariaLabel: string
  disabled: boolean
  display: TagsDisplay
  isLoading: boolean
  placeholder: string
  readOnly: boolean
  value: string[]
  variant: PropertyVariant
}

export const tagsControlArgs: TagsControls = {
  ariaLabel: 'Tags',
  disabled: false,
  display: 'chips',
  isLoading: false,
  placeholder: 'Adicionar uma tag',
  readOnly: false,
  value: ['documents', 'urgent'],
  variant: 'plain',
}

export const tagsControlArgTypes: Partial<ArgTypes<TagsControls>> = {
  ariaLabel: {
    control: 'text',
    description:
      'The `ariaLabel` of `TagsProperty`: names the row and the list, and prefixes the count.',
  },
  disabled: {
    control: 'boolean',
    description: 'The `disabled` of `TagsProperty`.',
  },
  display: {
    control: 'inline-radio',
    description: 'The `display` of `TagsProperty`.',
    options: tagsDisplays,
  },
  isLoading: {
    control: 'boolean',
    description:
      'The `isLoading` of `TagsProperty`: a status line at the top of the open list.',
  },
  placeholder: {
    control: 'text',
    description:
      'The `placeholder` of `TagsProperty`, shown by the read-only chips while no tag is applied.',
  },
  readOnly: {
    control: 'boolean',
    description: 'The `readOnly` of `TagsProperty`.',
  },
  value: {
    control: { labels: tagOptionLabels, type: 'check' },
    description:
      'The tags of `value`; the story keeps the edits in its own state until this control changes.',
    options: tagOptions.map((option) => option.value),
  },
  variant: {
    control: 'inline-radio',
    description: 'The `variant` of `TagsProperty`.',
    options: tagsVariants,
  },
}
