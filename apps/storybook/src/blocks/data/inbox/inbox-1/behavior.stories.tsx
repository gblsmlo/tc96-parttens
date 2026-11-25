import type { Meta, StoryObj } from '@storybook/react-vite'
import { Inbox1 } from '@tc96/ui/blocks/data/inbox/inbox-1'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { entries, failureForMember, readInbox } from '../fixtures/inbox-1.ts'
import { type Inbox1Controls, inbox1ControlArgs } from './inbox-1-controls.ts'
import { ComposedInbox1 } from './inbox-1-layouts.tsx'

const meta = {
  args: {
    ...inbox1ControlArgs,
    onCategoryChange: fn(),
    onKindFilterChange: fn(),
    onLoadMore: fn(),
    onMarkRead: fn(),
    onOpen: fn(),
    onReadChange: fn(),
    onReadFilterChange: fn(),
    onReceivedFilterChange: fn(),
    onRetry: fn(),
    onSelectedIdsChange: fn(),
    onSortChange: fn(),
  },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedInbox1 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/Inbox/Inbox1/Behavior',
} satisfies Meta<
  Inbox1Controls & {
    onCategoryChange: () => void
    onKindFilterChange: () => void
    onLoadMore: () => void
    onMarkRead: () => void
    onOpen: () => void
    onReadChange: () => void
    onReadFilterChange: () => void
    onReceivedFilterChange: () => void
    onRetry: () => void
    onSelectedIdsChange: () => void
    onSortChange: () => void
  }
>

export default meta

type Story = StoryObj<typeof meta>

const firstTitle = 'Revisar minuta do contrato social da Padaria Trigo Bom'
const readTitle = 'Juntada de petição no processo 1004567-12.2026.8.26.0002'
const failureTitle = 'Captura de publicações do TJSP interrompida'

const toolbarOf = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole('toolbar', { name: 'Controles da Inbox' })

const rowsOf = (canvasElement: HTMLElement) =>
  canvasElement.querySelectorAll('[data-slot="data-table"] tbody tr')

const rowOf = (canvasElement: HTMLElement, text: string) =>
  within(canvasElement).getByText(text).closest('tr') as HTMLElement

const openCategories = async (canvasElement: HTMLElement, current: string) => {
  await userEvent.click(
    within(toolbarOf(canvasElement)).getByRole('button', { name: current }),
  )
  const categories = await screen.findByRole('group', { name: 'Categorias' })
  await waitFor(() => expect(categories).toBeVisible())
  return categories
}

const categoriesClosed = () =>
  waitFor(() =>
    expect(screen.queryByRole('group', { name: 'Categorias' })).toBeNull(),
  )

const chooseCategory = async (
  canvasElement: HTMLElement,
  current: string,
  next: string,
) => {
  const categories = await openCategories(canvasElement, current)
  await userEvent.click(within(categories).getByRole('button', { name: next }))
  await categoriesClosed()
}

const openDisplayMenu = async (canvasElement: HTMLElement) => {
  await userEvent.click(
    within(canvasElement).getByRole('button', { name: /^Exibição/ }),
  )
  return screen.findByRole('menu')
}

const closeMenus = async () => {
  await userEvent.keyboard('{Escape}')
  await userEvent.keyboard('{Escape}')
  await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
}

const chooseInSubmenu = async (
  canvasElement: HTMLElement,
  submenu: string,
  option: string,
) => {
  await openDisplayMenu(canvasElement)
  await userEvent.click(await screen.findByRole('menuitem', { name: submenu }))
  await userEvent.click(
    await screen.findByRole('menuitemradio', { name: option }),
  )
  await closeMenus()
}

const selectEntry = (canvasElement: HTMLElement, title: string) =>
  userEvent.click(
    within(canvasElement).getByRole('checkbox', {
      name: `Selecionar ${title}`,
    }),
  )

