import {
  Contacts2,
  type Contacts2Props,
} from '@tc96/ui/blocks/application/record-dialog/contacts-2'
import { Button } from '@tc96/ui/button'
import { useState } from 'react'
import { contactCompanies, contactRoles } from '../fixtures/contacts.ts'

interface ComposedContacts2Props {
  documents?: readonly string[]
  onCreate?: Contacts2Props['onCreate']
  open?: boolean
}

export const ComposedContacts2 = ({
  documents = [],
  onCreate,
  open: openProp = true,
}: Readonly<ComposedContacts2Props>) => {
  const [open, setOpen] = useState(openProp)

  return (
    <div className="flex min-h-80 items-center justify-center">
      <Button onClick={() => setOpen(true)} variant="outline">
        Novo contato
      </Button>
      <Contacts2
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
