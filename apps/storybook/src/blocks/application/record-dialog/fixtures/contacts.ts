import { initialContacts } from '../../../../patterns/collection/fixtures/contacts'

export const contactCompanies = [
  ...new Set(initialContacts.map((contact) => contact.company)),
]

export const contactRoles = [
  ...new Set(initialContacts.map((contact) => contact.role)),
]

export const contactCpfDocument = '390.533.447-05'

export const contactCnpjDocument = '04.252.011/0001-10'