const actionBarOf = (canvasElement: HTMLElement) =>
  within(canvasElement).findByRole('toolbar', {
    name: 'Ações das entradas selecionadas',
  })

export const TheCategorySwitcherReplacesTheHeading: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('region', { name: 'Inbox' })).toBeVisible()
    await expect(canvas.queryByRole('heading', { level: 2 })).toBeNull()
    await expect(
      within(toolbarOf(canvasElement)).getByRole('button', { name: 'Todos' }),
    ).toBeVisible()
    await expect(canvas.getByRole('table', { name: 'Inbox' })).toBeVisible()
    await expect(rowsOf(canvasElement)).toHaveLength(6)
  },
}

export const TheCategoriesKeepTheirOrder: Story = {
  play: async ({ canvasElement }) => {
    const categories = await openCategories(canvasElement, 'Todos')
    await expect(
      within(categories)
        .getAllByRole('button')
        .map((button) => button.textContent),
    ).toEqual(['Todos', 'Tarefas', 'Prazos', 'Tribunal', 'Monitoramento'])
    await userEvent.keyboard('{Escape}')
    await categoriesClosed()
  },
}

export const ChoosingACategoryReportsIt: Story = {
  play: async ({ args, canvasElement }) => {
    await chooseCategory(canvasElement, 'Todos', 'Prazos')
    await expect(args.onCategoryChange).toHaveBeenCalledWith('deadlines')
    await expect(
      within(toolbarOf(canvasElement)).getByRole('button', { name: 'Prazos' }),
    ).toBeVisible()
    await expect(rowsOf(canvasElement)).toHaveLength(5)
  },
}

export const CountsNameTheUnreadEntriesOfEachCategory: Story = {
  args: { counts: true },
  play: async ({ canvasElement }) => {
    const categories = within(await openCategories(canvasElement, 'Todos'))
    await expect(
      categories.getByRole('button', { name: 'Todos, 8 não lidas' }),
    ).toBeVisible()
    await expect(
      categories.getByRole('button', { name: 'Monitoramento, 1 não lida' }),
    ).toHaveTextContent('Monitoramento1')
    await userEvent.keyboard('{Escape}')
    await categoriesClosed()
    await expect(
      within(toolbarOf(canvasElement)).getByRole('button', { name: 'Todos' }),
    ).toBeVisible()
  },
}

export const CategoriesLimitTheChoicesOfAMember: Story = {
  args: { member: true },
  play: async ({ canvasElement }) => {
    const categories = await openCategories(canvasElement, 'Todos')
    await expect(
      within(categories)
        .getAllByRole('button')
        .map((button) => button.textContent),
    ).toEqual(['Todos', 'Tarefas', 'Prazos', 'Tribunal'])
    await userEvent.keyboard('{Escape}')
    await categoriesClosed()
  },
}

export const TheReasonOptionsFollowTheCategory: Story = {
  args: { category: 'deadlines' },
  play: async ({ canvasElement }) => {
    await openDisplayMenu(canvasElement)
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Motivo' }),
    )
    await screen.findByRole('menuitemradio', { name: 'Todos os motivos' })
    await expect(
      screen.getAllByRole('menuitemradio').map((item) => item.textContent),
    ).toEqual([
      'Todos os motivos',
      'Data interna do prazo',
      'Data fatal do prazo',
      'Prazo em risco',
      'Prazo parado',
    ])
    await closeMenus()
  },
}

export const ChangingTheCategoryClearsAReasonOutsideIt: Story = {
  play: async ({ args, canvasElement }) => {
    await chooseInSubmenu(canvasElement, 'Motivo', 'Nova publicação')
    await expect(args.onKindFilterChange).toHaveBeenCalledWith('publication')
    await chooseCategory(canvasElement, 'Todos', 'Tribunal')
    await expect(args.onKindFilterChange).toHaveBeenCalledOnce()
    await chooseCategory(canvasElement, 'Tribunal', 'Prazos')
    await expect(args.onKindFilterChange).toHaveBeenLastCalledWith(null)
  },
}

