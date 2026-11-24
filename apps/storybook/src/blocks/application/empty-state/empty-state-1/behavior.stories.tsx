import { UsersIcon } from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { EmptyState1 } from '@tc96/ui/blocks/application/empty-state/empty-state-1'
import { expect, fn, userEvent, within } from 'storybook/test'
import { guides } from '../fixtures/empty-state-1.ts'

const meta = {
  args: { guides, onCreate: fn(), onImport: fn() },
  component: EmptyState1,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Empty State/EmptyState1/Behavior',
} satisfies Meta<typeof EmptyState1>

export default meta

type Story = StoryObj<typeof meta>

export const ShowsTitleAndDescription: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('region', { name: 'Nenhum dado por aqui ainda' }),
    ).toBeVisible()
    await expect(canvas.getByText(/Importe uma planilha/)).toBeVisible()
  },
}

export const ImportCallsOnImport: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Importar' }),
    )
    await expect(args.onImport).toHaveBeenCalledTimes(1)
    await expect(args.onCreate).not.toHaveBeenCalled()
  },
}

export const CreateCallsOnCreate: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Criar manualmente' }),
    )
    await expect(args.onCreate).toHaveBeenCalledTimes(1)
    await expect(args.onImport).not.toHaveBeenCalled()
  },
}

export const ActionsRenderOnlyWithTheirCallback: Story = {
  args: { onCreate: undefined, onImport: undefined },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole('button')).toBeNull()
  },
}

export const GuidesRenderThroughRenderLink: Story = {
  args: {
    renderLink: (href) => (
      // biome-ignore lint/a11y/useAnchorContent: the block merges the guide text into this element
      <a data-router-link="" href={`/app${href}`} />
    ),
  },
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole('link', {
      name: 'Como importar uma planilha',
    })
    await expect(link).toHaveAttribute('href', '/app/ajuda/importar-planilha')
    await expect(link).toHaveAttribute('data-router-link')
  },
}

export const GuidesDefaultToPlainAnchors: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getAllByRole('link')).toHaveLength(3)
    await expect(
      canvas.getByRole('link', { name: 'Baixar o modelo de CSV' }),
    ).toHaveAttribute('href', '/ajuda/modelo-csv')
  },
}

export const WithoutGuidesTheListIsGone: Story = {
  args: { guides: [] },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole('navigation')).toBeNull()
  },
}

export const IconIsDecorative: Story = {
  args: { icon: <UsersIcon data-testid="custom-icon" /> },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByTestId('custom-icon')).toBeInTheDocument()
    await expect(
      canvasElement.querySelector('[data-slot="empty-media"]'),
    ).toBeInTheDocument()
  },
}

export const LabelsOverrideTexts: Story = {
  args: {
    labels: {
      create: 'Cadastrar',
      description: 'Traga seus clientes.',
      guides: 'Ajuda',
      import: 'Enviar arquivo',
      title: 'Sem clientes',
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('region', { name: 'Sem clientes' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Enviar arquivo' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Cadastrar' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('navigation', { name: 'Ajuda' }),
    ).toBeVisible()
  },
}
