import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import { Form } from '@tc96/ui/form'
import { expect, fn, userEvent, within } from 'storybook/test'
import { checkboxGroupControlArgs } from './checkbox-group-controls.ts'
import {
  ComposedCheckboxGroup,
  FieldCheckboxGroup,
  NestedPermissions,
} from './checkbox-group-layouts.tsx'

interface BehaviorArgs {
  onSubmit: (values: string[]) => void
  onValueChange: (value: string[]) => void
}

const meta = {
  args: { onSubmit: fn(), onValueChange: fn() },
  argTypes: {
    onSubmit: { control: false },
    onValueChange: { control: false },
  },
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/CheckboxGroup/Behavior',
} satisfies Meta<BehaviorArgs>

export default meta

type Story = StoryObj<BehaviorArgs>

export const NamedGroup: Story = {
  render: () => <ComposedCheckboxGroup {...checkboxGroupControlArgs} />,
  play: async ({ canvasElement }) => {
    const group = within(canvasElement).getByRole('group', {
      name: 'Frameworks',
    })
    await expect(within(group).getAllByRole('checkbox')).toHaveLength(3)
    await expect(
      within(group).getByRole('checkbox', { name: 'Next.js' }),
    ).toBeChecked()
  },
}

export const ReportsValue: Story = {
  render: ({ onValueChange }) => (
    <ComposedCheckboxGroup
      {...checkboxGroupControlArgs}
      onValueChange={onValueChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Vite' }))
    await expect(args.onValueChange).toHaveBeenLastCalledWith(
      ['next', 'vite'],
      expect.anything(),
    )
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Next.js' }))
    await expect(args.onValueChange).toHaveBeenLastCalledWith(
      ['vite'],
      expect.anything(),
    )
    await expect(args.onValueChange).toHaveBeenCalledTimes(2)
    await expect(
      canvas.getByRole('checkbox', { name: 'Next.js' }),
    ).not.toBeChecked()
  },
}

export const LabelTogglesItem: Story = {
  render: () => <ComposedCheckboxGroup {...checkboxGroupControlArgs} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByText('Astro'))
    await expect(canvas.getByRole('checkbox', { name: 'Astro' })).toBeChecked()
  },
}

export const KeyboardToggle: Story = {
  render: () => <ComposedCheckboxGroup {...checkboxGroupControlArgs} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.tab()
    const next = canvas.getByRole('checkbox', { name: 'Next.js' })
    await expect(next).toHaveFocus()
    await userEvent.keyboard(' ')
    await expect(next).not.toBeChecked()
    await userEvent.tab()
    const vite = canvas.getByRole('checkbox', { name: 'Vite' })
    await expect(vite).toHaveFocus()
    await userEvent.keyboard(' ')
    await expect(vite).toBeChecked()
  },
}

export const ParentCyclesThroughSelection: Story = {
  render: ({ onValueChange }) => (
    <ComposedCheckboxGroup
      {...checkboxGroupControlArgs}
      onValueChange={onValueChange}
      parent
    />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const parent = canvas.getByRole('checkbox', { name: 'Frameworks' })
    const itemNamed = (name: string) => canvas.getByRole('checkbox', { name })
    await expect(parent).toHaveAttribute('aria-checked', 'mixed')
    await userEvent.click(parent)
    await expect(parent).toHaveAttribute('aria-checked', 'true')
    await expect(args.onValueChange).toHaveBeenLastCalledWith(
      ['next', 'vite', 'astro'],
      expect.anything(),
    )
    await userEvent.click(parent)
    await expect(parent).toHaveAttribute('aria-checked', 'false')
    await expect(itemNamed('Next.js')).not.toBeChecked()
    await userEvent.click(parent)
    await expect(parent).toHaveAttribute('aria-checked', 'mixed')
    await expect(itemNamed('Next.js')).toBeChecked()
    await expect(itemNamed('Vite')).not.toBeChecked()
  },
}

export const ParentFollowsItems: Story = {
  render: () => (
    <ComposedCheckboxGroup
      {...checkboxGroupControlArgs}
      defaultValue={[]}
      parent
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const parent = canvas.getByRole('checkbox', { name: 'Frameworks' })
    await expect(parent).toHaveAttribute('aria-checked', 'false')
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Next.js' }))
    await expect(parent).toHaveAttribute('aria-checked', 'mixed')
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Vite' }))
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Astro' }))
    await expect(parent).toHaveAttribute('aria-checked', 'true')
  },
}

