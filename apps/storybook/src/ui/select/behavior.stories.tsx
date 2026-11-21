import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { esperarIndicadorADireita } from '../../test-utils/property-surface'
import { selectControlArgs } from './select-controls.ts'
import { SelectCanvas } from './select-frame.tsx'
import {
  ComposedSelect,
  FieldSelect,
  ProjectForm,
  SelectButtonCombobox,
} from './select-layouts.tsx'
import { selectSizeNames } from './select-variants.ts'

interface BehaviorArgs {
  onOpenChange: (open: boolean, details: unknown) => void
  onSubmit: (value: FormDataEntryValue | null) => void
  onValueChange: (value: unknown, details: unknown) => void
}

const { label } = selectControlArgs

const withValue = { ...selectControlArgs, value: 'next' }

const multipleArgs = {
  ...selectControlArgs,
  defaultValue: ['next', 'vite'],
  multiple: true,
}

const getTrigger = (canvasElement: HTMLElement, name = label) =>
  within(canvasElement).getByRole('combobox', { name })

const closeList = async () => {
  await userEvent.keyboard('{Escape}')
  await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())
}

const meta = {
  args: { onOpenChange: fn(), onSubmit: fn(), onValueChange: fn() },
  argTypes: {
    onOpenChange: { control: false },
    onSubmit: { control: false },
    onValueChange: { control: false },
  },
  decorators: [SelectCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Select/Behavior',
} satisfies Meta<BehaviorArgs>

export default meta

type Story = StoryObj<BehaviorArgs>

export const OpensFromTrigger: Story = {
  render: ({ onOpenChange }) => (
    <ComposedSelect {...selectControlArgs} onOpenChange={onOpenChange} />
  ),
  play: async ({ args, canvasElement }) => {
    const trigger = getTrigger(canvasElement)
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(trigger)
    await screen.findByRole('listbox')
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await expect(args.onOpenChange).toHaveBeenCalledWith(
      true,
      expect.objectContaining({ reason: 'trigger-press' }),
    )
    await closeList()
  },
}

export const OpensBelowTrigger: Story = {
  render: () => (
    <div className="py-72">
      <ComposedSelect {...selectControlArgs} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const trigger = getTrigger(canvasElement)
    await userEvent.click(trigger)
    const listbox = await screen.findByRole('listbox')
    const positioner = listbox.closest<HTMLElement>(
      '[data-slot="select-positioner"]',
    )
    if (!positioner) throw new Error('The popup has no positioner.')
    await waitFor(() =>
      expect(positioner).toHaveAttribute('data-side', 'bottom'),
    )
    await expect(positioner).toHaveAttribute('data-align', 'start')
    await expect(positioner.getBoundingClientRect().top).toBeGreaterThanOrEqual(
      trigger.getBoundingClientRect().bottom,
    )
    await closeList()
  },
}

export const SelectsOnClick: Story = {
  render: ({ onValueChange }) => (
    <ComposedSelect {...withValue} onValueChange={onValueChange} />
  ),
  play: async ({ args, canvasElement }) => {
    const trigger = getTrigger(canvasElement)
    await expect(trigger).toHaveTextContent('Next.js')
    await userEvent.click(trigger)
    await userEvent.click(await screen.findByRole('option', { name: 'Vite' }))
    await waitFor(() => expect(trigger).toHaveTextContent('Vite'))
    await expect(args.onValueChange).toHaveBeenCalledWith(
      'vite',
      expect.objectContaining({ reason: 'item-press' }),
    )
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())
  },
}

export const CheckOnTheRight: Story = {
  render: () => <ComposedSelect {...withValue} />,
  play: async ({ canvasElement }) => {
    await userEvent.click(getTrigger(canvasElement))
    const option = await screen.findByRole('option', { name: 'Next.js' })
    await expect(option).toHaveAttribute('aria-selected', 'true')
    await expect(option).toHaveAttribute('data-selected')
    await esperarIndicadorADireita(option)
    await expect(
      screen.getByRole('option', { name: 'Vite' }).querySelector('svg'),
    ).toBeNull()
    await closeList()
  },
}

