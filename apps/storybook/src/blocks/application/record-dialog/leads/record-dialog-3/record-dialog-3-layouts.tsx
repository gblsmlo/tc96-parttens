import {
  RecordDialog3,
  type RecordDialog3Props,
} from '@tc96/ui/blocks/application/record-dialog/record-dialog-3'
import { Button } from '@tc96/ui/button'
import { useState } from 'react'
import { recordDialog3People } from '../../fixtures/record-dialog-3.ts'
import type { RecordDialog3Controls } from './record-dialog-3-controls.ts'

interface ComposedRecordDialog3Props extends RecordDialog3Controls {
  onCreate?: RecordDialog3Props['onCreate']
  open?: boolean
}

export const ComposedRecordDialog3 = ({
  onCreate,
  open: openProp = true,
  titleAncestor,
}: Readonly<ComposedRecordDialog3Props>) => {
  const [open, setOpen] = useState(openProp)

  return (
    <div className="flex min-h-80 items-center justify-center">
      <Button onClick={() => setOpen(true)} variant="outline">
        Novo lead
      </Button>
      <RecordDialog3
        labels={{ titleAncestor }}
        onCreate={onCreate ?? (() => undefined)}
        onOpenChange={setOpen}
        open={open}
        people={recordDialog3People}
      />
    </div>
  )
}
