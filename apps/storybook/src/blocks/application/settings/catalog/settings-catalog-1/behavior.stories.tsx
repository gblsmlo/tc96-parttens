import type { Meta, StoryObj } from '@storybook/react-vite'
import { SettingsCatalog1 } from '@tc96/ui/blocks/application/settings/catalog/settings-catalog-1'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { tags } from '../../fixtures/tags.ts'
import {
  type SettingsCatalog1Controls,
  settingsCatalog1ControlArgs,
} from './settings-catalog-1-controls.ts'
import { ComposedSettingsCatalog1 } from './settings-catalog-1-layouts.tsx'

const retryHandler = fn()

const meta = {
  args: { ...settingsCatalog1ControlArgs, onCreate: fn(), onTagAction: fn() },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettingsCatalog1 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Catalog/Settings1/Behavior',
} satisfies Meta<
  SettingsCatalog1Controls & {
    onCreate: () => void
    onTagAction: (tagId: string, action: string) => void
  }
>

export default meta

type Story = StoryObj<typeof meta>

export const EmptyListShowsStateSurface: Story = {
  args: { empty: true },
  play: async ({ canvasElement }) => {
    const status = within(canvasElement).getByRole('status')
    await expect(status).toHaveAttribute('data-kind', 'empty')
    await expect(status).toHaveTextContent('Nenhuma tag ainda')
  },
}

export const NewTagButtonCallsOnCreate: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Nova tag' }),
    )
    await expect(args.onCreate).toHaveBeenCalledOnce()
  },
}

export const NewTagButtonNeedsOnCreate: Story = {
  args: { withActions: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByRole('button', { name: 'Nova tag' })).toBeNull()
    await expect(canvas.queryByRole('button', { name: /^Ações de/ })).toBeNull()
  },
}

export const RowMenuCallsOnTagAction: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Ações de Cliente ativo',
      }),
    )
    const items = await screen.findAllByRole('menuitem')
    await expect(items.map((item) => item.textContent)).toEqual([
      'Editar',
      'Adicionar subtag',
      'Excluir',
    ])
    await userEvent.click(screen.getByRole('menuitem', { name: 'Excluir' }))
    await waitFor(() =>
      expect(args.onTagAction).toHaveBeenCalledWith(
        'tag-cliente-ativo',
        'delete',
      ),
    )
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}

export const SubtagRowHasNoAddSubtag: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Subtag de Cliente ativo')).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Ações de Renovação em 30 dias' }),
    )
    const items = await screen.findAllByRole('menuitem')
    await expect(items.map((item) => item.textContent)).toEqual([
      'Editar',
      'Excluir',
    ])
    await userEvent.click(screen.getByRole('menuitem', { name: 'Editar' }))
    await waitFor(() =>
      expect(args.onTagAction).toHaveBeenCalledWith('tag-renovacao', 'edit'),
    )
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}

export const LabelsOverrideTexts: Story = {
  render: (args) => (
    <SettingsCatalog1
      labels={{
        actions: (name) => `Opções de ${name}`,
        newTag: 'Criar etiqueta',
        subtagOf: (parent) => `Dentro de ${parent}`,
        title: 'Etiquetas',
      }}
      onCreate={args.onCreate}
      onTagAction={args.onTagAction}
      tags={tags}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Etiquetas')).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Criar etiqueta' }),
    ).toBeVisible()
    await expect(canvas.getByText('Dentro de Cliente ativo')).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Opções de Indicação' }),
    ).toBeVisible()
    await expect(canvas.queryByText('Tags')).toBeNull()
  },
}

export const PendingShowsSkeleton: Story = {
  render: (args) => <ComposedSettingsCatalog1 {...args} pending />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('Carregando tags'),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(
      canvasElement.querySelector('[data-slot="settings-row"], table'),
    ).toBeNull()
  },
}

export const ErrorRetryCallsOnRetry: Story = {
  render: (args) => (
    <ComposedSettingsCatalog1 {...args} error onRetry={retryHandler} />
  ),
  play: async ({ canvasElement }) => {
    retryHandler.mockClear()
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('alert')).toHaveAttribute(
      'data-kind',
      'error',
    )
    await userEvent.click(
      canvas.getByRole('button', { name: 'Tentar novamente' }),
    )
    await expect(retryHandler).toHaveBeenCalledOnce()
  },
}

export const ErrorWithoutOnRetryHasNoButton: Story = {
  render: (args) => <ComposedSettingsCatalog1 {...args} error />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('alert')).toBeVisible()
    await expect(
      canvas.queryByRole('button', { name: 'Tentar novamente' }),
    ).toBeNull()
  },
}

export const PendingWinsOverError: Story = {
  render: (args) => <ComposedSettingsCatalog1 {...args} error pending />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando tags')).toHaveAttribute(
      'aria-busy',
      'true',
    )
    await expect(canvas.queryByRole('alert')).toBeNull()
  },
}

export const ErrorWinsOverEmpty: Story = {
  render: (args) => <ComposedSettingsCatalog1 {...args} empty error />,
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('alert')).toBeVisible()
    await expect(canvasElement.querySelector('[data-kind="empty"]')).toBeNull()
  },
}
