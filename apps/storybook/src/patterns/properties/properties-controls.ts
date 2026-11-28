import type { ArgTypes } from '@storybook/react-vite'
import type { PropertyVariant } from '@tc96/ui/patterns'
import { type TaskItemId, taskItemIds } from './properties-data'
import { ptBRPropertyLabels } from './properties-labels.ts'

export interface PropertiesControls {
  ariaLabel: string
  defaultVisible: TaskItemId[]
  empty: boolean
  error: boolean
  icons: boolean
  labelsTrigger: string
  loading: boolean
  onRetry?: () => void
  readOnly: boolean
  variant: PropertyVariant
}

export const propertiesControlArgs: PropertiesControls = {
  ariaLabel: 'Task properties',
  defaultVisible: ['status', 'priority', 'assignee', 'dueDate'],
  empty: false,
  error: false,
  icons: true,
  labelsTrigger: ptBRPropertyLabels.collection.trigger,
  loading: false,
  readOnly: false,
  variant: 'badge',
}

export const propertiesControlArgTypes: Partial<ArgTypes<PropertiesControls>> =
  {
    ariaLabel: {
      control: 'text',
      description:
        'The `ariaLabel` of `PropertyCollection`, which names its `fieldset`.',
    },
    defaultVisible: {
      control: 'check',
      description:
        'Sets `defaultVisible: true` on these catalog items; the row starts with them.',
      options: taskItemIds,
    },
    empty: {
      control: 'boolean',
      description:
        'Passes no value to every display, so each surface renders muted with its placeholder.',
    },
    error: {
      control: 'boolean',
      description:
        'The `error` of `PropertyCollection`: the values give way to `labels.error` in an alert and, with `onRetry`, a `labels.retry` button; the menu trigger leaves.',
    },
    icons: {
      control: 'boolean',
      description:
        'Gives each catalog item an `icon`, shown beside its label in the menu.',
    },
    labelsTrigger: {
      control: 'text',
      description:
        '`labels.trigger` of `PropertyCollection`: the accessible name of the menu trigger.',
    },
    loading: {
      control: 'boolean',
      description:
        'The `loading` of `PropertyCollection`: one skeleton per visible property, named by `labels.loading`, and no menu trigger. Wins over `error`.',
    },
    readOnly: {
      control: 'boolean',
      description:
        'The `readOnly` of `PropertyCollection`: removes the menu trigger; the displays stay editable.',
    },
    variant: {
      control: 'inline-radio',
      description:
        'The `variant` every display passes to its `PropertySurface`: `badge` fills it, `plain` does not.',
      options: ['badge', 'plain'],
    },
  }
