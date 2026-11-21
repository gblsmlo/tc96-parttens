import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import { Form } from '@tc96/ui/form'
import { Slider } from '@tc96/ui/slider'
import { useState } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { sliderControlArgs } from './slider-controls.ts'
import { SliderCanvas } from './slider-frame.tsx'
import { ComposedSlider } from './slider-layouts.tsx'

type SliderValueArg = number | readonly number[]

interface BehaviorArgs {
  onSubmit: (values: string[]) => void
  onValueChange: (value: SliderValueArg, eventDetails: unknown) => void
  onValueCommitted: (value: SliderValueArg, eventDetails: unknown) => void
}

const meta = {
  args: { onSubmit: fn(), onValueChange: fn(), onValueCommitted: fn() },
  argTypes: {
    onSubmit: { control: false },
    onValueChange: { control: false },
    onValueCommitted: { control: false },
  },
  decorators: [SliderCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Slider/Behavior',
} satisfies Meta<BehaviorArgs>

export default meta

type Story = StoryObj<BehaviorArgs>

const ringShadow = /0px 0px 0px 3px/

export const NamedByFieldLabel: Story = {
  render: () => <ComposedSlider {...sliderControlArgs} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('group', { name: 'Opacity' })).toBeVisible()
    await expect(
      canvas.getByRole('slider', { name: 'Opacity' }),
    ).toBeInTheDocument()
  },
}

export const ExposesValueAndBounds: Story = {
  render: () => (
    <ComposedSlider
      {...sliderControlArgs}
      defaultValue={40}
      max={90}
      min={10}
    />
  ),
  play: async ({ canvasElement }) => {
    const thumb = within(canvasElement).getByRole('slider', { name: 'Opacity' })
    await expect(thumb).toHaveAttribute('aria-valuenow', '40')
    await expect(thumb).toHaveAttribute('min', '10')
    await expect(thumb).toHaveAttribute('max', '90')
  },
}

export const ThumbsNamedByGetAriaLabel: Story = {
  render: () => <ComposedSlider {...sliderControlArgs} range />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const thumbs = canvas.getAllByRole('slider')
    await expect(thumbs).toHaveLength(2)
    await expect(thumbs[0]).toHaveAccessibleName('Minimum')
    await expect(thumbs[1]).toHaveAccessibleName('Maximum')
  },
}

export const RangeValueText: Story = {
  render: () => <ComposedSlider {...sliderControlArgs} range />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('slider', { name: 'Minimum' }),
    ).toHaveAttribute('aria-valuetext', '25 start range')
    await expect(
      canvas.getByRole('slider', { name: 'Maximum' }),
    ).toHaveAttribute('aria-valuetext', '75 end range')
  },
}

export const ArrowKeysMoveByStep: Story = {
  render: () => <ComposedSlider {...sliderControlArgs} step={5} />,
  play: async ({ canvasElement }) => {
    const thumb = within(canvasElement).getByRole('slider', { name: 'Opacity' })
    await userEvent.tab()
    await expect(thumb).toHaveFocus()
    await userEvent.keyboard('{ArrowRight}')
    await expect(thumb).toHaveAttribute('aria-valuenow', '55')
    await userEvent.keyboard('{ArrowUp}')
    await expect(thumb).toHaveAttribute('aria-valuenow', '60')
    await userEvent.keyboard('{ArrowLeft}')
    await expect(thumb).toHaveAttribute('aria-valuenow', '55')
    await userEvent.keyboard('{ArrowDown}')
    await expect(thumb).toHaveAttribute('aria-valuenow', '50')
  },
}

export const ShiftAndPageKeysMoveByLargeStep: Story = {
  render: () => <ComposedSlider {...sliderControlArgs} />,
  play: async ({ canvasElement }) => {
    const thumb = within(canvasElement).getByRole('slider', { name: 'Opacity' })
    await userEvent.tab()
    await expect(thumb).toHaveFocus()
    await userEvent.keyboard('{Shift>}{ArrowRight}{/Shift}')
    await expect(thumb).toHaveAttribute('aria-valuenow', '60')
    await userEvent.keyboard('{PageUp}')
    await expect(thumb).toHaveAttribute('aria-valuenow', '70')
    await userEvent.keyboard('{PageDown}')
    await expect(thumb).toHaveAttribute('aria-valuenow', '60')
    await userEvent.keyboard('{Shift>}{ArrowLeft}{/Shift}')
    await expect(thumb).toHaveAttribute('aria-valuenow', '50')
  },
}

