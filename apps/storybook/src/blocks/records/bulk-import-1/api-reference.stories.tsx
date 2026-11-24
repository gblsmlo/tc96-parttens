import type { Meta, StoryObj } from '@storybook/react-vite'
import { BulkImport1 } from '@tc96/blocks/records/bulk-import-1'
import { Slot } from '../../../test-utils/anatomy-slot'

const meta = {
  parameters: { docs: { story: { iframeHeight: '520px', inline: false } } },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Records/BulkImport1/API Reference',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const ignore = () => undefined

export const Anatomy: Story = {
  render: () => (
    <BulkImport1
      columns={['Coluna']}
      onImport={() => true}
      onOpenChange={ignore}
      onSelectedChange={ignore}
      onStepChange={ignore}
      open
      query={<Slot name="query" />}
      rows={[
        { cells: [<Slot key="cell" name="cell" />], id: 'row', label: 'Linha' },
      ]}
      searchedAt={<Slot name="searchedAt" />}
      selected={['row']}
      step="select"
    />
  ),
}
