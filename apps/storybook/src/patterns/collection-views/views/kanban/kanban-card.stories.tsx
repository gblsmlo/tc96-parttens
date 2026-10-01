import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, screen, userEvent, within } from 'storybook/test'
import {
  KanbanCard,
  KanbanCardOpenTrigger,
  KanbanCardSkeleton,
} from 'tc96/blocks'
import { KanbanCardExampleContent } from './kanban-card-example'

function Example({
  dimmed = false,
  interactive = false,
  selected = false,
}: Readonly<{
  dimmed?: boolean
  interactive?: boolean
  selected?: boolean
}>) {
  return (
    <div className="w-full max-w-sm p-4">
      <KanbanCard
        dimmed={dimmed}
        render={
          interactive
            ? (props) => (
                <a {...props} href="#task-detail">
                  {props.children}
                </a>
              )
            : undefined
        }
        selected={selected}
        variant={interactive ? 'interactive' : 'default'}
      >
        <KanbanCardExampleContent
          description="O consumer compõe o shell com dados e propriedades do item."
          readOnlyPriority={interactive}
          title="Revisar proposta comercial"
        />
      </KanbanCard>
    </div>
  )
}

/** Alvos do contrato visual do KanbanCard, medidos em browser real. */
const slot = (canvasElement: HTMLElement, nome: string) =>
  canvasElement.querySelector<HTMLElement>(
    `[data-slot="${nome}"]`,
  ) as HTMLElement

function OpenTriggerExample() {
  const [events, setEvents] = useState<readonly string[]>([])

  return (
    <div className="w-full max-w-sm p-4">
      <KanbanCard variant="interactive">
        <KanbanCardOpenTrigger
          aria-label="Abrir detalhes do item"
          onClick={() => setEvents((current) => [...current, 'abrir'])}
        />
        <KanbanCardExampleContent
          description="O consumer compõe o shell com dados e propriedades do item."
          footerExtra={
            <span className="sr-only" data-story-events>
              {events.join(' · ') || 'nenhuma ação'}
            </span>
          }
          onPriorityChange={(value) =>
            setEvents((current) => [
              ...current,
              `prioridade: ${value ?? 'none'}`,
            ])
          }
          priorityIsCardAction
          title="Revisar proposta comercial"
        />
      </KanbanCard>
    </div>
  )
}

const meta = {
  argTypes: {
    density: {
      control: 'select',
      description: 'Densidade do shell do card compartilhado.',
      options: ['sm', 'md', 'lg'],
    },
    dimmed: {
      control: 'boolean',
      description:
        'Indica que o card está temporariamente inativo durante uma movimentação.',
    },
    render: {
      control: false,
      description:
        'Permite trocar o elemento raiz usando o contrato render de Base UI.',
    },
    selected: {
      control: 'boolean',
      description: 'Aplica o estado visual de seleção ao card.',
    },
    variant: {
      control: 'radio',
      description: 'Escolhe o tratamento visual padrão ou interativo do card.',
      options: ['default', 'interactive'],
    },
  },
  component: KanbanCard,
  parameters: {
    docs: {
      description: {
        component:
          'Contrato visual canônico para cards em Kanban. Todos os exemplos usam a anatomia completa: título, descrição, propriedade de prioridade, contagem de tarefas e responsável. O consumer fornece os dados e as ações de domínio.',
      },
    },
  },
  tags: ['autodocs', 'storybook-test'],
  title: 'Patterns/CollectionViews/Views/Kanban/Card',
} satisfies Meta<typeof KanbanCard>

export default meta

type Story = StoryObj<typeof meta>

export const Full: Story = {
  play: async ({ canvasElement }) => {
    const footer = getComputedStyle(slot(canvasElement, 'card-footer'))

    // O footer se separa do conteúdo por uma régua de 1px, não por espaçamento.
    await expect(footer.borderTopWidth).toBe('1px')
    await expect(footer.minHeight).toBe('36px')
    await expect(footer.paddingLeft).toBe('12px')
    await expect(footer.paddingTop).toBe('8px')

    // Texto de apoio: mesma cor atenuada no footer e na descrição, legível nos dois temas.
    const descricao = getComputedStyle(slot(canvasElement, 'card-description'))

    await expect(descricao.color).toBe(footer.color)
    await expect(descricao.color).not.toBe(
      getComputedStyle(slot(canvasElement, 'card-title')).color,
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          'Anatomia completa para o card com título, descrição, metadados e footer de tasks e responsável.',
      },
    },
  },
  render: () => <Example />,
}

