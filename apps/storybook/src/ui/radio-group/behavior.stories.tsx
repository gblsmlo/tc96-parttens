import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import { Form } from '@tc96/ui/form'
import { expect, fn, userEvent, within } from 'storybook/test'
import { radioGroupControlArgs } from './radio-group-controls.ts'
import { ComposedRadioGroup, FieldRadioGroup } from './radio-group-layouts.tsx'

interface BehaviorArgs {
  onSubmit: (values: Record<string, FormDataEntryValue | null>) => void
  onValueChange: (value: string) => void
}

const meta = {
  args: { onSubmit: fn(), onValueChange: fn() },
  argTypes: {
    onSubmit: { control: false },
    onValueChange: { control: false },
  },
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/RadioGroup/Behavior',
} satisfies Meta<BehaviorArgs>

export default meta

type Story = StoryObj<BehaviorArgs>

const radioNamed = (canvasElement: HTMLElement, name: string) =>
  within(canvasElement).getByRole('radio', { name })

const RequiredForm = ({ onSubmit }: Pick<BehaviorArgs, 'onSubmit'>) => (
  <Form
    className="flex flex-col items-start gap-4"
    onSubmit={(event) => {
      event.preventDefault()
      onSubmit({
        framework: new FormData(event.currentTarget).get('framework'),
      })
    }}
  >
    <FieldRadioGroup required />
    <Button type="submit">Save</Button>
  </Form>
)

export const RadiosNamedByWrappingLabel: Story = {
  render: () => <ComposedRadioGroup {...radioGroupControlArgs} />,
  play: async ({ canvasElement }) => {
    await expect(radioNamed(canvasElement, 'Next.js')).toBeVisible()
    await expect(radioNamed(canvasElement, 'Vite')).toBeVisible()
    await expect(radioNamed(canvasElement, 'Astro')).toBeVisible()
  },
}

export const RadioNamedByLabelFor: Story = {
  render: () => <ComposedRadioGroup {...radioGroupControlArgs} description />,
  play: async ({ canvasElement }) => {
    await expect(radioNamed(canvasElement, 'Next.js')).toBeVisible()
    await expect(radioNamed(canvasElement, 'Vite')).toBeVisible()
    await expect(radioNamed(canvasElement, 'Astro')).toBeVisible()
  },
}

export const SelectsOnClick: Story = {
  render: ({ onValueChange }) => (
    <ComposedRadioGroup
      {...radioGroupControlArgs}
      onValueChange={onValueChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const vite = radioNamed(canvasElement, 'Vite')
    await userEvent.click(vite)
    await expect(args.onValueChange).toHaveBeenCalledOnce()
    await expect(args.onValueChange).toHaveBeenCalledWith(
      'vite',
      expect.anything(),
    )
    await expect(vite).toBeChecked()
    await expect(radioNamed(canvasElement, 'Next.js')).not.toBeChecked()
  },
}

export const SelectedClickKeepsValue: Story = {
  render: ({ onValueChange }) => (
    <ComposedRadioGroup
      {...radioGroupControlArgs}
      onValueChange={onValueChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const next = radioNamed(canvasElement, 'Next.js')
    await userEvent.click(next)
    await expect(next).toBeChecked()
    await expect(args.onValueChange).not.toHaveBeenCalled()
  },
}

export const IndicatorFollowsSelection: Story = {
  render: () => <ComposedRadioGroup {...radioGroupControlArgs} />,
  play: async ({ canvasElement }) => {
    const indicatorOf = (name: string) =>
      radioNamed(canvasElement, name).querySelector(
        '[data-slot="radio-indicator"]',
      )
    await expect(indicatorOf('Next.js')).not.toBeNull()
    await expect(indicatorOf('Astro')).toBeNull()
    await userEvent.click(radioNamed(canvasElement, 'Astro'))
    await expect(indicatorOf('Astro')).not.toBeNull()
    await expect(radioNamed(canvasElement, 'Astro')).toHaveAttribute(
      'data-checked',
    )
    await expect(radioNamed(canvasElement, 'Next.js')).toHaveAttribute(
      'data-unchecked',
    )
  },
}

export const LabelSelectsItem: Story = {
  render: () => <ComposedRadioGroup {...radioGroupControlArgs} />,
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByText('Astro'))
    await expect(radioNamed(canvasElement, 'Astro')).toBeChecked()
  },
}

