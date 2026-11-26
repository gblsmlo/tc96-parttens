import { ContactDialog } from '../shared/contact-dialog'
import type { ContactDialogProps } from '../shared/contact-types'

export type Contacts1Props = Omit<ContactDialogProps, 'layout'>

export function Contacts1(props: Readonly<Contacts1Props>) {
  return <ContactDialog layout="rows" {...props} />
}
