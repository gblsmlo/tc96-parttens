import type { Meta, StoryObj } from '@storybook/react-vite'
import { tabsControlArgs } from './tabs-controls.ts'
import { TabsCanvas } from './tabs-frame.tsx'
import { ComposedTabs } from './tabs-layouts.tsx'

const meta = {
  decorators: [TabsCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Tabs/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const WithIcons: Story = {
  render: () => <ComposedTabs {...tabsControlArgs} icons />,
}

export const IconOnly: Story = {
  render: () => <ComposedTabs {...tabsControlArgs} iconOnly />,
}

export const FullWidth: Story = {
  render: () => <ComposedTabs {...tabsControlArgs} listClassName="w-full" />,
}
