import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  SettingsCatalog9,
  type SettingsCatalog9Category,
} from '@tc96/ui/blocks/application/settings/catalog/settings-catalog-9'
import { expect, fn, userEvent, within } from 'storybook/test'
import { fetchJson } from '../../../../../mocks/api.ts'
import { settingsCatalog9Handlers } from '../../../../../mocks/settings-catalog-9.ts'
import { settingsCatalog9ControlArgs } from './settings-catalog-9-controls.ts'
import { ComposedSettingsCatalog9 } from './settings-catalog-9-layouts.tsx'

const WorkspaceCategories = () => {
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () =>
      fetchJson<SettingsCatalog9Category[]>('/settings/categories'),
    queryKey: ['settings', 'categories'],
  })

  if (isPending || isError)
    return (
      <ComposedSettingsCatalog9
        {...settingsCatalog9ControlArgs}
        error={isError}
        onRetry={refetch}
        pending={isPending}
      />
    )

  return (
    <SettingsCatalog9
      categories={data}
      onCategoryAction={fn()}
      onCreate={fn()}
    />
  )
}

const meta = {
  component: WorkspaceCategories,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Application/Settings/Catalog/Settings9/Usages',
} satisfies Meta<typeof WorkspaceCategories>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsCatalog9Handlers.categories)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByText('Custas processuais')).toBeVisible()
    await expect(canvas.getByText('Subcategoria de Honorários')).toBeVisible()
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsCatalog9Handlers.categoriesEmpty)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText('Nenhuma categoria ainda'),
    ).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsCatalog9Handlers.categoriesError)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByText('Não foi possível carregar as categorias'),
    ).toBeVisible()
    const retry = canvas.getByRole('button', { name: 'Tentar novamente' })
    await expect(retry).toBeEnabled()
    await userEvent.click(retry)
    await expect(await canvas.findByRole('alert')).toHaveAttribute(
      'data-kind',
      'error',
    )
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsCatalog9Handlers.categoriesPending)
  },
  play: async ({ canvasElement }) => {
    const skeleton = await within(canvasElement).findByLabelText(
      'Carregando categorias',
    )
    await expect(skeleton).toHaveAttribute('aria-busy', 'true')
  },
}
