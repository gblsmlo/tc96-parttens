import type { Meta, StoryObj } from '@storybook/react-vite'
import { Legal7 } from '@tc96/ui/blocks/data/legal/legal-7'
import { fn } from 'storybook/test'
import { pageSize, publications, tribunals } from '../fixtures/legal-7.ts'

const meta = {
  args: {
    onCreateDeadline: fn(),
    onCreateLawsuit: fn(),
    onCreateTask: fn(),
    onDiscard: fn(),
    onLinkDeadline: fn(),
    onLinkLawsuit: fn(),
    onNoDeadline: fn(),
    onOpen: fn(),
    onPageChange: fn(),
    page: 1,
    pageCount: Math.ceil(publications.length / pageSize),
    pageSize,
    publications: publications.slice(0, pageSize),
    total: publications.length,
    tribunals,
  },
  component: Legal7,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Data/Legal/Legal7/API Reference',
} satisfies Meta<typeof Legal7>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
