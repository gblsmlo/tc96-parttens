import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  Card2,
  type Card2Integration,
} from '@tc96/blocks/application/card/card-2'
import { Alert, AlertDescription, AlertTitle } from '@tc96/ui/alert'
import { Spinner } from '@tc96/ui/spinner'
import { expect, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { card2Handlers } from '../../../../mocks/card-2.ts'

const IntegrationCatalog = () => {
  const { data, error, isPending } = useQuery({
    queryFn: () => fetchJson<Card2Integration[]>('/card/integrations'),
    queryKey: ['card', 'integrations'],
  })

  if (isPending) return <Spinner aria-label="Carregando integrações" />
  if (error)
    return (
      <Alert variant="error">
        <AlertTitle>Não foi possível carregar as integrações</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    )

  return <Card2 integrations={data} onConnect={() => {}} />
}

const meta = {
  component: IntegrationCatalog,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Card/Card2/Usages',
} satisfies Meta<typeof IntegrationCatalog>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(card2Handlers.loaded)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByText('Slack')).toBeVisible()
    await expect(canvas.getByText('Conectado')).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(card2Handlers.error)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText(
        'Não foi possível carregar as integrações',
      ),
    ).toBeVisible()
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(card2Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByLabelText('Carregando integrações'),
    ).toBeVisible()
  },
}
