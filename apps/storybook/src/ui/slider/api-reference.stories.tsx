import type { Meta, StoryObj } from '@storybook/react-vite'
import { Slider, SliderValue } from '@tc96/ui/slider'
import { expect, within } from 'storybook/test'
import { Slot } from '../../test-utils/anatomy-slot'
import { SliderCanvas } from './slider-frame.tsx'

const meta = {
  component: Slider,
  decorators: [SliderCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs', '!dev'],
  title: 'UI/Slider/API Reference',
} satisfies Meta<typeof Slider>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  render: (args) => (
    <Slider {...args} defaultValue={50} getAriaLabel={() => 'Value'}>
      <div className="mb-2 flex items-center justify-between gap-1">
        <Slot name="children" />
        <SliderValue />
      </div>
    </Slider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('children')).toBeVisible()
    await expect(canvas.getByRole('slider', { name: 'Value' })).toHaveAttribute(
      'aria-valuenow',
      '50',
    )
    await expect(canvas.getByRole('status')).toHaveTextContent('50')
  },
}
