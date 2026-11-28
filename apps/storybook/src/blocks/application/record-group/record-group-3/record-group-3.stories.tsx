import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  createRecordGroup3Catalog,
  RecordGroup3 as RecordGroup3Block,
} from '@tc96/ui/blocks/application/record-group/record-group-3'
import { useState } from 'react'
import { expect, within } from 'storybook/test'
import {
  contactDetails,
  detailsCatalogLabels,
  detailsLabels,
} from '../fixtures/details.ts'

const detailsCatalog = createRecordGroup3Catalog(detailsCatalogLabels)

const expectWholeLabels = async (
  scope: HTMLElement,
  labels: readonly string[],
) => {
  for (const label of labels) {
    const text = within(scope).getByText(label, {
      selector: '[data-slot="record-group-row-label"] > span',
    })
    await expect(text.scrollWidth).toBeLessThanOrEqual(text.clientWidth)
  }
}

function ContactDetails() {
  const [record, setRecord] = useState(contactDetails)

  return (
    <RecordGroup3Block
      catalog={detailsCatalog}
      labels={detailsLabels}
      locale="pt-BR"
      onRecordChange={(changes) =>
        setRecord((current) => ({ ...current, ...changes }))
      }
      record={record}
      timeZone="UTC"
    />
  )
}

const meta = {
  component: ContactDetails,
  decorators: [
    (Story) => (
      <div className="w-105 max-w-full">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Record Group/RecordGroup3',
} satisfies Meta<typeof ContactDetails>

export default meta

type Story = StoryObj<typeof meta>

export const RecordGroup3: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Secondary data of a record in a plain group: field rows whose values are properties edited in place (a date, two inline texts and a select), with a fallback text for an empty value. The typed record comes in as a prop and every change leaves as a partial through `onRecordChange`. The source options come from the catalog the block exports (`createRecordGroup3Catalog`).',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const details = within(
      within(canvasElement).getByRole('region', { name: 'Mais informações' }),
    )
    await expectWholeLabels(
      within(canvasElement).getByRole('region', { name: 'Mais informações' }),
      ['Nascimento', 'CPF', 'Profissão', 'Origem'],
    )

    await expect(details.getByRole('textbox', { name: 'CPF' })).toHaveValue(
      '123.456.789-09',
    )
    await expect(
      details.getByRole('textbox', { name: 'Profissão' }),
    ).toHaveAttribute('placeholder', 'Sem profissão')
  },
}
