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
  parameters: {
    ...inactiveTabContrast,
    controls: { exclude: ['disabledTab', 'orientation', 'size', 'variant'] },
    layout: 'centered',
  },
  render: (args) => <ComposedTabs {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Tabs/Stories',
} satisfies Meta<TabsControls>

export default meta

type Story = StoryObj<TabsControls>

export const Default: Story = {}

export const Underline: Story = {
  args: { variant: 'underline' },
}

export const SizeSm: Story = {
  args: { size: 'sm' },
  name: 'Size sm',
}

export const SizeLg: Story = {
  args: { size: 'lg' },
  name: 'Size lg',
}

export const Vertical: Story = {
  args: { orientation: 'vertical' },
}

export const DisabledTab: Story = {
  args: { disabledTab: true },
  name: 'Disabled tab',
}
