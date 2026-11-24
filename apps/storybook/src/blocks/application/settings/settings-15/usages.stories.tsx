import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  Settings15,
  type Settings15Category,
} from '@tc96/blocks/application/settings/settings-15'
import { expect, fn, userEvent, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { settings15Handlers } from '../../../../mocks/settings-15.ts'
import { settings15ControlArgs } from './settings-15-controls.ts'
import { ComposedSettings15 } from './settings-15-layouts.tsx'

const WorkspaceCategories = () => {
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<Settings15Category[]>('/settings/categories'),
    queryKey: ['settings', 'categories'],
  })

  if (isPending || isError)
    return (
      <ComposedSettings15
        {...settings15ControlArgs}
        error={isError}
        onRetry={refetch}
        pending={isPending}
      />
    )

  return (
    <Settings15 categories={data} onCategoryAction={fn()} onCreate={fn()} />
  )
}

const meta = {
  component: WorkspaceCategories,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Application/Settings/Settings15/Usages',
} satisfies Meta<typeof WorkspaceCategories>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings15Handlers.categories)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByText('Custas processuais')).toBeVisible()
    await expect(canvas.getByText('Subcategoria de Honorários')).toBeVisible()
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings15Handlers.categoriesEmpty)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText('Nenhuma categoria ainda'),
    ).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings15Handlers.categoriesError)
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
    msw.use(settings15Handlers.categoriesPending)
  },
  play: async ({ canvasElement }) => {
    const skeleton = await within(canvasElement).findByLabelText(
      'Carregando categorias',
    )
    await expect(skeleton).toHaveAttribute('aria-busy', 'true')
  },
}
