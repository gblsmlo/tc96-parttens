import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { ComposedContacts2 } from './contacts-2-layouts.tsx'

const meta = {
  args: {
    documents: [] as readonly string[],
    onCreate: fn(),
  },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedContacts2 {...args} />,
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Record Dialog/Contacts/Contacts2/API Reference',
} satisfies Meta<typeof ComposedContacts2>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
