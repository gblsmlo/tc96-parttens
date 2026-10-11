import { afterEach, describe, expect, mock, test } from 'bun:test'

await import('../test/dom')

const { cleanup, fireEvent, render, screen } = await import(
  '@testing-library/react'
)
const { PropertyAddTrigger } = await import('./property-add-trigger')
const { MailIcon } = await import('lucide-react')

afterEach(cleanup)

describe('PropertyAddTrigger', () => {
  test('empty, it shows the placeholder as an absent value and names the action', () => {
    render(
      <PropertyAddTrigger
        addLabel="Adicionar e-mail"
        hasValue={false}
        icon={MailIcon}
        placeholder="Sem e-mail"
      />,
    )

    const trigger = screen.getByRole('button', { name: 'Adicionar e-mail' })
    expect(trigger.textContent).toBe('Sem e-mail')
    expect(trigger.getAttribute('data-empty')).toBe('true')
    expect(trigger.querySelector('svg')).toBeTruthy()
  })

  test('with a value, it collapses to a sign and keeps the accessible name', () => {
    render(
      <PropertyAddTrigger
        addLabel="Adicionar e-mail"
        hasValue
        icon={MailIcon}
        placeholder="Sem e-mail"
      />,
    )

    const trigger = screen.getByRole('button', { name: 'Adicionar e-mail' })
    expect(trigger.textContent).toBe('')
    expect(trigger.getAttribute('data-empty')).toBeNull()
    expect(trigger.querySelectorAll('svg')).toHaveLength(1)
  })

  test('muted can be overridden', () => {
    render(
      <PropertyAddTrigger
        addLabel="Anexar"
        hasValue={false}
        muted={false}
        placeholder="Anexar"
      />,
    )

    expect(
      screen.getByRole('button', { name: 'Anexar' }).getAttribute('data-empty'),
    ).toBeNull()
  })

  test('forwards the props a Base UI trigger injects', () => {
    render(
      <PropertyAddTrigger
        addLabel="Adicionar"
        aria-expanded="true"
        aria-haspopup="dialog"
        data-testid="trigger"
        hasValue={false}
        placeholder="Sem valor"
      />,
    )

    const trigger = screen.getByTestId('trigger')
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog')
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
  })

  test('runs onClick, and not when disabled', () => {
    const onClick = mock()
    const { rerender } = render(
      <PropertyAddTrigger
        addLabel="Adicionar"
        hasValue={false}
        onClick={onClick}
        placeholder="Sem valor"
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Adicionar' }))
    expect(onClick).toHaveBeenCalledTimes(1)

    rerender(
      <PropertyAddTrigger
        addLabel="Adicionar"
        disabled
        hasValue={false}
        onClick={onClick}
        placeholder="Sem valor"
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
