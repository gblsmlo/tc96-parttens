import type { Meta, StoryObj } from '@storybook/react-vite'
import { ActionBar, type ActionBarGroup } from '@tc96/ui/patterns'
import { IconSlot } from '../../test-utils/anatomy-slot'

const clearNothing = () => {}

const anatomyActions: ActionBarGroup[] = [
  {
    id: 'first',
    items: [
      { id: 'primary', label: 'ActionBarItem', variant: 'primary' },
      {
        icon: <IconSlot />,
        id: 'shortcut',
        label: 'ActionBarItem',
        shortcut: 'K',
      },
    ],
  },
  {
    id: 'second',
    items: [
      {
        label: 'ActionBarItem with submenu',
        submenu: [
          {
            items: [{ label: 'ActionBarItem' }],
            label: 'ActionBarGroup',
          },
        ],
      },
    ],
  },
]

const meta = {
  component: ActionBar,
  parameters: { layout: 'centered' },
  tags: ['!autodocs', '!dev'],
  title: 'Patterns/ActionBar/API Reference',
} satisfies Meta<typeof ActionBar>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  args: { actions: anatomyActions, selectedCount: 1 },
  render: (args) => <ActionBar {...args} onClearSelection={clearNothing} />,
}
