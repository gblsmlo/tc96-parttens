import {
  CalendarCheckIcon,
  CalendarPlusIcon,
  CalendarXIcon,
  FilePlusIcon,
  LinkIcon,
  ListChecksIcon,
  TrashIcon,
} from '@phosphor-icons/react'
import type {
  ActionBarGroup,
  ActionBarItem,
} from '@tc96/ui/patterns/action-bar/components/action-bar'
import type { ReactNode } from 'react'
import type {
  Legal7ActionId,
  Legal7Labels,
  Legal7Props,
  Legal7Publication,
} from './types'

type Item = ActionBarItem<Legal7Publication>

export type Legal7SelectionHandlers = Pick<
  Legal7Props,
  | 'onCreateDeadline'
  | 'onCreateLawsuit'
  | 'onCreateTask'
  | 'onDiscard'
  | 'onLinkDeadline'
  | 'onLinkLawsuit'
  | 'onNoDeadline'
>

export interface Legal7SelectionActionsOptions extends Legal7SelectionHandlers {
  labels: Legal7Labels
  selectedRows: readonly Legal7Publication[]
}

const icons = {
  createDeadline: <CalendarPlusIcon aria-hidden="true" />,
  createLawsuit: <FilePlusIcon aria-hidden="true" />,
  createTask: <ListChecksIcon aria-hidden="true" />,
  discard: <TrashIcon aria-hidden="true" />,
  linkDeadline: <CalendarCheckIcon aria-hidden="true" />,
  linkLawsuit: <LinkIcon aria-hidden="true" />,
  noDeadline: <CalendarXIcon aria-hidden="true" />,
} as const satisfies Record<Legal7ActionId, ReactNode>

export function isLegal7MixedSelection(
  selectedRows: readonly Legal7Publication[],
) {
  return (
    selectedRows.length > 1 &&
    selectedRows.some((item) => item.lawsuitTitle !== null)
  )
}

export function createLegal7SelectionActions({
  labels,
  onCreateDeadline,
  onCreateLawsuit,
  onCreateTask,
  onDiscard,
  onLinkDeadline,
  onLinkLawsuit,
  onNoDeadline,
  selectedRows,
}: Legal7SelectionActionsOptions): ActionBarGroup<Legal7Publication>[] {
  const ids = selectedRows.map((item) => item.id)
  const [only] = selectedRows.length === 1 ? selectedRows : []
  const disabled = isLegal7MixedSelection(selectedRows)

  const item = (
    id: Legal7ActionId,
    onSelect: (() => void) | undefined,
    extra?: Partial<Item>,
  ): Item[] =>
    onSelect
      ? [{ icon: icons[id], id, label: labels.actions[id], onSelect, ...extra }]
      : []

  const one = (handler: ((publicationId: string) => void) | undefined) =>
    handler && only ? () => handler(only.id) : undefined
  const many = (handler: ((publicationIds: string[]) => void) | undefined) =>
    handler ? () => handler(ids) : undefined

  const groups: ActionBarGroup<Legal7Publication>[] = only
    ? [
        {
          id: 'decide',
          items:
            only.lawsuitTitle === null
              ? [
                  ...item('createLawsuit', one(onCreateLawsuit)),
                  ...item('linkLawsuit', many(onLinkLawsuit)),
                ]
              : [
                  ...item('createDeadline', one(onCreateDeadline)),
                  ...item('linkDeadline', one(onLinkDeadline)),
                  ...item('noDeadline', one(onNoDeadline)),
                ],
        },
        {
          id: 'more',
          items: [
            ...item('createTask', one(onCreateTask)),
            ...item('discard', many(onDiscard), { variant: 'destructive' }),
          ],
        },
      ]
    : [
        {
          id: 'bulk',
          items: [
            ...item('linkLawsuit', many(onLinkLawsuit), { disabled }),
            ...item('discard', many(onDiscard), {
              disabled,
              variant: 'destructive',
            }),
          ],
        },
      ]

  return groups.filter((group) => group.items.length > 0)
}
