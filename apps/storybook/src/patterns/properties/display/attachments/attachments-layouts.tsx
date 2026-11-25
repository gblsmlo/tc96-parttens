import { PaperclipIcon } from '@phosphor-icons/react'
import {
  AttachmentProperty,
  AttachmentsProperty,
  type AttachmentsPropertyAction,
} from '@tc96/ui/patterns'
import { useState } from 'react'
import { ptBRPropertyLabels } from '../../properties-labels.ts'
import type { AttachmentsControls } from './attachments-controls.ts'
import {
  type AttachmentItem,
  sampleAttachments,
  sampleNewAttachment,
} from './attachments-data.ts'

export interface StatefulAttachmentsProps {
  ariaLabel: string
  initialItems: readonly AttachmentItem[]
  action?: Omit<AttachmentsPropertyAction, 'onSelect'>
  newItem?: AttachmentItem
  removable?: boolean
}

export function StatefulAttachments({
  action,
  ariaLabel,
  initialItems,
  newItem,
  removable = true,
}: Readonly<StatefulAttachmentsProps>) {
  const [items, setItems] = useState(initialItems)
  const add = () => {
    if (!newItem) return
    setItems((current) =>
      current.some((item) => item.id === newItem.id)
        ? current
        : [...current, newItem],
    )
  }

  return (
    <AttachmentsProperty
      action={action ? { ...action, onSelect: add } : undefined}
      ariaLabel={ariaLabel}
    >
      {items.map((item) => (
        <AttachmentProperty
          action={item.action}
          href={item.href}
          key={item.id}
          label={item.label}
          onRemove={
            removable
              ? () =>
                  setItems((current) =>
                    current.filter((candidate) => candidate.id !== item.id),
                  )
              : undefined
          }
          type={item.type}
          labels={{
            ...ptBRPropertyLabels.attachment,
            remove: `Remover ${item.label}`,
          }}
        />
      ))}
    </AttachmentsProperty>
  )
}

export const ComposedAttachments = ({
  action,
  actionDisabled,
  actionIcon,
  actionLabel,
  ariaLabel,
  empty,
  readOnly,
  remove,
  type,
  typeIcon,
}: Readonly<AttachmentsControls>) => (
  <StatefulAttachments
    action={
      action && !readOnly
        ? {
            disabled: actionDisabled,
            icon: actionIcon ? PaperclipIcon : undefined,
            label: actionLabel,
          }
        : undefined
    }
    ariaLabel={ariaLabel}
    initialItems={
      empty
        ? []
        : sampleAttachments.map((item) => ({
            ...item,
            type: typeIcon ? type : undefined,
          }))
    }
    key={[empty, type, typeIcon].join()}
    newItem={{ ...sampleNewAttachment, type: typeIcon ? type : undefined }}
    removable={remove && !readOnly}
  />
)
