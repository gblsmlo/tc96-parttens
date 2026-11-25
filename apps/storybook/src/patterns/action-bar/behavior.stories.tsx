import type { Meta, StoryObj } from '@storybook/react-vite'
import { ActionBar, type ActionBarContext } from '@tc96/ui/patterns'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { actionBarControlArgs } from './action-bar-controls.ts'
import {
  type ActionHandler,
  ComposedActionBar,
  type DraftRow,
} from './action-bar-layouts.tsx'

interface BehaviorArgs {
  onAction: ActionHandler
  onClearSelection: () => void
  onMore: (context: ActionBarContext<DraftRow>) => void
}

const meta = {
  args: { onAction: fn(), onClearSelection: fn(), onMore: fn() },
  argTypes: {
    onAction: { control: false },
    onClearSelection: { control: false },
    onMore: { control: false },
  },
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'Patterns/ActionBar/Behavior',
} satisfies Meta<BehaviorArgs>

export default meta

type Story = StoryObj<BehaviorArgs>

const toolbarName = 'Ações dos itens selecionados'

const twoRows = {
  selectedCount: 2,
  selectedRows: [{ id: 'draft-1' }, { id: 'draft-2' }],
}

const getToolbar = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole('toolbar', { name: toolbarName })

const openSubmenu = async (canvasElement: HTMLElement) => {
  await userEvent.click(
    within(canvasElement).getByRole('button', { name: 'Mais opções' }),
  )
  return screen.findByRole('menu')
}

const closeSubmenu = async () => {
  await userEvent.keyboard('{Escape}')
  await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
}

export const ToolbarRole: Story = {
  render: () => <ComposedActionBar {...actionBarControlArgs} />,
  play: async ({ canvasElement }) => {
    const toolbar = getToolbar(canvasElement)
    await expect(toolbar).toBeVisible()
    await expect(toolbar).toHaveAttribute('data-slot', 'action-bar')
  },
}

export const HiddenWithoutSelection: Story = {
  render: () => (
    <ComposedActionBar {...actionBarControlArgs} selectedCount={0} />
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole('toolbar')).toBeNull()
    await expect(
      canvasElement.querySelector('[data-slot="action-bar"]'),
    ).toBeNull()
  },
}

export const CountsTheSelection: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-4">
      <ComposedActionBar {...actionBarControlArgs} selectedCount={1} />
      <ComposedActionBar {...actionBarControlArgs} selectedCount={4} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [one, four] = within(canvasElement).getAllByRole('toolbar') as [
      HTMLElement,
      HTMLElement,
    ]
    await expect(within(one).getByText('1 selecionado')).toBeVisible()
    await expect(within(four).getByText('4 selecionados')).toBeVisible()
  },
}

export const DividerBetweenGroups: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-4">
      <ComposedActionBar {...actionBarControlArgs} />
      <ComposedActionBar {...actionBarControlArgs} submenu={false} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [twoGroups, oneGroup] = within(canvasElement).getAllByRole(
      'toolbar',
    ) as [HTMLElement, HTMLElement]
    const separators = within(twoGroups).getAllByRole('separator')
    await expect(separators).toHaveLength(1)
    const [separator] = separators as [HTMLElement]
    await expect(separator).toHaveAttribute('aria-orientation', 'vertical')
    const archive = within(twoGroups).getByRole('button', { name: 'Arquivar' })
    const more = within(twoGroups).getByRole('button', { name: 'Mais opções' })
    await expect(
      archive.compareDocumentPosition(separator) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
    await expect(
      separator.compareDocumentPosition(more) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
    await expect(within(oneGroup).queryByRole('separator')).toBeNull()
  },
}

export const SelectCallsOnSelect: Story = {
  render: ({ onAction }) => (
    <ComposedActionBar
      {...actionBarControlArgs}
      onAction={onAction}
      selectedCount={2}
    />
  ),
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Arquivar' }),
    )
    await expect(args.onAction).toHaveBeenCalledOnce()
    await expect(args.onAction).toHaveBeenLastCalledWith('archive', twoRows)
  },
}