export const SortReportsTheNewValue: Story = {
  play: async ({ args, canvasElement }) => {
    await chooseInSubmenu(canvasElement, 'Ordenar por', 'Mais antigas')
    await expect(args.onSortChange).toHaveBeenCalledWith('oldest')
    await expect(rowsOf(canvasElement)[0]).toHaveTextContent(
      'Captura de movimentações do TRT-2 com falha',
    )
  },
}

export const ReadFilterReportsTheNewValue: Story = {
  play: async ({ args, canvasElement }) => {
    await chooseInSubmenu(canvasElement, 'Leitura', 'Lidas')
    await expect(args.onReadFilterChange).toHaveBeenCalledWith('read')
    await expect(rowsOf(canvasElement)).toHaveLength(6)
    await expect(within(canvasElement).queryByText(firstTitle)).toBeNull()
  },
}

export const ReceivedFilterReportsTheNewValue: Story = {
  play: async ({ args, canvasElement }) => {
    await chooseInSubmenu(canvasElement, 'Recebida', 'Últimos 7 dias')
    await expect(args.onReceivedFilterChange).toHaveBeenCalledWith('last7')
  },
}

export const ClearFiltersKeepsTheCategoryAndTheSort: Story = {
  args: { category: 'court' },
  play: async ({ args, canvasElement }) => {
    await chooseInSubmenu(canvasElement, 'Leitura', 'Não lidas')
    await expect(
      within(canvasElement).getByRole('button', { name: 'Exibição (1)' }),
    ).toBeVisible()
    await openDisplayMenu(canvasElement)
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Limpar filtros' }),
    )
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
    await expect(args.onReadFilterChange).toHaveBeenLastCalledWith(null)
    await expect(args.onKindFilterChange).toHaveBeenLastCalledWith(null)
    await expect(args.onReceivedFilterChange).toHaveBeenLastCalledWith(null)
    await expect(args.onCategoryChange).not.toHaveBeenCalled()
    await expect(args.onSortChange).not.toHaveBeenCalled()
    await expect(
      within(toolbarOf(canvasElement)).getByRole('button', {
        name: 'Tribunal',
      }),
    ).toBeVisible()
  },
}

export const ARowOpensTheEntry: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: `Abrir ${firstTitle}`,
      }),
    )
    await expect(args.onOpen).toHaveBeenCalledWith('inb-01')
  },
}

export const ARowThatLeadsNowhereDoesNotOpen: Story = {
  args: { member: true },
  play: async ({ args, canvasElement }) => {
    const row = rowOf(canvasElement, failureTitle)
    await expect(row).toHaveTextContent(failureForMember)
    await expect(
      within(row).queryByRole('button', { name: `Abrir ${failureTitle}` }),
    ).toBeNull()
    await expect(row).not.toHaveAttribute('data-interactive')
    await userEvent.click(within(row).getByText(failureTitle))
    await expect(args.onOpen).not.toHaveBeenCalled()
    await userEvent.click(
      within(row).getByRole('checkbox', { name: `Selecionar ${failureTitle}` }),
    )
    await expect(row).toHaveAttribute('data-state', 'selected')
    await expect(args.onSelectedIdsChange).toHaveBeenLastCalledWith(['inb-07'])
  },
}

export const TheReadToggleReportsWithoutOpeningTheRow: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole('button', { name: `Marcar ${firstTitle} como lida` }),
    )
    await expect(args.onReadChange).toHaveBeenCalledWith('inb-01', true)
    await expect(args.onOpen).not.toHaveBeenCalled()
    await expect(
      canvas.getByRole('button', {
        name: `Marcar ${firstTitle} como não lida`,
      }),
    ).toBeVisible()
  },
}

export const TheReadToggleOfAReadEntryMarksItUnread: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: `Marcar ${readTitle} como não lida`,
      }),
    )
    await expect(args.onReadChange).toHaveBeenCalledWith('inb-05', false)
  },
}

