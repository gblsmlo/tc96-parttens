import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import {
  contactCnpjDocument,
  contactCpfDocument,
} from '../fixtures/contacts.ts'
import { ComposedContacts2 } from './contacts-2-layouts.tsx'

const meta = {
  args: {
    documents: [] as readonly string[],
    onCreate: fn(),
  },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedContacts2 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Record Dialog/Contacts/Contacts2/States',
} satisfies Meta<typeof ComposedContacts2>

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
