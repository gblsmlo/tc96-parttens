import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  Settings15,
  type Settings15Category,
} from '@tc96/blocks/application/settings/settings-15'
import { Alert, AlertDescription, AlertTitle } from '@tc96/ui/alert'
import { Spinner } from '@tc96/ui/spinner'
import { expect, fn, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { settings15Handlers } from '../../../../mocks/settings-15.ts'

const WorkspaceCategories = () => {
  const { data, error, isPending } = useQuery({
    queryFn: () => fetchJson<Settings15Category[]>('/settings/categories'),
    queryKey: ['settings', 'categories'],
  })

  if (isPending) return <Spinner aria-label="Carregando categorias" />
  if (error)
    return (
      <Alert variant="error">
        <AlertTitle>Não foi possível carregar as categorias</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    )

  return (
    <Settings15 categories={data} onCategoryAction={fn()} onCreate={fn()} />
  )
}

const meta = {
  component: WorkspaceCategories,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
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
    await expect(
      await within(canvasElement).findByText(
        'Não foi possível carregar as categorias',
      ),
    ).toBeVisible()
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings15Handlers.categoriesPending)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByLabelText('Carregando categorias'),
    ).toBeVisible()
  },
}
