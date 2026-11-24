import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import { Card6, type Card6Job } from '@tc96/blocks/application/card/card-6'
import { Alert, AlertDescription, AlertTitle } from '@tc96/ui/alert'
import { Spinner } from '@tc96/ui/spinner'
import { useState } from 'react'
import { expect, fn, userEvent, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { card6Handlers } from '../../../../mocks/card-6.ts'

const onApply = fn()

const JobsCard = () => {
  const [saved, setSaved] = useState<string[]>([])
  const { data, error, isPending } = useQuery({
    queryFn: () => fetchJson<Card6Job[]>('/cards/jobs'),
    queryKey: ['cards', 'jobs'],
  })

  if (isPending) return <Spinner aria-label="Carregando vagas" />
  if (error)
    return (
      <Alert variant="error">
        <AlertTitle>Não foi possível carregar as vagas</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    )

  return (
    <Card6
      jobs={data}
      onApply={onApply}
      onSaveChange={(jobId, next) =>
        setSaved((current) =>
          next ? [...current, jobId] : current.filter((id) => id !== jobId),
        )
      }
      saved={saved}
    />
  )
}

const meta = {
  component: JobsCard,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Card/Card6/Usages',
} satisfies Meta<typeof JobsCard>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    onApply.mockClear()
    msw.use(card6Handlers.loaded)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const save = await canvas.findByRole('button', {
      name: 'Salvar vaga Gerente de produto',
    })
    await userEvent.click(save)
    await expect(save).toHaveAttribute('aria-pressed', 'true')
    await userEvent.click(
      canvas.getByRole('button', {
        name: 'Candidatar-se a Gerente de produto em Vale Logística',
      }),
    )
    await expect(onApply).toHaveBeenCalledWith('product')
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(card6Handlers.empty)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText('Nenhuma vaga recomendada'),
    ).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(card6Handlers.error)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText(
        'Não foi possível carregar as vagas',
      ),
    ).toBeVisible()
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(card6Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByLabelText('Carregando vagas'),
    ).toBeVisible()
  },
}
