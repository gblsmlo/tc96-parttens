import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import {
  type AgendaEvent,
  AgendaWidget,
  ProjectCardWidget,
  type ProjectSubtask,
  TaskProgressWidget,
  UpcomingEventWidget,
  WorldClockWidget,
} from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import {
  EllipsisIcon,
  MessageSquareIcon,
  PaperclipIcon,
  PlusIcon,
  VideoIcon,
} from 'lucide-react'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'

type ProgressPeriod = 'month' | 'quarter'

const progressSeries: Record<
  ProgressPeriod,
  { label: string; value: number }[]
> = {
  month: [
    { label: 'W1', value: 18 },
    { label: 'W2', value: 26 },
    { label: 'W3', value: 31 },
    { label: 'W4', value: 24 },
  ],
  quarter: [
    { label: 'Jan', value: 64 },
    { label: 'Feb', value: 92 },
    { label: 'Mar', value: 71 },
  ],
}

const progressChange: Record<ProgressPeriod, number> = {
  month: 0.08,
  quarter: 0.12,
}

const meetingStart = new Date('2026-10-02T13:30:00Z')
const meetingEnd = new Date('2026-10-02T15:00:00Z')
const clockInstant = new Date('2026-10-02T20:11:20Z')

const agendaEvents: AgendaEvent[] = [
  {
    date: '2023-04-19',
    endLabel: '6:30 PM',
    id: 'yoga',
    startLabel: '5:30 PM',
    title: 'Yoga Class',
  },
  {
    color: 'var(--chart-2)',
    date: '2023-04-19',
    endLabel: '10:30 AM',
    id: 'gym',
    startLabel: '9:30 AM',
    title: 'Gym',
  },
  {
    color: 'var(--chart-3)',
    date: '2023-04-21',
    endLabel: '11:00 AM',
    id: 'review',
    startLabel: '10:00 AM',
    title: 'Design review',
  },
]

const initialSubtasks: ProjectSubtask[] = [
  { done: true, id: 'interview', label: 'Interview with users' },
  { done: true, id: 'brainstorm', label: 'Brain storm' },
  { done: true, id: 'ia', label: 'Information architecture' },
  { done: false, id: 'wireframe', label: 'Wireframe design' },
  { done: false, id: 'visual', label: 'Visual design' },
]

function TaskProgress({ tone }: Readonly<{ tone?: 'default' | 'inverted' }>) {
  const [period, setPeriod] = useState<ProgressPeriod>('quarter')

  return (
    <TaskProgressWidget
      change={progressChange[period]}
      changeLabel="vs. previous period"
      chartLabel="Tasks completed per period"
      data={progressSeries[period]}
      onPeriodChange={setPeriod}
      period={period}
      periodLabel="Progress period"
      periods={[
        { label: 'Month', value: 'month' },
        { label: 'Quarter', value: 'quarter' },
      ]}
      stats={[
        { id: 'progress', label: 'In progress', value: 152 },
        { id: 'todo', label: 'To do', value: 294 },
        { id: 'backlog', label: 'Backlog', value: 187 },
      ]}
      title="Task progress"
      {...(tone ? { tone } : {})}
    />
  )
}

function ProductMeeting() {
  const [copied, setCopied] = useState(false)

  return (
    <UpcomingEventWidget
      end={meetingEnd}
      eyebrow={copied ? 'Link copied' : 'In 30 minutes'}
      joinHref="https://meet.google.com/nax-wqkf-stu"
      joinLabel="Join on Google Meet"
      joinText="meet.google.com/nax-wqkf-stu"
      live
      onCopy={() => setCopied(true)}
      provider={<VideoIcon aria-hidden="true" />}
      start={meetingStart}
      timeZone="UTC"
      title="Meeting with Product team"
    />
  )
}

function DesignWebsite() {
  const [subtasks, setSubtasks] = useState(initialSubtasks)

  return (
    <ProjectCardWidget
      action={
        <Button aria-label="More options" size="icon-sm" variant="ghost">
          <EllipsisIcon aria-hidden="true" />
        </Button>
      }
      description="Design an attractive women's clothing store website in a responsive manner that users will enjoy and have no problems using."
      endLabel="25 May"
      footer={
        <Button className="w-full" variant="outline">
          <PlusIcon aria-hidden="true" />
          Add task
        </Button>
      }
      meta={
        <>
          <span className="inline-flex items-center gap-1">
            <MessageSquareIcon aria-hidden="true" className="size-4" />
            <span className="sr-only">Comments:</span>2
          </span>
          <span className="inline-flex items-center gap-1">
            <PaperclipIcon aria-hidden="true" className="size-4" />
            <span className="sr-only">Attachments:</span>10
          </span>
        </>
      }
      onSubtaskToggle={(id, done) =>
        setSubtasks((current) =>
          current.map((subtask) =>
            subtask.id === id ? { ...subtask, done } : subtask,
          ),
        )
      }
      people={[
        { id: 'ana', label: 'Ana Martins' },
        { id: 'gabriel', label: 'Gabriel Melo' },
        { id: 'marina', label: 'Marina Souza' },
        { id: 'joao', label: 'João Lima' },
      ]}
      startLabel="10 May"
      subtasks={subtasks}
      tags={[
        { id: 'design', label: 'Design' },
        { id: 'ui', label: 'UI/UX' },
        { id: 'web', label: 'Website' },
      ]}
      title="Design Website"
    />
  )
}

