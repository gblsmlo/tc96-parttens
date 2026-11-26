import type { Meta, StoryObj } from '@storybook/react-vite'
import { documents2ControlArgs } from './documents-2-controls.ts'
import { ComposedDocuments2 } from './documents-2-layouts.tsx'

const meta = {
  args: documents2ControlArgs,
  component: ComposedDocuments2,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Data/Documents/Documents2/Usages',
} satisfies Meta<typeof ComposedDocuments2>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {}

export const Table: Story = {
  args: { groupBy: 'type', mode: 'table' },
}

export const Gallery: Story = {
  args: { mode: 'gallery' },
}

export const WithoutPinned: Story = {
  args: { pinned: false },
}

export const Empty: Story = {
  args: { empty: true },
}

export const Pending: Story = {
  args: { pending: true },
}

export const Failed: Story = {
  args: { error: true },
}
