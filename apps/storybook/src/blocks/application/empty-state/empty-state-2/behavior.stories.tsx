import { MagnifyingGlassIcon } from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { EmptyState2 } from '@tc96/blocks/application/empty-state/empty-state-2'
import { expect, fn, userEvent, within } from 'storybook/test'
import { suggestions } from '../fixtures/empty-state-2.ts'

const meta = {
  args: {
    onClear: fn(),
    onSuggestion: fn(),
    query: 'fatura atrasada',
    suggestions,
  },
  component: EmptyState2,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Empty State/EmptyState2/Behavior',
} satisfies Meta<typeof EmptyState2>

export default meta

type Story = StoryObj<typeof meta>

export const TitleNamesTheQuery: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText(
        'Nenhum resultado para “fatura atrasada”',
      ),
    ).toBeVisible()
    await expect(within(canvasElement).getByRole('status')).toBeInTheDocument()
  },
}

export const SuggestionCallsOnSuggestionWithItsText: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'cliente ativo' }),
    )
    await expect(args.onSuggestion).toHaveBeenCalledWith('cliente ativo')
    await expect(args.onSuggestion).toHaveBeenCalledTimes(1)
  },
}

export const EverySuggestionIsAButton: Story = {
  play: async ({ canvasElement }) => {
    const list = within(canvasElement).getByRole('list', {
      name: 'Tente buscar por',
    })
    await expect(within(list).getAllByRole('button')).toHaveLength(3)
  },
}

export const ClearCallsOnClear: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Limpar busca' }),
    )
    await expect(args.onClear).toHaveBeenCalledTimes(1)
  },
}

export const ClearRendersOnlyWithOnClear: Story = {
  args: { onClear: undefined },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', { name: 'Limpar busca' }),
    ).toBeNull()
  },
}

export const SuggestionsRenderOnlyWithOnSuggestion: Story = {
  args: { onSuggestion: undefined },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole('list')).toBeNull()
    await expect(
      within(canvasElement).queryByRole('button', { name: 'fatura' }),
    ).toBeNull()
  },
}

export const WithoutSuggestionsTheListIsGone: Story = {
  args: { suggestions: [] },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole('list')).toBeNull()
  },
}

export const IconIsReplaceable: Story = {
  args: { icon: <MagnifyingGlassIcon data-testid="custom-icon" /> },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByTestId('custom-icon'),
    ).toBeInTheDocument()
  },
}

export const LabelsOverrideTexts: Story = {
  args: {
    labels: {
      clear: 'Zerar',
      description: 'Outra dica.',
      suggestions: 'Sugestões',
      title: (query) => `Sem resultados: ${query}`,
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Sem resultados: fatura atrasada'),
    ).toBeVisible()
    await expect(canvas.getByText('Outra dica.')).toBeVisible()
    await expect(canvas.getByRole('list', { name: 'Sugestões' })).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Zerar' })).toBeVisible()
  },
}
