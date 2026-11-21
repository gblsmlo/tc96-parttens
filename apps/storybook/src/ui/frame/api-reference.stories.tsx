import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Frame,
  FrameDescription,
  FrameFooter,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from '@tc96/ui/frame'
import { Slot } from '../../test-utils/anatomy-slot'
import { FrameCanvas } from './frame-frame.tsx'

const meta = {
  component: Frame,
  decorators: [FrameCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs', '!dev'],
  title: 'UI/Frame/API Reference',
} satisfies Meta<typeof Frame>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  render: (args) => (
    <Frame {...args}>
      <FrameHeader>
        <FrameTitle>
          <Slot name="FrameTitle" />
        </FrameTitle>
        <FrameDescription>
          <Slot name="FrameDescription" />
        </FrameDescription>
      </FrameHeader>
      <FramePanel>
        <Slot name="FramePanel" />
      </FramePanel>
      <FrameFooter>
        <Slot name="FrameFooter" />
      </FrameFooter>
    </Frame>
  ),
}
