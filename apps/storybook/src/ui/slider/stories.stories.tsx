import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type SliderControls,
  sliderControlArgs,
  sliderControlArgTypes,
} from './slider-controls.ts'
import { SliderCanvas } from './slider-frame.tsx'
import { ComposedSlider } from './slider-layouts.tsx'

const meta = {
  args: sliderControlArgs,
  argTypes: sliderControlArgTypes,
  decorators: [SliderCanvas],
  parameters: {
    controls: { exclude: ['disabled', 'orientation'] },
    layout: 'centered',
  },
  render: (args) => <ComposedSlider {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Slider/Stories',
} satisfies Meta<SliderControls>

export default meta

type Story = StoryObj<SliderControls>

export const Default: Story = {}

export const Vertical: Story = {
  args: { orientation: 'vertical' },
}

export const Disabled: Story = {
  args: { disabled: true },
}