export const WithoutOnReadChangeTheDotIsAnImage: Story = {
  args: { readToggle: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getAllByRole('img', { name: 'Não lida' })).toHaveLength(
      5,
    )
    await expect(canvas.getAllByRole('img', { name: 'Lida' })).toHaveLength(1)
    await expect(canvas.queryByRole('button', { name: /^Marcar / })).toBeNull()
  },
}

export const UnreadTitlesAreSemibold: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText(firstTitle)).toHaveClass('font-semibold')
    await expect(canvas.getByText(readTitle)).toHaveClass('font-normal')
  },
}

export const DueCarriesItsTone: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Data fatal 25 nov. · hoje')).toHaveAttribute(
      'data-tone',
      'attention',
    )
    await expect(
      canvas.getByText('Data fatal 24 nov. · venceu'),
    ).toHaveAttribute('data-tone', 'error')
    await expect(canvas.getByText('Data fatal 24 nov. · venceu')).toHaveClass(
      'text-destructive-foreground',
    )
    await expect(
      canvas.getAllByRole('img', { name: 'Sem vencimento' }),
    ).toHaveLength(3)
  },
}

export const TheReceivedHintDescribesTheTimeAndOpensTheEntry: Story = {
  play: async ({ args, canvasElement }) => {
    const received = within(canvasElement).getByRole('button', {
      name: 'há 5 minutos',
    })
    await expect(received).toHaveAccessibleDescription(
      'Recebida em 25/11/2026 às 14:27',
    )
    await userEvent.click(received)
    await expect(args.onOpen).toHaveBeenCalledWith('inb-01')
    await userEvent.unhover(received)
    await waitFor(() =>
      expect(document.querySelector('[data-slot="tooltip-popup"]')).toBeNull(),
    )
  },
}

export const TheEntryIconTakesTheOriginColor: Story = {
  play: async ({ canvasElement }) => {
    const frame = rowOf(canvasElement, firstTitle).querySelector(
      '[data-slot="icon-frame"]',
    ) as HTMLElement
    await expect(frame).toHaveAttribute('data-origin', 'task')
    await expect(frame.style.color).toBe('var(--color-blue-600)')
  },
}

export const WithoutOriginColorsTheIconIsMuted: Story = {
  args: { colors: false },
  play: async ({ canvasElement }) => {
    const frame = rowOf(canvasElement, firstTitle).querySelector(
      '[data-slot="icon-frame"]',
    ) as HTMLElement
    await expect(frame.style.color).toBe('')
    await expect(frame).toHaveClass('bg-muted')
  },
}

export const MarkReadSendsOnlyTheUnreadSelection: Story = {
  play: async ({ args, canvasElement }) => {
    await selectEntry(canvasElement, firstTitle)
    await selectEntry(canvasElement, readTitle)
    const bar = within(await actionBarOf(canvasElement))
    await expect(bar.getByText('2 selecionadas')).toBeVisible()
    await expect(bar.getByRole('button', { name: 'Abrir' })).toBeDisabled()
    await userEvent.click(bar.getByRole('button', { name: 'Marcar como lida' }))
    await expect(args.onMarkRead).toHaveBeenCalledWith(['inb-01'])
    await expect(args.onSelectedIdsChange).toHaveBeenLastCalledWith([])
    await expect(
      within(canvasElement).queryByRole('toolbar', {
        name: 'Ações das entradas selecionadas',
      }),
    ).toBeNull()
  },
}

export const OpenActsOnOneOpenableEntry: Story = {
  play: async ({ args, canvasElement }) => {
    await selectEntry(canvasElement, firstTitle)
    const bar = within(await actionBarOf(canvasElement))
    await userEvent.click(bar.getByRole('button', { name: 'Abrir' }))
    await expect(args.onOpen).toHaveBeenCalledWith('inb-01')
    await expect(args.onSelectedIdsChange).toHaveBeenLastCalledWith([])
  },
}

