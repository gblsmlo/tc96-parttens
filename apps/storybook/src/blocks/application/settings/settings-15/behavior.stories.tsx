import type { Meta, StoryObj } from '@storybook/react-vite'
import { Settings15 } from '@tc96/ui/blocks/application/settings/settings-15'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { settings15Categories } from '../fixtures/settings-15.ts'
import {
  type Settings15Controls,
  settings15ControlArgs,
} from './settings-15-controls.ts'
import { ComposedSettings15 } from './settings-15-layouts.tsx'

const retryHandler = fn()

const meta = {
  args: {
    ...settings15ControlArgs,
    onCategoryAction: fn(),
    onCreate: fn(),
  },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettings15 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Settings15/Behavior',
} satisfies Meta<
  Settings15Controls & {
    onCategoryAction: (categoryId: string, action: string) => void
    onCreate: () => void
  }
>

export default meta

type Story = StoryObj<typeof meta>

export const EmptyListShowsStateSurface: Story = {
  args: { empty: true },
  play: async ({ canvasElement }) => {
    const status = within(canvasElement).getByRole('status')
    await expect(status).toHaveAttribute('data-kind', 'empty')
    await expect(status).toHaveTextContent('Nenhuma categoria ainda')
  },
}

export const NewCategoryButtonCallsOnCreate: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Nova categoria' }),
    )
    await expect(args.onCreate).toHaveBeenCalledOnce()
  },
}

export const NewCategoryButtonNeedsOnCreate: Story = {
  args: { withActions: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.queryByRole('button', { name: 'Nova categoria' }),
    ).toBeNull()
    await expect(canvas.queryByRole('button', { name: /^Ações de/ })).toBeNull()
  },
}

export const TopLevelMenuCallsAddSubcategory: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Ações de Custas processuais',
      }),
    )
    const items = await screen.findAllByRole('menuitem')
    await expect(items.map((item) => item.textContent)).toEqual([
      'Editar',
      'Adicionar subcategoria',
      'Arquivar',
    ])
    await userEvent.click(
      screen.getByRole('menuitem', { name: 'Adicionar subcategoria' }),
    )
    await waitFor(() =>
      expect(args.onCategoryAction).toHaveBeenCalledWith(
        'cat-custas',
        'add-subcategory',
      ),
    )
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}

export const ArchiveCallsOnCategoryAction: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Ações de Despesas administrativas',
      }),
    )
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Arquivar' }),
    )
    await waitFor(() =>
      expect(args.onCategoryAction).toHaveBeenCalledWith(
        'cat-despesas',
        'archive',
      ),
    )
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}

export const SubcategoryMenuHasNoAddSubcategory: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Subcategoria de Honorários')).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Ações de Consultas' }),
    )
    const items = await screen.findAllByRole('menuitem')
    await expect(items.map((item) => item.textContent)).toEqual([
      'Editar',
      'Arquivar',
    ])
    await userEvent.click(screen.getByRole('menuitem', { name: 'Editar' }))
    await waitFor(() =>
      expect(args.onCategoryAction).toHaveBeenCalledWith(
        'cat-honorarios-consultas',
        'edit',
      ),
    )
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}

export const DirectionShowsOnTopLevelOnly: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getAllByText('Receita')).toHaveLength(1)
    await expect(canvas.getAllByText('Despesa')).toHaveLength(2)
  },
}

export const ArchivedCategoriesStayCollapsed: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Arquivadas')).toBeVisible()
    await expect(canvas.queryByText('Viagens antigas')).toBeNull()
    await userEvent.click(canvas.getByText('Arquivadas'))
    await expect(canvas.getByText('Viagens antigas')).toBeVisible()
  },
}

export const RestoreCallsOnCategoryAction: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByText('Arquivadas'))
    await userEvent.click(
      canvas.getByRole('button', { name: 'Ações de Viagens antigas' }),
    )
    const items = await screen.findAllByRole('menuitem')
    await expect(items.map((item) => item.textContent)).toEqual(['Restaurar'])
    await userEvent.click(screen.getByRole('menuitem', { name: 'Restaurar' }))
    await waitFor(() =>
      expect(args.onCategoryAction).toHaveBeenCalledWith(
        'cat-viagens',
        'restore',
      ),
    )
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}

export const NoArchivedSectionWithoutArchivedCategories: Story = {
  args: { withArchived: false },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByText('Arquivadas')).toBeNull()
  },
}

export const LabelsOverrideTexts: Story = {
  render: (args) => (
    <Settings15
      categories={settings15Categories}
      labels={{
        actions: (name) => `Opções de ${name}`,
        newCategory: 'Criar categoria',
        subcategoryOf: (parent) => `Dentro de ${parent}`,
        title: 'Plano de contas',
      }}
      onCategoryAction={args.onCategoryAction}
      onCreate={args.onCreate}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Plano de contas')).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Criar categoria' }),
    ).toBeVisible()
    await expect(canvas.getByText('Dentro de Honorários')).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Opções de Custas processuais' }),
    ).toBeVisible()
    await expect(canvas.queryByText('Categorias')).toBeNull()
  },
}

export const PendingShowsSkeleton: Story = {
  render: (args) => <ComposedSettings15 {...args} pending />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('Carregando categorias'),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(
      canvasElement.querySelector('[data-slot="settings-row"], table'),
    ).toBeNull()
  },
}

export const ErrorRetryCallsOnRetry: Story = {
  render: (args) => (
    <ComposedSettings15 {...args} error onRetry={retryHandler} />
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
  render: (args) => <ComposedSettings15 {...args} error />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('alert')).toBeVisible()
    await expect(
      canvas.queryByRole('button', { name: 'Tentar novamente' }),
    ).toBeNull()
  },
}

export const PendingWinsOverError: Story = {
  render: (args) => <ComposedSettings15 {...args} error pending />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByLabelText('Carregando categorias'),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(canvas.queryByRole('alert')).toBeNull()
  },
}

export const ErrorWinsOverEmpty: Story = {
  render: (args) => <ComposedSettings15 {...args} empty error />,
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('alert')).toBeVisible()
    await expect(canvasElement.querySelector('[data-kind="empty"]')).toBeNull()
  },
}
