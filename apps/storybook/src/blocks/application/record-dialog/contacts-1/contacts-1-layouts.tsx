import {
  Contacts1,
  type Contacts1Props,
} from '@tc96/ui/blocks/application/record-dialog/contacts-1'
import { Button } from '@tc96/ui/button'
import { useState } from 'react'
import { contactCompanies, contactRoles } from '../fixtures/contacts.ts'

interface ComposedContacts1Props {
  documents?: readonly string[]
  onCreate?: Contacts1Props['onCreate']
  open?: boolean
}

export const ComposedContacts1 = ({
  documents = [],
  onCreate,
  open: openProp = true,
}: Readonly<ComposedContacts1Props>) => {
  const [open, setOpen] = useState(openProp)

  return (
    <div className="flex min-h-80 items-center justify-center">
      <Button onClick={() => setOpen(true)} variant="outline">
        Novo contato
      </Button>
      <Contacts1
        companies={contactCompanies}
        documents={documents}
        key={documents.join('|')}
        onCreate={onCreate ?? (() => undefined)}
        onOpenChange={setOpen}
        open={open}
        roles={contactRoles}
      />
    </div>
  )
}
