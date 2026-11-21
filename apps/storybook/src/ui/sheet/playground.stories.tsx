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
  render: (args) => <ComposedSheet {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Sheet/Playground',
} satisfies Meta<SheetControls>

export default meta

type Story = StoryObj<SheetControls>

export const Playground: Story = {}
