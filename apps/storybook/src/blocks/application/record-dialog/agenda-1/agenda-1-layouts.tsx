import {
  Agenda1,
  type Agenda1Props,
} from '@tc96/ui/blocks/application/record-dialog/agenda-1'
import { Button } from '@tc96/ui/button'
import { useState } from 'react'
import { agenda1People } from '../fixtures/agenda-1.ts'
import type { Agenda1Controls } from './agenda-1-controls.ts'

interface ComposedAgenda1Props extends Agenda1Controls {
  onCreate?: Agenda1Props['onCreate']
  open?: boolean
}

export const ComposedAgenda1 = ({
  onCreate,
  open: openProp = true,
  slot,
  titleAncestor,
}: Readonly<ComposedAgenda1Props>) => {
  const [open, setOpen] = useState(openProp)

  return (
    <div className="flex min-h-80 items-center justify-center">
      <Button onClick={() => setOpen(true)} variant="outline">
        Nova atividade
      </Button>
      <Agenda1
        key={JSON.stringify(slot)}
        labels={{ titleAncestor }}
        onCreate={onCreate ?? (() => undefined)}
        onOpenChange={setOpen}
        open={open}
        people={agenda1People}
        slot={slot}
      />
    </div>
  )
}
