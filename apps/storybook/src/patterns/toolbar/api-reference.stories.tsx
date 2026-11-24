import type { Meta, StoryObj } from '@storybook/react-vite'
import { CollectionToolbar, ViewSwitcherMenu } from '@tc96/ui/patterns'
import { IconSlot, Slot } from '../../test-utils/anatomy-slot'
import { ToolbarCanvas } from './toolbar-canvas.tsx'

const meta = {
  component: CollectionToolbar,
  decorators: [ToolbarCanvas],
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs', '!dev'],
  title: 'Patterns/Toolbar/API Reference',
} satisfies Meta<typeof CollectionToolbar>

export default meta

type Story = StoryObj<typeof CollectionToolbar>

export const Anatomy: Story = {
  render: () => (
    <CollectionToolbar
      centerSlot={<Slot name="centerSlot" />}
      description="description"
      endSlot={<Slot name="endSlot" />}
      startSlot={<Slot name="startSlot" />}
      title="title"
      variant="text"
    >
      <Slot name="children" />
    </CollectionToolbar>
  ),
}

export const ViewSwitcherAnatomy: Story = {
  render: () => (
    <CollectionToolbar
      startSlot={
        <ViewSwitcherMenu icon={<IconSlot />} label="ViewSwitcherMenu">
          <Slot name="children" />
        </ViewSwitcherMenu>
      }
    />
  ),
}
