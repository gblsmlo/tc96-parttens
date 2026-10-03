import { afterEach, describe, expect, mock, test } from 'bun:test'

await import('../../../test/dom')

const { cleanup, fireEvent, render, screen } = await import(
  '@testing-library/react'
)
const { ListRow } = await import('./list-row')

afterEach(cleanup)

describe('ListRow', () => {
  test('renders left and right slots', () => {
    const { container } = render(
      <ListRow
        actions={<button type="button">Mais</button>}
        description="Conta corrente"
        icon="NB"
        properties={<span>Ativa</span>}
        title="Nubank"
        value="R$ 1.856,20"
      />,
    )

    const frame = container.querySelector('[data-slot="icon-frame"]')
    expect(frame?.getAttribute('data-shape')).toBe('rounded')
    expect(screen.getByRole('heading', { name: 'Nubank' })).toBeTruthy()
    expect(screen.getByText('R$ 1.856,20')).toBeTruthy()
    expect(screen.getByText('Ativa')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Mais' })).toBeTruthy()
  })

  test('joins a description array with dots', () => {
    const { container } = render(
      <ListRow
        description={['Conta corrente', <b key="bank">Nubank</b>, null]}
        title="Nubank"
      />,
    )

    const description = container.querySelector(
      '[data-slot="list-item-description"]',
    )
    expect(description?.textContent).toBe('Conta corrente·Nubank')
    expect(description?.querySelectorAll('[aria-hidden="true"]')).toHaveLength(
      1,
    )
  })

  test('omits empty slots', () => {
    const { container } = render(<ListRow title="Carteira" description={[]} />)

    expect(
      container.querySelector('[data-slot="list-item-leading"]'),
    ).toBeNull()
    expect(
      container.querySelector('[data-slot="list-item-description"]'),
    ).toBeNull()
    expect(
      container.querySelector('[data-slot="list-item-trailing"]'),
    ).toBeNull()
  })

  test('onClick turns the title into the row trigger', () => {
    const onClick = mock()
    const { container } = render(<ListRow onClick={onClick} title="Carteira" />)

    fireEvent.click(screen.getByRole('button', { name: 'Carteira' }))

    expect(onClick).toHaveBeenCalledTimes(1)
    expect(
      container
        .querySelector('[data-slot="list-item"]')
        ?.hasAttribute('data-interactive'),
    ).toBe(true)
  })

  test('without onClick there is no button and no hover', () => {
    const { container } = render(<ListRow title="Carteira" />)

    expect(screen.queryByRole('button')).toBeNull()
    expect(
      container
        .querySelector('[data-slot="list-item"]')
        ?.hasAttribute('data-interactive'),
    ).toBe(false)
  })
})
