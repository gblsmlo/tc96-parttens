import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import { Checkbox } from '@tc96/ui/checkbox'
import { Form } from '@tc96/ui/form'
import { Label } from '@tc96/ui/label'
import type { FormEvent } from 'react'
import { expect, fn, userEvent, within } from 'storybook/test'
import { checkboxControlArgs } from './checkbox-controls.ts'
import {
  ComposedCheckbox,
  FieldCheckbox,
  WrappedLabelCheckbox,
} from './checkbox-layouts.tsx'

interface BehaviorArgs {
  onCheckedChange: (checked: boolean) => void
  onSubmit: (values: Record<string, FormDataEntryValue | null>) => void
}

const formValues = (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault()
  const data = new FormData(event.currentTarget)
  return { newsletter: data.get('newsletter') }
}

const meta = {
  args: { onCheckedChange: fn(), onSubmit: fn() },
  argTypes: {
    onCheckedChange: { control: false },
    onSubmit: { control: false },
  },
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Checkbox/Behavior',
} satisfies Meta<BehaviorArgs>

export default meta

type Story = StoryObj<BehaviorArgs>

export const TogglesOnClick: Story = {
  render: ({ onCheckedChange }) => (
    <ComposedCheckbox
      {...checkboxControlArgs}
      onCheckedChange={onCheckedChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const checkbox = within(canvasElement).getByRole('checkbox')
    await expect(checkbox).toHaveAttribute('aria-checked', 'false')
    await expect(checkbox).toHaveAttribute('data-unchecked')
    await expect(checkbox.querySelector('svg')).toBeNull()
    await userEvent.click(checkbox)
    await expect(args.onCheckedChange).toHaveBeenLastCalledWith(
      true,
      expect.anything(),
    )
    await expect(checkbox).toHaveAttribute('aria-checked', 'true')
    await expect(checkbox).toHaveAttribute('data-checked')
    await expect(checkbox.querySelector('svg')).not.toBeNull()
    await userEvent.click(checkbox)
    await expect(args.onCheckedChange).toHaveBeenLastCalledWith(
      false,
      expect.anything(),
    )
    await expect(checkbox).toHaveAttribute('aria-checked', 'false')
  },
}

export const LabelForNamesAndToggles: Story = {
  render: () => <ComposedCheckbox {...checkboxControlArgs} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const checkbox = canvas.getByRole('checkbox', { name: 'Label text' })
    await userEvent.click(canvas.getByText('Label text'))
    await expect(checkbox).toHaveAttribute('aria-checked', 'true')
  },
}

export const WrappingLabelNamesAndToggles: Story = {
  render: () => <WrappedLabelCheckbox />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const checkbox = canvas.getByRole('checkbox', { name: 'Label text' })
    await userEvent.click(canvas.getByText('Label text'))
    await expect(checkbox).toHaveAttribute('aria-checked', 'true')
  },
}

export const DescriptionDescribes: Story = {
  render: () => (
    <ComposedCheckbox
      {...checkboxControlArgs}
      description="Describe what checking the box does."
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('checkbox', { name: 'Label text' }),
    ).toHaveAccessibleDescription('Describe what checking the box does.')
  },
}

export const KeyboardToggle: Story = {
  render: () => <ComposedCheckbox {...checkboxControlArgs} />,
  play: async ({ canvasElement }) => {
    const checkbox = within(canvasElement).getByRole('checkbox')
    await userEvent.tab()
    await expect(checkbox).toHaveFocus()
    await userEvent.keyboard(' ')
    await expect(checkbox).toHaveAttribute('aria-checked', 'true')
    await userEvent.keyboard(' ')
    await expect(checkbox).toHaveAttribute('aria-checked', 'false')
  },
}

export const FocusVisibleFromKeyboard: Story = {
  render: () => <ComposedCheckbox {...checkboxControlArgs} />,
  play: async ({ canvasElement }) => {
    const checkbox = within(canvasElement).getByRole('checkbox')
    await userEvent.tab()
    await expect(checkbox).toHaveFocus()
    await expect(checkbox.matches(':focus-visible')).toBe(true)
  },
}

export const EnterSubmitsForm: Story = {
  render: ({ onSubmit }) => (
    <Form
      className="flex flex-col items-start gap-4"
      onSubmit={(event) => onSubmit(formValues(event))}
    >
      <Label>
        <Checkbox name="newsletter" />
        Label text
      </Label>
      <Button type="submit">Submit</Button>
    </Form>
  ),
  play: async ({ args, canvasElement }) => {
    const checkbox = within(canvasElement).getByRole('checkbox')
    await userEvent.tab()
    await expect(checkbox).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await expect(args.onSubmit).toHaveBeenCalledOnce()
    await expect(checkbox).toHaveAttribute('aria-checked', 'false')
  },
}

