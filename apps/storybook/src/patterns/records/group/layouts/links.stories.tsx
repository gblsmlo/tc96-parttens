import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  RecordGroup,
  RecordGroupLink,
  type RecordGroupVariant,
} from '@tc96/parttens'
import { FileTextIcon, ReceiptTextIcon } from 'lucide-react'
import { expect, within } from 'storybook/test'
import type { UsageDocsParameters } from '../../../../../.storybook/docs-page.tsx'
import {
  booleanArgType,
  recordGroupArgTypes,
} from '../../../../test-utils/story-arg-types'
import { IconSlot, Slot } from '../fixtures/slot'

interface LinksArgs {
  leading: boolean
  meta: boolean
  variant: RecordGroupVariant
}

const hidden = { table: { disable: true } } as const

const usage = `
import { RecordGroupLink, RecordGroup } from '@acme/patterns'
import { Link } from '@tanstack/react-router'

<RecordGroup title="Linked records">
  <RecordGroupLink
    leading={<ReceiptTextIcon aria-hidden="true" />}
    meta="Paid"
    render={<Link params={{ id }} to="/installments/$id" />}
  >
    Installment 1
  </RecordGroupLink>
  <RecordGroupLink href={file.url} leading={<FileTextIcon aria-hidden="true" />} meta="PDF · 08/12/2026">
    signed-contract.pdf
  </RecordGroupLink>
</RecordGroup>
`

const docs = {
  api: [
    {
      description:
        'A row of a `RecordGroup` that is a link to another record or a document: the whole row is the link. Renders an `a` by default and the consumer element (a router link, a `button`) through `render` from Base UI `useRender`, so the pattern never knows the router. Its accessible name is the content followed by `meta`. The name truncates first; `meta` is plain text on the right, takes at most half the row and gets no tone. The hover reaches 8px past the row on the inline axis while the icon keeps the group edge.',
      name: 'RecordGroupLink',
    },
  ],
  description: {
    component:
      '`RecordGroupLink` fills a `RecordGroup` with rows that open another record or a document. `Anatomy` shows the slots of a link (`leading`, `children`, `meta`), driven by the controls. `Usage` lists installments and a signed document. `Behavior` is under test: each link is named by its content and `meta`, a long name truncates while `meta` stays whole, and no link overflows the row.',
  },
  usage,
} satisfies UsageDocsParameters & Record<string, unknown>

function LinkedRecords({ variant }: Readonly<Pick<LinksArgs, 'variant'>>) {
  return (
    <RecordGroup title="Parcelas" variant={variant}>
      <RecordGroupLink
        href="#/parcelas/1"
        leading={<ReceiptTextIcon aria-hidden />}
        meta="Paga"
      >
        Parcela 1
      </RecordGroupLink>
      <RecordGroupLink
        href="#/parcelas/2"
        leading={<ReceiptTextIcon aria-hidden />}
        meta="Prevista"
      >
        Parcela 2
      </RecordGroupLink>
      <RecordGroupLink
        href="#/parcelas/3"
        leading={<ReceiptTextIcon aria-hidden />}
        meta="Prevista"
      >
        Parcela 3 do contrato de honorários da ação revisional bancária,
        renegociada em setembro
      </RecordGroupLink>
      <RecordGroupLink
        href="#/documentos/contrato-assinado.pdf"
        leading={<FileTextIcon aria-hidden />}
        meta="PDF · 12/08/2026"
      >
        contrato-assinado.pdf
      </RecordGroupLink>
    </RecordGroup>
  )
}

const meta = {
  args: { leading: true, meta: true, variant: 'plain' },
  argTypes: {
    leading: booleanArgType,
    meta: booleanArgType,
    variant: recordGroupArgTypes.variant,
  },
  component: RecordGroupLink,
  decorators: [
    (Story) => (
      <div className="w-96 max-w-full">
        <Story />
      </div>
    ),
  ],
  parameters: { docs },
  title: 'Patterns/Records/Group/Layouts/Links',
} satisfies Meta<LinksArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  play: async ({ args, canvasElement }) => {
    for (const link of within(canvasElement).getAllByRole('link')) {
      await expect(
        [...link.querySelectorAll('[data-slot^="record-group-link-"]')].map(
          (node) => node.getAttribute('data-slot'),
        ),
      ).toEqual([
        'record-group-link-name',
        ...(args.meta ? ['record-group-link-meta'] : []),
      ])
    }
  },
  render: ({ leading, meta: withMeta, variant }) => (
    <RecordGroup title="Group" variant={variant}>
      {['first', 'second'].map((key) => (
        <RecordGroupLink
          href={`#/${key}`}
          key={key}
          leading={leading ? <IconSlot /> : undefined}
          meta={withMeta ? <Slot name="meta" /> : undefined}
        >
          <Slot name="children" />
        </RecordGroupLink>
      ))}
    </RecordGroup>
  ),
}

export const Usage: Story = {
  argTypes: { leading: hidden, meta: hidden },
  render: ({ variant }) => <LinkedRecords variant={variant} />,
}

export const Behavior: Story = {
  argTypes: { leading: hidden, meta: hidden, variant: hidden },
  play: async ({ canvasElement }) => {
    const links = within(canvasElement).getAllByRole('link')
    const long = links[2] as HTMLElement
    const name = long.querySelector(
      '[data-slot="record-group-link-name"]',
    ) as HTMLElement
    const linkMeta = long.querySelector(
      '[data-slot="record-group-link-meta"]',
    ) as HTMLElement

    await expect(links).toHaveLength(4)
    await expect(links[0]).toHaveAccessibleName('Parcela 1 Paga')
    await expect(links[0]).toHaveAttribute('href', '#/parcelas/1')
    await expect(name.scrollWidth).toBeGreaterThan(name.clientWidth)
    await expect(linkMeta).toBeVisible()
    await expect(linkMeta.scrollWidth).toBeLessThanOrEqual(linkMeta.clientWidth)
    for (const link of links) {
      await expect(link.scrollWidth).toBeLessThanOrEqual(link.clientWidth)
    }

    long.focus()
    await expect(long).toHaveFocus()
  },
  render: () => <LinkedRecords variant="plain" />,
}