export const SelectsWithKeyboard: Story = {
  render: ({ onValueChange }) => (
    <ComposedSelect {...withValue} onValueChange={onValueChange} />
  ),
  play: async ({ args, canvasElement }) => {
    const trigger = getTrigger(canvasElement)
    trigger.focus()
    await userEvent.keyboard('{ArrowDown}')
    await screen.findByRole('listbox')
    await waitFor(() =>
      expect(screen.getByRole('option', { name: 'Next.js' })).toHaveFocus(),
    )
    await userEvent.keyboard('{ArrowDown}')
    await waitFor(() =>
      expect(screen.getByRole('option', { name: 'Vite' })).toHaveAttribute(
        'data-highlighted',
      ),
    )
    await userEvent.keyboard('{Enter}')
    await expect(args.onValueChange).toHaveBeenCalledWith(
      'vite',
      expect.anything(),
    )
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())
    await expect(trigger).toHaveTextContent('Vite')
    await waitFor(() => expect(trigger).toHaveFocus())
  },
}

export const ClosesOnEscape: Story = {
  render: ({ onOpenChange, onValueChange }) => (
    <ComposedSelect
      {...withValue}
      onOpenChange={onOpenChange}
      onValueChange={onValueChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const trigger = getTrigger(canvasElement)
    await userEvent.click(trigger)
    await screen.findByRole('listbox')
    await closeList()
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(
      false,
      expect.objectContaining({ reason: 'escape-key' }),
    )
    await expect(args.onValueChange).not.toHaveBeenCalled()
    await expect(trigger).toHaveTextContent('Next.js')
    await waitFor(() => expect(trigger).toHaveFocus())
  },
}

export const MultipleStaysOpen: Story = {
  render: () => <ComposedSelect {...multipleArgs} />,
  play: async ({ canvasElement }) => {
    const trigger = getTrigger(canvasElement)
    await userEvent.click(trigger)
    await userEvent.click(await screen.findByRole('option', { name: 'Astro' }))
    await new Promise((resolve) => setTimeout(resolve, 300))
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await expect(screen.getByRole('listbox')).toBeVisible()
    await closeList()
  },
}

export const MultipleValueIsArray: Story = {
  render: ({ onValueChange }) => (
    <ComposedSelect {...multipleArgs} onValueChange={onValueChange} />
  ),
  play: async ({ args, canvasElement }) => {
    await userEvent.click(getTrigger(canvasElement))
    await userEvent.click(await screen.findByRole('option', { name: 'Astro' }))
    await expect(args.onValueChange).toHaveBeenLastCalledWith(
      ['next', 'vite', 'astro'],
      expect.anything(),
    )
    await userEvent.click(screen.getByRole('option', { name: 'Next.js' }))
    await expect(args.onValueChange).toHaveBeenLastCalledWith(
      ['vite', 'astro'],
      expect.anything(),
    )
    await closeList()
  },
}

export const MultipleIsAnnounced: Story = {
  render: () => <ComposedSelect {...multipleArgs} />,
  play: async ({ canvasElement }) => {
    await userEvent.click(getTrigger(canvasElement))
    const listbox = await screen.findByRole('listbox')
    await expect(listbox).toHaveAttribute('aria-multiselectable', 'true')
    await expect(screen.getByRole('option', { name: 'Vite' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    await closeList()
  },
}

export const AlignsItemWithTrigger: Story = {
  render: () => <ComposedSelect {...withValue} alignItemWithTrigger />,
  play: async ({ canvasElement }) => {
    const trigger = getTrigger(canvasElement)
    await userEvent.click(trigger)
    const option = await screen.findByRole('option', { name: 'Next.js' })
    const positioner = option.closest('[data-slot="select-positioner"]')
    await waitFor(() => expect(positioner).toHaveAttribute('data-side', 'none'))
    await waitFor(() => {
      const optionBox = option.getBoundingClientRect()
      const triggerBox = trigger.getBoundingClientRect()
      expect(optionBox.top).toBeLessThan(triggerBox.bottom)
      expect(optionBox.bottom).toBeGreaterThan(triggerBox.top)
    })
    await closeList()
  },
}

export const DisabledStaysClosed: Story = {
  render: ({ onOpenChange }) => (
    <ComposedSelect
      {...selectControlArgs}
      disabled
      onOpenChange={onOpenChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const trigger = getTrigger(canvasElement)
    await expect(trigger).toBeDisabled()
    await expect(trigger).toHaveAttribute('data-disabled')
    await userEvent.click(trigger, { pointerEventsCheck: 0 })
    await expect(screen.queryByRole('listbox')).toBeNull()
    await expect(args.onOpenChange).not.toHaveBeenCalled()
  },
}

export const LabelFocusesTrigger: Story = {
  render: ({ onOpenChange }) => (
    <ComposedSelect {...selectControlArgs} onOpenChange={onOpenChange} />
  ),
  play: async ({ args, canvasElement }) => {
    const trigger = getTrigger(canvasElement)
    await userEvent.click(within(canvasElement).getByText(label))
    await waitFor(() => expect(trigger).toHaveFocus())
    await expect(screen.queryByRole('listbox')).toBeNull()
    await expect(args.onOpenChange).not.toHaveBeenCalled()
  },
}

export const NamedByFieldLabel: Story = {
  render: () => <FieldSelect />,
  play: async ({ canvasElement }) => {
    const trigger = getTrigger(canvasElement)
    await expect(trigger).toHaveAccessibleDescription(
      'The stack the new project starts from.',
    )
  },
}

export const RequiredBlocksSubmit: Story = {
  render: ({ onSubmit }) => <ProjectForm onSubmit={onSubmit} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole('button', { name: 'Create project' }),
    )
    await expect(
      await canvas.findByText('Choose a framework to create the project.'),
    ).toBeVisible()
    await expect(getTrigger(canvasElement)).toHaveAttribute(
      'aria-invalid',
      'true',
    )
    await expect(args.onSubmit).not.toHaveBeenCalled()
  },
}

export const SubmitsItsValue: Story = {
  render: ({ onSubmit }) => <ProjectForm onSubmit={onSubmit} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(getTrigger(canvasElement))
    await userEvent.click(await screen.findByRole('option', { name: 'Vite' }))
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())
    await userEvent.click(
      canvas.getByRole('button', { name: 'Create project' }),
    )
    await waitFor(() => expect(args.onSubmit).toHaveBeenCalledWith('vite'))
  },
}

export const SelectButtonShowsComboboxValue: Story = {
  render: () => <SelectButtonCombobox />,
  play: async ({ canvasElement }) => {
    const trigger = getTrigger(canvasElement)
    await expect(trigger).toHaveTextContent(selectControlArgs.placeholder)
    await userEvent.click(trigger)
    await userEvent.click(await screen.findByRole('option', { name: 'Astro' }))
    await waitFor(() => expect(trigger).toHaveTextContent('Astro'))
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())
  },
}

export const SelectButtonCheckOnTheRight: Story = {
  render: () => <SelectButtonCombobox defaultValue="astro" />,
  play: async ({ canvasElement }) => {
    await userEvent.click(getTrigger(canvasElement))
    await esperarIndicadorADireita(
      await screen.findByRole('option', { name: 'Astro' }),
    )
    await closeList()
  },
}

export const SizesStepUp: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {selectSizeNames.map((size) => (
        <ComposedSelect
          {...selectControlArgs}
          key={size}
          label={`Framework ${size}`}
          size={size}
        />
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [sm = 0, base = 0, lg = 0] = selectSizeNames.map(
      (size) =>
        getTrigger(canvasElement, `Framework ${size}`).getBoundingClientRect()
          .height,
    )
    await expect(sm).toBeLessThan(base)
    await expect(base).toBeLessThan(lg)
  },
}
