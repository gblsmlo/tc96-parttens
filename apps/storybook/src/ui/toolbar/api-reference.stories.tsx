import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarInput,
  ToolbarLink,
  ToolbarSeparator,
} from '@tc96/ui/toolbar'
import { Slot } from '../../test-utils/anatomy-slot'

const meta = {
  component: Toolbar,
  parameters: { layout: 'centered' },
  tags: ['!autodocs', '!dev'],
  title: 'UI/Toolbar/API Reference',
} satisfies Meta<typeof Toolbar>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  render: (args) => (
    <Toolbar aria-label="Anatomy" {...args}>
      <ToolbarLink href="#anatomy">
        <Slot name="ToolbarLink" />
      </ToolbarLink>
      <ToolbarSeparator />
      <ToolbarGroup aria-label="ToolbarGroup">
        <ToolbarButton>
          <Slot name="ToolbarButton" />
        </ToolbarButton>
        <ToolbarButton>
          <Slot name="ToolbarButton" />
        </ToolbarButton>
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarInput
        aria-label="ToolbarInput"
        className="h-6 w-28 rounded-sm border border-dashed px-2 text-xs"
        placeholder="ToolbarInput"
      />
    </Toolbar>
  ),
}
