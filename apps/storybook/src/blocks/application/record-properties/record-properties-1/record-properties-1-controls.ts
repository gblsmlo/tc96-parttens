import type { ArgTypes } from '@storybook/react-vite'
import type { TaskPropertiesProps } from './record-properties-1-layouts.tsx'

export type RecordProperties1Controls = Required<TaskPropertiesProps>

export const recordProperties1ControlArgs: RecordProperties1Controls = {
  customProperty: false,
  iconlessKeys: ['status', 'priority'],
  pendingKeys: [],
  showLabelIcons: true,
}

export const recordProperties1ControlArgTypes: Partial<
  ArgTypes<RecordProperties1Controls>
> = {
  customProperty: {
    control: 'boolean',
    description:
      'Adds an item outside the catalog, with its own `label` and `icon`.',
  },
  iconlessKeys: {
    control: 'check',
    description: 'Items that pass `icon: null` and render no label icon.',
    options: ['status', 'priority', 'type', 'owner', 'tags'],
  },
  pendingKeys: {
    control: 'check',
    description:
      'Items that pass `pending: true` and show a skeleton in place of the value.',
    options: ['status', 'priority', 'type', 'owner', 'tags'],
  },
  showLabelIcons: {
    control: 'boolean',
    description: 'Value of `showLabelIcons`; `false` hides every label icon.',
  },
}
