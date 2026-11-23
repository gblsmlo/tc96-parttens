'use client'

import { PlusIcon } from 'lucide-react'
import {
  type ReactElement,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { RecordGroup } from '../../records/group/composition/record-group/record-group'
import { RecordGroupAction } from '../../records/group/composition/record-group-action/record-group-action'
import { RecordGroupFilter } from '../../records/group/composition/record-group-filter/record-group-filter'
import type { RecordGroupFilterProps } from '../../records/group/core'
import { ChecklistBody, type ChecklistBodyProps } from './checklist-body'
import { ChecklistCount } from './checklist-count'

export function ChecklistGroup({
  actions,
  addLabel,
  autoFocusDraft = false,
  filter,
  title,
  ...body
}: Readonly<
  Omit<ChecklistBodyProps, 'draftInputRef' | 'frame'> & {
    actions?: ReactNode
    addLabel: string
    autoFocusDraft?: boolean
    filter?: RecordGroupFilterProps
    title: ReactNode
  }
>): ReactElement {
  const [open, setOpen] = useState(true)
  const [focusRequest, setFocusRequest] = useState(0)
  const pendingFocus = useRef(autoFocusDraft)
  const draftInput = useRef<HTMLInputElement | null>(null)
  const draftInputRef = useCallback((node: HTMLInputElement | null) => {
    draftInput.current = node
    if (node && pendingFocus.current) {
      pendingFocus.current = false
      node.focus()
    }
  }, [])
  const total = body.items.length
  const completed = body.items.filter((item) => item.completed).length

  useEffect(() => {
    if (focusRequest === 0 || !draftInput.current) return
    pendingFocus.current = false
    draftInput.current.focus()
  }, [focusRequest])

  return (
    <RecordGroup
      actions={
        <>
          {actions}
          {filter ? <RecordGroupFilter {...filter} /> : null}
          <RecordGroupAction
            disabled={body.readOnly}
            icon={PlusIcon}
            label={addLabel}
            onClick={() => {
              pendingFocus.current = true
              setOpen(true)
              setFocusRequest((current) => current + 1)
            }}
          />
        </>
      }
      onOpenChange={setOpen}
      open={open}
      title={
        <span className="inline-flex items-center gap-2">
          {title}
          {total > 0 ? (
            <ChecklistCount completed={completed} total={total} />
          ) : null}
        </span>
      }
      variant="plain"
    >
      <ChecklistBody {...body} draftInputRef={draftInputRef} frame="plain" />
    </RecordGroup>
  )
}
