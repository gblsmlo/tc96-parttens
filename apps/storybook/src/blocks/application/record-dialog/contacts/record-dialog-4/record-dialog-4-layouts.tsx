import {
  RecordDialog4,
  type RecordDialog4Props,
} from '@tc96/ui/blocks/application/record-dialog/record-dialog-4'
import { Button } from '@tc96/ui/button'
import { useState } from 'react'
import {
  recordDialog4Companies,
  recordDialog4Roles,
} from '../../fixtures/record-dialog-4.ts'
import type { RecordDialog4Controls } from './record-dialog-4-controls.ts'

interface ComposedRecordDialog4Props extends RecordDialog4Controls {
  onCreate?: RecordDialog4Props['onCreate']
  open?: boolean
}

export const ComposedRecordDialog4 = ({
  onCreate,
  open: openProp = true,
  titleAncestor,
}: Readonly<ComposedRecordDialog4Props>) => {
  const [open, setOpen] = useState(openProp)

  return (
    <div className="flex min-h-80 items-center justify-center">
      <Button onClick={() => setOpen(true)} variant="outline">
        Novo contato
      </Button>
      <RecordDialog4
        labels={{ titleAncestor }}
        onCreate={onCreate ?? (() => undefined)}
        onOpenChange={setOpen}
        open={open}
        companies={recordDialog4Companies}
        roles={recordDialog4Roles}
      />
    </div>
  )
}
