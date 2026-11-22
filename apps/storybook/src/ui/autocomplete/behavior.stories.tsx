import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import type { FormEvent } from 'react'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { autocompleteControlArgs } from './autocomplete-controls.ts'
import { AutocompleteCanvas } from './autocomplete-frame.tsx'
import {
  ComposedAutocomplete,
  FieldAutocomplete,
  GroupedAutocomplete,
} from './autocomplete-layouts.tsx'
import {
  autocompleteSizeNames,
  clearLabel,
  triggerLabel,
} from './autocomplete-variants.ts'

interface BehaviorArgs {
  onOpenChange: (open: boolean) => void
  onSubmit: (value: FormDataEntryValue | null) => void
  onValueChange: (value: string) => void
}

const { empty, label } = autocompleteControlArgs

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
  decorators: [AutocompleteCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Autocomplete/Behavior',
} satisfies Meta<BehaviorArgs>

export default meta

type Story = StoryObj<BehaviorArgs>

export const FiltersAsYouType: Story = {
  render: () => <ComposedAutocomplete {...autocompleteControlArgs} />,
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('combobox', { name: label })
    await expect(input).toHaveAttribute('aria-autocomplete', 'list')
    await userEvent.type(input, 'an')
    await screen.findByRole('listbox')
    await waitFor(() =>
      expect(optionNames()).toEqual(['Banana', 'Mango', 'Orange']),
    )
    await closeList()
  },
}

export const EmptyWhenNothingMatches: Story = {
  render: () => <ComposedAutocomplete {...autocompleteControlArgs} />,
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('combobox', { name: label })
    await userEvent.type(input, 'kiwi')
    const status = await screen.findByText(empty)
    await expect(status).toHaveAttribute('role', 'status')
    await expect(screen.queryAllByRole('option')).toHaveLength(0)
    await closeList()
  },
}

export const MarksTheEmptyList: Story = {
  render: () => <ComposedAutocomplete {...autocompleteControlArgs} />,
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('combobox', { name: label })
    await userEvent.type(input, 'kiwi')
    await waitFor(() => expect(input).toHaveAttribute('data-list-empty'))
    await userEvent.clear(input)
    await userEvent.type(input, 'ap')
    await waitFor(() => expect(input).not.toHaveAttribute('data-list-empty'))
    await closeList()
  },
}

export const KeepsFreeText: Story = {
  render: ({ onValueChange }) => (
    <ComposedAutocomplete
      {...autocompleteControlArgs}
      onValueChange={onValueChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const input = within(canvasElement).getByRole('combobox', { name: label })
    await userEvent.type(input, 'Kiwi')
    await expect(args.onValueChange).toHaveBeenLastCalledWith(
      'Kiwi',
      expect.objectContaining({ reason: 'input-change' }),
    )
    await closeList()
    await userEvent.tab()
    await expect(input).not.toHaveFocus()
    await expect(input).toHaveValue('Kiwi')
  },
}

export const FillsInputOnSelect: Story = {
  render: ({ onValueChange }) => (
    <ComposedAutocomplete
      {...autocompleteControlArgs}
      onValueChange={onValueChange}
    />
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
    await expect(args.onValueChange).toHaveBeenLastCalledWith(
      'Peach',
      expect.objectContaining({ reason: 'item-press' }),
    )
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())
    await expect(input).toHaveValue('Peach')
  },
}

export const ListModeKeepsTypedText: Story = {
  render: () => <ComposedAutocomplete {...autocompleteControlArgs} />,
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('combobox', { name: label })
    await userEvent.type(input, 'pea')
    await screen.findByRole('listbox')
    await userEvent.keyboard('{ArrowDown}{ArrowDown}')
    await waitFor(() =>
      expect(screen.getByRole('option', { name: 'Pear' })).toHaveAttribute(
        'data-highlighted',
      ),
    )
    await expect(input).toHaveValue('pea')
    await closeList()
  },
}

