import { RecordDialog7 } from '@tc96/ui/blocks/application/record-dialog/record-dialog-7'
import { Button } from '@tc96/ui/button'
import { useState } from 'react'
import {
  recordDialog7People,
  recordDialog7Repos,
} from '../../fixtures/record-dialog-7.ts'
import type { RecordDialog7Controls } from './record-dialog-7-controls.ts'

interface ComposedRecordDialog7Props extends RecordDialog7Controls {
  onCreate?: () => void
  open?: boolean
}

export const ComposedRecordDialog7 = ({
  onCreate,
  open: openProp = true,
  titleAncestor,
}: Readonly<ComposedRecordDialog7Props>) => {
  const [open, setOpen] = useState(openProp)

  return (
    <div className="flex min-h-80 items-center justify-center">
      <Button onClick={() => setOpen(true)} variant="outline">
        Novo projeto
      </Button>
      <RecordDialog7
        labels={{ titleAncestor }}
        people={recordDialog7People}
        repos={recordDialog7Repos}
        onCreate={onCreate ?? (() => undefined)}
        onOpenChange={setOpen}
        open={open}
      />
    </div>
  )
}
