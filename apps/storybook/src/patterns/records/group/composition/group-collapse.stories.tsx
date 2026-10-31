import type { Meta, StoryObj } from '@storybook/react-vite'
import { RecordGroup, type RecordGroupProps } from '@tc96/parttens'
import { useState } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

const openChange = fn()

const openChanges = () => openChange.mock.calls.map(([next]) => next)

type Step = Omit<RecordGroupProps, 'title'>

function Steps({ steps }: Readonly<{ steps: Step[] }>) {
  const [index, setIndex] = useState(0)
  const step = steps[index] ?? {}

  return (
    <div className="flex flex-col gap-2">
      <button onClick={() => setIndex(index + 1)} type="button">
        Next step
      </button>
      <RecordGroup title="Details" {...step}>
        {step.children ?? <p>Body</p>}
      </RecordGroup>
    </div>
  )
}

const triggerOf = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole('button', { name: 'Details' })

const nextStep = (canvasElement: HTMLElement) =>
  userEvent.click(
    within(canvasElement).getByRole('button', { name: 'Next step' }),
  )

const meta = {
  args: { title: 'Details' },
  component: RecordGroup,
  render: (args) => (
    <RecordGroup {...args}>
      <p>Body</p>
    </RecordGroup>
  ),
  tags: ['!autodocs'],
  title: 'Patterns/Records/Group/Composition/Group Collapse',
} satisfies Meta<typeof RecordGroup>

export default meta
type Story = StoryObj<typeof meta>

export const TogglesFromTheTitle: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = triggerOf(canvasElement)

    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await expect(canvas.queryByText('Body')).not.toBeNull()

    await userEvent.click(trigger)

    await waitFor(() => expect(canvas.queryByText('Body')).toBeNull())
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await expect(trigger.hasAttribute('data-panel-open')).toBe(false)

    await userEvent.click(trigger)

    await waitFor(() => expect(canvas.queryByText('Body')).not.toBeNull())
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await expect(trigger.hasAttribute('data-panel-open')).toBe(true)
  },
}

export const DefaultOpenFalseStartsClosed: Story = {
  args: { defaultOpen: false },
  play: async ({ canvasElement }) => {
    await expect(triggerOf(canvasElement)).toHaveAttribute(
      'aria-expanded',
      'false',
    )
    await expect(within(canvasElement).queryByText('Body')).toBeNull()
  },
}

export const ReportsOpenChangeWhenUncontrolled: Story = {
  args: { onOpenChange: openChange },
  play: async ({ canvasElement }) => {
    openChange.mockClear()

    await userEvent.click(triggerOf(canvasElement))
    await waitFor(() =>
      expect(triggerOf(canvasElement)).toHaveAttribute(
        'aria-expanded',
        'false',
      ),
    )

    await expect(openChanges()).toEqual([false])
  },
}

export const ControlledFollowsOpenAndOnlyReports: Story = {
  render: () => (
    <Steps
      steps={[
        { onOpenChange: openChange, open: false },
        { onOpenChange: openChange, open: true },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    openChange.mockClear()
    const canvas = within(canvasElement)

    await expect(canvas.queryByText('Body')).toBeNull()

    await userEvent.click(triggerOf(canvasElement))

    await expect(openChanges()).toEqual([true])
    await expect(triggerOf(canvasElement)).toHaveAttribute(
      'aria-expanded',
      'false',
    )

    await nextStep(canvasElement)

    await waitFor(() => expect(canvas.queryByText('Body')).not.toBeNull())
    await expect(triggerOf(canvasElement)).toHaveAttribute(
      'aria-expanded',
      'true',
    )
  },
}

export const EmptyStartsClosedAndMarksTheGroup: Story = {
  args: { empty: true },
  play: async ({ canvasElement }) => {
    const region = within(canvasElement).getByRole('region', {
      name: 'Details',
    })

    await expect(triggerOf(canvasElement)).toHaveAttribute(
      'aria-expanded',
      'false',
    )
    await expect(region).toHaveAttribute('data-empty', 'true')
  },
}

export const EmptyMarkerStaysWhileOpened: Story = {
  args: { empty: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(triggerOf(canvasElement))

    await waitFor(() => expect(canvas.queryByText('Body')).not.toBeNull())
    await expect(
      canvas.getByRole('region', { name: 'Details' }),
    ).toHaveAttribute('data-empty', 'true')
  },
}

export const NotEmptyIsNotMarked: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement)
        .getByRole('region', { name: 'Details' })
        .hasAttribute('data-empty'),
    ).toBe(false)
  },
}