export const OpenIsDisabledForAnEntryThatLeadsNowhere: Story = {
  args: { member: true },
  play: async ({ canvasElement }) => {
    await selectEntry(canvasElement, failureTitle)
    const bar = within(await actionBarOf(canvasElement))
    await expect(bar.getByRole('button', { name: 'Abrir' })).toBeDisabled()
    await expect(
      bar.getByRole('button', { name: 'Marcar como lida' }),
    ).toBeEnabled()
  },
}

export const MarkReadIsDisabledWhenEverySelectedEntryIsRead: Story = {
  play: async ({ canvasElement }) => {
    await selectEntry(canvasElement, readTitle)
    const bar = within(await actionBarOf(canvasElement))
    await expect(
      bar.getByRole('button', { name: 'Marcar como lida' }),
    ).toBeDisabled()
  },
}

export const LoadMoreAsksForTheNextPage: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(rowsOf(canvasElement)).toHaveLength(6)
    await userEvent.click(canvas.getByRole('button', { name: 'Carregar mais' }))
    await expect(args.onLoadMore).toHaveBeenCalledOnce()
    await expect(rowsOf(canvasElement)).toHaveLength(12)
    await userEvent.click(canvas.getByRole('button', { name: 'Carregar mais' }))
    await expect(rowsOf(canvasElement)).toHaveLength(14)
    await expect(
      canvas.queryByRole('button', { name: 'Carregar mais' }),
    ).toBeNull()
  },
}

export const LoadMoreErrorIsAnnounced: Story = {
  args: { loadMoreError: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('alert')).toHaveTextContent(
      'Não foi possível carregar a Inbox.',
    )
    await expect(
      canvas.getByRole('button', { name: 'Carregar mais' }),
    ).toBeEnabled()
  },
}

export const MarkErrorIsAnnounced: Story = {
  args: { markError: true },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('alert')).toHaveTextContent(
      'Não foi possível marcar a entrada. Tente de novo.',
    )
  },
}

export const LoadingMoreDisablesTheButton: Story = {
  render: (args) => (
    <Inbox1
      entries={readInbox(entries).items}
      hasMore
      loadingMore
      onLoadMore={args.onLoadMore}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: 'Carregar mais' }),
    ).toBeDisabled()
  },
}

export const WithoutAValueTheControlsStillAnswer: Story = {
  render: (args) => (
    <Inbox1
      entries={readInbox(entries).items}
      onCategoryChange={args.onCategoryChange}
      onSortChange={args.onSortChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    await chooseCategory(canvasElement, 'Todos', 'Tarefas')
    await expect(args.onCategoryChange).toHaveBeenCalledWith('tasks')
    await expect(
      within(toolbarOf(canvasElement)).getByRole('button', {
        name: 'Tarefas',
      }),
    ).toBeVisible()
  },
}

export const EmptyShowsTheInboxMessage: Story = {
  args: { empty: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Nenhuma entrada na sua Inbox.'),
    ).toBeVisible()
  },
}

export const EmptyWithACategoryShowsTheFilteredMessage: Story = {
  args: { category: 'tasks', empty: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Nenhuma entrada no filtro escolhido.'),
    ).toBeVisible()
  },
}

export const PendingShowsTheSkeleton: Story = {
  render: () => <Inbox1 entries={[]} pending />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando entradas')).toHaveAttribute(
      'aria-busy',
      'true',
    )
    await expect(canvas.getByRole('button', { name: 'Todos' })).toBeVisible()
    await expect(canvas.queryByRole('button', { name: 'Exibição' })).toBeNull()
  },
}

export const ErrorShowsRetry: Story = {
  render: (args) => <Inbox1 entries={[]} error onRetry={args.onRetry} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Não foi possível carregar a Inbox'),
    ).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Tentar novamente' }),
    )
    await expect(args.onRetry).toHaveBeenCalledOnce()
  },
}
