import { afterEach, expect, test } from 'bun:test'

await import('../../properties/test/dom')

class ResizeObserverStub {
  disconnect() {}
  observe() {}
  unobserve() {}
}
Object.assign(globalThis, { ResizeObserver: ResizeObserverStub })

const { cleanup, render, screen, within } = await import(
  '@testing-library/react'
)
const {
  AchievementsWidget,
  LevelWidget,
  ProgressFooter,
  ProgressHud,
  QuestsWidget,
  StreakWidget,
} = await import('./index')

afterEach(cleanup)

const xp = { current: 180, target: 250, total: 930 }

test('level widget reports XP toward the next level on a named meter', () => {
  render(<LevelWidget level={4} title="Seu progresso" xp={xp} />)
  const meter = screen.getByRole('meter', { name: 'Progresso para o nível 5' })
  expect(meter.getAttribute('aria-valuenow')).toBe('180')
  expect(meter.getAttribute('aria-valuemax')).toBe('250')
  const region = screen.getByRole('region', { name: 'Seu progresso' })
  expect(region.textContent).toContain('930 XP no total')
  expect(region.textContent).toContain('Faltam 70 XP para o nível 5.')
})

test('level widget clamps XP beyond the target', () => {
  render(
    <LevelWidget
      level={4}
      title="Seu progresso"
      xp={{ current: 300, target: 250, total: 1050 }}
    />,
  )
  expect(
    screen
      .getByRole('meter', { name: 'Progresso para o nível 5' })
      .getAttribute('aria-valuenow'),
  ).toBe('250')
  expect(screen.getByText(/Faltam/).textContent).toContain('Faltam 0 XP')
})

test('streak widget announces each day state instead of relying on the icon', () => {
  render(
    <StreakWidget
      days={3}
      title="Sequência"
      week={[
        { active: true, id: 'd1', label: 'seg' },
        { active: false, id: 'd2', label: 'ter', today: true },
      ]}
    />,
  )
  const list = screen.getByRole('list', { name: 'Dias de estudo' })
  expect(list.textContent).toContain('seg: estudou')
  expect(list.textContent).toContain('ter, hoje: sem estudo')
  expect(list.querySelectorAll('[data-today="true"]')).toHaveLength(1)
  expect(
    screen.getByRole('region', { name: 'Sequência' }).textContent,
  ).toContain('3dias seguidos')
})

test('achievements widget counts the unlocked ones and names the state of each', () => {
  render(
    <AchievementsWidget
      achievements={[
        {
          detail: 'Conclua uma sessão',
          icon: null,
          id: 'first',
          label: 'Primeiro passo',
          unlocked: true,
        },
        {
          detail: 'Estude 5 dias seguidos',
          icon: null,
          id: 'streak',
          label: 'Fogo aceso',
          progress: { current: 3, target: 5 },
          unlocked: false,
        },
      ]}
      title="Conquistas"
    />,
  )
  const region = screen.getByRole('region', { name: 'Conquistas' })
  expect(region.textContent).toContain('1 de 2')
  expect(
    screen.getByText('Primeiro passo').closest('li')?.textContent,
  ).toContain('conquistada')
  const locked = screen.getByText('Fogo aceso').closest('li')
  expect(locked?.textContent).toContain('bloqueada')
  expect(locked?.textContent).toContain('3/5')
})

test('quests widget lists open quests before finished ones and marks the finished', () => {
  render(
    <QuestsWidget
      description="930 XP - 2 dias seguidos"
      quests={[
        {
          done: true,
          icon: null,
          id: 'first',
          label: 'Primeiro passo',
        },
        {
          detail: 'Faltam 70 XP',
          done: false,
          icon: null,
          id: 'level',
          label: 'Chegar ao nível 5',
          progress: { current: 180, target: 250 },
        },
      ]}
      title="Missões"
    />,
  )
  const items = within(
    screen.getByRole('region', { name: 'Missões' }),
  ).getAllByRole('listitem')
  expect(
    items.map((item) => [
      item.querySelector('p')?.textContent,
      item.hasAttribute('data-done'),
    ]),
  ).toEqual([
    ['Chegar ao nível 5', false],
    ['Primeiro passo', true],
  ])
  expect(
    screen
      .getByRole('meter', { name: 'Chegar ao nível 5' })
      .getAttribute('aria-valuenow'),
  ).toBe('180')
  expect(screen.getByText('Concluída')).toBeDefined()
  expect(screen.getByText('930 XP - 2 dias seguidos')).toBeDefined()
})

test('progress hud names streak and achievements for a screen reader', () => {
  render(
    <ProgressHud
      achievements={{ total: 3, unlocked: 1 }}
      aria-label="Seu progresso"
      level={4}
      streakDays={3}
      xp={xp}
    />,
  )
  const hud = screen.getByRole('region', { name: 'Seu progresso' })
  expect(hud.textContent).toContain('3 dias seguidos')
  expect(hud.textContent).toContain('1/3 conquistas')
  expect(hud.textContent).toContain('180/250 XP')
})

test('progress footer reads the score with its label, and no label before there is one', () => {
  const metrics = [{ icon: null, id: 'cards', value: '24 cartões' }]
  const { container, rerender } = render(
    <ProgressFooter
      metrics={metrics}
      score={{ display: '86%', max: 100, srLabel: 'de acerto', value: 86 }}
    />,
  )
  expect(container.textContent).toBe('24 cartões86% de acerto')
  expect(
    container.querySelector('[data-slot="progress-ring"]'),
  ).not.toHaveProperty('dataset.empty', 'true')

  rerender(
    <ProgressFooter
      metrics={metrics}
      score={{ display: '—', max: 100, srLabel: 'de acerto', value: null }}
    />,
  )
  expect(container.textContent).toBe('24 cartões—')
  expect(
    container
      .querySelector('[data-slot="progress-ring"]')
      ?.getAttribute('data-empty'),
  ).toBe('true')
})
