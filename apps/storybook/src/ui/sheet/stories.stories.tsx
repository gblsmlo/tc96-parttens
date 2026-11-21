import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type SheetControls,
  sheetControlArgs,
  sheetControlArgTypes,
} from './sheet-controls.ts'
import { ComposedSheet } from './sheet-layouts.tsx'

const meta = {
  args: sheetControlArgs,
  argTypes: sheetControlArgTypes,
  parameters: {
    controls: { exclude: ['footerVariant', 'side', 'variant'] },
  },
  render: (args) => <ComposedSheet {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Sheet/Stories',
} satisfies Meta<SheetControls>

export default meta

type Story = StoryObj<SheetControls>

export const Default: Story = {}

export const SideLeft: Story = {
  args: { side: 'left' },
  name: 'Side left',
}

export const SideTop: Story = {
  args: { side: 'top' },
  name: 'Side top',
}

export const SideBottom: Story = {
  args: { side: 'bottom' },
  name: 'Side bottom',
}

export const Inset: Story = {
  args: { variant: 'inset' },
}

export const FooterBare: Story = {
  args: { footerVariant: 'bare' },
  name: 'Footer bare',
}
