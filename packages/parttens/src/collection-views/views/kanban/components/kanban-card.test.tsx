import { afterEach, describe, expect, test } from 'bun:test'

await import('../../../test/dom')

const { cleanup, fireEvent, render, screen } = await import(
  '@testing-library/react'
)
const {
  KanbanCard,
  KanbanCardAction,
  KanbanCardOpenTrigger,
  kanbanCardVariants,
} = await import('./kanban-card')
const { KanbanCardSkeleton } = await import('./kanban-card-skeleton')

afterEach(cleanup)

// A aparência renderizada do KanbanCard — anel de seleção, borda tracejada da
// movimentação, densidade do modo compacto, régua do footer e cor do texto de apoio —
// é asseverada nas stories `Collections/Views/KanbanCard`, em estilo computado.
// Aqui fica o que o browser não alcança: pseudo-classes que só respondem a mouse e
// teclado reais, e os atributos de contrato.
describe('kanbanCardVariants', () => {
  test('reserves the full column width', () => {
    expect(kanbanCardVariants()).toContain('w-full')
  })

  test('declares the interactive affordances that need real input to trigger', () => {
    // `:hover` e `:focus-visible` não respondem a evento sintético do Testing Library,
    // e a `play` do Storybook só dispara evento sintético — a classe é a única evidência.
    expect(kanbanCardVariants({ variant: 'interactive' })).toContain(
      'hover:bg-card/60',
    )
    expect(kanbanCardVariants({ variant: 'interactive' })).toContain(
      'focus-visible:ring-2',
    )
    expect(kanbanCardVariants({ variant: 'interactive' })).toContain(
      'has-focus-visible:ring-2',
    )
    expect(kanbanCardVariants({ variant: 'interactive' })).toContain(
      '[&>:focus-visible]:outline-none',
    )
  })
})

describe('KanbanCard', () => {
  test('exposes the canonical card anatomy while loading', () => {
    const { container } = render(
      <KanbanCardSkeleton label="Carregando tarefa" />,
    )

    const skeleton = screen.getByRole('status', { name: 'Carregando tarefa' })
    expect(skeleton.getAttribute('aria-busy')).toBe('true')
    expect(container.querySelector('[data-slot="card-header"]')).toBeTruthy()
    expect(container.querySelector('[data-slot="card-panel"]')).toBeTruthy()
    expect(container.querySelector('[data-slot="card-footer"]')).toBeTruthy()
  })

  test('composes a custom element through render while retaining the card contract', () => {
    render(
      <KanbanCard
        render={<section aria-label="Cartão de tarefa" />}
        selected
        variant="interactive"
      >
        Abrir tarefa
      </KanbanCard>,
    )

    const card = screen.getByRole('region', { name: 'Cartão de tarefa' })

    expect(card.getAttribute('data-pattern')).toBe('kanban-card')
    expect(card.getAttribute('data-slot')).toBe('card')
    expect(card.getAttribute('data-state')).toBe('selected')
  })
})

describe('KanbanCardOpenTrigger', () => {
  function CardWithActions({
    onAction,
    onOpen,
  }: Readonly<{ onAction: () => void; onOpen: () => void }>) {
    return (
      <KanbanCard variant="interactive">
        <KanbanCardOpenTrigger
          aria-label="Abrir detalhes do item"
          onClick={onOpen}
        />
        <KanbanCardAction>
          <button onClick={onAction} type="button">
            Mudar prioridade
          </button>
        </KanbanCardAction>
      </KanbanCard>
    )
  }

  test('keeps the card an article so inner controls stay valid HTML', () => {
    const { container } = render(
      <KanbanCard variant="interactive">
        <KanbanCardOpenTrigger aria-label="Abrir detalhes do item" />
        <KanbanCardAction>
          <button type="button">Mudar prioridade</button>
        </KanbanCardAction>
      </KanbanCard>,
    )

    const card = container.querySelector('[data-pattern="kanban-card"]')
    expect(card?.tagName).toBe('ARTICLE')
    // Nenhum botão embrulha outro: o gatilho e a ação são irmãos.
    expect(card?.querySelector('button button')).toBeNull()
  })

  test('separates the open trigger from an inner action', () => {
    const events: string[] = []
    render(
      <CardWithActions
        onAction={() => events.push('action')}
        onOpen={() => events.push('open')}
      />,
    )

    fireEvent.click(
      screen.getByRole('button', { name: 'Abrir detalhes do item' }),
    )
    expect(events).toEqual(['open'])

    fireEvent.click(screen.getByRole('button', { name: 'Mudar prioridade' }))
    // A ação interna não reabre o card: são alvos distintos.
    expect(events).toEqual(['open', 'action'])
  })

  test('marks the action slot with the data-kanban-card-action contract', () => {
    const { container } = render(
      <KanbanCard>
        <KanbanCardAction>
          <button type="button">Mudar prioridade</button>
        </KanbanCardAction>
      </KanbanCard>,
    )

    expect(container.querySelector('[data-kanban-card-action]')).toBeTruthy()
  })

  test('raises marked actions above the stretched trigger', () => {
    // Sem esta regra a ação fica sob o gatilho esticado e nunca recebe o clique.
    expect(kanbanCardVariants()).toContain('[&_[data-kanban-card-action]]:z-10')
    expect(kanbanCardVariants()).toContain('isolate')
  })
})
