import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import {
  contactCnpjDocument,
  contactCpfDocument,
} from '../fixtures/contacts.ts'
import { ComposedContacts1 } from './contacts-1-layouts.tsx'

const meta = {
  args: {
    documents: [] as readonly string[],
    onCreate: fn(),
  },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedContacts1 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Record Dialog/Contacts/Contacts1/States',
} satisfies Meta<typeof ComposedContacts1>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Closed: Story = {
  args: { open: false },
}

export const Multiple: Story = {
  args: { documents: [contactCpfDocument, contactCnpjDocument] },
}

export const Cpf: Story = {
  args: { documents: [contactCpfDocument] },
}

export const Cnpj: Story = {
  args: { documents: [contactCnpjDocument] },
}
