import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { ComposedContacts1 } from './contacts-1-layouts.tsx'

const meta = {
  args: {
    documents: [] as readonly string[],
    onCreate: fn(),
  },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedContacts1 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Record Dialog/Contacts/Contacts1/Playground',
} satisfies Meta<typeof ComposedContacts1>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}
