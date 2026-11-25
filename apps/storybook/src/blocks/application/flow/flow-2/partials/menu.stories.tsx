import { DotsThreeIcon } from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Flow2Menu } from '@tc96/ui/blocks/application/flow/flow-2/partials'
import { Button } from '@tc96/ui/button'
import { Menu, MenuPopup, MenuTrigger } from '@tc96/ui/menu'
import { fn } from 'storybook/test'

const meta = {
  args: {
    onClearResults: fn(),
    onCopyJson: fn(),
    onRestoreExample: fn(),
  },
  component: Flow2Menu,
  render: (args) => (
    <Menu>
      <MenuTrigger
        render={
          <Button aria-label="Ações do agente" size="icon" variant="outline" />
        }
      >
        <DotsThreeIcon aria-hidden="true" />
      </MenuTrigger>
      <MenuPopup align="start">
        <Flow2Menu {...args} />
      </MenuPopup>
    </Menu>
  ),
  tags: ['!autodocs'],
  title: 'Blocks/Application/Flow/Flow2/Partials/Menu',
} satisfies Meta<typeof Flow2Menu>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const CopyOnly: Story = {
  args: { onClearResults: undefined, onRestoreExample: undefined },
}
