import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tabs, TabsList, TabsPanel, TabsTab } from '@tc96/ui/tabs'
import { Slot } from '../../test-utils/anatomy-slot'
import { TabsCanvas } from './tabs-frame.tsx'

const meta = {
  component: Tabs,
  decorators: [TabsCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs', '!dev'],
  title: 'UI/Tabs/API Reference',
} satisfies Meta<typeof Tabs>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  args: { defaultValue: 'first' },
  render: (args) => (
    <Tabs {...args}>
      <TabsList>
        <TabsTab value="first">TabsTab</TabsTab>
        <TabsTab value="second">TabsTab</TabsTab>
      </TabsList>
      <TabsPanel value="first">
        <Slot name="TabsPanel" />
      </TabsPanel>
      <TabsPanel value="second">
        <Slot name="TabsPanel" />
      </TabsPanel>
    </Tabs>
  ),
}
