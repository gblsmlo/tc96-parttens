import type { Meta, StoryObj } from '@storybook/react-vite'
import { RecordGroup, RecordGroupAction, RecordGroupRow } from '@tc96/parttens'
import { PlusIcon } from 'lucide-react'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import type { UsageDocsParameters } from '../../../../.storybook/docs-page.tsx'
import { detailRows } from './fixtures/group-demo'

const usage = `
import {
  RecordGroup,
  RecordGroupAction,
  RecordGroupItem,
  RecordGroupLink,
  RecordGroupMetric,
  RecordGroupMetrics,
  RecordGroupRow,
  RecordGroupSubgroup,
  SelectProperty,
  TextProperty,
} from '@acme/patterns'

<RecordGroup
  title="Details"
  actions={
    <RecordGroupAction icon={PlusIcon} label="Add property" onClick={addProperty} />
  }
>
  <RecordGroupRow label="Owner" leading={<UserIcon aria-hidden="true" />}>
    <TextProperty value={owner} variant="plain" />
  </RecordGroupRow>
  <RecordGroupItem title="Installment 1" leading={<ReceiptTextIcon aria-hidden="true" />}>
    <SelectProperty
      ariaLabel="Installment 1 status"
      onValueChange={setStatus}
      options={statusOptions}
      value={status}
      variant="plain"
    />
  </RecordGroupItem>
  <RecordGroupLink href="/contracts/42" meta="Signed">
    Service contract
  </RecordGroupLink>
  <RecordGroupSubgroup title="History" meta="3 changes">
    <RecordGroupRow label="Created">{createdAt}</RecordGroupRow>
  </RecordGroupSubgroup>
</RecordGroup>

<RecordGroup title="Indicators">
  <RecordGroupMetrics>
    <RecordGroupMetric
      icon={<UsersIcon aria-hidden="true" />}
      label="Leads"
      progress={leads / plannedLeads}
      target={\`of \${plannedLeads} planned\`}
      value={leads}
    />
    <RecordGroupMetric label="Conversion" value={conversion} />
  </RecordGroupMetrics>
</RecordGroup>
`

const docs = {
  api: [
    {
      description:
        'Root component. A titled `section` on the COSS `Collapsible`, named by its `h2` title. Controlled through `open` and `onOpenChange`, uncontrolled through `defaultOpen`. `variant` is `card`, `inset` or `plain`, and `empty` starts it closed and drops the vertical padding of the content.',
      name: 'RecordGroup',
    },
    {
      description:
        'Icon button for the `actions` slot of the header. Styled wrapper for the COSS `Button` (`ghost`, `icon-sm`); `label` is its only accessible name. It stays visible when the group is closed.',
      name: 'RecordGroupAction',
    },
    {
      description:
        'A label and its value, rendered as a `dl` with a `dt` and a `dd`. `align` is `start` (fixed label column) or `between`, and `leading` puts an icon on the label and hides the property icon in the value.',
      name: 'RecordGroupRow',
    },
    {
      description:
        'List row: an icon, a title and a trailing control that takes at most half the row. It is a `div`, never a link, because a link cannot contain a control; the control carries its own accessible name.',
      name: 'RecordGroupItem',
    },
    {
      description:
        'A row that is a link to another record or a document. Renders an `a` by default and the consumer element (a router link, a `button`) through `render` from Base UI `useRender`. `meta` is plain text on the right.',
      name: 'RecordGroupLink',
    },
    {
      description:
        'Collapsible subitem inside a group, with an `h3` title. Starts closed (`defaultOpen` is `false`) and reads `meta` with the title.',
      name: 'RecordGroupSubgroup',
    },
    {
      description:
        'Grid of `RecordGroupMetric` tiles inside a group. `columns` is `2` (the default) or `1`.',
      name: 'RecordGroupMetrics',
    },
    {
      description:
        'Indicator tile: a `dl` wrapping the COSS `Card`, with `label` and `icon` in the `dt` and `value` in the `dd`. `target` reads after the value, muted: the planned amount (planned leads, a goal) or a unit, and `progress` (a ratio from 0 to 1, clamped) adds a COSS `Meter` named by the label. The consumer formats every number.',
      name: 'RecordGroupMetric',
    },
  ],
  description: {
    component:
      'A controlled, collapsible group of rows for record surfaces. The consumer passes the rows, the copy, the link targets and the collapse state when it wants to control it.',
  },
  usage,
} satisfies UsageDocsParameters & Record<string, unknown>

const meta = {
  args: { title: 'Details' },
  argTypes: {
    actionsAlign: { control: 'inline-radio', options: ['between', 'start'] },
    defaultOpen: { control: 'boolean' },
    empty: { control: 'boolean' },
    variant: { control: 'inline-radio', options: ['card', 'inset', 'plain'] },
  },
  component: RecordGroup,
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
  parameters: { docs },
  render: (args) => (
    <RecordGroup
      {...args}
      actions={<RecordGroupAction icon={PlusIcon} label="Add property" />}
    >
      {detailRows.map((row) => (
        <RecordGroupRow
          key={row.label}
          label={row.label}
          leading={<row.icon aria-hidden="true" />}
        >
          {row.value}
        </RecordGroupRow>
      ))}
    </RecordGroup>
  ),
  title: 'Patterns/Records/Group',
} satisfies Meta<typeof RecordGroup>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const DefaultInteraction: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const region = canvas.getByRole('region', { name: 'Details' })
    await expect(within(region).getByText('Owner')).toBeVisible()

    await userEvent.click(canvas.getByRole('button', { name: 'Details' }))
    await waitFor(() =>
      expect(within(region).queryByText('Owner')).not.toBeInTheDocument(),
    )
  },
  tags: ['!dev', '!autodocs'],
}

export const Empty: Story = {
  args: { empty: true },
  render: (args) => (
    <RecordGroup {...args}>
      <p className="text-muted-foreground text-sm">No properties yet</p>
    </RecordGroup>
  ),
}

export const EmptyInteraction: Story = {
  ...Empty,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const title = canvas.getByRole('button', { name: 'Details' })
    const section = canvasElement.querySelector(
      '[data-slot="record-group"]',
    ) as HTMLElement

    expect(section).toHaveAttribute('data-empty', 'true')
    expect(title).toHaveAttribute('aria-expanded', 'false')
    expect(canvas.queryByText('No properties yet')).toBeNull()

    await userEvent.click(title)
    await waitFor(() => expect(title).toHaveAttribute('aria-expanded', 'true'))

    const message = await canvas.findByText('No properties yet')
    const content = canvasElement.querySelector(
      '[data-slot="record-group-content"]',
    ) as HTMLElement
    await waitFor(() => {
      const contentBox = content.getBoundingClientRect()
      const messageBox = message.getBoundingClientRect()
      expect(Math.abs(messageBox.left - contentBox.left)).toBeLessThan(1)
      expect(Math.abs(messageBox.top - contentBox.top)).toBeLessThan(1)
    })
    expect(
      canvasElement.querySelector('[data-slot="record-group-footer"]'),
    ).toBeNull()
  },
  tags: ['!dev', '!autodocs'],
}
