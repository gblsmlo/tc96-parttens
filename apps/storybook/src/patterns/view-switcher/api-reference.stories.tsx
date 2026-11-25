import type { Meta, StoryObj } from '@storybook/react-vite'
import { ViewSwitcherMenu } from '@tc96/ui/patterns'
import { IconSlot, Slot } from '../../test-utils/anatomy-slot'
import { ViewSwitcherCanvas } from './view-switcher-canvas.tsx'

const meta = {
  args: { children: null, label: 'ViewSwitcherMenu' },
  component: ViewSwitcherMenu,
  decorators: [ViewSwitcherCanvas],
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs', '!dev'],
  title: 'Patterns/ViewSwitcher/API Reference',
} satisfies Meta<typeof ViewSwitcherMenu>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  render: () => (
    <ViewSwitcherMenu icon={<IconSlot />} label="ViewSwitcherMenu">
      <Slot name="children" />
    </ViewSwitcherMenu>
  ),
}
