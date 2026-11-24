import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type RecordStatus,
  RecordStatusItem,
  RecordStatusList,
} from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import { useState } from 'react'
import { expect, fn, userEvent, within } from 'storybook/test'
import { RecordStatusListCanvas } from './status-list-canvas.tsx'
import { recordStatusListControlArgs } from './status-list-controls.ts'
import { ComposedRecordStatusList } from './status-list-layouts.tsx'

interface BehaviorArgs {
  onAction: () => void
}

const meta = {
  args: { onAction: fn() },
  decorators: [RecordStatusListCanvas],
  render: ({ onAction }) => (
    <ComposedRecordStatusList
      {...recordStatusListControlArgs}
      action
      detail="não respondeu"
      onAction={onAction}
      status="failed"
    />
  ),
  tags: ['!autodocs'],
  title: 'Patterns/StatusList/Behavior',
} satisfies Meta<BehaviorArgs>

export default meta

type Story = StoryObj<BehaviorArgs>

const announcerOf = (canvasElement: HTMLElement) =>
  canvasElement.querySelector(
    '[data-slot="record-status-list-announcer"]',
  ) as HTMLElement

function LookupHarness() {
  const [status, setStatus] = useState<RecordStatus>('running')
  const [seconds, setSeconds] = useState(0)

  return (
    <div className="flex flex-col gap-3">
      <RecordStatusList label="Fontes consultadas">
        <RecordStatusItem
          announcement={
            status === 'done'
              ? 'DataJud respondeu: ação e objeto'
              : 'DataJud não respondeu'
          }
          detail={
            status === 'running'
              ? `buscando ação e objeto · há ${seconds} s`
              : 'ação e objeto'
          }
          status={status}
          title="DataJud"
        />
      </RecordStatusList>
      <div className="flex gap-2">
        <Button
          onClick={() => setSeconds((value) => value + 10)}
          size="sm"
          variant="outline"
        >
          Passar 10 s
        </Button>
        <Button onClick={() => setStatus('done')} size="sm" variant="outline">
          Responder
        </Button>
      </div>
    </div>
  )
}

export const ReadsOnlyStatusChanges: Story = {
  name: 'Reads the announcement only when the status changes',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const announcer = announcerOf(canvasElement)
    await expect(announcer).toHaveAttribute('aria-live', 'polite')
    await expect(announcer).toHaveTextContent('')
    await userEvent.click(canvas.getByRole('button', { name: 'Passar 10 s' }))
    await expect(canvas.getByText(/há 10 s/)).toBeVisible()
    await expect(announcer).toHaveTextContent('')
    await userEvent.click(canvas.getByRole('button', { name: 'Responder' }))
    await expect(announcer).toHaveTextContent(
      'DataJud respondeu: ação e objeto',
    )
  },
  render: () => <LookupHarness />,
}

export const NamedListWithDecorativeIcons: Story = {
  name: 'Names the list and hides the status icons',
  play: async ({ canvasElement }) => {
    const list = within(canvasElement).getByRole('list', {
      name: recordStatusListControlArgs.label,
    })
    const items = within(list).getAllByRole('listitem')
    await expect(items.map((item) => item.dataset.status)).toEqual([
      'done',
      'failed',
      'skipped',
    ])
    for (const icon of list.querySelectorAll(
      '[data-slot="record-status-item-icon"]',
    ))
      await expect(icon).toHaveAttribute('aria-hidden', 'true')
  },
}

export const ShowsEachStatusOnItsRow: Story = {
  name: 'Shows each status on its own row',
  play: async ({ canvasElement }) => {
    const list = within(canvasElement).getByRole('list', {
      name: 'Fontes consultadas',
    })
    await expect(
      within(list)
        .getAllByRole('listitem')
        .map((item) => item.dataset.status),
    ).toEqual(['pending', 'running', 'done', 'skipped', 'failed'])
  },
  render: () => (
    <RecordStatusList label="Fontes consultadas">
      {(['pending', 'running', 'done', 'skipped', 'failed'] as const).map(
        (status) => (
          <RecordStatusItem
            detail={status}
            key={status}
            status={status}
            title={status}
          />
        ),
      )}
    </RecordStatusList>
  ),
}

export const RunsTheItemAction: Story = {
  name: 'Runs the action of a failed item',
  play: async ({ args, canvasElement }) => {
    const item = canvasElement.querySelector(
      '[data-status="failed"]',
    ) as HTMLElement
    await userEvent.click(
      within(item).getByRole('button', { name: 'Tentar de novo' }),
    )
    await expect(args.onAction).toHaveBeenCalledOnce()
  },
}