export const ClickDoesNotOpen: Story = {
  render: ({ onOpenChange }) => (
    <ComposedAutocomplete
      {...autocompleteControlArgs}
      onOpenChange={onOpenChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const input = within(canvasElement).getByRole('combobox', { name: label })
    await userEvent.click(input)
    await expect(input).toHaveFocus()
    await expect(input).toHaveAttribute('aria-expanded', 'false')
    await expect(screen.queryByRole('listbox')).toBeNull()
    await expect(args.onOpenChange).not.toHaveBeenCalled()
  },
}

export const ArrowDownOpens: Story = {
  render: ({ onOpenChange }) => (
    <ComposedAutocomplete
      {...autocompleteControlArgs}
      onOpenChange={onOpenChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const input = within(canvasElement).getByRole('combobox', { name: label })
    await userEvent.click(input)
    await expect(screen.queryByRole('listbox')).toBeNull()
    await userEvent.keyboard('{ArrowDown}')
    await screen.findByRole('listbox')
    await expect(input).toHaveAttribute('aria-expanded', 'true')
    await expect(screen.getAllByRole('option')).toHaveLength(8)
    await expect(args.onOpenChange).toHaveBeenCalledWith(
      true,
      expect.objectContaining({ reason: 'list-navigation' }),
    )
    await closeList()
  },
}

export const OpensFromTrigger: Story = {
  render: ({ onOpenChange }) => (
    <ComposedAutocomplete
      {...autocompleteControlArgs}
      onOpenChange={onOpenChange}
      showTrigger
    />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('combobox', { name: label })
    await userEvent.click(canvas.getByRole('button', { name: triggerLabel }))
    await screen.findByRole('listbox')
    await expect(input).toHaveAttribute('aria-expanded', 'true')
    await expect(screen.getAllByRole('option')).toHaveLength(8)
    await expect(args.onOpenChange).toHaveBeenCalledWith(
      true,
      expect.objectContaining({ reason: 'trigger-press' }),
    )
    await closeList()
  },
}

export const ClosesOnEscape: Story = {
  render: ({ onOpenChange }) => (
    <ComposedAutocomplete
      {...autocompleteControlArgs}
      onOpenChange={onOpenChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const input = within(canvasElement).getByRole('combobox', { name: label })
    await userEvent.type(input, 'ap')
    await screen.findByRole('listbox')
    await closeList()
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(
      false,
      expect.objectContaining({ reason: 'escape-key' }),
    )
    await expect(input).toHaveAttribute('aria-expanded', 'false')
    await expect(input).toHaveValue('ap')
  },
}

export const ClearsText: Story = {
  render: ({ onValueChange }) => (
    <ComposedAutocomplete
      {...autocompleteControlArgs}
      defaultValue="Mango"
      onValueChange={onValueChange}
      showClear
    />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('combobox', { name: label })
    await expect(input).toHaveValue('Mango')
    await userEvent.click(canvas.getByRole('button', { name: clearLabel }))
    await expect(args.onValueChange).toHaveBeenLastCalledWith(
      '',
      expect.objectContaining({ reason: 'clear-press' }),
    )
    await expect(input).toHaveValue('')
    await waitFor(() =>
      expect(canvas.queryByRole('button', { name: clearLabel })).toBeNull(),
    )
  },
}

export const TriggerHidesWhileClearShows: Story = {
  render: () => (
    <ComposedAutocomplete
      {...autocompleteControlArgs}
      defaultValue="Mango"
      showClear
      showTrigger
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvasElement.querySelector(
      '[data-slot="autocomplete-trigger"]',
    )
    await expect(canvas.getByRole('button', { name: clearLabel })).toBeVisible()
    await expect(trigger).not.toBeVisible()
    await userEvent.clear(canvas.getByRole('combobox', { name: label }))
    await waitFor(() =>
      expect(canvas.queryByRole('button', { name: clearLabel })).toBeNull(),
    )
    await expect(trigger).toBeVisible()
    await closeList()
  },
}

export const CompletesInline: Story = {
  render: () => (
    <ComposedAutocomplete {...autocompleteControlArgs} mode="both" />
  ),
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('combobox', { name: label })
    await expect(input).toHaveAttribute('aria-autocomplete', 'both')
    await userEvent.type(input, 'pea')
    await waitFor(() => expect(optionNames()).toEqual(['Peach', 'Pear']))
    await userEvent.keyboard('{ArrowDown}')
    await waitFor(() => expect(input).toHaveValue('Peach'))
    await userEvent.keyboard('{ArrowDown}')
    await waitFor(() => expect(input).toHaveValue('Pear'))
    await expect(optionNames()).toEqual(['Peach', 'Pear'])
    await closeList()
  },
}

export const AutoHighlightsFirstMatch: Story = {
  render: ({ onValueChange }) => (
    <ComposedAutocomplete
      {...autocompleteControlArgs}
      autoHighlight
      onValueChange={onValueChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const input = within(canvasElement).getByRole('combobox', { name: label })
    await userEvent.type(input, 'an')
    await waitFor(() =>
      expect(screen.getByRole('option', { name: 'Banana' })).toHaveAttribute(
        'data-highlighted',
      ),
    )
    await userEvent.keyboard('{Enter}')
    await expect(args.onValueChange).toHaveBeenLastCalledWith(
      'Banana',
      expect.objectContaining({ reason: 'item-press' }),
    )
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())
    await expect(input).toHaveValue('Banana')
  },
}

export const GroupsFollowTheFilter: Story = {
  render: () => <GroupedAutocomplete />,
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

export const LimitsTheList: Story = {
  render: () => <ComposedAutocomplete {...autocompleteControlArgs} limit={3} />,
  play: async ({ canvasElement }) => {
    await userEvent.type(
      within(canvasElement).getByRole('combobox', { name: label }),
      'a',
    )
    await waitFor(() =>
      expect(optionNames()).toEqual(['Apple', 'Banana', 'Grape']),
    )
    await closeList()
  },
}

export const DisabledStaysClosed: Story = {
  render: ({ onOpenChange }) => (
    <ComposedAutocomplete
      {...autocompleteControlArgs}
      disabled
      onOpenChange={onOpenChange}
      showTrigger
    />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('combobox', { name: label })
    const trigger = canvas.getByRole('button', { name: triggerLabel })
    await expect(input).toBeDisabled()
    await expect(trigger).toBeDisabled()
    await userEvent.click(trigger, { pointerEventsCheck: 0 })
    await expect(screen.queryByRole('listbox')).toBeNull()
    await expect(args.onOpenChange).not.toHaveBeenCalled()
  },
}

export const NamedByFieldLabel: Story = {
  render: () => <FieldAutocomplete />,
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('combobox', { name: label })
    await expect(input).toHaveAccessibleDescription(
      'Any fruit, even one not on the list.',
    )
  },
}

export const SubmitsTheText: Story = {
  render: ({ onSubmit }) => (
    <form
      className="flex flex-col items-start gap-4"
      onSubmit={(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        onSubmit(new FormData(event.currentTarget).get('fruit'))
      }}
    >
      <FieldAutocomplete name="fruit" />
      <Button type="submit">Save</Button>
    </form>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(canvas.getByRole('combobox', { name: label }), 'man')
    await userEvent.click(await screen.findByRole('option', { name: 'Mango' }))
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())
    await userEvent.click(canvas.getByRole('button', { name: 'Save' }))
    await expect(args.onSubmit).toHaveBeenLastCalledWith('Mango')
    await userEvent.clear(canvas.getByRole('combobox', { name: label }))
    await userEvent.type(canvas.getByRole('combobox', { name: label }), 'Kiwi')
    await closeList()
    await userEvent.click(canvas.getByRole('button', { name: 'Save' }))
    await expect(args.onSubmit).toHaveBeenLastCalledWith('Kiwi')
  },
}

export const SizesStepUp: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {autocompleteSizeNames.map((size) => (
        <ComposedAutocomplete
          {...autocompleteControlArgs}
          key={size}
          label={`Fruit ${size}`}
          size={size}
        />
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const heights = autocompleteSizeNames.map((size) => {
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