export const TabStopsOnSelected: Story = {
  render: () => (
    <ComposedRadioGroup {...radioGroupControlArgs} defaultValue="vite" />
  ),
  play: async ({ canvasElement }) => {
    await userEvent.tab()
    await expect(radioNamed(canvasElement, 'Vite')).toHaveFocus()
    await userEvent.tab()
    for (const radio of within(canvasElement).getAllByRole('radio')) {
      await expect(radio).not.toHaveFocus()
    }
  },
}

export const TabStopsOnFirstWhenEmpty: Story = {
  render: () => (
    <ComposedRadioGroup {...radioGroupControlArgs} defaultValue="none" />
  ),
  play: async ({ canvasElement }) => {
    const next = radioNamed(canvasElement, 'Next.js')
    await userEvent.tab()
    await expect(next).toHaveFocus()
    await expect(next).not.toBeChecked()
  },
}

export const ArrowKeysSelect: Story = {
  render: ({ onValueChange }) => (
    <ComposedRadioGroup
      {...radioGroupControlArgs}
      onValueChange={onValueChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const next = radioNamed(canvasElement, 'Next.js')
    const vite = radioNamed(canvasElement, 'Vite')
    await userEvent.tab()
    await userEvent.keyboard('{ArrowDown}')
    await expect(vite).toHaveFocus()
    await expect(vite).toBeChecked()
    await expect(args.onValueChange).toHaveBeenLastCalledWith(
      'vite',
      expect.anything(),
    )
    await userEvent.keyboard('{ArrowUp}')
    await expect(next).toHaveFocus()
    await expect(next).toBeChecked()
    await expect(args.onValueChange).toHaveBeenLastCalledWith(
      'next',
      expect.anything(),
    )
  },
}

export const ArrowKeysWrap: Story = {
  render: () => <ComposedRadioGroup {...radioGroupControlArgs} />,
  play: async ({ canvasElement }) => {
    const next = radioNamed(canvasElement, 'Next.js')
    const astro = radioNamed(canvasElement, 'Astro')
    await userEvent.tab()
    await userEvent.keyboard('{ArrowUp}')
    await expect(astro).toHaveFocus()
    await expect(astro).toBeChecked()
    await userEvent.keyboard('{ArrowDown}')
    await expect(next).toHaveFocus()
    await expect(next).toBeChecked()
  },
}

export const SpaceSelects: Story = {
  render: () => (
    <ComposedRadioGroup {...radioGroupControlArgs} defaultValue="none" />
  ),
  play: async ({ canvasElement }) => {
    await userEvent.tab()
    await userEvent.keyboard(' ')
    await expect(radioNamed(canvasElement, 'Next.js')).toBeChecked()
  },
}

export const EnterDoesNotSelect: Story = {
  render: () => (
    <ComposedRadioGroup {...radioGroupControlArgs} defaultValue="none" />
  ),
  play: async ({ canvasElement }) => {
    const next = radioNamed(canvasElement, 'Next.js')
    await userEvent.tab()
    await expect(next).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await expect(next).not.toBeChecked()
  },
}

export const DisabledItemIgnoresClick: Story = {
  render: ({ onValueChange }) => (
    <ComposedRadioGroup
      {...radioGroupControlArgs}
      disabledItem
      onValueChange={onValueChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const vite = radioNamed(canvasElement, 'Vite')
    await expect(vite).toHaveAttribute('data-disabled')
    await expect(vite).toHaveAttribute('aria-disabled', 'true')
    await userEvent.click(vite)
    await expect(vite).not.toBeChecked()
    await expect(args.onValueChange).not.toHaveBeenCalled()
  },
}

export const ArrowKeysSkipDisabledItem: Story = {
  render: () => <ComposedRadioGroup {...radioGroupControlArgs} disabledItem />,
  play: async ({ canvasElement }) => {
    const astro = radioNamed(canvasElement, 'Astro')
    await userEvent.tab()
    await userEvent.keyboard('{ArrowDown}')
    await expect(astro).toHaveFocus()
    await expect(astro).toBeChecked()
    await expect(radioNamed(canvasElement, 'Vite')).not.toBeChecked()
  },
}

export const DisabledGroupDisablesEveryRadio: Story = {
  render: () => <ComposedRadioGroup {...radioGroupControlArgs} disabled />,
  play: async ({ canvasElement }) => {
    const group = within(canvasElement).getByRole('radiogroup')
    await expect(group).toHaveAttribute('data-disabled')
    await expect(group).toHaveAttribute('aria-disabled', 'true')
    for (const radio of within(group).getAllByRole('radio')) {
      await expect(radio).toHaveAttribute('data-disabled')
      await expect(radio).toHaveAttribute('aria-disabled', 'true')
    }
  },
}

export const DisabledGroupIgnoresClick: Story = {
  render: ({ onValueChange }) => (
    <ComposedRadioGroup
      {...radioGroupControlArgs}
      disabled
      onValueChange={onValueChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const vite = radioNamed(canvasElement, 'Vite')
    await userEvent.click(vite)
    await expect(vite).not.toBeChecked()
    await expect(args.onValueChange).not.toHaveBeenCalled()
  },
}

export const DisabledGroupIgnoresLabelClick: Story = {
  render: ({ onValueChange }) => (
    <ComposedRadioGroup
      {...radioGroupControlArgs}
      disabled
      onValueChange={onValueChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    await userEvent.click(within(canvasElement).getByText('Vite'))
    await expect(radioNamed(canvasElement, 'Vite')).not.toBeChecked()
    await expect(args.onValueChange).not.toHaveBeenCalled()
  },
}

export const DisabledGroupKeepsTabStop: Story = {
  render: () => <ComposedRadioGroup {...radioGroupControlArgs} disabled />,
  play: async ({ canvasElement }) => {
    await userEvent.tab()
    await expect(radioNamed(canvasElement, 'Next.js')).toHaveFocus()
  },
}

export const DisabledGroupIgnoresArrowKeys: Story = {
  render: ({ onValueChange }) => (
    <ComposedRadioGroup
      {...radioGroupControlArgs}
      disabled
      onValueChange={onValueChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    await userEvent.tab()
    await userEvent.keyboard('{ArrowDown}')
    await expect(radioNamed(canvasElement, 'Next.js')).toBeChecked()
    await expect(radioNamed(canvasElement, 'Vite')).not.toBeChecked()
    await expect(args.onValueChange).not.toHaveBeenCalled()
  },
}

export const ReadOnlyIgnoresClick: Story = {
  render: ({ onValueChange }) => (
    <ComposedRadioGroup
      {...radioGroupControlArgs}
      onValueChange={onValueChange}
      readOnly
    />
  ),
  play: async ({ args, canvasElement }) => {
    const astro = radioNamed(canvasElement, 'Astro')
    await expect(within(canvasElement).getByRole('radiogroup')).toHaveAttribute(
      'aria-readonly',
      'true',
    )
    await expect(astro).toHaveAttribute('data-readonly')
    await userEvent.click(astro)
    await expect(astro).not.toBeChecked()
    await expect(radioNamed(canvasElement, 'Next.js')).toBeChecked()
    await expect(args.onValueChange).not.toHaveBeenCalled()
  },
}

export const ReadOnlyArrowKeysMoveFocusOnly: Story = {
  render: ({ onValueChange }) => (
    <ComposedRadioGroup
      {...radioGroupControlArgs}
      onValueChange={onValueChange}
      readOnly
    />
  ),
  play: async ({ args, canvasElement }) => {
    const vite = radioNamed(canvasElement, 'Vite')
    await userEvent.tab()
    await userEvent.keyboard('{ArrowDown}')
    await expect(vite).toHaveFocus()
    await expect(vite).not.toBeChecked()
    await expect(radioNamed(canvasElement, 'Next.js')).toBeChecked()
    await expect(args.onValueChange).not.toHaveBeenCalled()
  },
}

export const SubmitsSelectedValue: Story = {
  render: ({ onSubmit }) => (
    <Form
      className="flex flex-col items-start gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit({
          framework: new FormData(event.currentTarget).get('framework'),
        })
      }}
    >
      <ComposedRadioGroup {...radioGroupControlArgs} name="framework" />
      <Button type="submit">Save</Button>
    </Form>
  ),
  play: async ({ args, canvasElement }) => {
    const save = within(canvasElement).getByRole('button', { name: 'Save' })
    await userEvent.click(save)
    await expect(args.onSubmit).toHaveBeenLastCalledWith({ framework: 'next' })
    await userEvent.click(radioNamed(canvasElement, 'Astro'))
    await userEvent.click(save)
    await expect(args.onSubmit).toHaveBeenLastCalledWith({
      framework: 'astro',
    })
  },
}

export const NamedByLegend: Story = {
  render: () => <FieldRadioGroup />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('radiogroup')).toHaveAttribute(
      'aria-labelledby',
      canvas.getByText('Framework').id,
    )
  },
}

