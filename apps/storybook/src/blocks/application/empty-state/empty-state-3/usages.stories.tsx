import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  EmptyState3,
  type EmptyState3Template,
} from '@tc96/blocks/application/empty-state/empty-state-3'
import { Alert, AlertDescription, AlertTitle } from '@tc96/ui/alert'
import { Spinner } from '@tc96/ui/spinner'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { emptyState3Handlers } from '../../../../mocks/empty-state-3.ts'

const FirstProject = () => {
  const [chosen, setChosen] = useState<string | null>(null)
  const { data, error, isPending } = useQuery({
    queryFn: () => fetchJson<EmptyState3Template[]>('/empty-state/templates'),
    queryKey: ['empty-state', 'templates'],
  })

  if (isPending) return <Spinner aria-label="Carregando modelos" />
  if (error)
    return (
      <Alert variant="error">
        <AlertTitle>Não foi possível carregar os modelos</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    )
  if (chosen)
    return <p className="text-sm">Projeto criado a partir de {chosen}.</p>

  return (
    <EmptyState3
      onCreate={() => setChosen('um projeto em branco')}
      onTemplate={(id) =>
        setChosen(data.find((template) => template.id === id)?.title ?? id)
      }
      templates={data}
    />
  )
}

const meta = {
  component: FirstProject,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Empty State/EmptyState3/Usages',
} satisfies Meta<typeof FirstProject>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(emptyState3Handlers.loaded)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      await canvas.findByRole('button', { name: /Lançamento de produto/ }),
    )
    await expect(
      await canvas.findByText(
        'Projeto criado a partir de Lançamento de produto.',
      ),
    ).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(emptyState3Handlers.error)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText(
        'Não foi possível carregar os modelos',
      ),
    ).toBeVisible()
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(emptyState3Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByLabelText('Carregando modelos'),
    ).toBeVisible()
  },
}