export const SubmenuItemCallsOnSelect: Story = {
  render: ({ onAction, onMore }) => (
    <ComposedActionBar
      {...actionBarControlArgs}
      onAction={onAction}
      onMore={onMore}
      selectedCount={2}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const menu = await openSubmenu(canvasElement)
    await userEvent.click(
      within(menu).getByRole('menuitem', { name: 'Duplicar' }),
    )
    await expect(args.onAction).toHaveBeenCalledOnce()
    await expect(args.onAction).toHaveBeenLastCalledWith('duplicate', twoRows)
    await expect(args.onMore).not.toHaveBeenCalled()
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}

export const TriggerMarksOpenSubmenu: Story = {
  render: () => <ComposedActionBar {...actionBarControlArgs} />,
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'Mais opções',
    })
    await expect(trigger).toHaveAttribute('data-slot', 'menu-trigger')
    await expect(trigger).not.toHaveAttribute('data-popup-open')
    await openSubmenu(canvasElement)
    await expect(trigger).toHaveAttribute('data-popup-open')
    await expect(trigger).toHaveAttribute('data-pressed')
    await closeSubmenu()
    await expect(trigger).not.toHaveAttribute('data-popup-open')
    await expect(trigger).not.toHaveAttribute('data-pressed')
  },
}

export const SubmenuOpensAbove: Story = {
  render: () => (
    <div className="px-16 pt-80 pb-16">
      <ComposedActionBar {...actionBarControlArgs} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'Mais opções',
    })
    const menu = await openSubmenu(canvasElement)
    await expect(menu).toHaveAttribute('data-side', 'top')
    await waitFor(() =>
      expect(menu.getBoundingClientRect().bottom).toBeLessThanOrEqual(
        trigger.getBoundingClientRect().top,
      ),
    )
    await closeSubmenu()
  },
}

export const SubmenuIsNotModal: Story = {
  render: ({ onAction }) => (
    <ComposedActionBar {...actionBarControlArgs} onAction={onAction} />
  ),
  play: async ({ args, canvasElement }) => {
    await openSubmenu(canvasElement)
    const archive = within(canvasElement).getByRole('button', {
      name: 'Arquivar',
    })
    const box = archive.getBoundingClientRect()
    const hit = document.elementFromPoint(
      box.left + box.width / 2,
      box.top + box.height / 2,
    )
    await expect(archive.contains(hit)).toBe(true)
    await userEvent.click(archive)
    await expect(args.onAction).toHaveBeenCalledOnce()
    await expect(args.onAction).toHaveBeenLastCalledWith('archive', {
      selectedCount: 1,
      selectedRows: [{ id: 'draft-1' }],
    })
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}

export const GroupLabelsOnlyInSubmenu: Story = {
  render: () => <ComposedActionBar {...actionBarControlArgs} groupLabels />,
  play: async ({ canvasElement }) => {
    const toolbar = getToolbar(canvasElement)
    await expect(within(toolbar).queryByText('Principais')).toBeNull()
    await expect(within(toolbar).queryByText('Mais')).toBeNull()
    const menu = await openSubmenu(canvasElement)
    const organize = within(menu).getByRole('group', { name: 'Organizar' })
    await expect(
      within(organize).getByRole('menuitem', { name: 'Duplicar' }),
    ).toBeVisible()
    await expect(
      within(menu).getByRole('group', { name: 'Remover' }),
    ).toBeVisible()
    await closeSubmenu()
  },
}

export const SubmenuGroupsSeparated: Story = {
  render: () => <ComposedActionBar {...actionBarControlArgs} />,
  play: async ({ canvasElement }) => {
    const menu = await openSubmenu(canvasElement)
    const groups = within(menu).getAllByRole('group')
    await expect(groups).toHaveLength(2)
    const separators = within(menu).getAllByRole('separator')
    await expect(separators).toHaveLength(1)
    const [first, second] = groups as [HTMLElement, HTMLElement]
    const [separator] = separators as [HTMLElement]
    await expect(
      first.compareDocumentPosition(separator) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
    await expect(
      separator.compareDocumentPosition(second) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
    await closeSubmenu()
  },
}

export const ClearSelection: Story = {
  render: ({ onAction, onClearSelection }) => (
    <ComposedActionBar
      {...actionBarControlArgs}
      onAction={onAction}
      onClearSelection={onClearSelection}
    />
  ),
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Limpar seleção' }),
    )
    await expect(args.onClearSelection).toHaveBeenCalledOnce()
    await expect(args.onAction).not.toHaveBeenCalled()
  },
}

export const NoClearButtonWithoutHandler: Story = {
  render: () => (
    <ComposedActionBar {...actionBarControlArgs} clearButton={false} />
  ),
  play: async ({ canvasElement }) => {
    const toolbar = getToolbar(canvasElement)
    await expect(
      within(toolbar).queryByRole('button', { name: 'Limpar seleção' }),
    ).toBeNull()
    await expect(
      within(toolbar).getByRole('button', { name: 'Mais opções' }),
    ).toBeVisible()
  },
}

export const DisabledAction: Story = {
  render: () => <ComposedActionBar {...actionBarControlArgs} disabled />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('button', { name: 'Enviar' })).toBeDisabled()
    await expect(canvas.getByRole('button', { name: 'Arquivar' })).toBeEnabled()
  },
}