export const FooterFollowsBodyOfOpenedEmptyGroup: Story = {
  args: { empty: true, footer: <p>Footer</p> },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(
      canvasElement.querySelector('[data-slot="record-group-footer"]'),
    ).toBeNull()

    await userEvent.click(triggerOf(canvasElement))

    await waitFor(() => expect(canvas.queryByText('Footer')).not.toBeNull())
    const panel = canvasElement.querySelector('[data-slot="collapsible-panel"]')
    await expect(
      [...(panel?.children ?? [])].map((child) =>
        child.getAttribute('data-slot'),
      ),
    ).toEqual(['record-group-content', 'record-group-footer'])
    await expect(canvas.queryByText('Body')).not.toBeNull()
  },
}

export const EmptyFlipOpensWithoutOpenChange: Story = {
  render: () => (
    <Steps
      steps={[
        { empty: true, onOpenChange: openChange },
        { empty: false, onOpenChange: openChange },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    openChange.mockClear()

    await nextStep(canvasElement)

    await waitFor(() =>
      expect(within(canvasElement).queryByText('Body')).not.toBeNull(),
    )
    await expect(openChanges()).toEqual([])
  },
}

export const ControlledOpenWinsOverEmpty: Story = {
  render: () => (
    <Steps
      steps={[
        { empty: true, open: true },
        { empty: false, open: false },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(triggerOf(canvasElement)).toHaveAttribute(
      'aria-expanded',
      'true',
    )
    await expect(canvas.queryByText('Body')).not.toBeNull()

    await nextStep(canvasElement)

    await waitFor(() => expect(canvas.queryByText('Body')).toBeNull())
    await expect(triggerOf(canvasElement)).toHaveAttribute(
      'aria-expanded',
      'false',
    )
  },
}

export const EmptyFlipToTrueLeavesOpenState: Story = {
  render: () => <Steps steps={[{ empty: false }, { empty: true }]} />,
  play: async ({ canvasElement }) => {
    await nextStep(canvasElement)

    await expect(triggerOf(canvasElement)).toHaveAttribute(
      'aria-expanded',
      'true',
    )
    await expect(within(canvasElement).queryByText('Body')).not.toBeNull()
  },
}

export const EmptyFlipOpensAndKeepsManualCollapse: Story = {
  render: () => (
    <Steps
      steps={[
        { empty: true },
        { empty: false },
        { children: <p>Body changed</p>, empty: false },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(triggerOf(canvasElement)).toHaveAttribute(
      'aria-expanded',
      'false',
    )

    await nextStep(canvasElement)

    await waitFor(() => expect(canvas.queryByText('Body')).not.toBeNull())
    await expect(triggerOf(canvasElement)).toHaveAttribute(
      'aria-expanded',
      'true',
    )

    await userEvent.click(triggerOf(canvasElement))
    await waitFor(() => expect(canvas.queryByText('Body')).toBeNull())

    await nextStep(canvasElement)

    await expect(triggerOf(canvasElement)).toHaveAttribute(
      'aria-expanded',
      'false',
    )
    await expect(canvas.queryByText('Body changed')).toBeNull()
  },
}

export const ManualCollapseSurvivesParentRerender: Story = {
  render: () => <Steps steps={[{ empty: false }, { empty: false }]} />,
  play: async ({ canvasElement }) => {
    await userEvent.click(triggerOf(canvasElement))
    await waitFor(() =>
      expect(within(canvasElement).queryByText('Body')).toBeNull(),
    )

    await nextStep(canvasElement)

    await expect(triggerOf(canvasElement)).toHaveAttribute(
      'aria-expanded',
      'false',
    )
  },
}

export const ControlledEmptyFlipLeavesInternalState: Story = {
  render: () => (
    <Steps
      steps={[
        { empty: true, open: true },
        { empty: false, open: true },
        { empty: false },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    await nextStep(canvasElement)
    await nextStep(canvasElement)

    await expect(triggerOf(canvasElement)).toHaveAttribute(
      'aria-expanded',
      'false',
    )
  },
}

export const ActionsStayOutsideTheTriggerWhenClosed: Story = {
  args: { actions: <button type="button">Add</button> },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(triggerOf(canvasElement))
    await waitFor(() => expect(canvas.queryByText('Body')).toBeNull())

    const add = canvas.getByRole('button', { name: 'Add' })
    await expect(triggerOf(canvasElement).contains(add)).toBe(false)
  },
}

export const ClosedFooterLeavesTheDocument: Story = {
  args: { footer: <button type="button">Save</button> },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByRole('button', { name: 'Save' })).not.toBeNull()

    await userEvent.click(triggerOf(canvasElement))

    await waitFor(() =>
      expect(canvas.queryByRole('button', { name: 'Save' })).toBeNull(),
    )
    await expect(
      canvasElement.querySelector('[data-slot="record-group-footer"]'),
    ).toBeNull()
    await expect(canvas.queryByText('Save')).toBeNull()
  },
}

export const DefaultOpenFalseStartsWithoutFooter: Story = {
  args: { defaultOpen: false, footer: <button type="button">Save</button> },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', { name: 'Save' }),
    ).toBeNull()
    await expect(
      canvasElement.querySelector('[data-slot="record-group-footer"]'),
    ).toBeNull()
  },
}
