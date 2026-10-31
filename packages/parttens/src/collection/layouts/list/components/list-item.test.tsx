import { afterEach, describe, expect, test } from 'bun:test'

await import('../../../test/dom')

const { cleanup, fireEvent, render, screen } = await import(
  '@testing-library/react'
)
const {
  ListItem,
  ListItemBody,
  ListItemDescription,
  ListItemField,
  ListItemLeading,
  ListItemTitle,
  ListItemTitleTrigger,
  ListItemTrailing,
} = await import('./list-item')
const { ListItemSkeleton } = await import('./list-item-skeleton')

afterEach(cleanup)

// O crescimento do corpo da linha migrou para a story `Collections/Views/List`. As
// pontas seguem aqui: nenhuma story renderiza leading e trailing ao mesmo tempo, e
// criar uma só para isso custaria mais do que a asserção vale.
describe('ListItem operational layout', () => {
  test('keeps the approved body and trailing anatomy while loading', () => {
    const { container } = render(<ListItemSkeleton label="Carregando tarefa" />)

    const skeleton = screen.getByRole('status', { name: 'Carregando tarefa' })
    expect(skeleton.getAttribute('aria-busy')).toBe('true')
    expect(
      container.querySelector('[data-slot="list-item-leading"]'),
    ).toBeTruthy()
    expect(container.querySelector('[data-slot="list-item-body"]')).toBeTruthy()
    expect(
      container.querySelector('[data-slot="list-item-trailing"]'),
    ).toBeTruthy()
  })

  test('separates leading controls, content hierarchy and trailing controls', () => {
    const { container } = render(
      <ListItem>
        <ListItemLeading>Selecionar</ListItemLeading>
        <ListItemBody>
          <ListItemTitle>Revisar contrato</ListItemTitle>
          <ListItemDescription>
            Validar os documentos recebidos
          </ListItemDescription>
        </ListItemBody>
        <ListItemTrailing>Status e ações</ListItemTrailing>
      </ListItem>,
    )

    expect(
      screen.getByRole('heading', { name: 'Revisar contrato' }),
    ).toBeTruthy()
    expect(
      container.querySelector('[data-slot="list-item-leading"]')?.className,
    ).toContain('shrink-0')
    expect(
      container.querySelector('[data-slot="list-item-trailing"]')?.className,
    ).toContain('ms-auto')
    // Descrição truncada por padrão: a linha tem uma altura só, e o consumidor
    // não repete `min-w-0 truncate` a cada uso.
    expect(
      container.querySelector('[data-slot="list-item-description"]')?.className,
    ).toContain('truncate')
  })

  test('owns the vertical rhythm of both densities', () => {
    const { container: comfortable } = render(<ListItem>Confortável</ListItem>)
    const { container: compact } = render(
      <ListItem density="compact">Compacta</ListItem>,
    )

    expect(
      comfortable.querySelector('[data-slot="list-item"]')?.className,
    ).toContain('py-1.5')
    expect(
      compact.querySelector('[data-slot="list-item"]')?.className,
    ).toContain('py-1')
    expect(
      compact
        .querySelector('[data-slot="list-item"]')
        ?.getAttribute('data-density'),
    ).toBe('compact')
  })

  test('hides a field on narrow viewports unless it is always visible', () => {
    const { container } = render(
      <ListItem>
        <ListItemTrailing>
          <ListItemField data-testid="priority">Alta</ListItemField>
          <ListItemField always data-testid="actions">
            Abrir
          </ListItemField>
        </ListItemTrailing>
      </ListItem>,
    )

    const priority = container.querySelector('[data-testid="priority"]')
    expect(priority?.className).toContain('hidden')
    expect(priority?.className).toContain('lg:flex')

    const actions = container.querySelector('[data-testid="actions"]')
    expect(actions?.className).toContain('flex')
    expect(actions?.className).not.toContain('hidden')
  })

  test('exposes the title trigger as a button that keeps the heading semantics', () => {
    const clicks: string[] = []
    render(
      <ListItem>
        <ListItemBody>
          <ListItemTitle>
            <ListItemTitleTrigger onClick={() => clicks.push('open')}>
              Revisar contrato
            </ListItemTitleTrigger>
          </ListItemTitle>
        </ListItemBody>
      </ListItem>,
    )

    const trigger = screen.getByRole('button', { name: 'Revisar contrato' })
    expect(trigger.getAttribute('type')).toBe('button')
    expect(
      screen.getByRole('heading', { name: 'Revisar contrato' }),
    ).toBeTruthy()

    fireEvent.click(trigger)
    expect(clicks).toEqual(['open'])
  })
})
