import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardFrame,
  CardFrameAction,
  CardFrameDescription,
  CardFrameFooter,
  CardFrameHeader,
  CardFrameTitle,
  CardHeader,
  CardPanel,
  CardTitle,
} from '@tc96/ui/card'
import { Slot } from '../../test-utils/anatomy-slot'
import { CardCanvas } from './card-canvas.tsx'

const meta = {
  component: Card,
  decorators: [CardCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs', '!dev'],
  title: 'UI/Card/API Reference',
} satisfies Meta<typeof Card>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>
          <Slot name="CardTitle" />
        </CardTitle>
        <CardDescription>
          <Slot name="CardDescription" />
        </CardDescription>
        <CardAction>
          <Slot name="CardAction" />
        </CardAction>
      </CardHeader>
      <CardPanel>
        <Slot name="CardPanel" />
      </CardPanel>
      <CardFooter>
        <Slot name="CardFooter" />
      </CardFooter>
    </Card>
  ),
}

export const FrameAnatomy: Story = {
  render: () => (
    <CardFrame>
      <CardFrameHeader>
        <CardFrameTitle>
          <Slot name="CardFrameTitle" />
        </CardFrameTitle>
        <CardFrameDescription>
          <Slot name="CardFrameDescription" />
        </CardFrameDescription>
        <CardFrameAction>
          <Slot name="CardFrameAction" />
        </CardFrameAction>
      </CardFrameHeader>
      <Card>
        <CardPanel>
          <Slot name="Card" />
        </CardPanel>
      </Card>
      <CardFrameFooter>
        <Slot name="CardFrameFooter" />
      </CardFrameFooter>
    </CardFrame>
  ),
}
