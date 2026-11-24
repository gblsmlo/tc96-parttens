import type { ArgTypes } from '@storybook/react-vite'
import { type RecordStatus, recordStatuses } from '@tc96/ui/patterns'

export interface RecordStatusListControls {
  action: boolean
  announcement: string
  detail: string
  label: string
  status: RecordStatus
  title: string
}

export const recordStatusListControlArgs: RecordStatusListControls = {
  action: false,
  announcement: 'DataJud respondeu: ação e objeto',
  detail: 'buscando ação e objeto',
  label: 'Fontes consultadas',
  status: 'running',
  title: 'DataJud',
}

export const recordStatusListControlArgTypes: Partial<
  ArgTypes<RecordStatusListControls>
> = {
  action: {
    control: 'boolean',
    description: 'Passes a "Tentar de novo" button as `action`.',
  },
  announcement: {
    control: 'text',
    description: 'Read by the list region when `status` changes.',
  },
  detail: { control: 'text' },
  label: { control: 'text', description: 'Names the list.' },
  status: { control: 'inline-radio', options: [...recordStatuses] },
  title: { control: 'text' },
}
