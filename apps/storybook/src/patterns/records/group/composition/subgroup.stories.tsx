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
  title: 'Patterns/Records/Group/Composition/Subgroup',
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const ClosedUnderHeadingOpensFromTitle: Story = {
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

export const DefaultOpenReportsToggles: Story = {
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

export const FollowsOpenWhenControlled: Story = {
  render: () => <Controlled />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.queryByText('Body')).toBeNull()

    await userEvent.click(canvas.getByRole('button', { name: 'Open outside' }))

    await waitFor(() => expect(canvas.queryByText('Body')).not.toBeNull())
  },
}

export const MetaIsPartOfTheTriggerName: Story = {
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
