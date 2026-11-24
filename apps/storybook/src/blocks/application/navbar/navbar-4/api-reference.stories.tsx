import type { Meta, StoryObj } from '@storybook/react-vite'
import { Navbar4 } from '@tc96/ui/blocks/application/navbar/navbar-4'
import { fn } from 'storybook/test'
import { documentTitle, savedText } from '../fixtures/navbar-4.ts'

const meta = {
  args: {
    active: true,
    onActiveChange: fn(),
    onClose: fn(),
    onHistory: fn(),
    onSubmit: fn(),
    onTest: fn(),
    savedText,
    title: documentTitle,
  },
  component: Navbar4,
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Navbar/Navbar4/API Reference',
} satisfies Meta<typeof Navbar4>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
