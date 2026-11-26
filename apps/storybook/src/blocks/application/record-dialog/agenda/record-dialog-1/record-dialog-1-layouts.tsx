import {
  RecordDialog1,
  type RecordDialog1Props,
} from '@tc96/ui/blocks/application/record-dialog/record-dialog-1'
import { Button } from '@tc96/ui/button'
import { useState } from 'react'
import { recordDialog1People } from '../../fixtures/record-dialog-1.ts'
import type { RecordDialog1Controls } from './record-dialog-1-controls.ts'

interface ComposedRecordDialog1Props extends RecordDialog1Controls {
  onCreate?: RecordDialog1Props['onCreate']
  open?: boolean
}

export const ComposedRecordDialog1 = ({
  onCreate,
  open: openProp = true,
  slot,
  titleAncestor,
}: Readonly<ComposedRecordDialog1Props>) => {
  const [open, setOpen] = useState(openProp)

  return (
    <div className="flex min-h-80 items-center justify-center">
      <Button onClick={() => setOpen(true)} variant="outline">
        Nova atividade
      </Button>
      <RecordDialog1
        key={JSON.stringify(slot)}
        labels={{ titleAncestor }}
        onCreate={onCreate ?? (() => undefined)}
        onOpenChange={setOpen}
        open={open}
        people={recordDialog1People}
        slot={slot}
      />
    </div>
  )
}
