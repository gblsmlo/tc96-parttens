import {
  EnvelopeSimpleIcon,
  HandshakeIcon,
  TrophyIcon,
  UserCircleIcon,
} from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import { Card7, type Card7Item } from '@tc96/ui/blocks/application/card/card-7'
import { formatAmount } from '@tc96/ui/helpers/format'
import { expect, fn, userEvent, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { card7Handlers, type card7Summary } from '../../../../mocks/card-7.ts'

type ContactSummary = typeof card7Summary
type DealStage = ContactSummary['deals'][number]['stage']

const stageIcons: Record<DealStage, Pick<Card7Item, 'color' | 'icon'>> = {
  lead: { icon: <UserCircleIcon /> },
  proposal: { color: 'var(--color-sky-500)', icon: <HandshakeIcon /> },
  won: { color: 'var(--color-emerald-500)', icon: <TrophyIcon /> },
}

const compact = (value: number) =>
  formatAmount(value, {
    currency: 'BRL',
    locale: 'pt-BR',
    maximumFractionDigits: 1,
    notation: 'compact',
    style: 'currency',
  })

const ContactSummaryCard = ({
  contactId,
  onEmail,
}: {
  contactId: string
  onEmail: (contactId: string) => void
}) => {
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () =>
      fetchJson<ContactSummary>(`/crm/contacts/${contactId}/summary`),
    queryKey: ['crm', 'contacts', contactId, 'summary'],
  })

  return (
    <Card7
      actionIcon={<EnvelopeSimpleIcon />}
      className="max-w-sm"
      contact={data?.contact}
      error={isError}
      items={data?.deals.map((deal) => ({
        ...deal,
        ...stageIcons[deal.stage],
      }))}
      labels={{ action: 'Enviar e-mail', items: 'Negócios do contato' }}
      onAction={() => onEmail(contactId)}
      onRetry={() => refetch()}
      pending={isPending}
      stats={
        data
          ? [
              {
                id: 'deals',
                label: 'Negócios',
                value: String(data.stats.deals),
              },
              {
                id: 'open',
                label: 'Em aberto',
                value: String(data.stats.openDeals),
              },
              {
                id: 'won',
                label: 'Ganho',
                value: compact(data.stats.wonAmount),
              },
            ]
          : []
      }
    />
  )
}

const meta = {
  args: { contactId: 'rafael-costa', onEmail: fn() },
  component: ContactSummaryCard,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Application/Card/Card7/Usages',
} satisfies Meta<typeof ContactSummaryCard>

export default meta

type Story = StoryObj<typeof meta>

export const CrmContact: Story = {
  beforeEach: ({ msw }) => {
    msw.use(card7Handlers.loaded)
  },
  name: 'CRM contact',
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByRole('heading', { name: 'Rafael Costa' }),
    ).toBeVisible()
    await expect(canvas.getByText('Em negociação')).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: 'Enviar e-mail' }))
    await expect(args.onEmail).toHaveBeenCalledWith('rafael-costa')
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(card7Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByLabelText('Carregando contato'),
    ).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(card7Handlers.error)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText(
        'Não foi possível carregar o contato',
      ),
    ).toBeVisible()
  },
}
