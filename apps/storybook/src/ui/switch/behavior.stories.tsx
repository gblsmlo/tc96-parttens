import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import { Form } from '@tc96/ui/form'
import { Label } from '@tc96/ui/label'
import { Switch } from '@tc96/ui/switch'
import type { FormEvent } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { switchControlArgs } from './switch-controls.ts'
import {
  ComposedSwitch,
  FieldSwitch,
  WrappedLabelSwitch,
} from './switch-layouts.tsx'
import { switchSizeClasses } from './switch-variants.ts'

interface BehaviorArgs {
  onCheckedChange: (checked: boolean) => void
  onSubmit: (values: Record<string, FormDataEntryValue | null>) => void
}

const formValues = (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault()
  const data = new FormData(event.currentTarget)
  return { marketing: data.get('marketing') }
}

const thumbOf = (control: HTMLElement) => {
  const thumb = control.querySelector<HTMLElement>('[data-slot="switch-thumb"]')
  if (!thumb) throw new Error('The switch has no thumb')
  return thumb
}

const ringSpread = '0px 0px 0px 3px'

const RequiredForm = ({ onSubmit }: Pick<BehaviorArgs, 'onSubmit'>) => (
  <Form
    className="flex flex-col items-start gap-4"
    onSubmit={(event) => {
      event.preventDefault()
      onSubmit({})
    }}
  >
    <FieldSwitch required />
    <Button type="submit">Submit</Button>
  </Form>
)

const meta = {
  args: { onCheckedChange: fn(), onSubmit: fn() },
  argTypes: {
    onCheckedChange: { control: false },
    onSubmit: { control: false },
  },
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Switch/Behavior',
} satisfies Meta<BehaviorArgs>

export default meta

type Story = StoryObj<BehaviorArgs>

export const TogglesOnClick: Story = {
  render: ({ onCheckedChange }) => (
    <ComposedSwitch {...switchControlArgs} onCheckedChange={onCheckedChange} />
  ),
  play: async ({ args, canvasElement }) => {
    const control = within(canvasElement).getByRole('switch')
    await expect(control).toHaveAttribute('aria-checked', 'false')
    await expect(control).toHaveAttribute('data-unchecked')
    await userEvent.click(control)
    await expect(args.onCheckedChange).toHaveBeenLastCalledWith(
      true,
      expect.anything(),
    )
    await expect(control).toHaveAttribute('aria-checked', 'true')
    await expect(control).toHaveAttribute('data-checked')
    await userEvent.click(control)
    await expect(args.onCheckedChange).toHaveBeenLastCalledWith(
      false,
      expect.anything(),
    )
    await expect(control).toHaveAttribute('aria-checked', 'false')
  },
}

export const ThumbSlidesWhenOn: Story = {
  render: () => <ComposedSwitch {...switchControlArgs} />,
  play: async ({ canvasElement }) => {
    const control = within(canvasElement).getByRole('switch')
    const thumb = thumbOf(control)
    const track = control.getBoundingClientRect()
    const off = thumb.getBoundingClientRect()
    await expect(off.left - track.left).toBeLessThan(track.width / 2)
    await userEvent.click(control)
    await expect(thumb).toHaveAttribute('data-checked')
    await waitFor(() => {
      const on = thumb.getBoundingClientRect()
      expect(on.right).toBeCloseTo(track.right - 1, 0)
      expect(on.left).toBeGreaterThan(off.left)
    })
  },
}

export const ThumbSlidesLeftInRtl: Story = {
  render: () => (
    <div dir="rtl">
      <ComposedSwitch {...switchControlArgs} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const control = within(canvasElement).getByRole('switch')
    const thumb = thumbOf(control)
    const track = control.getBoundingClientRect()
    const off = thumb.getBoundingClientRect()
    await expect(off.right).toBeCloseTo(track.right - 1, 0)
    await userEvent.click(control)
    await waitFor(() => {
      const on = thumb.getBoundingClientRect()
      expect(on.left).toBeCloseTo(track.left + 1, 0)
    })
  },
}

