import {
  CalendarDotsIcon,
  HashIcon,
  PlusIcon,
  ShapesIcon,
  UserIcon,
} from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import {
  DateProperty,
  RecordGroup,
  RecordGroupAction,
  RecordGroupRow,
  TextProperty,
} from '@tc96/ui/patterns'
import { ptBRPropertyLabels } from '../../properties/properties-labels.ts'
import type { RecordGroupControls } from './record-group-controls.ts'

interface ComposedRecordGroupProps extends RecordGroupControls {
  onAction?: () => void
}

export function ComposedRecordGroup({
  actions,
  actionsAlign,
  chevron,
  collapsible,
  defaultOpen,
  empty,
  footer,
  leading,
  onAction,
  title,
  variant,
}: Readonly<ComposedRecordGroupProps>) {
  const icon = (Icon: typeof UserIcon) =>
    leading ? <Icon aria-hidden /> : undefined

  return (
    <RecordGroup
      actions={
        actions ? (
          <RecordGroupAction
            icon={PlusIcon}
            label="Add property"
            onClick={onAction}
          />
        ) : undefined
      }
      actionsAlign={actionsAlign}
      chevron={chevron}
      collapsible={collapsible}
      defaultOpen={defaultOpen}
      empty={empty}
      footer={
        footer ? <Button variant="ghost">View history</Button> : undefined
      }
      key={`${defaultOpen}-${empty}`}
      title={title}
      variant={variant}
    >
      {empty ? (
        <p className="text-muted-foreground text-sm">No properties yet</p>
      ) : (
        <>
          <RecordGroupRow label="Type" leading={icon(ShapesIcon)}>
            <TextProperty
              value="Document request"
              variant="plain"
              labels={ptBRPropertyLabels.text}
            />
          </RecordGroupRow>
          <RecordGroupRow label="Owner" leading={icon(UserIcon)}>
            <TextProperty
              value="Mariana Souza"
              variant="plain"
              labels={ptBRPropertyLabels.text}
            />
          </RecordGroupRow>
          <RecordGroupRow label="Reference" leading={icon(HashIcon)}>
            <TextProperty
              value="REQ-1042"
              variant="plain"
              labels={ptBRPropertyLabels.text}
            />
          </RecordGroupRow>
          <RecordGroupRow label="Due" leading={icon(CalendarDotsIcon)}>
            <DateProperty
              readOnly
              value="2026-10-21"
              variant="plain"
              labels={ptBRPropertyLabels.date}
            />
          </RecordGroupRow>
        </>
      )}
    </RecordGroup>
  )
}