export const HomeAndEndJumpToBounds: Story = {
  render: () => <ComposedSlider {...sliderControlArgs} />,
  play: async ({ canvasElement }) => {
    const thumb = within(canvasElement).getByRole('slider', { name: 'Opacity' })
    await userEvent.tab()
    await expect(thumb).toHaveFocus()
    await userEvent.keyboard('{Home}')
    await expect(thumb).toHaveAttribute('aria-valuenow', '0')
    await userEvent.keyboard('{End}')
    await expect(thumb).toHaveAttribute('aria-valuenow', '100')
  },
}

export const ReportsValue: Story = {
  render: ({ onValueChange, onValueCommitted }) => (
    <ComposedSlider
      {...sliderControlArgs}
      onValueChange={onValueChange}
      onValueCommitted={onValueCommitted}
    />
  ),
  play: async ({ args }) => {
    await userEvent.tab()
    await userEvent.keyboard('{ArrowRight}')
    await expect(args.onValueChange).toHaveBeenCalledOnce()
    await expect(args.onValueChange).toHaveBeenCalledWith(
      51,
      expect.objectContaining({ reason: 'keyboard' }),
    )
    await expect(args.onValueCommitted).toHaveBeenCalledOnce()
    await expect(args.onValueCommitted).toHaveBeenCalledWith(
      51,
      expect.objectContaining({ reason: 'keyboard' }),
    )
  },
}

export const RangeThumbsKeepDistance: Story = {
  render: ({ onValueChange }) => (
    <ComposedSlider
      {...sliderControlArgs}
      minStepsBetweenValues={10}
      onValueChange={onValueChange}
      range
    />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const minimum = canvas.getByRole('slider', { name: 'Minimum' })
    await userEvent.tab()
    await expect(minimum).toHaveFocus()
    await userEvent.keyboard('{End}')
    await expect(minimum).toHaveAttribute('aria-valuenow', '65')
    await expect(args.onValueChange).toHaveBeenLastCalledWith(
      [65, 75],
      expect.anything(),
    )
    await userEvent.keyboard('{ArrowRight}')
    await expect(minimum).toHaveAttribute('aria-valuenow', '65')
    await expect(
      canvas.getByRole('slider', { name: 'Maximum' }),
    ).toHaveAttribute('aria-valuenow', '75')
    await expect(args.onValueChange).toHaveBeenCalledOnce()
  },
}

export const ValueFollowsThumbs: Story = {
  render: () => <ComposedSlider {...sliderControlArgs} range />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const output = canvas.getByRole('status')
    const minimum = canvas.getByRole('slider', { name: 'Minimum' })
    const maximum = canvas.getByRole('slider', { name: 'Maximum' })
    await expect(output).toHaveTextContent('25 – 75')
    await expect(output).toHaveAttribute('for', `${minimum.id} ${maximum.id}`)
    await userEvent.tab()
    await userEvent.keyboard('{ArrowRight}')
    await expect(output).toHaveTextContent('26 – 75')
  },
}

export const FormatsValue: Story = {
  render: () => (
    <ComposedSlider
      {...sliderControlArgs}
      format={{ style: 'unit', unit: 'percent' }}
      locale="en-US"
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const thumb = canvas.getByRole('slider', { name: 'Opacity' })
    await expect(canvas.getByRole('status')).toHaveTextContent('50%')
    await expect(thumb).toHaveAttribute('aria-valuetext', '50%')
    await userEvent.tab()
    await userEvent.keyboard('{ArrowRight}')
    await expect(canvas.getByRole('status')).toHaveTextContent('51%')
    await expect(thumb).toHaveAttribute('aria-valuetext', '51%')
  },
}

export const VerticalOrientation: Story = {
  render: () => (
    <ComposedSlider {...sliderControlArgs} orientation="vertical" />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('slider', { name: 'Opacity' })
    await expect(input).toHaveAttribute('aria-orientation', 'vertical')
    const control = canvasElement.querySelector('[data-slot="slider-control"]')
    const thumb = canvasElement.querySelector('[data-slot="slider-thumb"]')
    if (!control || !thumb) throw new Error('The slider renders no control')
    const { height, width } = control.getBoundingClientRect()
    await expect(height).toBeGreaterThan(width)
    await waitFor(() =>
      expect(getComputedStyle(thumb).visibility).toBe('visible'),
    )
    const startTop = thumb.getBoundingClientRect().top
    await userEvent.tab()
    await userEvent.keyboard('{End}')
    await expect(input).toHaveAttribute('aria-valuenow', '100')
    await waitFor(() =>
      expect(thumb.getBoundingClientRect().top).toBeLessThan(startTop - 40),
    )
  },
}

