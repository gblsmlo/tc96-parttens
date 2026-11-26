import { RecordDialog5 } from '@tc96/ui/blocks/application/record-dialog/record-dialog-5'
import { Button } from '@tc96/ui/button'
import { useState } from 'react'
import { recordDialog5People } from '../../fixtures/record-dialog-5.ts'
import type { RecordDialog5Controls } from './record-dialog-5-controls.ts'

interface ComposedRecordDialog5Props extends RecordDialog5Controls {
  onCreate?: () => void
  open?: boolean
}

export const ComposedRecordDialog5 = ({
  onCreate,
  open: openProp = true,
  recordName,
}: Readonly<ComposedRecordDialog5Props>) => {
  const [open, setOpen] = useState(openProp)

  return (
    <div className="flex min-h-80 items-center justify-center">
      <Button onClick={() => setOpen(true)} variant="outline">
        Nova nota
      </Button>
      <RecordDialog5
        recordName={recordName}
        people={recordDialog5People}
        note={null}
        onSave={onCreate ?? (() => undefined)}
        onOpenChange={setOpen}
        open={open}
      />
    </div>
  )
}