export const WithOpenTriggerAndActions: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'O card permanece `article` e ganha um gatilho esticado para abrir. Controles internos marcados com `data-kanban-card-action` sobem acima do gatilho e recebem o próprio clique — é o que permite propriedade editável dentro de um card clicável, sem botão dentro de botão.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const card = slot(canvasElement, 'card')

    await expect(card.tagName).toBe('ARTICLE')

    // O gatilho cobre a área interna do card — `inset-0` mede a caixa de padding,
    // então a comparação é com `clientWidth`, e não com a borda externa.
    const trigger = slot(canvasElement, 'kanban-card-open-trigger')
    const triggerBox = trigger.getBoundingClientRect()

    await expect(getComputedStyle(trigger).position).toBe('absolute')
    await expect(Math.round(triggerBox.width)).toBe(card.clientWidth)
    await expect(Math.round(triggerBox.height)).toBe(card.clientHeight)

    // A ação interna fica acima do gatilho, senão nunca receberia o clique.
    const action = canvasElement.querySelector<HTMLElement>(
      '[data-kanban-card-action]',
    )

    if (!action)
      throw new Error('A story não renderizou [data-kanban-card-action].')

    await expect(getComputedStyle(action).zIndex).toBe('10')

    // Cada alvo dispara só o que é seu.
    await userEvent.click(canvas.getByRole('combobox', { name: 'Prioridade' }))
    await userEvent.click(await screen.findByRole('option', { name: 'Média' }))
    await expect(
      canvasElement.querySelector('[data-story-events]')?.textContent,
    ).toBe('prioridade: medium')

    await userEvent.click(
      canvas.getByRole('button', { name: 'Abrir detalhes do item' }),
    )
    await expect(
      canvasElement.querySelector('[data-story-events]')?.textContent,
    ).toBe('prioridade: medium · abrir')
  },
  render: () => <OpenTriggerExample />,
}

export const Selected: Story = {
  play: async ({ canvasElement }) => {
    const card = slot(canvasElement, 'card')

    await expect(card.getAttribute('data-state')).toBe('selected')
    // ring-2: um anel de 2px de espalhamento no box-shadow.
    await expect(getComputedStyle(card).boxShadow).toContain('0px 0px 0px 2px')
  },
  parameters: {
    docs: {
      description: {
        story: 'Estado visual usado quando o card está selecionado na coleção.',
      },
    },
  },
  render: () => <Example selected />,
}

export const Moving: Story = {
  play: async ({ canvasElement }) => {
    const card = getComputedStyle(slot(canvasElement, 'card'))

    // Movimentação é comunicada por borda tracejada — nunca por opacidade, que
    // apagaria o texto junto.
    await expect(card.borderStyle).toBe('dashed')
    await expect(card.opacity).toBe('1')
  },
  parameters: {
    docs: {
      description: {
        story: 'Estado temporário durante uma movimentação por drag and drop.',
      },
    },
  },
  render: () => <Example dimmed />,
}

export const Interactive: Story = {
  play: async ({ canvasElement }) => {
    // A raiz interativa alinha o texto à esquerda mesmo virando botão ou link.
    // O realce de `hover:` fica fora: `:hover` de CSS não responde a evento sintético,
    // só a mouse real — a classe continua sendo a evidência possível, em jsdom.
    await expect(getComputedStyle(slot(canvasElement, 'card')).textAlign).toBe(
      'left',
    )
  },

  parameters: {
    docs: {
      description: {
        story:
          'Composição interativa que troca o elemento raiz por um link sem duplicar o shell do card.',
      },
    },
  },
  render: () => <Example interactive />,
}

export const Loading: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Estado de carregamento que preserva a anatomia completa do KanbanCard e comunica progresso sem conteúdo fictício.',
      },
    },
  },
  render: () => (
    <div className="w-full max-w-sm p-4">
      <KanbanCardSkeleton label="Carregando card" />
    </div>
  ),
}