export const DisabledSubmenuTrigger: Story = {
  render: () => <ComposedActionBar {...actionBarControlArgs} disabledMore />,
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'Mais opções',
    })
    await expect(trigger).toBeDisabled()
    await expect(trigger).toHaveAttribute('data-disabled')
  },
}

export const DisabledSubmenuItem: Story = {
  render: ({ onAction }) => (
    <ComposedActionBar
      {...actionBarControlArgs}
      disabledMove
      onAction={onAction}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const menu = await openSubmenu(canvasElement)
    const move = within(menu).getByRole('menuitem', { name: 'Mover para…' })
    await expect(move).toHaveAttribute('data-disabled')
    await expect(move).toHaveAttribute('aria-disabled', 'true')
    move.click()
    await expect(args.onAction).not.toHaveBeenCalled()
    await expect(menu).toBeVisible()
    await expect(
      within(menu).getByRole('menuitem', { name: 'Duplicar' }),
    ).not.toHaveAttribute('data-disabled')
    await closeSubmenu()
  },
}

export const ContextWithoutRows: Story = {
  render: ({ onAction }) => (
    <ActionBar<DraftRow>
      actions={[
        {
          items: [
            {
              label: 'Arquivar',
              onSelect: (context) => onAction('archive', context),
            },
          ],
        },
      ]}
      selectedCount={3}
    />
  ),
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Arquivar' }),
    )
    await expect(args.onAction).toHaveBeenCalledOnce()
    await expect(args.onAction).toHaveBeenLastCalledWith('archive', {
      selectedCount: 3,
      selectedRows: [],
    })
  },
}

export const ShortcutKeepsTheName: Story = {
  render: () => <ComposedActionBar {...actionBarControlArgs} shortcuts />,
  play: async ({ canvasElement }) => {
    const archive = within(canvasElement).getByRole('button', {
      name: 'Arquivar',
    })
    const shortcut = within(archive).getByText('E')
    await expect(shortcut.tagName).toBe('KBD')
    await expect(shortcut).toBeVisible()
  },
}

export const KeyboardActivation: Story = {
  render: ({ onAction }) => (
    <ComposedActionBar {...actionBarControlArgs} onAction={onAction} />
  ),
  play: async ({ args, canvasElement }) => {
    const send = within(canvasElement).getByRole('button', { name: 'Enviar' })
    await userEvent.tab()
    await expect(send).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await expect(args.onAction).toHaveBeenCalledOnce()
    await expect(args.onAction).toHaveBeenLastCalledWith('send', {
      selectedCount: 1,
      selectedRows: [{ id: 'draft-1' }],
    })
  },
}

