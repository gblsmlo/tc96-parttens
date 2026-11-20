import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import type { FormEvent } from 'react'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { comboboxControlArgs } from './combobox-controls.ts'
import { ComboboxCanvas } from './combobox-frame.tsx'
import {
  ComposedCombobox,
  FieldCombobox,
  GroupedCombobox,
  InputInsidePopupCombobox,
} from './combobox-layouts.tsx'
import { comboboxSizeNames } from './combobox-variants.ts'

interface BehaviorArgs {
  onOpenChange: (open: boolean) => void
  onSubmit: (value: FormDataEntryValue | null) => void
  onValueChange: (value: unknown) => void
}

const { empty, label } = comboboxControlArgs

const optionNames = () =>
  screen.getAllByRole('option').map((option) => option.textContent)

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
  decorators: [ComboboxCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Combobox/Behavior',
} satisfies Meta<BehaviorArgs>

export default meta

type Story = StoryObj<BehaviorArgs>

export const FiltersAsYouType: Story = {
  render: () => <ComposedCombobox {...comboboxControlArgs} />,
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('combobox', { name: label })
    await userEvent.type(input, 'an')
    await screen.findByRole('listbox')
    await waitFor(() =>
      expect(optionNames()).toEqual(['Banana', 'Mango', 'Orange']),
    )
    await closeList()
  },
}

export const EmptyWhenNothingMatches: Story = {
  render: () => <ComposedCombobox {...comboboxControlArgs} />,
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('combobox', { name: label })
    await userEvent.type(input, 'kiwi')
    const status = await screen.findByText(empty)
    await expect(status).toHaveAttribute('role', 'status')
    await expect(status).toHaveAttribute('data-slot', 'combobox-empty')
    await expect(screen.queryAllByRole('option')).toHaveLength(0)
    await expect(screen.getByRole('listbox')).toHaveAttribute('data-empty')
    await expect(input).toHaveAttribute('data-list-empty')
    await closeList()
  },
}

export const SelectsWithKeyboard: Story = {
  render: ({ onValueChange }) => (
    <ComposedCombobox {...comboboxControlArgs} onValueChange={onValueChange} />
  ),
  play: async ({ args, canvasElement }) => {
    const input = within(canvasElement).getByRole('combobox', { name: label })
    await userEvent.type(input, 'pea')
    await screen.findByRole('listbox')
    await userEvent.keyboard('{ArrowDown}')
    await waitFor(() =>
      expect(screen.getByRole('option', { name: 'Peach' })).toHaveAttribute(
        'data-highlighted',
      ),
    )
    await userEvent.keyboard('{Enter}')
    await expect(args.onValueChange).toHaveBeenCalledWith(
      { label: 'Peach', value: 'peach' },
      expect.objectContaining({ reason: 'item-press' }),
    )
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())
    await expect(input).toHaveValue('Peach')
  },
}

export const GroupsFollowTheFilter: Story = {
  render: () => <GroupedCombobox />,
  play: async ({ canvasElement }) => {
    for (const name of ['Pome fruits', 'Stone fruits', 'Tropical fruits']) {
      await expect(await screen.findByRole('group', { name })).toBeVisible()
    }
    await userEvent.type(
      within(canvasElement).getByRole('combobox', { name: label }),
      'apple',
    )
    await waitFor(() => expect(optionNames()).toEqual(['Apple']))
    await expect(
      screen.getByRole('group', { name: 'Pome fruits' }),
    ).toBeVisible()
    await expect(
      screen.queryByRole('group', { name: 'Stone fruits' }),
    ).toBeNull()
    await closeList()
  },
}

export const CheckOnTheRight: Story = {
  render: () => (
    <ComposedCombobox {...comboboxControlArgs} defaultValue={['mango']} open />
  ),
  play: async () => {
    const option = await screen.findByRole('option', { name: 'Mango' })
    await expect(option).toHaveAttribute('aria-selected', 'true')
    await expect(option).toHaveAttribute('data-selected')
    const text = within(option).getByText('Mango').getBoundingClientRect()
    const check = option.querySelector('svg')?.getBoundingClientRect()
    await expect(check?.left).toBeGreaterThan(text.right)
    await expect(
      screen.getByRole('option', { name: 'Apple' }).querySelector('svg'),
    ).toBeNull()
    await closeList()
  },
}

export const OpensFromTrigger: Story = {
  render: ({ onOpenChange }) => (
    <ComposedCombobox {...comboboxControlArgs} onOpenChange={onOpenChange} />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('combobox', { name: label })
    await expect(input).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(canvas.getByRole('button', { name: 'Show options' }))
    await screen.findByRole('listbox')
    await expect(input).toHaveAttribute('aria-expanded', 'true')
    await expect(args.onOpenChange).toHaveBeenCalledWith(
      true,
      expect.objectContaining({ reason: 'trigger-press' }),
    )
    await closeList()
  },
}

export const ClosesOnEscape: Story = {
  render: ({ onOpenChange }) => (
    <ComposedCombobox {...comboboxControlArgs} onOpenChange={onOpenChange} />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('combobox', { name: label })
    await userEvent.click(canvas.getByRole('button', { name: 'Show options' }))
    await screen.findByRole('listbox')
    await closeList()
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(
      false,
      expect.objectContaining({ reason: 'escape-key' }),
    )
    await expect(input).toHaveAttribute('aria-expanded', 'false')
  },
}

