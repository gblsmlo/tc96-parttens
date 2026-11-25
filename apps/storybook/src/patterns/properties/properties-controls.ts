import type { ArgTypes } from '@storybook/react-vite'
import type { PropertyVariant } from '@tc96/ui/patterns'
import { type TaskItemId, taskItemIds } from './properties-data'
import { ptBRPropertyLabels } from './properties-labels.ts'

export interface PropertiesControls {
  ariaLabel: string
  defaultVisible: TaskItemId[]
  empty: boolean
  icons: boolean
  labelsTrigger: string
  readOnly: boolean
  variant: PropertyVariant
}

export const propertiesControlArgs: PropertiesControls = {
  ariaLabel: 'Task properties',
  defaultVisible: ['status', 'priority', 'assignee', 'dueDate'],
  empty: false,
  icons: true,
  labelsTrigger: ptBRPropertyLabels.collection.trigger,
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
