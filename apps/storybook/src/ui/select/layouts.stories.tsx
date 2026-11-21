import type { Meta, StoryObj } from '@storybook/react-vite'
import { selectControlArgs } from './select-controls.ts'
import { SelectCanvas } from './select-frame.tsx'
import {
  ComposedSelect,
  FieldSelect,
  SelectButtonCombobox,
} from './select-layouts.tsx'

const meta = {
  decorators: [SelectCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Select/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const WithoutLabel: Story = {
  render: () => <ComposedSelect {...selectControlArgs} label="" />,
}

export const WithIcon: Story = {
  render: () => <ComposedSelect {...selectControlArgs} icon />,
}

export const WithGroups: Story = {
  render: () => <ComposedSelect {...selectControlArgs} groups open />,
}

export const Multiple: Story = {
  render: () => (
    <ComposedSelect
      {...selectControlArgs}
      defaultValue={['next', 'vite']}
      multiple
    />
  ),
}

export const InField: Story = {
  render: () => <FieldSelect />,
}

export const SelectButtonAsTrigger: Story = {
  name: 'SelectButton as trigger',
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            selector: '*:not(button[data-placeholder] > span.flex-1)',
          },
        ],
      },
    },
  },
  render: () => <SelectButtonCombobox />,
}
