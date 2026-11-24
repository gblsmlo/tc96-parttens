import type { Meta, StoryObj } from '@storybook/react-vite'
import { Settings23 } from '@tc96/blocks/application/settings/settings-23'
import { fn } from 'storybook/test'
import {
  settings23Invoices,
  settings23Plan,
  settings23Usage,
} from '../fixtures/settings-23.ts'

const meta = {
  args: {
    invoices: settings23Invoices,
    onChangePlan: fn(),
    onDownload: fn(),
    plan: settings23Plan,
    usage: settings23Usage,
  },
  component: Settings23,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Settings/Settings23/API Reference',
} satisfies Meta<typeof Settings23>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