function Agenda() {
  return (
    <AgendaWidget
      defaultSelected={new Date(2023, 3, 19)}
      events={agendaEvents}
      title="Agenda"
    />
  )
}

function Clocks() {
  return (
    <WorldClockWidget
      clocks={[
        { id: 'paris', label: 'Paris', meta: '22°C', timeZone: 'Europe/Paris' },
        {
          id: 'london',
          label: 'London',
          meta: '20°C',
          timeZone: 'Europe/London',
        },
      ]}
      label="World clock"
      now={clockInstant}
    />
  )
}

const calendarContrast = {
  a11y: {
    config: {
      rules: [
        {
          id: 'color-contrast',
          selector:
            '*:not([data-slot="calendar"] *):not([data-tone="inverted"] *)',
        },
      ],
    },
  },
}

const meta = {
  title: 'Patterns/Widgets/Productivity',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  parameters: calendarContrast,
  render: () => (
    <div className="grid min-h-screen place-items-center p-6 sm:p-10">
      <div className="grid w-full max-w-5xl gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="grid content-start gap-4">
          <Clocks />
          <TaskProgress tone="inverted" />
          <ProductMeeting />
        </div>
        <div className="grid content-start gap-4">
          <DesignWebsite />
          <Agenda />
        </div>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const progress = canvas.getByRole('region', { name: 'Task progress' })
    await expect(progress).toHaveTextContent('12.00%')
    await userEvent.click(
      within(progress).getByRole('button', { name: 'Month' }),
    )
    await expect(progress).toHaveTextContent('8.00%')
    await expect(
      canvas.getByRole('meter', { name: 'Progresso' }),
    ).toHaveAttribute('aria-valuenow', '60')
    await expect(
      canvas.getByRole('region', { name: 'World clock' }),
    ).toHaveTextContent('10:11:20 PM')
  },
}

const single =
  (width: string): Decorator =>
  (Story) => (
    <div className="grid min-h-screen place-items-center p-6">
      <div className={`w-full ${width}`}>
        <Story />
      </div>
    </div>
  )

export const TaskProgressCard: Story = {
  decorators: [single('max-w-md')],
  render: () => <TaskProgress />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const widget = canvas.getByRole('region', { name: 'Task progress' })
    await expect(widget).toHaveTextContent('294')
    await userEvent.click(within(widget).getByRole('button', { name: 'Month' }))
    await expect(widget).toHaveTextContent('8.00%')
  },
}

export const TaskProgressInverted: Story = {
  parameters: calendarContrast,
  decorators: [single('max-w-md')],
  render: () => <TaskProgress tone="inverted" />,
}

export const UpcomingEvent: Story = {
  decorators: [single('max-w-md')],
  render: () => <ProductMeeting />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('img', { name: '1:30 PM – 3:00 PM' }),
    ).toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: 'Copiar link' }))
    await expect(
      canvas.getByRole('region', { name: 'Meeting with Product team' }),
    ).toHaveTextContent('Link copied')
  },
}

export const ProjectCard: Story = {
  decorators: [single('max-w-md')],
  render: () => <DesignWebsite />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const meter = canvas.getByRole('meter', { name: 'Progresso' })
    await expect(meter).toHaveAttribute('aria-valuenow', '60')
    await userEvent.click(
      canvas.getByRole('checkbox', { name: 'Wireframe design' }),
    )
    await expect(meter).toHaveAttribute('aria-valuenow', '80')
  },
}

export const AgendaCalendar: Story = {
  parameters: calendarContrast,
  decorators: [single('max-w-sm')],
  render: () => <Agenda />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const list = canvas.getByRole('list', { name: 'Eventos do dia' })
    await expect(list).toHaveTextContent('Yoga Class')
    await userEvent.click(
      canvas.getByRole('button', { name: 'Friday, April 21st, 2023' }),
    )
    await expect(
      canvas.getByRole('list', { name: 'Eventos do dia' }),
    ).toHaveTextContent('Design review')
  },
}

export const WorldClock: Story = {
  decorators: [single('max-w-md')],
  render: () => <Clocks />,
}
