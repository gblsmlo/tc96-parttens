import type { Meta, StoryObj } from '@storybook/react-vite'
import { RecordStatusItem, RecordStatusList } from '@tc96/ui/patterns'
import { expect } from 'storybook/test'
import { Slot } from '../../test-utils/anatomy-slot'
import { RecordStatusListCanvas } from './status-list-canvas.tsx'

const meta = {
  decorators: [RecordStatusListCanvas],
  tags: ['!autodocs', '!dev'],
  title: 'Patterns/StatusList/API Reference',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      [...canvasElement.querySelectorAll('[data-slot^="record-status-"]')].map(
        (node) => node.getAttribute('data-slot'),
      ),
    ).toEqual([
      'record-status-list',
      'record-status-item',
      'record-status-item-icon',
      'record-status-item-title',
      'record-status-item-detail',
      'record-status-item-action',
      'record-status-list-announcer',
    ])
  },
  render: () => (
    <RecordStatusList label="Anatomy">
      <RecordStatusItem
        action={<Slot name="action" />}
        detail={<Slot name="detail" />}
        status="running"
        title={<Slot name="title" />}
      />
    </RecordStatusList>
  ),
}
