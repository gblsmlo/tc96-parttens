import type { Meta, StoryObj } from '@storybook/react-vite'
import { RecordGroupSubgroup } from '@tc96/parttens'
import { useState } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

const toggle = fn()

function Controlled() {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col gap-2">
      <button onClick={() => setOpen(true)} type="button">
        Open outside
      </button>
      <RecordGroupSubgroup open={open} title="Versão 2">
        <p>Body</p>
      </RecordGroupSubgroup>
    </div>
  )
}

const triggerOf = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole('button', { name: /Versão 2/ })

const meta = {
  tags: ['!autodocs'],
  title: 'Patterns/Records/Group/Behavior',
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const SubgroupClosedUnderHeadingOpensFromTitle: Story = {
  render: () => (
    <RecordGroupSubgroup title="Versão 2">
      <p>Body</p>
    </RecordGroupSubgroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const heading = canvas.getByRole('heading', { level: 3 })

    await expect(heading.contains(triggerOf(canvasElement))).toBe(true)
    await expect(triggerOf(canvasElement)).toHaveAttribute(
      'aria-expanded',
      'false',
    )
    await expect(canvas.queryByText('Body')).toBeNull()
    await expect(canvas.queryByRole('region')).toBeNull()

    await userEvent.click(triggerOf(canvasElement))

    await waitFor(() => expect(canvas.queryByText('Body')).not.toBeNull())
    await expect(triggerOf(canvasElement)).toHaveAttribute(
      'aria-expanded',
      'true',
    )
  },
}

export const SubgroupDefaultOpenReportsToggles: Story = {
  render: () => (
    <RecordGroupSubgroup defaultOpen onOpenChange={toggle} title="Versão 2">
      <p>Body</p>
    </RecordGroupSubgroup>
  ),
  play: async ({ canvasElement }) => {
    toggle.mockClear()
    const canvas = within(canvasElement)

    await expect(canvas.queryByText('Body')).not.toBeNull()

    await userEvent.click(triggerOf(canvasElement))

    await waitFor(() => expect(canvas.queryByText('Body')).toBeNull())
    await expect(toggle.mock.calls.map(([next]) => next)).toEqual([false])
  },
}

export const SubgroupFollowsOpenWhenControlled: Story = {
  render: () => <Controlled />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.queryByText('Body')).toBeNull()

    await userEvent.click(canvas.getByRole('button', { name: 'Open outside' }))

    await waitFor(() => expect(canvas.queryByText('Body')).not.toBeNull())
  },
}

export const SubgroupMetaIsPartOfTheTriggerName: Story = {
  render: () => <RecordGroupSubgroup meta="Rascunho" title="Versão 2" />,
  play: async ({ canvasElement }) => {
    const meta = canvasElement.querySelector(
      '[data-slot="record-group-subgroup-meta"]',
    )

    await expect(triggerOf(canvasElement).contains(meta)).toBe(true)
    await expect(
      within(canvasElement).getByRole('button', { name: 'Versão 2 Rascunho' }),
    ).toBe(triggerOf(canvasElement))
  },
}

export const SubgroupCountFollowsTheTitle: Story = {
  render: () => (
    <div className="w-96">
      <RecordGroupSubgroup count={4} meta="Rascunho" title="Versão 2" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const trigger = triggerOf(canvasElement)
    const count = canvasElement.querySelector(
      '[data-slot="record-group-subgroup-count"]',
    ) as HTMLElement
    const meta = canvasElement.querySelector(
      '[data-slot="record-group-subgroup-meta"]',
    ) as HTMLElement
    const title = count.previousElementSibling as HTMLElement

    await expect(title).toHaveTextContent('Versão 2')
    await expect(
      count.getBoundingClientRect().left - title.getBoundingClientRect().right,
    ).toBeCloseTo(4, 0)
    await expect(meta.getBoundingClientRect().left).toBeGreaterThan(
      count.getBoundingClientRect().right,
    )
    await expect(trigger).toHaveAccessibleName('Versão 2 4 Rascunho')
  },
}

export const SubgroupNotCollapsibleShowsItsContent: Story = {
  render: () => (
    <div className="w-96">
      <RecordGroupSubgroup collapsible={false} count={2} title="Versão 2">
        <p>Body</p>
      </RecordGroupSubgroup>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const heading = canvas.getByRole('heading', { level: 3 })
    const content = canvasElement.querySelector(
      '[data-slot="record-group-subgroup-content"]',
    ) as HTMLElement

    await expect(heading).toHaveTextContent('Versão 2')
    await expect(canvas.queryByRole('button')).toBeNull()
    await expect(heading.querySelector('svg')).toBeNull()
    await expect(canvas.getByText('Body')).toBeVisible()
    await expect(content.getBoundingClientRect().left).toBeCloseTo(
      heading.getBoundingClientRect().left,
      0,
    )
  },
}

export const SubgroupChevronAtTheEnd: Story = {
  render: () => (
    <div className="w-96">
      <RecordGroupSubgroup chevron="end" count={4} title="Versão 2">
        <p>Body</p>
      </RecordGroupSubgroup>
      <RecordGroupSubgroup chevron="end" meta="Rascunho" title="Versão 3">
        <p>Body 3</p>
      </RecordGroupSubgroup>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    for (const name of [/Versão 2/, /Versão 3/]) {
      const trigger = canvas.getByRole('button', { name })
      const icon = trigger.querySelector('svg') as SVGElement
      await expect(trigger.firstElementChild?.tagName).toBe('SPAN')
      await expect(icon.getBoundingClientRect().right).toBeCloseTo(
        trigger.getBoundingClientRect().right,
        0,
      )
    }

    const meta = canvasElement.querySelector(
      '[data-slot="record-group-subgroup-meta"]',
    ) as HTMLElement
    const icon = canvas
      .getByRole('button', { name: /Versão 3/ })
      .querySelector('svg') as SVGElement
    await expect(icon.getBoundingClientRect().left).toBeGreaterThan(
      meta.getBoundingClientRect().right,
    )

    const trigger = canvas.getByRole('button', { name: /Versão 2/ })
    await userEvent.click(trigger)
    await waitFor(() => expect(canvas.queryByText('Body')).not.toBeNull())
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
  },
}