export const DescribedByFieldDescription: Story = {
  render: () => <FieldRadioGroup />,
  play: async ({ canvasElement }) => {
    const description = 'Pick the framework the project starts on.'
    await expect(
      within(canvasElement).getByRole('radiogroup'),
    ).toHaveAccessibleDescription(description)
    await expect(radioNamed(canvasElement, 'Vite')).toHaveAccessibleDescription(
      description,
    )
  },
}

export const RequiredSetsAriaRequired: Story = {
  render: () => <FieldRadioGroup required />,
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('radiogroup')).toHaveAttribute(
      'aria-required',
      'true',
    )
  },
}

export const RequiredBlocksEmptySubmit: Story = {
  render: ({ onSubmit }) => <RequiredForm onSubmit={onSubmit} />,
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Save' }),
    )
    await expect(args.onSubmit).not.toHaveBeenCalled()
  },
}

export const RequiredShowsFieldError: Story = {
  render: ({ onSubmit }) => <RequiredForm onSubmit={onSubmit} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.queryByText('Choose a framework to continue.'),
    ).toBeNull()
    await userEvent.click(canvas.getByRole('button', { name: 'Save' }))
    await expect(
      canvas.getByText('Choose a framework to continue.'),
    ).toBeVisible()
  },
}

export const RequiredMarksRadiosInvalid: Story = {
  render: ({ onSubmit }) => <RequiredForm onSubmit={onSubmit} />,
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Save' }),
    )
    for (const radio of within(canvasElement).getAllByRole('radio')) {
      await expect(radio).toHaveAttribute('aria-invalid', 'true')
    }
  },
}

export const SelectionClearsInvalid: Story = {
  render: ({ onSubmit }) => <RequiredForm onSubmit={onSubmit} />,
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Save' }),
    )
    await expect(radioNamed(canvasElement, 'Next.js')).toHaveAttribute(
      'aria-invalid',
      'true',
    )
    await userEvent.click(radioNamed(canvasElement, 'Vite'))
    await expect(radioNamed(canvasElement, 'Next.js')).not.toHaveAttribute(
      'aria-invalid',
    )
  },
}

export const RequiredSubmitsAfterSelection: Story = {
  render: ({ onSubmit }) => <RequiredForm onSubmit={onSubmit} />,
  play: async ({ args, canvasElement }) => {
    await userEvent.click(radioNamed(canvasElement, 'Vite'))
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Save' }),
    )
    await expect(args.onSubmit).toHaveBeenCalledOnce()
    await expect(args.onSubmit).toHaveBeenCalledWith({ framework: 'vite' })
  },
}