export const ParentSkipsDisabledItem: Story = {
  render: ({ onValueChange }) => (
    <ComposedCheckboxGroup
      {...checkboxGroupControlArgs}
      defaultValue={[]}
      disabledItem
      onValueChange={onValueChange}
      parent
    />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Frameworks' }))
    await expect(args.onValueChange).toHaveBeenLastCalledWith(
      ['next', 'vite'],
      expect.anything(),
    )
    await expect(
      canvas.getByRole('checkbox', { name: 'Astro' }),
    ).not.toBeChecked()
  },
}

export const DisabledItemIgnoresClick: Story = {
  render: ({ onValueChange }) => (
    <ComposedCheckboxGroup
      {...checkboxGroupControlArgs}
      disabledItem
      onValueChange={onValueChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const astro = within(canvasElement).getByRole('checkbox', {
      name: 'Astro',
    })
    await expect(astro).toHaveAttribute('data-disabled')
    await userEvent.click(astro, { pointerEventsCheck: 0 })
    await expect(astro).toHaveAttribute('aria-checked', 'false')
    await expect(args.onValueChange).not.toHaveBeenCalled()
  },
}

export const DisabledGroup: Story = {
  render: ({ onValueChange }) => (
    <ComposedCheckboxGroup
      {...checkboxGroupControlArgs}
      disabled
      onValueChange={onValueChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const group = canvas.getByRole('group', { name: 'Frameworks' })
    await expect(group).toHaveAttribute('data-disabled')
    for (const checkbox of within(group).getAllByRole('checkbox')) {
      await expect(checkbox).toHaveAttribute('data-disabled')
    }
    const vite = canvas.getByRole('checkbox', { name: 'Vite' })
    await userEvent.click(vite)
    await userEvent.click(canvas.getByText('Vite'))
    await expect(vite).not.toBeChecked()
    await expect(args.onValueChange).not.toHaveBeenCalled()
  },
}

export const NamedByFieldLabel: Story = {
  render: () => <FieldCheckboxGroup />,
  play: async ({ canvasElement }) => {
    const group = within(canvasElement).getByRole('group', {
      name: 'Frameworks',
    })
    await expect(group).toHaveAccessibleDescription(
      'Pick every framework your team ships with.',
    )
  },
}

export const FieldState: Story = {
  render: () => <FieldCheckboxGroup />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const group = canvas.getByRole('group', { name: 'Frameworks' })
    await expect(group).toHaveAttribute('data-filled')
    await expect(group).not.toHaveAttribute('data-dirty')
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Vite' }))
    await expect(group).toHaveAttribute('data-dirty')
  },
}

export const SubmitsCheckedValues: Story = {
  render: ({ onSubmit }) => (
    <Form
      className="flex flex-col items-start gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit(
          new FormData(event.currentTarget).getAll('frameworks').map(String),
        )
      }}
    >
      <FieldCheckboxGroup />
      <Button type="submit">Save</Button>
    </Form>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Vite' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Save' }))
    await expect(args.onSubmit).toHaveBeenCalledOnce()
    await expect(args.onSubmit).toHaveBeenCalledWith(['next', 'vite'])
  },
}

export const NestedParentFollowsChildren: Story = {
  render: () => <NestedPermissions />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const checkbox = (name: string) => canvas.getByRole('checkbox', { name })
    const editor = checkbox('Editor permissions')
    const users = checkbox('Manage users')
    await expect(editor).toHaveAttribute('aria-checked', 'mixed')
    await expect(users).toHaveAttribute('aria-checked', 'false')
    await userEvent.click(checkbox('Create users'))
    await expect(users).toHaveAttribute('aria-checked', 'mixed')
    await userEvent.click(checkbox('Edit users'))
    await userEvent.click(checkbox('Delete users'))
    await userEvent.click(checkbox('Assign roles'))
    await expect(users).toHaveAttribute('aria-checked', 'true')
    await expect(editor).toHaveAttribute('aria-checked', 'mixed')
    await userEvent.click(checkbox('Access reports'))
    await expect(editor).toHaveAttribute('aria-checked', 'true')
  },
}
