import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  CalendarEventChip,
  CalendarEventChipOpenTrigger,
  type CalendarEventChipProps,
  CalendarEventChipTime,
  CalendarEventChipTitle,
  CalendarItemSkeleton,
} from '@tc96/parttens'
import { useEffect, useState } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import type { UsageDocsParameters } from '../../../../../.storybook/docs-page.tsx'
import { sleep } from '../../../../test-utils/sleep'

interface ChipArgs
  extends Pick<CalendarEventChipProps, 'completed' | 'display' | 'tone'> {
  loading: boolean
  time: boolean
  trigger: boolean
}

const hidden = { table: { disable: true } } as const
const onOpen = fn()
const LOAD_DELAY = 2000

const usage = `
import {
  CalendarEventChip,
  CalendarEventChipOpenTrigger,
  CalendarEventChipTime,
  CalendarEventChipTitle,
} from '@acme/patterns'

<CalendarEventChip display="chip" tone="primary">
  <CalendarEventChipTime>09:00</CalendarEventChipTime>
  <CalendarEventChipTitle>Kickoff do trimestre</CalendarEventChipTitle>
  <CalendarEventChipOpenTrigger aria-label="Abrir Kickoff do trimestre" onClick={open} />
</CalendarEventChip>
`

const docs = {
  api: [
    {
      description:
        'Structural item for `CalendarView`, an `article` with no content props. `display` is `chip` (one line, month and all-day) or `block` (time grid, time after the title, collapsing to one row below 2.625rem of height); `tone` is `neutral`, `primary`, `success`, `warning` or `destructive`; `completed` dims it and strikes the title.',
      name: 'CalendarEventChip',
    },
    {
      description:
        '`CalendarEventChipTime` and `CalendarEventChipTitle` hold the text; the title truncates first.',
      name: 'CalendarEventChipTitle',
    },
    {
      description:
        'Button stretched over the chip that opens the record, named by `aria-label`; the chip draws the focus ring because the trigger removes the native outline.',
      name: 'CalendarEventChipOpenTrigger',
    },
    {
      description:
        'Loading item, `chip` or `block`, inside an `output` with `aria-busy`. `CalendarView` renders it while `loading`.',
      name: 'CalendarItemSkeleton',
    },
  ],
  description: {
    component:
      '`CalendarEventChip` is the item `renderRecord` returns. `Anatomy` shows the slots, driven by the controls. `Usage` is a meeting chip with the same controls, and `loading` renders `CalendarItemSkeleton`. `Behavior` is the usage under test, as a chip and as a block, whose time click must reach the open trigger.',
  },
  usage,
} satisfies UsageDocsParameters & Record<string, unknown>

const slotClassName =
  'flex h-4 min-w-10 items-center justify-center rounded-sm border border-dashed px-1 text-[0.625rem] text-muted-foreground'

function Meeting({
  completed,
  display = 'chip',
  loading,
  time,
  title = 'Kickoff do trimestre',
  tone,
  trigger,
}: Readonly<ChipArgs & { title?: string }>) {
  if (loading)
    return (
      <CalendarItemSkeleton
        display={display ?? 'chip'}
        label={`Carregando ${title}`}
      />
    )

  return (
    <CalendarEventChip
      completed={completed ?? false}
      display={display}
      {...(tone ? { tone } : {})}
    >
      {time ? <CalendarEventChipTime>09:00</CalendarEventChipTime> : null}
      <CalendarEventChipTitle>{title}</CalendarEventChipTitle>
      {trigger ? (
        <CalendarEventChipOpenTrigger
          aria-label={`Abrir ${title}`}
          onClick={onOpen}
        />
      ) : null}
    </CalendarEventChip>
  )
}

function LoadingMeeting({
  display,
  title,
}: Readonly<Pick<ChipArgs, 'display'> & { title: string }>) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    sleep(LOAD_DELAY).then(() => {
      if (active) setLoading(false)
    })
    return () => {
      active = false
    }
  }, [])

  return (
    <Meeting
      completed={false}
      display={display}
      loading={loading}
      time
      title={title}
      tone="primary"
      trigger
    />
  )
}

