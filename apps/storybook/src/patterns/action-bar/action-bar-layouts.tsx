import {
  ArchiveIcon,
  PaperPlaneRightIcon,
  TrashIcon,
} from '@phosphor-icons/react'
import {
  ActionBar,
  type ActionBarContext,
  type ActionBarGroup,
} from '@tc96/ui/patterns'
import type { ActionBarControls } from './action-bar-controls.ts'

export interface DraftRow {
  id: string
}

export type ActionHandler = (
  action: string,
  context: ActionBarContext<DraftRow>,
) => void

export interface ComposedActionBarProps extends ActionBarControls {
  className?: string
  disabledMore?: boolean
  disabledMove?: boolean
  onAction?: ActionHandler
  onClearSelection?: () => void
  onMore?: (context: ActionBarContext<DraftRow>) => void
}

const clearNothing = () => {}

export const draftRows = (count: number): DraftRow[] =>
  Array.from({ length: Math.max(count, 0) }, (_, index) => ({
    id: `draft-${index + 1}`,
  }))

export const ComposedActionBar = ({
  className,
  clearButton,
  disabled,
  disabledMore,
  disabledMove,
  groupLabels,
  icons,
  label,
  onAction,
  onClearSelection,
  onMore,
  selectedCount,
  shortcuts,
  submenu,
  variant,
}: Readonly<ComposedActionBarProps>) => {
  const select = (action: string) => (context: ActionBarContext<DraftRow>) =>
    onAction?.(action, context)

  const actions: ActionBarGroup<DraftRow>[] = [
    {
      id: 'main',
      items: [
        ...(label
          ? [
              {
                disabled: disabled || undefined,
                icon: icons ? (
                  <PaperPlaneRightIcon aria-hidden="true" />
                ) : undefined,
                id: 'send',
                label,
                onSelect: select('send'),
                shortcut: shortcuts ? 'S' : undefined,
                variant,
              },
            ]
          : []),
        {
          icon: icons ? <ArchiveIcon aria-hidden="true" /> : undefined,
          id: 'archive',
          label: 'Arquivar',
          onSelect: select('archive'),
          shortcut: shortcuts ? 'E' : undefined,
        },
      ],
      label: groupLabels ? 'Principais' : undefined,
    },
  ]

  if (submenu) {
    actions.push({
      id: 'more',
      items: [
        {
          disabled: disabledMore || undefined,
          id: 'more',
          label: 'Mais opções',
          onSelect: onMore,
          submenu: [
            {
              id: 'organize',
              items: [
                {
                  id: 'duplicate',
                  label: 'Duplicar',
                  onSelect: select('duplicate'),
                  shortcut: shortcuts ? 'D' : undefined,
                },
                {
                  disabled: disabledMove || undefined,
                  id: 'move',
                  label: 'Mover para…',
                  onSelect: select('move'),
                  shortcut: shortcuts ? 'V' : undefined,
                },
              ],
              label: groupLabels ? 'Organizar' : undefined,
            },
            {
              id: 'danger',
              items: [
                {
                  icon: icons ? <TrashIcon aria-hidden="true" /> : undefined,
                  id: 'delete',
                  label: 'Excluir',
                  onSelect: select('delete'),
                  shortcut: shortcuts ? '#' : undefined,
                  variant: 'destructive',
                },
              ],
              label: groupLabels ? 'Remover' : undefined,
            },
          ],
        },
      ],
      label: groupLabels ? 'Mais' : undefined,
    })
  }

  return (
    <ActionBar
      actions={actions}
      className={className}
      onClearSelection={
        clearButton ? (onClearSelection ?? clearNothing) : undefined
      }
      selectedCount={selectedCount}
      selectedRows={draftRows(selectedCount)}
    />
  )
}
