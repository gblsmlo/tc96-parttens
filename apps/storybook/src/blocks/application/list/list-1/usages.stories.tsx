import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import { List1, type List1Metric } from '@tc96/blocks/application/list/list-1'
import { Alert, AlertDescription, AlertTitle } from '@tc96/ui/alert'
import { Spinner } from '@tc96/ui/spinner'
import { expect, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { list1Handlers } from '../../../../mocks/list-1.ts'

const MetricList = () => {
  const { data, error, isPending } = useQuery({
    queryFn: () => fetchJson<List1Metric[]>('/list/metrics'),
    queryKey: ['list', 'metrics'],
  })

  if (isPending) return <Spinner aria-label="Carregando métricas" />
  if (error)
    return (
      <Alert variant="error">
        <AlertTitle>Não foi possível carregar as métricas</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    )

  return <List1 metrics={data} />
}

const meta = {
  component: MetricList,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/List/List1/Usages',
} satisfies Meta<typeof MetricList>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(list1Handlers.loaded)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByText('Receita')).toBeVisible()
    await expect(canvas.getByText('Clientes ativos')).toBeVisible()
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(list1Handlers.empty)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText('Nenhuma métrica ainda'),
    ).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(list1Handlers.error)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText(
        'Não foi possível carregar as métricas',
      ),
    ).toBeVisible()
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(list1Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByLabelText('Carregando métricas'),
    ).toBeVisible()
  },
}
