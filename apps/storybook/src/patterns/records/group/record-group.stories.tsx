import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  DateProperty,
  RecordGroup,
  RecordGroupAction,
  type RecordGroupProps,
  RecordGroupRow,
  TextProperty,
} from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import {
  CalendarDaysIcon,
  HashIcon,
  PlusIcon,
  ShapesIcon,
  UserIcon,
} from 'lucide-react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import type { UsageDocsParameters } from '../../../../.storybook/docs-page.tsx'
import { Slot } from '../../../test-utils/anatomy-slot'
import {
  booleanArgType,
  recordGroupArgTypes,
} from '../../../test-utils/story-arg-types'

type GroupArgs = RecordGroupProps & {
  withActions: boolean
  withFooter: boolean
}

const hidden = { table: { disable: true } } as const
const onAddProperty = fn()
const longTitle =
  'Customer onboarding, compliance review and contract renewal details'

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
  footer={<Button variant="ghost">View history</Button>}
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
  </RecordGroupMetrics>
</RecordGroup>
`

const docs = {
  api: [
    {
      description:
        'Root component. A titled `section` on the COSS `Collapsible`, named by its `h2` title, which wraps instead of truncating. Controlled through `open` and `onOpenChange`, uncontrolled through `defaultOpen`. `variant` is `card`, `inset` or `plain` (the default). `actions` sits outside the trigger and stays visible when the group is closed; `actionsAlign` spreads it to the end (`between`) or places it after the title (`start`). `footer` sits inside the panel and hides with the body. `empty` starts the group closed, opens it when it flips to `false`, and drops the vertical padding of the content.',
      name: 'RecordGroup',
    },
    {
      description:
        'Icon button for the `actions` slot of the header. Styled wrapper for the COSS `Button` (`ghost`, `icon-sm`); `label` is its only accessible name.',
      name: 'RecordGroupAction',
    },
    {
      description:
        'A line between the children of a group, usually collapsible `RecordGroupSubgroup`s, on the COSS `Separator`. The children take no actions; the parent header keeps the only trigger. See `Layouts/Finance` (`Grouped`).',
      name: 'RecordGroupDivider',
    },
    {
      description:
        'Default filter for the `actions` slot: an icon button named by `label` that opens a popover with a checkbox list (`filterOptions`, `filterValue`, `onFilterChange`) and a radio list (`sortOptions`, `sortValue`, `onSortChange`). Controlled: the consumer filters and sorts the rows. See `Layouts/Tasks` (`Agenda`) and `Layouts/Finance` (`Entries`).',
      name: 'RecordGroupFilter',
    },
    {
      description:
        'The status of a row, in one size: `children` is the text and `color` (a CSS color, usually a theme token) tints the background at 8% and the text; without `color` it is neutral. Pass the same color to the row `IconFrame`. See `Layouts/Finance`.',
      name: 'RecordStatusBadge',
    },
    {
      description:
        'A label and its value as a `dl`. See `Patterns/Records/Group/Composition/Rows`.',
      name: 'RecordGroupRow',
    },
    {
      description:
        'List row: an icon, a title and a trailing control. See `Patterns/Records/Group/Composition/Items`.',
      name: 'RecordGroupItem',
    },
    {
      description:
        'A row that is a link to another record or a document. See `Patterns/Records/Group/Layouts/Links`.',
      name: 'RecordGroupLink',
    },
    {
      description:
        'Grid of indicator tiles. See `Patterns/Records/Group/Layouts/Metrics`.',
      name: 'RecordGroupMetrics',
    },
    {
      description:
        'Collapsible subitem inside a group, with an `h3` title. Starts closed (`defaultOpen` is `false`) and reads `meta` with the title. It has no catalog page; its plays are in `Patterns/Records/Group/Composition/Subgroup`.',
      name: 'RecordGroupSubgroup',
    },
  ],
  description: {
    component:
      'A controlled, collapsible group of rows for record surfaces. The consumer passes the rows, the copy, the link targets and the collapse state when it wants to control it. `Default` is a details group driven by the controls. `Anatomy` shows the slots of the shell (`title`, `actions`, `children`, `footer`). `Behavior` is under test: the title wraps beside the action, the action keeps working while the group closes, the footer leaves the tab order as soon as the group closes, and an empty group opens with its text at the start. What fills the body is in `Layouts` (Rows, Items, Links, Metrics); whole groups for a record page are in `Usages`.',
  },
  usage,
} satisfies UsageDocsParameters & Record<string, unknown>

const slotsOf = (scope: HTMLElement) =>
  [...scope.querySelectorAll('[data-slot^="record-group-"]')].map((node) =>
    node.getAttribute('data-slot'),
  )

function GroupBehavior() {
  return (
    <div className="flex flex-col gap-6">
      <RecordGroup
        actions={
          <RecordGroupAction
            icon={PlusIcon}
            label="Add property"
            onClick={onAddProperty}
          />
        }
        footer={<Button variant="ghost">View history</Button>}
        title={longTitle}
      >
        <RecordGroupRow label="Owner" leading={<UserIcon aria-hidden />}>
          <TextProperty value="Mariana Souza" variant="plain" />
        </RecordGroupRow>
        <RecordGroupRow label="Reference" leading={<HashIcon aria-hidden />}>
          <TextProperty value="REQ-1042" variant="plain" />
        </RecordGroupRow>
      </RecordGroup>
      <RecordGroup empty title="Attachments">
        <p className="text-muted-foreground text-sm">No attachments yet</p>
      </RecordGroup>
    </div>
  )
}

const meta = {
  args: {
    actionsAlign: 'between',
    defaultOpen: true,
    empty: false,
    title: 'Details',
    variant: 'plain',
    withActions: true,
    withFooter: true,
  },
  argTypes: {
    ...recordGroupArgTypes,
    title: { control: 'text' },
    withActions: booleanArgType,
    withFooter: booleanArgType,
  },
  component: RecordGroup,
  decorators: [
    (Story) => (
      <div className="w-96 max-w-full">
        <Story />
      </div>
    ),
  ],
  parameters: { docs },
  title: 'Patterns/Records/Group',
} satisfies Meta<GroupArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  argTypes: { withActions: hidden, withFooter: hidden },
  render: ({ withActions: _actions, withFooter: _footer, ...args }) => (
    <RecordGroup
      {...args}
      actions={<RecordGroupAction icon={PlusIcon} label="Add property" />}
      footer={<Button variant="ghost">View history</Button>}
    >
      <RecordGroupRow label="Type" leading={<ShapesIcon aria-hidden />}>
        <TextProperty value="Document request" variant="plain" />
      </RecordGroupRow>
      <RecordGroupRow label="Owner" leading={<UserIcon aria-hidden />}>
        <TextProperty value="Mariana Souza" variant="plain" />
      </RecordGroupRow>
      <RecordGroupRow label="Reference" leading={<HashIcon aria-hidden />}>
        <TextProperty value="REQ-1042" variant="plain" />
      </RecordGroupRow>
      <RecordGroupRow label="Due" leading={<CalendarDaysIcon aria-hidden />}>
        <DateProperty readOnly value="2026-10-21" variant="plain" />
      </RecordGroupRow>
    </RecordGroup>
  ),
}

export const Anatomy: Story = {
  argTypes: { title: hidden },
  play: async ({ args, canvasElement }) => {
    const open = (args.defaultOpen ?? true) && !args.empty
    const expected = [
      'record-group-header',
      ...(args.withActions ? ['record-group-actions'] : []),
      ...(open ? ['record-group-content'] : []),
      ...(open && args.withFooter ? ['record-group-footer'] : []),
    ]
    await expect(slotsOf(canvasElement)).toEqual(expected)
    if (!(open && args.withFooter)) return

    const widthOf = (selector: string) =>
      (
        canvasElement.querySelector(selector) as HTMLElement
      ).getBoundingClientRect().width
    const footer = widthOf('[data-slot="record-group-footer"]')
    await expect(footer).toBeCloseTo(
      widthOf('[data-slot="record-group-header"]'),
      1,
    )
    await expect(footer).toBeCloseTo(
      widthOf('[data-slot="collapsible-panel"] > :first-child'),
      1,
    )
  },
  render: ({ withActions, withFooter, title: _title, ...args }) => (
    <RecordGroup
      {...args}
      actions={withActions ? <Slot name="actions" /> : undefined}
      footer={withFooter ? <Slot name="footer" /> : undefined}
      title={<Slot name="title" />}
    >
      <Slot name="children" />
    </RecordGroup>
  ),
}

export const Behavior: Story = {
  argTypes: {
    actionsAlign: hidden,
    defaultOpen: hidden,
    empty: hidden,
    title: hidden,
    variant: hidden,
    withActions: hidden,
    withFooter: hidden,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const region = canvas.getByRole('region', { name: longTitle })
    const group = within(region)
    const trigger = group.getByRole('button', { name: longTitle })
    const header = region.querySelector(
      '[data-slot="record-group-header"]',
    ) as HTMLElement
    const action = group.getByRole('button', { name: 'Add property' })
    const titleText = trigger.querySelector('span') as HTMLElement

    await expect(titleText.scrollWidth).toBeLessThanOrEqual(
      titleText.clientWidth,
    )
    await expect(header.scrollWidth).toBeLessThanOrEqual(header.clientWidth)
    await expect(action.getBoundingClientRect().right).toBeLessThanOrEqual(
      header.getBoundingClientRect().right + 0.5,
    )
    await expect(action.querySelector('svg')).toHaveAttribute(
      'aria-hidden',
      'true',
    )

    const content = region.querySelector(
      '[data-slot="record-group-content"]',
    ) as HTMLElement
    const footer = region.querySelector(
      '[data-slot="record-group-footer"]',
    ) as HTMLElement
    await expect(footer.getBoundingClientRect().top).toBeGreaterThanOrEqual(
      content.getBoundingClientRect().bottom - 0.5,
    )

    onAddProperty.mockClear()
    await userEvent.click(action)
    await expect(onAddProperty).toHaveBeenCalledTimes(1)
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')

    const panel = region.querySelector(
      '[data-slot="collapsible-panel"]',
    ) as HTMLElement
    const footerButton = within(panel).getByRole('button', {
      name: 'View history',
    })
    await userEvent.click(trigger)
    await waitFor(() =>
      expect(panel.hasAttribute('data-ending-style')).toBe(true),
    )
    await expect(panel.getAnimations().length).toBeGreaterThan(0)
    await expect(footerButton.closest('[inert]')).not.toBeNull()
    footerButton.focus()
    await expect(document.activeElement).not.toBe(footerButton)

    await waitFor(() => expect(panel.isConnected).toBe(false))
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await expect(
      group.queryByRole('button', { name: 'View history' }),
    ).toBeNull()
    await expect(action).toBeVisible()

    await userEvent.click(trigger)
    await expect(await group.findByText('Owner')).toBeVisible()

    const emptyRegion = canvas.getByRole('region', { name: 'Attachments' })
    const emptyGroup = within(emptyRegion)
    const emptyTrigger = emptyGroup.getByRole('button', {
      name: 'Attachments',
    })
    await expect(emptyRegion).toHaveAttribute('data-empty', 'true')
    await expect(emptyTrigger).toHaveAttribute('aria-expanded', 'false')
    await expect(emptyGroup.queryByText('No attachments yet')).toBeNull()

    await userEvent.click(emptyTrigger)
    const message = await emptyGroup.findByText('No attachments yet')
    const emptyContent = emptyRegion.querySelector(
      '[data-slot="record-group-content"]',
    ) as HTMLElement
    await waitFor(() => {
      const contentBox = emptyContent.getBoundingClientRect()
      const messageBox = message.getBoundingClientRect()
      expect(Math.abs(messageBox.left - contentBox.left)).toBeLessThan(1)
      expect(Math.abs(messageBox.top - contentBox.top)).toBeLessThan(1)
    })
  },
  render: () => <GroupBehavior />,
}
