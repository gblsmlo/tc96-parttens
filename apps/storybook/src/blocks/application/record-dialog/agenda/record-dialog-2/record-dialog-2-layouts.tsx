import {
  RecordDialog2,
  type RecordDialog2Props,
} from '@tc96/ui/blocks/application/record-dialog/record-dialog-2'
import { Button } from '@tc96/ui/button'
import { useState } from 'react'
import { recordDialog2People } from '../../fixtures/record-dialog-2.ts'
import type { RecordDialog2Controls } from './record-dialog-2-controls.ts'

interface ComposedRecordDialog2Props extends RecordDialog2Controls {
  onCreate?: RecordDialog2Props['onCreate']
  open?: boolean
}

export const ComposedRecordDialog2 = ({
  onCreate,
  open: openProp = true,
  slot,
  titleAncestor,
}: Readonly<ComposedRecordDialog2Props>) => {
  const [open, setOpen] = useState(openProp)

  return (
    <div className="flex min-h-80 items-center justify-center">
      <Button onClick={() => setOpen(true)} variant="outline">
        Nova atividade
      </Button>
      <RecordDialog2
        key={JSON.stringify(slot)}
        labels={{ titleAncestor }}
        onCreate={onCreate ?? (() => undefined)}
        onOpenChange={setOpen}
        open={open}
        people={recordDialog2People}
        slot={slot}
      />
    </div>
  )
}