const meta = {
  args: {
    completed: false,
    display: 'chip',
    loading: false,
    time: true,
    tone: 'primary',
    trigger: true,
  },
  argTypes: {
    completed: { control: 'boolean' },
    display: { control: 'inline-radio', options: ['chip', 'block'] },
    loading: { control: 'boolean' },
    time: { control: 'boolean' },
    tone: {
      control: 'inline-radio',
      options: ['neutral', 'primary', 'success', 'warning', 'destructive'],
    },
    trigger: { control: 'boolean' },
  },
  component: CalendarEventChip,
  decorators: [
    (Story) => (
      <div className="flex h-24 w-56 max-w-full p-4">
        <Story />
      </div>
    ),
  ],
  parameters: { docs },
  tags: ['!autodocs'],
  title: 'Patterns/Collection/Layouts/Calendar/Event Chip',
} satisfies Meta<ChipArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  argTypes: { loading: hidden },
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('[data-slot="calendar-event-chip-title"]'),
    ).not.toBeNull()
  },
  render: ({ completed, display, time, tone, trigger }) => (
    <CalendarEventChip
      completed={completed ?? false}
      {...(display ? { display } : {})}
      {...(tone ? { tone } : {})}
    >
      {time ? (
        <CalendarEventChipTime>
          <span className={slotClassName}>Time</span>
        </CalendarEventChipTime>
      ) : null}
      <CalendarEventChipTitle>
        <span className={slotClassName}>Title</span>
      </CalendarEventChipTitle>
      {trigger ? (
        <CalendarEventChipOpenTrigger aria-label="OpenTrigger" />
      ) : null}
    </CalendarEventChip>
  ),
}

export const Usage: Story = {
  render: (args) => <Meeting {...args} />,
}

export const Behavior: Story = {
  argTypes: {
    completed: hidden,
    display: hidden,
    loading: hidden,
    time: hidden,
    tone: hidden,
    trigger: hidden,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const skeleton = canvas.getByRole('status', {
      name: 'Carregando Kickoff do trimestre',
    })
    const skeletonHeight = skeleton.getBoundingClientRect().height

    const open = await canvas.findByRole(
      'button',
      { name: 'Abrir Kickoff do trimestre' },
      { timeout: LOAD_DELAY * 2 },
    )
    const chip = open.closest('article')
    if (!chip) throw new Error('The open trigger is outside the chip.')
    await expect(chip.getBoundingClientRect().height).toBe(skeletonHeight)

    onOpen.mockClear()
    const title = canvas
      .getByText('Kickoff do trimestre')
      .getBoundingClientRect()
    const hit = canvasElement.ownerDocument.elementFromPoint(
      title.left + title.width / 2,
      title.top + title.height / 2,
    )
    if (!hit) throw new Error('Nothing is rendered over the title.')
    await expect(hit).toBe(open)
    await userEvent.click(hit)
    await expect(onOpen).toHaveBeenCalledTimes(1)

    open.blur()
    await userEvent.tab()
    await expect(open).toHaveFocus()
    await waitFor(() =>
      expect(getComputedStyle(chip).boxShadow).not.toBe('none'),
    )
    await userEvent.keyboard('{Enter}')
    await expect(onOpen).toHaveBeenCalledTimes(2)

    const openBlock = canvas.getByRole('button', {
      name: 'Abrir Revisão do pipeline',
    })
    const block = openBlock.closest('article')
    if (!block) throw new Error('The open trigger is outside the block.')
    await expect(block).toHaveAttribute('data-display', 'block')
    const time = within(block).getByText('09:00').getBoundingClientRect()
    const timeHit = canvasElement.ownerDocument.elementFromPoint(
      time.left + time.width / 2,
      time.top + time.height / 2,
    )
    if (!timeHit) throw new Error('Nothing is rendered over the block time.')
    await expect(timeHit).toBe(openBlock)
    await userEvent.click(timeHit)
    await expect(onOpen).toHaveBeenCalledTimes(3)
  },
  render: () => (
    <div className="flex w-full gap-2">
      <LoadingMeeting display="chip" title="Kickoff do trimestre" />
      <LoadingMeeting display="block" title="Revisão do pipeline" />
    </div>
  ),
}
