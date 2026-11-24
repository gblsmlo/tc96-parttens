import { RocketIcon } from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { EmptyState3 } from '@tc96/blocks/application/empty-state/empty-state-3'
import { expect, fn, userEvent, within } from 'storybook/test'
import { templates } from '../fixtures/empty-state-3.ts'

const meta = {
  args: { onCreate: fn(), onImport: fn(), onTemplate: fn(), templates },
  component: EmptyState3,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Empty State/EmptyState3/Behavior',
} satisfies Meta<typeof EmptyState3>

export default meta

type Story = StoryObj<typeof meta>

export const ShowsTitleAndDescription: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('region', { name: 'Crie seu primeiro projeto' }),
    ).toBeVisible()
    await expect(canvas.getByText(/Organize tarefas/)).toBeVisible()
  },
}

export const CreateCallsOnCreate: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Criar projeto' }),
    )
    await expect(args.onCreate).toHaveBeenCalledTimes(1)
    await expect(args.onImport).not.toHaveBeenCalled()
  },
}

export const ImportCallsOnImport: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Importar projeto' }),
    )
    await expect(args.onImport).toHaveBeenCalledTimes(1)
    await expect(args.onCreate).not.toHaveBeenCalled()
  },
}

export const ActionsRenderOnlyWithTheirCallback: Story = {
  args: { onCreate: undefined, onImport: undefined, templates: [] },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole('button')).toBeNull()
  },
}

export const EveryTemplateIsAButton: Story = {
  play: async ({ canvasElement }) => {
    const list = within(canvasElement).getByRole('list', {
      name: 'Comece por um modelo',
    })
    await expect(within(list).getAllByRole('button')).toHaveLength(3)
    await expect(
      within(list).getByText('Calendário editorial com pauta e revisão.'),
    ).toBeVisible()
  },
}

export const TemplateCallsOnTemplateWithItsId: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: /Planejamento de sprint/,
      }),
    )
    await expect(args.onTemplate).toHaveBeenCalledWith('sprint')
    await expect(args.onTemplate).toHaveBeenCalledTimes(1)
  },
}

export const WithoutTemplatesTheListIsGone: Story = {
  args: { templates: [] },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole('list')).toBeNull()
  },
}

export const TemplateIconIsReplaceable: Story = {
  args: {
    templates: [
      {
        icon: <RocketIcon data-testid="template-icon" />,
        id: 'x',
        title: 'Modelo X',
      },
    ],
  },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByTestId('template-icon'),
    ).toBeInTheDocument()
  },
}

export const LabelsOverrideTexts: Story = {
  args: {
    labels: {
      create: 'Novo',
      description: 'Descrição própria.',
      import: 'Trazer',
      templates: 'Modelos prontos',
      title: 'Primeiro projeto',
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('region', { name: 'Primeiro projeto' }),
    ).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Novo' })).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Trazer' })).toBeVisible()
    await expect(
      canvas.getByRole('list', { name: 'Modelos prontos' }),
    ).toBeVisible()
  },
}
