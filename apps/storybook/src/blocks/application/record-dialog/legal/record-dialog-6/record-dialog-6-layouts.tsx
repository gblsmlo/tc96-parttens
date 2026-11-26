import { RecordDialog6 } from '@tc96/ui/blocks/application/record-dialog/record-dialog-6'
import { Button } from '@tc96/ui/button'
import { useState } from 'react'
import {
  recordDialog6Clients,
  recordDialog6ContractOptions,
  recordDialog6InitialValues,
  recordDialog6InstanceOptions,
  recordDialog6Owners,
  recordDialog6PartyRoleOptions,
  recordDialog6PhaseOptions,
} from '../../fixtures/record-dialog-6.ts'
import type { RecordDialog6Controls } from './record-dialog-6-controls.ts'

interface ComposedRecordDialog6Props extends RecordDialog6Controls {
  onCreate?: () => void
  open?: boolean
}

export const ComposedRecordDialog6 = ({
  onCreate,
  open: openProp = true,
  titleAncestor,
}: Readonly<ComposedRecordDialog6Props>) => {
  const [open, setOpen] = useState(openProp)

  return (
    <div className="flex min-h-80 items-center justify-center">
      <Button onClick={() => setOpen(true)} variant="outline">
        Novo processo
      </Button>
      <RecordDialog6
        labels={{ titleAncestor }}
        clients={recordDialog6Clients}
        contractOptions={recordDialog6ContractOptions}
        initialValues={recordDialog6InitialValues}
        instanceOptions={recordDialog6InstanceOptions}
        owners={recordDialog6Owners}
        partyRoleOptions={recordDialog6PartyRoleOptions}
        phaseOptions={recordDialog6PhaseOptions}
        onCreate={onCreate ?? (() => undefined)}
        onOpenChange={setOpen}
        open={open}
      />
    </div>
  )
}
