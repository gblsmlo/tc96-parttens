import { SunDimIcon, SunIcon } from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { sliderControlArgs } from './slider-controls.ts'
import { SliderCanvas } from './slider-frame.tsx'
import {
  ComposedSlider,
  IconSlider,
  ScaleSlider,
  SliderWithInput,
} from './slider-layouts.tsx'
import { scaleMarks, singleDefaultValue } from './slider-variants.ts'

const meta = {
  decorators: [SliderCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Slider/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Range: Story = {
  render: () => <ComposedSlider {...sliderControlArgs} range />,
}

export const SliderOnly: Story = {
  render: () => (
    <ComposedSlider {...sliderControlArgs} label="" showValue={false} />
  ),
}

export const WithoutValue: Story = {
  render: () => <ComposedSlider {...sliderControlArgs} showValue={false} />,
}

export const WithIcons: Story = {
  render: () => (
    <IconSlider
      defaultValue={singleDefaultValue}
      endIcon={SunIcon}
      label={sliderControlArgs.label}
      startIcon={SunDimIcon}
    />
  ),
}

export const WithScale: Story = {
  render: () => (
    <ScaleSlider
      defaultValue={singleDefaultValue}
      label={sliderControlArgs.label}
      marks={scaleMarks}
    />
  ),
}

export const WithInput: Story = {
  render: () => <SliderWithInput />,
}