export const TrackFollowsThumbSize: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Switch aria-label="Default size" />
      <Switch aria-label="Custom size" className={switchSizeClasses.small} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    for (const name of ['Default size', 'Custom size']) {
      const control = canvas.getByRole('switch', { name })
      const track = control.getBoundingClientRect()
      const thumb = thumbOf(control).getBoundingClientRect()
      await expect(track.height).toBeCloseTo(thumb.height + 2, 0)
      await expect(track.width).toBeCloseTo(thumb.height * 2 - 2, 0)
    }
  },
}

export const LabelForNamesAndToggles: Story = {
  render: () => <ComposedSwitch {...switchControlArgs} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const control = canvas.getByRole('switch', { name: 'Label text' })
    await userEvent.click(canvas.getByText('Label text'))
    await expect(control).toHaveAttribute('aria-checked', 'true')
  },
}

export const WrappingLabelNamesAndToggles: Story = {
  render: () => <WrappedLabelSwitch />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const control = canvas.getByRole('switch', { name: 'Label text' })
    await userEvent.click(canvas.getByText('Label text'))
    await expect(control).toHaveAttribute('aria-checked', 'true')
  },
}

export const ForwardsDescribedByToSwitch: Story = {
  render: () => (
    <ComposedSwitch
      {...switchControlArgs}
      description="Describe what turning the switch on does."
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const control = canvas.getByRole('switch', { name: 'Label text' })
    const description = canvas.getByText(
      'Describe what turning the switch on does.',
    )
    await expect(control).toHaveAttribute('aria-describedby', description.id)
    await expect(control.parentElement).not.toHaveAttribute('aria-describedby')
  },
}

export const KeyboardToggle: Story = {
  render: () => <ComposedSwitch {...switchControlArgs} />,
  play: async ({ canvasElement }) => {
    const control = within(canvasElement).getByRole('switch')
    await userEvent.tab()
    await expect(control).toHaveFocus()
    await userEvent.keyboard(' ')
    await expect(control).toHaveAttribute('aria-checked', 'true')
    await userEvent.keyboard('{Enter}')
    await expect(control).toHaveAttribute('aria-checked', 'false')
  },
}

export const FocusRingFromKeyboard: Story = {
  render: () => <ComposedSwitch {...switchControlArgs} />,
  play: async ({ canvasElement }) => {
    const control = within(canvasElement).getByRole('switch')
    await expect(getComputedStyle(control).boxShadow).not.toContain(ringSpread)
    await userEvent.tab()
    await expect(control).toHaveFocus()
    await waitFor(() =>
      expect(getComputedStyle(control).boxShadow).toContain(ringSpread),
    )
  },
}

export const DisabledIsAnnounced: Story = {
  render: () => <ComposedSwitch {...switchControlArgs} disabled />,
  play: async ({ canvasElement }) => {
    const control = within(canvasElement).getByRole('switch')
    await expect(control).toHaveAttribute('aria-disabled', 'true')
    await expect(control).toHaveAttribute('data-disabled')
  },
}

