import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type BulkImport1Controls,
  bulkImport1ControlArgs,
  bulkImport1ControlArgTypes,
} from './bulk-import-1-controls.ts'
import { ComposedBulkImport1 } from './bulk-import-1-layouts.tsx'

const meta = {
  args: bulkImport1ControlArgs,
  argTypes: bulkImport1ControlArgTypes,
  render: (args) => <ComposedBulkImport1 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Records/BulkImport1/Playground',
} satisfies Meta<BulkImport1Controls>

export default meta

type Story = StoryObj<BulkImport1Controls>

export const Playground: Story = {}
