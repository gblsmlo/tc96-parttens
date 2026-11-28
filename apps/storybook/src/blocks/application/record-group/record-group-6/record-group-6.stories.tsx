import type { Meta, StoryObj } from '@storybook/react-vite'
import { RecordGroup6 as RecordGroup6Block } from '@tc96/ui/blocks/application/record-group/record-group-6'
import { expect, within } from 'storybook/test'
import {
  installmentCatalog,
  installmentLabels,
  installmentLinks,
} from '../fixtures/links.ts'

function InstallmentLinks() {
  return (
    <RecordGroup6Block
      catalog={installmentCatalog}
      labels={installmentLabels}
      links={installmentLinks}
    />
  )
}

const meta = {
  component: InstallmentLinks,
  decorators: [
    (Story) => (
      <div className="w-105 max-w-full">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Record Group/RecordGroup6',
} satisfies Meta<typeof InstallmentLinks>

export default meta

type Story = StoryObj<typeof meta>

export const RecordGroup6: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Records tied to this one in a plain group: each link (id, href, label, an optional `status` and a text meta) renders as an anchor row with the icon of its kind, record or file, and its status as a badge whose tone comes from the catalog the block exports (`createRecordGroup6Catalog`): Paga `success`, Prevista `warning`, Atrasada `danger`. The same arrangement shows an attached document, and with no links the group starts closed and shows the `empty` label as muted text. Everything is read-only; the links come in as props.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const links = within(
      within(canvasElement).getByRole('region', { name: 'Parcelas' }),
    ).getAllByRole('link')

    await expect(links.map((link) => link.textContent)).toEqual([
      'Parcela 1Paga10/09/2026',
      'Parcela 2Atrasada10/10/2026',
      'Parcela 3Prevista10/11/2026',
    ])
    await expect(
      within(links[1]).getByText('Atrasada').closest('[data-slot="badge"]'),
    ).not.toBeNull()
    await expect(links[1]).toHaveAttribute('href', '#/lancamentos/parcela-2')
  },
}
