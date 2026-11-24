import type { Meta, StoryObj } from '@storybook/react-vite'
import { EmptyState4 } from '@tc96/ui/blocks/application/empty-state/empty-state-4'
import { expect, fn, userEvent, within } from 'storybook/test'
import {
  type EmptyState4Controls,
  emptyState4ControlArgs,
} from './empty-state-4-controls.ts'
import { ComposedEmptyState4 } from './empty-state-4-layouts.tsx'

const meta = {
  args: emptyState4ControlArgs,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedEmptyState4 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Empty State/EmptyState4/Behavior',
} satisfies Meta<EmptyState4Controls>

export default meta

type Story = StoryObj<typeof meta>

export const ShowsTitleDescriptionAndBothActions: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Você ainda está sozinho por aqui'),
    ).toBeVisible()
    await expect(canvas.getByText(/Convide colegas/)).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Convidar' })).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Copiar link' }),
    ).toBeVisible()
  },
}

const onInvite = fn()
const onCopyLink = fn()

export const ClicksCallTheirHandlers: Story = {
  render: () => <EmptyState4 onCopyLink={onCopyLink} onInvite={onInvite} />,
  play: async ({ canvasElement }) => {
    onInvite.mockClear()
    onCopyLink.mockClear()
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Convidar' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Copiar link' }))
    await expect(onInvite).toHaveBeenCalledTimes(1)
    await expect(onCopyLink).toHaveBeenCalledTimes(1)
  },
}

export const InviteNeedsOnInvite: Story = {
  args: { invite: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByRole('button', { name: 'Convidar' })).toBeNull()
    await expect(
      canvas.getByRole('button', { name: 'Copiar link' }),
    ).toBeVisible()
  },
}

export const CopyNeedsOnCopyLink: Story = {
  args: { copyLink: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.queryByRole('button', { name: 'Copiar link' }),
    ).toBeNull()
    await expect(canvas.getByRole('button', { name: 'Convidar' })).toBeVisible()
  },
}

export const NoHandlersRendersNoButtons: Story = {
  args: { copyLink: false, invite: false },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryAllByRole('button')).toHaveLength(0)
  },
}

export const CopiedSwitchesTheCopyLabel: Story = {
  args: { copied: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('button', { name: 'Link copiado' }),
    ).toBeVisible()
    await expect(
      canvas.queryByRole('button', { name: 'Copiar link' }),
    ).toBeNull()
  },
}

export const LabelsOverrideTexts: Story = {
  render: () => (
    <EmptyState4
      labels={{ invite: 'Chamar', title: 'Equipe vazia' }}
      onInvite={() => {}}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Equipe vazia')).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Chamar' })).toBeVisible()
  },
}
