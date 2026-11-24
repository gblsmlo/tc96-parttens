import type { Meta, StoryObj } from '@storybook/react-vite'
import { bulkImport1ControlArgs } from './bulk-import-1-controls.ts'
import { ComposedBulkImport1 } from './bulk-import-1-layouts.tsx'

const meta = {
  tags: ['!autodocs'],
  title: 'Blocks/Records/BulkImport1/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <ComposedBulkImport1 {...bulkImport1ControlArgs} />,
}
