import { DotsThreeIcon } from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { AgentBuilderMenu } from '@tc96/ui/blocks/ai-agents/flow/agent-builder/partials'
import { Button } from '@tc96/ui/button'
import { Menu, MenuPopup, MenuTrigger } from '@tc96/ui/menu'
import { expect, fn, userEvent, within } from 'storybook/test'

const meta = {
  args: {
    onClearResults: fn(),
    onCopyJson: fn(),
    onRestoreExample: fn(),
  },
  component: AgentBuilderMenu,
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
        <AgentBuilderMenu {...args} />
      </MenuPopup>
    </Menu>
  ),
  tags: ['!autodocs'],
  title: 'Blocks/AI & Agents/Flow/AgentBuilder/Partials/Menu',
} satisfies Meta<typeof AgentBuilderMenu>

export default meta

type Story = StoryObj<typeof meta>

const screen = () => within(document.body)

export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Ações do agente' }),
    )
    await userEvent.click(
      await screen().findByRole('menuitem', { name: 'Copiar como JSON' }),
    )
    await expect(args.onCopyJson).toHaveBeenCalledOnce()
  },
}

export const CopyOnly: Story = {
  args: { onClearResults: undefined, onRestoreExample: undefined },
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Ações do agente' }),
    )
    await expect(await screen().findAllByRole('menuitem')).toHaveLength(1)
    await expect(screen().queryByRole('separator')).toBeNull()
  },
}
