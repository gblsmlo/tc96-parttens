import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from '@tc96/ui/collapsible'
import { Slot } from '../../test-utils/anatomy-slot'
import { CollapsibleCanvas } from './collapsible-frame.tsx'

const meta = {
  component: Collapsible,
  decorators: [CollapsibleCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs', '!dev'],
  title: 'UI/Collapsible/API Reference',
} satisfies Meta<typeof Collapsible>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  args: { defaultOpen: true },
  render: (args) => (
    <Collapsible {...args}>
      <CollapsibleTrigger>
        <Slot name="CollapsibleTrigger" />
      </CollapsibleTrigger>
      <CollapsiblePanel>
        <div className="pt-2">
          <Slot name="CollapsiblePanel" />
        </div>
      </CollapsiblePanel>
    </Collapsible>
  ),
}
