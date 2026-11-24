import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card5, type Card5Props } from '@tc96/ui/blocks/application/card/card-5'
import { expect, fn, userEvent, within } from 'storybook/test'
import { shortcuts } from '../fixtures/card-5.ts'
import { type Card5Controls, card5ControlArgs } from './card-5-controls.ts'
import { ComposedCard5 } from './card-5-layouts.tsx'

const loaded: Card5Props = { shortcuts }

const retry = fn()

const meta = {
  args: { ...card5ControlArgs, onSelect: fn() },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedCard5 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Card/Card5/Behavior',
} satisfies Meta<Card5Controls & { onSelect: (shortcutId: string) => void }>

export default meta

type Story = StoryObj<typeof meta>

export const TilesShowTitleAndDescription: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getAllByRole('listitem')).toHaveLength(shortcuts.length)
    await expect(canvas.getByText('Emitir fatura')).toBeVisible()
    await expect(
      canvas.getByText('Gere uma cobrança para um cliente.'),
    ).toBeVisible()
  },
}

export const ShortcutWithoutHrefIsAButton: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: /Emitir fatura/ }),
    )
    await expect(args.onSelect).toHaveBeenCalledTimes(1)
    await expect(args.onSelect).toHaveBeenCalledWith('invoice')
  },
}

export const ShortcutWithHrefIsALink: Story = {
  play: async ({ args, canvasElement }) => {
    const link = within(canvasElement).getByRole('link', {
      name: /Central de ajuda/,
    })
    await expect(link).toHaveAttribute('href', '/ajuda')
    await expect(link.closest('button')).toBeNull()
    await expect(args.onSelect).not.toHaveBeenCalled()
  },
}

export const WithoutLinksEveryShortcutIsAButton: Story = {
  args: { withLinks: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByRole('link')).toBeNull()
    await expect(canvas.getAllByRole('button')).toHaveLength(shortcuts.length)
  },
}

export const RenderLinkReplacesTheAnchor: Story = {
  render: () => (
    <Card5
      renderLink={(href) => (
        // biome-ignore lint/a11y/useAnchorContent: the block merges the tile content into this element
        <a data-router-link="" href={`/app${href}`} />
      )}
      shortcuts={shortcuts}
    />
  ),
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole('link', {
      name: /Central de ajuda/,
    })
    await expect(link).toHaveAttribute('href', '/app/ajuda')
    await expect(link).toHaveAttribute('data-router-link')
  },
}

export const EmptyShortcutsShowTheEmptyState: Story = {
  args: { empty: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Nenhum atalho disponível')).toBeVisible()
    await expect(canvas.queryByRole('listitem')).toBeNull()
  },
}

export const LabelsOverrideTexts: Story = {
  render: () => (
    <Card5 labels={{ title: 'Ações frequentes' }} shortcuts={shortcuts} />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('region', { name: 'Ações frequentes' }),
    ).toBeVisible()
  },
}

export const PendingShowsSkeleton: Story = {
  render: () => <Card5 {...loaded} pending />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando atalhos')).toHaveAttribute(
      'aria-busy',
      'true',
    )
    await expect(canvas.queryByRole('alert')).toBeNull()
  },
}

export const ErrorRetryCallsOnRetry: Story = {
  render: () => <Card5 {...loaded} error onRetry={retry} />,
  play: async ({ canvasElement }) => {
    retry.mockClear()
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Não foi possível carregar os atalhos'),
    ).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Tentar novamente' }),
    )
    await expect(retry).toHaveBeenCalledOnce()
  },
}

export const ErrorWithoutOnRetryHasNoButton: Story = {
  render: () => <Card5 {...loaded} error />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', { name: 'Tentar novamente' }),
    ).toBeNull()
  },
}

export const PendingWinsOverError: Story = {
  render: () => <Card5 {...loaded} error pending />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando atalhos')).toBeVisible()
    await expect(
      canvas.queryByText('Não foi possível carregar os atalhos'),
    ).toBeNull()
  },
}

export const ErrorWinsOverEmpty: Story = {
  render: () => <Card5 {...loaded} shortcuts={[]} error />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Não foi possível carregar os atalhos'),
    ).toBeVisible()
    await expect(canvas.queryByText('Nenhum atalho disponível')).toBeNull()
  },
}