export const DisabledIgnoresClick: Story = {
  render: ({ onCheckedChange }) => (
    <ComposedSwitch
      {...switchControlArgs}
      disabled
      onCheckedChange={onCheckedChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const control = within(canvasElement).getByRole('switch')
    await userEvent.click(control, { pointerEventsCheck: 0 })
    await expect(args.onCheckedChange).not.toHaveBeenCalled()
    await expect(control).toHaveAttribute('aria-checked', 'false')
  },
}

export const DisabledIgnoresLabelClick: Story = {
  render: ({ onCheckedChange }) => (
    <ComposedSwitch
      {...switchControlArgs}
      disabled
      onCheckedChange={onCheckedChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByText('Label text'))
    await expect(args.onCheckedChange).not.toHaveBeenCalled()
    await expect(canvas.getByRole('switch')).toHaveAttribute(
      'aria-checked',
      'false',
    )
  },
}

export const DisabledLeavesTabOrder: Story = {
  render: () => <ComposedSwitch {...switchControlArgs} disabled />,
  play: async ({ canvasElement }) => {
    const control = within(canvasElement).getByRole('switch')
    await userEvent.tab()
    await expect(control).not.toHaveFocus()
  },
}

export const ReadOnlyIsAnnounced: Story = {
  render: () => <ComposedSwitch {...switchControlArgs} checked readOnly />,
  play: async ({ canvasElement }) => {
    const control = within(canvasElement).getByRole('switch')
    await expect(control).toHaveAttribute('aria-readonly', 'true')
    await expect(control).toHaveAttribute('data-readonly')
  },
}

export const ReadOnlyKeepsValueOnClick: Story = {
  render: ({ onCheckedChange }) => (
    <ComposedSwitch
      {...switchControlArgs}
      checked
      onCheckedChange={onCheckedChange}
      readOnly
    />
  ),
  play: async ({ args, canvasElement }) => {
    const control = within(canvasElement).getByRole('switch')
    await userEvent.click(control)
    await expect(args.onCheckedChange).not.toHaveBeenCalled()
    await expect(control).toHaveAttribute('aria-checked', 'true')
  },
}

export const ReadOnlyKeepsValueOnKeys: Story = {
  render: ({ onCheckedChange }) => (
    <ComposedSwitch
      {...switchControlArgs}
      checked
      onCheckedChange={onCheckedChange}
      readOnly
    />
  ),
  play: async ({ args, canvasElement }) => {
    const control = within(canvasElement).getByRole('switch')
    await userEvent.tab()
    await expect(control).toHaveFocus()
    await userEvent.keyboard(' ')
    await userEvent.keyboard('{Enter}')
    await expect(args.onCheckedChange).not.toHaveBeenCalled()
    await expect(control).toHaveAttribute('aria-checked', 'true')
  },
}

export const SubmitsItsValue: Story = {
  render: ({ onSubmit }) => (
    <Form
      className="flex flex-col items-start gap-4"
      onSubmit={(event) => onSubmit(formValues(event))}
    >
      <Label>
        <Switch name="marketing" uncheckedValue="no" value="yes" />
        Label text
      </Label>
      <Button type="submit">Submit</Button>
    </Form>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const submit = canvas.getByRole('button', { name: 'Submit' })
    await userEvent.click(submit)
    await expect(args.onSubmit).toHaveBeenLastCalledWith({ marketing: 'no' })
    await userEvent.click(canvas.getByRole('switch'))
    await userEvent.click(submit)
    await expect(args.onSubmit).toHaveBeenLastCalledWith({ marketing: 'yes' })
  },
}

export const RequiredBlocksSubmit: Story = {
  render: ({ onSubmit }) => <RequiredForm onSubmit={onSubmit} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const control = canvas.getByRole('switch', { name: 'Label text' })
    await expect(control).toHaveAttribute('aria-required', 'true')
    await userEvent.click(canvas.getByRole('button', { name: 'Submit' }))
    await expect(args.onSubmit).not.toHaveBeenCalled()
    await expect(control).toHaveAttribute('aria-invalid', 'true')
    await expect(control).toHaveAttribute('data-invalid')
  },
}

export const RequiredClearsWhenOn: Story = {
  render: ({ onSubmit }) => <RequiredForm onSubmit={onSubmit} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const control = canvas.getByRole('switch', { name: 'Label text' })
    const submit = canvas.getByRole('button', { name: 'Submit' })
    await userEvent.click(submit)
    await expect(control).toHaveAttribute('aria-invalid', 'true')
    await userEvent.click(control)
    await expect(control).not.toHaveAttribute('aria-invalid')
    await userEvent.click(submit)
    await expect(args.onSubmit).toHaveBeenCalledOnce()
  },
}
