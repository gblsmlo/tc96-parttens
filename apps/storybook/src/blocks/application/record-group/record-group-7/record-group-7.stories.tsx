import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  createRecordGroup7Catalog,
  RecordGroup7 as RecordGroup7Block,
} from '@tc96/ui/blocks/application/record-group/record-group-7'
import { useState } from 'react'
import { expect, within } from 'storybook/test'
import {
  billingCatalogLabels,
  billingIssuedAt,
  billingLabels,
  billingTimeZone,
  initialBilling,
} from '../fixtures/billing.ts'

const billingCatalog = createRecordGroup7Catalog(billingCatalogLabels)

function Billing() {
  const [billing, setBilling] = useState(initialBilling)

  return (
    <RecordGroup7Block
      catalog={billingCatalog}
      labels={billingLabels}
      locale="pt-BR"
      onIssue={() =>
        setBilling((current) => ({ ...current, issuedAt: billingIssuedAt }))
      }
      onMethodChange={(method) =>
        setBilling((current) => ({ ...current, method }))
      }
      record={billing}
      timeZone={billingTimeZone}
    />
  )
}

const meta = {
  component: Billing,
  decorators: [
    (Story) => (
      <div className="w-105 max-w-full">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Record Group/RecordGroup7',
} satisfies Meta<typeof Billing>

export default meta

type Story = StoryObj<typeof meta>

export const RecordGroup7: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Fills a form and runs its command inside one plain group: the payment method is an editable select, the due date and the issue date are read-only, and the `sm` button in the header actions stays disabled until a method is chosen, then issues the charge and turns into the second copy command; it is `secondary` in both states. The record (`method`, `dueAt`, `issuedAt`) comes in as props and the choices leave through `onMethodChange` and `onIssue`. The payment methods come from the catalog the block exports (`createRecordGroup7Catalog`).',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const charge = within(
      within(canvasElement).getByRole('region', { name: 'Cobrança' }),
    )
    await expect(charge.getByText('Não emitida')).toBeVisible()
    await expect(
      charge.getByRole('button', { name: 'Emitir cobrança' }),
    ).toBeDisabled()
  },
}