export const DisabledState: Story = {
  render: () => <ComposedSlider {...sliderControlArgs} disabled />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('group', { name: 'Opacity' }),
    ).toHaveAttribute('data-disabled')
    await expect(canvas.getByRole('slider', { name: 'Opacity' })).toBeDisabled()
    const control = canvasElement.querySelector('[data-slot="slider-control"]')
    if (!control) throw new Error('The slider renders no control')
    await expect(getComputedStyle(control).pointerEvents).toBe('none')
  },
}

export const ThumbsStayInsideAtBounds: Story = {
  render: () => (
    <ComposedSlider {...sliderControlArgs} defaultValue={[0, 100]} range />
  ),
  play: async ({ canvasElement }) => {
    const control = canvasElement.querySelector('[data-slot="slider-control"]')
    const thumbs = canvasElement.querySelectorAll('[data-slot="slider-thumb"]')
    await expect(control).not.toBeNull()
    await expect(thumbs).toHaveLength(2)
    await waitFor(async () => {
      const bounds = control?.getBoundingClientRect()
      const first = thumbs[0]?.getBoundingClientRect()
      const last = thumbs[1]?.getBoundingClientRect()
      await expect(
        Math.abs((first?.left ?? 0) - (bounds?.left ?? 0)),
      ).toBeLessThanOrEqual(1)
      await expect(
        Math.abs((last?.right ?? 0) - (bounds?.right ?? 0)),
      ).toBeLessThanOrEqual(1)
    })
  },
}

export const FocusRingOnKeyboard: Story = {
  render: () => <ComposedSlider {...sliderControlArgs} />,
  play: async ({ canvasElement }) => {
    const thumb = canvasElement.querySelector('[data-slot="slider-thumb"]')
    if (!thumb) throw new Error('The slider renders no thumb')
    await expect(getComputedStyle(thumb).boxShadow).not.toMatch(ringShadow)
    await userEvent.tab()
    await expect(thumb.querySelector('input')).toHaveFocus()
    await waitFor(() =>
      expect(getComputedStyle(thumb).boxShadow).toMatch(ringShadow),
    )
  },
}

export const SubmitsThumbValues: Story = {
  render: ({ onSubmit }) => (
    <Form
      className="flex flex-col items-start gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit(
          new FormData(event.currentTarget).getAll('opacity').map(String),
        )
      }}
    >
      <ComposedSlider {...sliderControlArgs} name="opacity" range />
      <Button type="submit">Save</Button>
    </Form>
  ),
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Save' }),
    )
    await expect(args.onSubmit).toHaveBeenCalledOnce()
    await expect(args.onSubmit).toHaveBeenCalledWith(['25', '75'])
  },
}

export const FieldState: Story = {
  render: () => <ComposedSlider {...sliderControlArgs} />,
  play: async ({ canvasElement }) => {
    const group = within(canvasElement).getByRole('group', { name: 'Opacity' })
    await expect(group).not.toHaveAttribute('data-dirty')
    await expect(group).not.toHaveAttribute('data-touched')
    await userEvent.tab()
    await userEvent.keyboard('{ArrowRight}')
    await expect(group).toHaveAttribute('data-dirty')
    await expect(group).toHaveAttribute('data-touched')
  },
}

const ControlledOpacity = () => {
  const [value, setValue] = useState(20)

  return (
    <div className="flex flex-col items-start gap-4">
      <Slider getAriaLabel={() => 'Opacity'} value={value} />
      <Button onClick={() => setValue(80)} variant="outline">
        Set to 80
      </Button>
    </div>
  )
}

export const FollowsControlledValue: Story = {
  render: () => <ControlledOpacity />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('slider', { name: 'Opacity' })
    const thumb = canvasElement.querySelector('[data-slot="slider-thumb"]')
    if (!thumb) throw new Error('The slider renders no thumb')
    await expect(input).toHaveAttribute('aria-valuenow', '20')
    await waitFor(() =>
      expect(getComputedStyle(thumb).visibility).toBe('visible'),
    )
    const startLeft = thumb.getBoundingClientRect().left
    await userEvent.click(canvas.getByRole('button', { name: 'Set to 80' }))
    await expect(input).toHaveAttribute('aria-valuenow', '80')
    await waitFor(() =>
      expect(thumb.getBoundingClientRect().left).toBeGreaterThan(
        startLeft + 40,
      ),
    )
  },
}