export const SubmenuByKeyboard: Story = {
  render: ({ onAction }) => (
    <ComposedActionBar {...actionBarControlArgs} onAction={onAction} />
  ),
  play: async ({ args, canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'Mais opções',
    })
    trigger.focus()
    await userEvent.keyboard('{Enter}')
    const menu = await screen.findByRole('menu')
    const duplicate = within(menu).getByRole('menuitem', { name: 'Duplicar' })
    await waitFor(() => expect(duplicate).toHaveFocus())
    await userEvent.keyboard('{Enter}')
    await expect(args.onAction).toHaveBeenCalledOnce()
    await expect(args.onAction).toHaveBeenLastCalledWith('duplicate', {
      selectedCount: 1,
      selectedRows: [{ id: 'draft-1' }],
    })
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
    await waitFor(() => expect(trigger).toHaveFocus())
  },
}

const mixedNotice =
  'Só publicações sem processo são vinculadas ou descartadas juntas.'

export const NoticeIsAPoliteStatusAboveTheBar: Story = {
  render: () => (
    <ComposedActionBar {...actionBarControlArgs} notice={mixedNotice} />
  ),
  play: async ({ canvasElement }) => {
    const toolbar = getToolbar(canvasElement)
    const notice = within(canvasElement).getByRole('status')
    await expect(notice).toHaveTextContent(mixedNotice)
    await expect(notice).toHaveAttribute('data-slot', 'action-bar-notice')
    await expect(toolbar.contains(notice)).toBe(false)
    await expect(notice.getBoundingClientRect().bottom).toBeLessThanOrEqual(
      toolbar.getBoundingClientRect().top,
    )
  },
}

export const NoNoticeLeavesNoStatus: Story = {
  render: () => (
    <div data-testid="parent">
      <ComposedActionBar {...actionBarControlArgs} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByRole('status')).toBeNull()
    await expect(
      canvasElement.querySelector('[data-slot="action-bar-notice"]'),
    ).toBeNull()
    await expect(getToolbar(canvasElement).parentElement).toBe(
      canvas.getByTestId('parent'),
    )
  },
}

export const NoticeHiddenWithoutSelection: Story = {
  render: () => (
    <ComposedActionBar
      {...actionBarControlArgs}
      notice={mixedNotice}
      selectedCount={0}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole('status')).toBeNull()
    await expect(within(canvasElement).queryByRole('toolbar')).toBeNull()
  },
}

export const NoticeWrapsWithoutWideningTheBar: Story = {
  render: () => (
    <div className="flex w-96 flex-col items-center gap-4">
      <ComposedActionBar
        {...actionBarControlArgs}
        notice={mixedNotice}
        submenu={false}
      />
      <ComposedActionBar {...actionBarControlArgs} submenu={false} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [withNotice, withoutNotice] = within(canvasElement).getAllByRole(
      'toolbar',
    ) as [HTMLElement, HTMLElement]
    const notice = within(canvasElement).getByRole('status')
    const lineHeight = Number.parseFloat(getComputedStyle(notice).lineHeight)
    await expect(withNotice.getBoundingClientRect().width).toBe(
      withoutNotice.getBoundingClientRect().width,
    )
    await expect(notice.getBoundingClientRect().width).toBeLessThanOrEqual(384)
    await expect(notice.clientHeight).toBeGreaterThan(lineHeight * 1.5)
  },
}

export const ClassNameMergesIntoRoot: Story = {
  render: () => (
    <ComposedActionBar {...actionBarControlArgs} className="w-96" />
  ),
  play: async ({ canvasElement }) => {
    const toolbar = getToolbar(canvasElement)
    await expect(toolbar.getBoundingClientRect().width).toBe(384)
    await expect(toolbar).not.toHaveClass('w-fit')
  },
}
