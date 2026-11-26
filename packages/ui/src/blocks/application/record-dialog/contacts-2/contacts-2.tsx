import { ContactDialog } from '../shared/contact-dialog'
import type { ContactDialogProps } from '../shared/contact-types'

export type Contacts2Props = Omit<ContactDialogProps, 'layout'>

export function Contacts2(props: Readonly<Contacts2Props>) {
  return <ContactDialog layout="inline" {...props} />
}
