import {
  Agenda2,
  type Agenda2Props,
} from '@tc96/ui/blocks/application/record-dialog/agenda-2'
import { Button } from '@tc96/ui/button'
import { useState } from 'react'
import { agenda2People } from '../fixtures/agenda-2.ts'
import type { Agenda2Controls } from './agenda-2-controls.ts'

interface ComposedAgenda2Props extends Agenda2Controls {
  onCreate?: Agenda2Props['onCreate']
  open?: boolean
}

export const ComposedAgenda2 = ({
  onCreate,
  open: openProp = true,
  slot,
  titleAncestor,
}: Readonly<ComposedAgenda2Props>) => {
  const [open, setOpen] = useState(openProp)

  return (
    <div className="flex min-h-80 items-center justify-center">
      <Button onClick={() => setOpen(true)} variant="outline">
        Nova atividade
      </Button>
      <Agenda2
        key={JSON.stringify(slot)}
        labels={{ titleAncestor }}
        onCreate={onCreate ?? (() => undefined)}
        onOpenChange={setOpen}
        open={open}
        people={agenda2People}
        slot={slot}
      />
    </div>
  )
}
