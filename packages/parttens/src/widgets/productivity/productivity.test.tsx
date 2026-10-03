import { afterEach, expect, test } from 'bun:test'

await import('../../properties/test/dom')

class ResizeObserverStub {
  disconnect() {}
  observe() {}
  unobserve() {}
}
Object.assign(globalThis, { ResizeObserver: ResizeObserverStub })

const { cleanup, fireEvent, render, screen } = await import(
  '@testing-library/react'
)
const {
  AgendaWidget,
  ProjectCardWidget,
  TaskProgressWidget,
  UpcomingEventWidget,
  WorldClockWidget,
} = await import('./index')

afterEach(cleanup)

test('task progress widget names its chart and lists the counters', () => {
  const periods: string[] = []
  render(
    <TaskProgressWidget
      change={0.12}
      changeLabel="vs. last quarter"
      chartLabel="Tasks completed per month"
      data={[
        { label: 'Jan', value: 48 },
        { label: 'Feb', value: 92 },
        { label: 'Mar', value: 61 },
      ]}
      onPeriodChange={(period) => periods.push(period)}
      period="quarter"
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
      tone="inverted"
    />,
  )
  const region = screen.getByRole('region', { name: 'Task progress' })
  expect(
    screen.getByRole('img', { name: 'Tasks completed per month' }),
  ).toBeTruthy()
  expect(region.textContent).toContain('Alta de 12.00%')
  expect(screen.getByText('294').tagName).toBe('DD')
  expect(
    document
      .querySelector('[data-slot="task-progress-widget-scope"]')
      ?.classList.contains('dark'),
  ).toBe(true)
  fireEvent.click(screen.getByRole('button', { name: 'Month' }))
  expect(periods).toEqual(['month'])
})

test('upcoming event widget places the slot on the timeline and copies the link', () => {
  const copied: string[] = []
  render(
    <UpcomingEventWidget
      end={new Date('2026-10-02T15:00:00Z')}
      eyebrow="In 30 minutes"
      joinHref="https://meet.google.com/nax-wqkf-stu"
      joinLabel="Join on Google Meet"
      joinText="meet.google.com/nax-wqkf-stu"
      live
      onCopy={(href) => copied.push(href)}
      start={new Date('2026-10-02T13:30:00Z')}
      timeZone="UTC"
      title="Meeting with Product team"
    />,
  )
  expect(
    screen.getByRole('region', { name: 'Meeting with Product team' }),
  ).toBeTruthy()
  const timeline = screen.getByRole('img', { name: '1:30 PM – 3:00 PM' })
  const slot = timeline.querySelector<HTMLElement>(
    '[data-slot="upcoming-event-slot"]',
  )
  expect(slot?.style.left).toBe('20%')
  expect(slot?.style.width).toBe('60%')
  expect(timeline.textContent).toContain('1:00 PM')
  expect(timeline.textContent).toContain('3:30 PM')
  expect(
    screen
      .getByRole('link', { name: 'Join on Google Meet' })
      .getAttribute('href'),
  ).toBe('https://meet.google.com/nax-wqkf-stu')
  fireEvent.click(screen.getByRole('button', { name: 'Copiar link' }))
  expect(copied).toEqual(['https://meet.google.com/nax-wqkf-stu'])
  expect(
    document.querySelector('[data-slot="upcoming-event-live"]'),
  ).toBeTruthy()
})

test('project card widget derives the progress from the subtasks', () => {
  const toggles: [string, boolean][] = []
  render(
    <ProjectCardWidget
      endLabel="25 May"
      onSubtaskToggle={(id, done) => toggles.push([id, done])}
      people={[
        { id: 'ana', label: 'Ana Martins' },
        { id: 'gabriel', label: 'Gabriel Melo' },
        { id: 'marina', label: 'Marina Souza' },
        { id: 'joao', label: 'João Lima' },
      ]}
      startLabel="10 May"
      subtasks={[
        { done: true, id: 'interview', label: 'Interview with users' },
        { done: true, id: 'brainstorm', label: 'Brainstorm' },
        { done: false, id: 'wireframe', label: 'Wireframe design' },
        { done: false, id: 'visual', label: 'Visual design' },
      ]}
      tags={[
        { id: 'design', label: 'Design' },
        { id: 'web', label: 'Website' },
      ]}
      title="Design Website"
    />,
  )
  const meter = screen.getByRole('meter', { name: 'Progresso' })
  expect(meter.getAttribute('aria-valuenow')).toBe('50')
  expect(meter.textContent).toContain('50%')
  const subtasks = screen.getByRole('list', { name: 'Subtarefas' })
  expect(subtasks.querySelectorAll('li').length).toBe(4)
  fireEvent.click(screen.getByRole('checkbox', { name: 'Wireframe design' }))
  expect(toggles).toEqual([['wireframe', true]])
  const people = screen.getByRole('list', { name: 'Pessoas' })
  expect(people.textContent).toContain('+1')
  expect(people.textContent).toContain('João Lima')
})

test('agenda widget lists the events of the selected day', () => {
  const selections: string[] = []
  render(
    <AgendaWidget
      defaultSelected={new Date(2023, 3, 19)}
      events={[
        {
          date: '2023-04-19',
          endLabel: '6:30 PM',
          id: 'yoga',
          startLabel: '5:30 PM',
          title: 'Yoga Class',
        },
        {
          date: '2023-04-20',
          id: 'gym',
          startLabel: '9:30 AM',
          title: 'Gym',
        },
      ]}
      onSelect={(date) => selections.push(date.toDateString())}
      title="April, 2023"
    />,
  )
  const list = screen.getByRole('list', { name: 'Eventos do dia' })
  expect(list.textContent).toContain('Yoga Class')
  expect(list.textContent).toContain('5:30 PM – 6:30 PM')
  expect(list.textContent).not.toContain('Gym')
  fireEvent.click(
    screen.getByRole('button', { name: 'Thursday, April 20th, 2023' }),
  )
  expect(selections).toEqual([new Date(2023, 3, 20).toDateString()])
  expect(
    screen.getByRole('list', { name: 'Eventos do dia' }).textContent,
  ).toContain('Gym')
  fireEvent.click(
    screen.getByRole('button', { name: 'Friday, April 21st, 2023' }),
  )
  expect(screen.getByText('Sem eventos')).toBeTruthy()
})

test('world clock widget renders each zone from the same instant', () => {
  render(
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
      now={new Date('2026-10-02T20:11:20Z')}
    />,
  )
  const region = screen.getByRole('region', { name: 'Relógios' })
  const times = [...region.querySelectorAll('time')]
  expect(times.map((time) => time.textContent)).toEqual([
    '10:11:20 PM',
    '9:11:20 PM',
  ])
  expect(times[0]?.getAttribute('dateTime')).toBe('2026-10-02T20:11:20.000Z')
  expect(region.textContent).toContain('Paris')
  expect(region.textContent).toContain('22°C')
})