export const ClearsValue: Story = {
  render: ({ onValueChange }) => (
    <ComposedCombobox
      {...comboboxControlArgs}
      defaultValue={['mango']}
      onValueChange={onValueChange}
      showClear
    />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('combobox', { name: label })
    await expect(input).toHaveValue('Mango')
    await expect(
      canvas.queryByRole('button', { name: 'Show options' }),
    ).toBeNull()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Clear selection' }),
    )
    await expect(args.onValueChange).toHaveBeenCalledWith(
      null,
      expect.objectContaining({ reason: 'clear-press' }),
    )
    await expect(input).toHaveValue('')
    await waitFor(() =>
      expect(
        canvas.queryByRole('button', { name: 'Clear selection' }),
      ).toBeNull(),
    )
    await expect(
      canvas.getByRole('button', { name: 'Show options' }),
    ).toBeVisible()
    await expect(screen.queryByRole('listbox')).toBeNull()
  },
}

export const ChipsFollowValue: Story = {
  render: ({ onValueChange }) => (
    <ComposedCombobox
      {...comboboxControlArgs}
      defaultValue={['apple', 'mango']}
      multiple
      onValueChange={onValueChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Remove Apple' }))
    await expect(args.onValueChange).toHaveBeenLastCalledWith(
      [{ label: 'Mango', value: 'mango' }],
      expect.objectContaining({ reason: 'chip-remove-press' }),
    )
    await waitFor(() =>
      expect(canvas.queryByRole('button', { name: 'Remove Apple' })).toBeNull(),
    )
    await userEvent.type(canvas.getByRole('combobox', { name: label }), 'peach')
    const listbox = await screen.findByRole('listbox')
    await expect(listbox).toHaveAttribute('aria-multiselectable', 'true')
    await userEvent.click(screen.getByRole('option', { name: 'Peach' }))
    await expect(args.onValueChange).toHaveBeenLastCalledWith(
      [
        { label: 'Mango', value: 'mango' },
        { label: 'Peach', value: 'peach' },
      ],
      expect.objectContaining({ reason: 'item-press' }),
    )
    await expect(
      canvas.getByRole('button', { name: 'Remove Peach' }),
    ).toBeVisible()
    await closeList()
  },
}

export const DisabledStaysClosed: Story = {
  render: ({ onOpenChange }) => (
    <ComposedCombobox
      {...comboboxControlArgs}
      disabled
      onOpenChange={onOpenChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('combobox', { name: label })
    const trigger = canvas.getByRole('button', { name: 'Show options' })
    await expect(input).toBeDisabled()
    await expect(trigger).toBeDisabled()
    await userEvent.click(trigger, { pointerEventsCheck: 0 })
    await expect(screen.queryByRole('listbox')).toBeNull()
    await expect(args.onOpenChange).not.toHaveBeenCalled()
  },
}

export const NamedByFieldLabel: Story = {
  render: () => <FieldCombobox />,
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('combobox', { name: label })
    await expect(input).toHaveAccessibleDescription(
      'Pick the fruit of the week.',
    )
    await expect(input).toHaveAttribute('data-slot', 'combobox-input')
  },
}

export const SubmitsItsValue: Story = {
  render: ({ onSubmit }) => (
    <form
      className="flex flex-col items-start gap-4"
      onSubmit={(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        onSubmit(new FormData(event.currentTarget).get('fruit'))
      }}
    >
      <FieldCombobox name="fruit" />
      <Button type="submit">Save</Button>
    </form>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(canvas.getByRole('combobox', { name: label }), 'man')
    await userEvent.click(await screen.findByRole('option', { name: 'Mango' }))
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())
    await userEvent.click(canvas.getByRole('button', { name: 'Save' }))
    await expect(args.onSubmit).toHaveBeenCalledWith('mango')
  },
}

export const SearchInsidePopup: Story = {
  render: () => <InputInsidePopupCombobox defaultOpen={false} />,
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('combobox', { name: label })
    await expect(trigger).toHaveAttribute('aria-haspopup', 'dialog')
    await userEvent.click(trigger)
    const dialog = await screen.findByRole('dialog', { name: label })
    const search = within(dialog).getByRole('combobox', {
      name: 'Search fruit',
    })
    await waitFor(() => expect(search).toHaveFocus())
    await userEvent.type(search, 'pea')
    await waitFor(() => expect(optionNames()).toEqual(['Peach', 'Pear']))
    await userEvent.click(screen.getByRole('option', { name: 'Pear' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    await expect(trigger).toHaveTextContent('Pear')
  },
}

export const SizesStepUp: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {comboboxSizeNames.map((size) => (
        <ComposedCombobox
          {...comboboxControlArgs}
          key={size}
          label={`Fruit ${size}`}
          size={size}
        />
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const heights = comboboxSizeNames.map((size) => {
      const input = within(canvasElement).getByRole('combobox', {
        name: `Fruit ${size}`,
      })
      return input.getBoundingClientRect().height
    })
    const [sm = 0, base = 0, lg = 0] = heights
    await expect(sm).toBeLessThan(base)
    await expect(base).toBeLessThan(lg)
  },
}
