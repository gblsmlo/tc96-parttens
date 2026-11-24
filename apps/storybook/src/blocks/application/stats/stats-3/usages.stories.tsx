import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import { Stats3, type Stats3Item } from '@tc96/blocks/application/stats/stats-3'
import { Alert, AlertDescription, AlertTitle } from '@tc96/ui/alert'
import { Spinner } from '@tc96/ui/spinner'
import { expect, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { stats3Handlers } from '../../../../mocks/stats-3.ts'

const WorkspaceCapacity = () => {
  const { data, error, isPending } = useQuery({
    queryFn: () => fetchJson<Stats3Item[]>('/stats/capacity'),
    queryKey: ['stats', 'capacity'],
  })

  if (isPending) return <Spinner aria-label="Carregando capacidade" />
  if (error)
    return (
      <Alert variant="error">
        <AlertTitle>Não foi possível carregar a capacidade</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    )

  return <Stats3 items={data} />
}

const meta = {
  component: WorkspaceCapacity,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Stats/Stats3/Usages',
} satisfies Meta<typeof WorkspaceCapacity>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(stats3Handlers.loaded)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findAllByRole('meter')).toHaveLength(3)
    await expect(canvas.getByText('Armazenamento (GB)')).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(stats3Handlers.error)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText(
        'Não foi possível carregar a capacidade',
      ),
    ).toBeVisible()
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(stats3Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByLabelText('Carregando capacidade'),
    ).toBeVisible()
  },
}
