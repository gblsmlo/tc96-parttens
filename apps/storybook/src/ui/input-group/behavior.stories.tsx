import { MagnifyingGlassIcon } from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Field, FieldDescription, FieldLabel } from '@tc96/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@tc96/ui/input-group'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { inputGroupControlArgs } from './input-group-controls.ts'
import { InputGroupCanvas } from './input-group-frame.tsx'
import { ComposedInputGroup } from './input-group-layouts.tsx'

interface BehaviorArgs {
  onSearch: () => void
}

const meta = {
  args: { onSearch: fn() },
  argTypes: { onSearch: { control: false } },
  decorators: [InputGroupCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/InputGroup/Behavior',
} satisfies Meta<BehaviorArgs>

export default meta

type Story = StoryObj<BehaviorArgs>

const groupOf = (canvasElement: HTMLElement): HTMLElement => {
  const group = canvasElement.querySelector<HTMLElement>(
    '[data-slot="input-group"]',
  )
  if (!group) throw new Error('InputGroup not rendered')
  return group
}

export const TypesIntoInput: Story = {
  render: () => <ComposedInputGroup {...inputGroupControlArgs} />,
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('searchbox', {
      name: 'Search',
    })
    await userEvent.type(input, 'coss')
    await expect(input).toHaveValue('coss')
  },
}

export const JoinsField: Story = {
  render: () => (
    <Field>
      <FieldLabel>Website</FieldLabel>
      <InputGroup>
        <InputGroupInput className="*:[input]:ps-0!" type="text" />
        <InputGroupAddon>
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      <FieldDescription>Shown on your public profile.</FieldDescription>
    </Field>
  ),
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox', {
      name: 'Website',
    })
    await expect(input).toHaveAccessibleDescription(
      'Shown on your public profile.',
    )
    await expect(input).not.toHaveAttribute('data-filled')
    await userEvent.type(input, 'acme.com')
    await expect(input).toHaveAttribute('data-focused')
    await expect(input).toHaveAttribute('data-filled')
  },
}

export const NamedGroup: Story = {
  render: () => (
    <InputGroup aria-label="Search the docs">
      <InputGroupInput aria-label="Query" type="search" />
      <InputGroupAddon>
        <MagnifyingGlassIcon aria-hidden="true" />
      </InputGroupAddon>
    </InputGroup>
  ),
  play: async ({ canvasElement }) => {
    const group = within(canvasElement).getByRole('group', {
      name: 'Search the docs',
    })
    await expect(group).toHaveAttribute('data-slot', 'input-group')
    await expect(
      within(group).getByRole('searchbox', { name: 'Query' }),
    ).toBeVisible()
  },
}

export const AddonClickFocusesInput: Story = {
  render: () => (
    <ComposedInputGroup {...inputGroupControlArgs} endText="Text" />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('searchbox', { name: 'Search' })
    await expect(input).not.toHaveFocus()
    await userEvent.click(canvas.getByText('Text'))
    await expect(input).toHaveFocus()
  },
}

export const AddonButtonKeepsItsClick: Story = {
  render: ({ onSearch }) => (
    <ComposedInputGroup {...inputGroupControlArgs} button onSearch={onSearch} />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: 'Search' })
    await userEvent.click(button)
    await expect(args.onSearch).toHaveBeenCalledOnce()
    await expect(button).toHaveFocus()
    await expect(
      canvas.getByRole('searchbox', { name: 'Search' }),
    ).not.toHaveFocus()
  },
}

export const AlignPlacesAddon: Story = {
  render: () => (
    <ComposedInputGroup {...inputGroupControlArgs} icon={false} text="Text" />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('searchbox', { name: 'Search' })
    const start = canvas.getByText('Text').getBoundingClientRect()
    await expect(start.right).toBeLessThanOrEqual(
      input.getBoundingClientRect().left,
    )
  },
}

export const BlockAddonsStack: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <ComposedInputGroup
        {...inputGroupControlArgs}
        align="block-start"
        icon={false}
        placeholder="Above"
        text="Text above"
      />
      <ComposedInputGroup
        {...inputGroupControlArgs}
        align="block-end"
        icon={false}
        placeholder="Below"
        text="Text below"
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const above = canvas.getByText('Text above').getBoundingClientRect()
    const below = canvas.getByText('Text below').getBoundingClientRect()
    const upper = canvas
      .getByRole('searchbox', { name: 'Above' })
      .getBoundingClientRect()
    const lower = canvas
      .getByRole('searchbox', { name: 'Below' })
      .getBoundingClientRect()
    await expect(above.bottom).toBeLessThanOrEqual(upper.top)
    await expect(below.top).toBeGreaterThanOrEqual(lower.bottom)
  },
}

export const FocusRingOnGroup: Story = {
  render: () => <ComposedInputGroup {...inputGroupControlArgs} />,
  play: async ({ canvasElement }) => {
    const group = groupOf(canvasElement)
    const input = within(canvasElement).getByRole('searchbox', {
      name: 'Search',
    })
    await expect(getComputedStyle(group).boxShadow).not.toContain(
      '0px 0px 0px 3px',
    )
    await userEvent.tab()
    await expect(input).toHaveFocus()
    await waitFor(() =>
      expect(getComputedStyle(group).boxShadow).toContain('0px 0px 0px 3px'),
    )
  },
}

export const DisabledDimsGroup: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <ComposedInputGroup {...inputGroupControlArgs} placeholder="Enabled" />
      <ComposedInputGroup
        {...inputGroupControlArgs}
        disabled
        placeholder="Disabled"
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const enabled = canvas.getByRole('searchbox', { name: 'Enabled' })
    const disabled = canvas.getByRole('searchbox', { name: 'Disabled' })
    await expect(disabled).toHaveAttribute('data-disabled')
    await expect(
      getComputedStyle(disabled.closest('[data-slot="input-group"]') as Element)
        .opacity,
    ).toBe('0.64')
    await expect(
      getComputedStyle(enabled.closest('[data-slot="input-group"]') as Element)
        .opacity,
    ).toBe('1')
  },
}

export const InvalidTintsBorder: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <ComposedInputGroup {...inputGroupControlArgs} placeholder="Valid" />
      <ComposedInputGroup
        {...inputGroupControlArgs}
        invalid
        placeholder="Invalid"
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const valid = canvas.getByRole('searchbox', { name: 'Valid' })
    const invalid = canvas.getByRole('searchbox', { name: 'Invalid' })
    const border = (input: HTMLElement) =>
      getComputedStyle(input.closest('[data-slot="input-group"]') as Element)
        .borderTopColor
    await expect(border(invalid)).not.toBe(border(valid))
  },
}
