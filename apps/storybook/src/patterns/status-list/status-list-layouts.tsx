import { Button } from '@tc96/ui/button'
import { RecordStatusItem, RecordStatusList } from '@tc96/ui/patterns'
import type { RecordStatusListControls } from './status-list-controls.ts'

interface ComposedRecordStatusListProps extends RecordStatusListControls {
  onAction?: () => void
}

export function ComposedRecordStatusList({
  action,
  announcement,
  detail,
  label,
  onAction,
  status,
  title,
}: Readonly<ComposedRecordStatusListProps>) {
  return (
    <RecordStatusList label={label}>
      <RecordStatusItem
        detail="3 publicações, 2 partes, tribunal e vara"
        status="done"
        title="DJEN"
      />
      <RecordStatusItem
        action={
          action ? (
            <Button onClick={onAction} size="sm" variant="outline">
              Tentar de novo
            </Button>
          ) : undefined
        }
        announcement={announcement}
        detail={detail}
        status={status}
        title={title}
      />
      <RecordStatusItem
        detail="sem consulta direta para o TJSP"
        status="skipped"
        title="Tribunal"
      />
    </RecordStatusList>
  )
}
