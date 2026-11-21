import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type TabsControls,
  tabsControlArgs,
  tabsControlArgTypes,
} from './tabs-controls.ts'
import { inactiveTabContrast, TabsCanvas } from './tabs-frame.tsx'
import { ComposedTabs } from './tabs-layouts.tsx'

const meta = {
  args: tabsControlArgs,
  argTypes: tabsControlArgTypes,
  decorators: [TabsCanvas],
  parameters: { ...inactiveTabContrast, layout: 'centered' },
  render: (args) => <ComposedTabs {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Tabs/Playground',
} satisfies Meta<TabsControls>

export default meta

type Story = StoryObj<TabsControls>

export const Playground: Story = {}
