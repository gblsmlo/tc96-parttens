import type { Meta, StoryObj } from '@storybook/react-vite'
import { comboboxControlArgs } from './combobox-controls.ts'
import { ComboboxCanvas } from './combobox-frame.tsx'
import {
  ComposedCombobox,
  FieldCombobox,
  GroupedCombobox,
  InputInsidePopupCombobox,
} from './combobox-layouts.tsx'

const meta = {
  decorators: [ComboboxCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Combobox/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const WithStartAddon: Story = {
  render: () => <ComposedCombobox {...comboboxControlArgs} startAddon />,
}

export const WithClear: Story = {
  render: () => (
    <ComposedCombobox
      {...comboboxControlArgs}
      defaultValue={['mango']}
      showClear
    />
  ),
}

export const WithoutTrigger: Story = {
  render: () => (
    <ComposedCombobox {...comboboxControlArgs} showTrigger={false} />
  ),
}

export const Multiple: Story = {
  render: () => (
    <ComposedCombobox
      {...comboboxControlArgs}
      defaultValue={['apple', 'mango']}
      multiple
    />
  ),
}

export const WithGroups: Story = {
  render: () => <GroupedCombobox />,
}

export const InputInsidePopup: Story = {
  render: () => <InputInsidePopupCombobox />,
}

export const InField: Story = {
  render: () => <FieldCombobox />,
}