export const IndeterminateIsMixed: Story = {
  render: () => <ComposedCheckbox {...checkboxControlArgs} indeterminate />,
  play: async ({ canvasElement }) => {
    const checkbox = within(canvasElement).getByRole('checkbox')
    await expect(checkbox).toHaveAttribute('aria-checked', 'mixed')
    await expect(checkbox).toHaveAttribute('data-indeterminate')
    await expect(checkbox).not.toHaveAttribute('data-checked')
    await expect(checkbox).not.toHaveAttribute('data-unchecked')
    await expect(checkbox.querySelector('path')).toHaveAttribute(
      'd',
      'M5.252 12h13.496',
    )
  },
}

export const IndeterminateStaysWhileControlled: Story = {
  render: ({ onCheckedChange }) => (
    <ComposedCheckbox
      {...checkboxControlArgs}
      indeterminate
      onCheckedChange={onCheckedChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const checkbox = within(canvasElement).getByRole('checkbox')
    await userEvent.click(checkbox)
    await expect(args.onCheckedChange).toHaveBeenLastCalledWith(
      true,
      expect.anything(),
    )
    await expect(checkbox).toHaveAttribute('aria-checked', 'mixed')
  },
}

export const DisabledIgnoresInput: Story = {
  render: ({ onCheckedChange }) => (
    <ComposedCheckbox
      {...checkboxControlArgs}
      disabled
      onCheckedChange={onCheckedChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const checkbox = canvas.getByRole('checkbox')
    await expect(checkbox).toHaveAttribute('data-disabled')
    await expect(checkbox).toHaveAttribute('aria-disabled', 'true')
    await userEvent.click(checkbox, { pointerEventsCheck: 0 })
    await userEvent.click(canvas.getByText('Label text'))
    await expect(args.onCheckedChange).not.toHaveBeenCalled()
    await expect(checkbox).toHaveAttribute('aria-checked', 'false')
  },
}

export const DisabledLeavesTabOrder: Story = {
  render: () => <ComposedCheckbox {...checkboxControlArgs} disabled />,
  play: async ({ canvasElement }) => {
    const checkbox = within(canvasElement).getByRole('checkbox')
    await userEvent.tab()
    await expect(checkbox).not.toHaveFocus()
  },
}

export const ReadOnlyKeepsValue: Story = {
  render: ({ onCheckedChange }) => (
    <Label>
      <Checkbox defaultChecked onCheckedChange={onCheckedChange} readOnly />
      Label text
    </Label>
  ),
  play: async ({ args, canvasElement }) => {
    const checkbox = within(canvasElement).getByRole('checkbox')
    await expect(checkbox).toHaveAttribute('aria-readonly', 'true')
    await expect(checkbox).toHaveAttribute('data-readonly')
    await userEvent.click(checkbox)
    await userEvent.keyboard(' ')
    await expect(args.onCheckedChange).not.toHaveBeenCalled()
    await expect(checkbox).toHaveAttribute('aria-checked', 'true')
  },
}

export const SubmitsItsValue: Story = {
  render: ({ onSubmit }) => (
    <Form
      className="flex flex-col items-start gap-4"
      onSubmit={(event) => onSubmit(formValues(event))}
    >
      <Label>
        <Checkbox name="newsletter" uncheckedValue="no" value="yes" />
        Label text
      </Label>
      <Button type="submit">Submit</Button>
    </Form>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const submit = canvas.getByRole('button', { name: 'Submit' })
    await userEvent.click(submit)
    await expect(args.onSubmit).toHaveBeenLastCalledWith({ newsletter: 'no' })
    await userEvent.click(canvas.getByRole('checkbox'))
    await userEvent.click(submit)
    await expect(args.onSubmit).toHaveBeenLastCalledWith({
      newsletter: 'yes',
    })
  },
}

export const RequiredInField: Story = {
  render: ({ onSubmit }) => (
    <Form
      className="flex flex-col items-start gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit({})
      }}
    >
      <FieldCheckbox required />
      <Button type="submit">Submit</Button>
    </Form>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const checkbox = canvas.getByRole('checkbox', { name: 'Label text' })
    const submit = canvas.getByRole('button', { name: 'Submit' })
    await userEvent.click(submit)
    await expect(args.onSubmit).not.toHaveBeenCalled()
    await expect(checkbox).toHaveAttribute('aria-invalid', 'true')
    await expect(checkbox).toHaveAttribute('data-invalid')
    await expect(canvas.getByText('Check the box to continue.')).toBeVisible()
    await userEvent.click(checkbox)
    await expect(checkbox).not.toHaveAttribute('aria-invalid')
    await userEvent.click(submit)
    await expect(args.onSubmit).toHaveBeenCalledOnce()
  },
}
