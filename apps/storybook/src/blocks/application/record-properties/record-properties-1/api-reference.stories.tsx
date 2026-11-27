import type { Meta, StoryObj } from '@storybook/react-vite'
import { TaskProperties } from './record-properties-1-layouts.tsx'

const meta = {
  component: TaskProperties,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Record Properties/RecordProperties1/API Reference',
} satisfies Meta<typeof TaskProperties>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
