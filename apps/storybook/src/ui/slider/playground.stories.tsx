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
  parameters: { layout: 'centered' },
  render: (args) => <ComposedSlider {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Slider/Playground',
} satisfies Meta<SliderControls>

export default meta

type Story = StoryObj<SliderControls>

export const Playground: Story = {}
