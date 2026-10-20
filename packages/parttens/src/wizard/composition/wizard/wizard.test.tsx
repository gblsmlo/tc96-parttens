import { afterEach, expect, mock, test } from 'bun:test'
import { type ComponentProps, useState } from 'react'
import type { WizardStep } from '../../core'

await import('../../test/dom')

const { act, cleanup, fireEvent, render, screen, within } = await import(
  '@testing-library/react'
)
const { Wizard } = await import('./wizard')

afterEach(async () => {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 20))
  })
  cleanup()
})

const steps: WizardStep[] = [
  {
    description: 'Escolha o tipo',
    icon: <svg data-testid="type-icon" />,
    title: 'Tipo',
    value: 'type',
  },
  { description: 'Informe os dados', title: 'Detalhes', value: 'details' },
  { disabled: true, title: 'Revisão', value: 'review' },
]

function mount(props: Partial<ComponentProps<typeof Wizard>> = {}) {
  return render(
    <Wizard
      label="Etapas do cupom"
      onValueChange={() => {}}
      steps={steps}
      value="details"
      {...props}
    >
      <p>Conteúdo</p>
    </Wizard>,
  )
}

const nav = () => screen.getByRole('navigation', { name: 'Etapas do cupom' })
const stepItems = () => within(nav()).getAllByRole('listitem')
const stepButton = (name: RegExp) => within(nav()).getByRole('button', { name })

test('lists the steps in an ordered list inside a nav named by label', () => {
  mount()

  expect(stepItems()[0]?.parentElement?.tagName).toBe('OL')
  expect(stepItems()).toHaveLength(3)
  expect(stepButton(/^Tipo/).textContent).toBe('TipoEscolha o tipo')
})

test('derives each step status from its position against value', () => {
  mount()

  expect(stepItems().map((item) => item.getAttribute('data-status'))).toEqual([
    'complete',
    'current',
    'upcoming',
  ])
  expect(stepButton(/^Detalhes/).getAttribute('aria-current')).toBe('step')
  expect(stepButton(/^Tipo/).hasAttribute('aria-current')).toBe(false)
})

test('shows the step icon, a check when complete and the number otherwise', () => {
  const { rerender } = mount()
  const indicator = (index: number) =>
    stepItems()[index]?.querySelector('[data-slot="wizard-step-indicator"]')

  expect(
    indicator(0)?.querySelector('[data-testid="type-icon"]'),
  ).not.toBeNull()
  expect(indicator(0)?.getAttribute('aria-hidden')).toBe('true')
  expect(indicator(1)?.textContent).toBe('2')
  expect(indicator(2)?.textContent).toBe('3')

  rerender(
    <Wizard
      label="Etapas do cupom"
      onValueChange={() => {}}
      steps={steps}
      value="review"
    />,
  )

  expect(indicator(1)?.querySelector('svg')).not.toBeNull()
  expect(indicator(1)?.textContent).toBe('')
})

test('selects another step from the nav and skips the current one', () => {
  const onValueChange = mock((_value: string) => {})
  mount({ onValueChange })

  fireEvent.click(stepButton(/^Tipo/))
  fireEvent.click(stepButton(/^Detalhes/))

  expect(onValueChange.mock.calls).toEqual([['type']])
})

test('keeps a disabled step out of reach', () => {
  const onValueChange = mock((_value: string) => {})
  mount({ onValueChange })

  const review = stepButton(/^Revisão/) as HTMLButtonElement
  fireEvent.click(review)

  expect(review.disabled).toBe(true)
  expect(onValueChange).not.toHaveBeenCalled()
})

test('names the panel by the current step title', () => {
  mount()

  const panel = screen.getByRole('region', { name: 'Detalhes' })

  expect(panel.getAttribute('data-slot')).toBe('wizard-panel')
  expect(panel.getAttribute('tabindex')).toBe('-1')
  expect(panel.textContent).toBe('Conteúdo')
})

test('leaves the panel unnamed when value is not a step', () => {
  mount({ value: 'missing' })

  expect(screen.queryByRole('region')).toBeNull()
  expect(
    stepItems().every(
      (item) => item.getAttribute('data-status') === 'upcoming',
    ),
  ).toBe(true)
})

test('sets the nav on the outer card and the panel on a card raised over it', () => {
  const { container } = mount({ className: 'max-w-4xl' })
  const root = container.firstElementChild as HTMLElement
  const shell = root.querySelector('[data-slot="card"]') as HTMLElement
  const panel = screen.getByRole('region', { name: 'Detalhes' })
  const panelCard = panel.parentElement as HTMLElement

  expect(root.getAttribute('data-slot')).toBe('wizard')
  expect(root.className).toContain('max-w-4xl')
  expect(shell.parentElement).toBe(root)
  expect(nav().parentElement).toBe(shell)
  expect(panelCard.getAttribute('data-slot')).toBe('card')
  expect(panelCard.parentElement).toBe(shell)
  expect(shell.className).toContain('bg-muted')
  expect(panelCard.className).not.toContain('bg-muted')
})

function JumpingWizard() {
  const [value, setValue] = useState('review')

  return (
    <Wizard
      label="Etapas do cupom"
      onValueChange={setValue}
      steps={steps}
      value={value}
    >
      {value === 'review' ? (
        <button onClick={() => setValue('type')} type="button">
          Editar tipo
        </button>
      ) : (
        <p>Conteúdo</p>
      )}
    </Wizard>
  )
}

test('focuses the panel when a jump unmounts the focused element', async () => {
  render(<JumpingWizard />)
  const edit = screen.getByRole('button', { name: 'Editar tipo' })

  expect(document.activeElement).not.toBe(
    screen.getByRole('region', { name: 'Revisão' }),
  )

  edit.focus()
  await act(async () => {
    fireEvent.click(edit)
  })

  expect(document.activeElement).toBe(
    screen.getByRole('region', { name: 'Tipo' }),
  )
})

test('keeps focus on a nav step after a click', async () => {
  render(<JumpingWizard />)
  const typeStep = stepButton(/^Tipo/)

  typeStep.focus()
  await act(async () => {
    fireEvent.click(typeStep)
  })

  expect(document.activeElement).toBe(typeStep)
})
