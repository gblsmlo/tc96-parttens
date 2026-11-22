import type { Meta, StoryObj } from '@storybook/react-vite'
import { SettingsCanvas } from './settings-canvas.tsx'
import { settingsControlArgs } from './settings-controls.ts'
import { ComposedSettings } from './settings-layouts.tsx'

const meta = {
  decorators: [SettingsCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'Patterns/Surfaces/Settings/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Untitled: Story = {
  render: () => (
    <ComposedSettings {...settingsControlArgs} group={false} title="" />
  ),
}

export const HeaderTitleOnly: Story = {
  render: () => (
    <ComposedSettings {...settingsControlArgs} action={false} description="" />
  ),
}

export const RowsOnly: Story = {
  render: () => <ComposedSettings {...settingsControlArgs} group={false} />,
}

export const TitleOnlyRow: Story = {
  render: () => (
    <ComposedSettings
      {...settingsControlArgs}
      control="none"
      icon={false}
      rowDescription=""
    />
  ),
}

export const ReadOnlyValue: Story = {
  render: () => <ComposedSettings {...settingsControlArgs} control="text" />,
}

export const WithSelect: Story = {
  render: () => <ComposedSettings {...settingsControlArgs} control="select" />,
}

export const WithInput: Story = {
  render: () => <ComposedSettings {...settingsControlArgs} control="input" />,
}

export const WithMenu: Story = {
  render: () => <ComposedSettings {...settingsControlArgs} control="menu" />,
}

export const GroupWithActions: Story = {
  render: () => <ComposedSettings {...settingsControlArgs} groupActions />,
}
