import { UserIcon, UserPlusIcon } from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { PersonProperty, type PersonPropertyOption } from '@tc96/ui/patterns'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { isIcon } from '../../../../test-utils/is-icon'
import {
  esperarAvatarComAresta,
  esperarSuperficieDeBadge,
  esperarSuperficiePlana,
} from '../../../../test-utils/property-surface'
import { PersonCanvas } from './person-canvas.tsx'

type Person = 'ana' | 'gm'

const options: PersonPropertyOption<Person>[] = [
  { label: 'Gabriel Melo', supportingLabel: 'Dono', value: 'gm' },
  { fallback: 'A!', label: 'Ana Souza', value: 'ana' },
]

const meta = {
  args: {
    ariaLabel: 'Responsável',
    options,
    readOnly: true,
    value: 'gm',
  },
  component: PersonProperty<Person>,
  decorators: [PersonCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Person/Behavior',
} satisfies Meta<typeof PersonProperty<Person>>

export default meta

type Story = StoryObj<typeof meta>

const fallbacks = (canvasElement: HTMLElement) =>
  Array.from(
    canvasElement.querySelectorAll('[data-slot="avatar-fallback"]'),
    (fallback) => fallback.textContent,
  )

const avatarIn = (element: HTMLElement) => {
  const avatar = element.querySelector<HTMLElement>('[data-slot="avatar"]')
  if (!avatar) throw new Error('The story did not render an avatar.')
  return avatar
}

const listClosed = () =>
  waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())

export const BadgeSurfaceWithXsAvatar: Story = {
  play: async ({ canvasElement }) => {
    await esperarSuperficieDeBadge(canvasElement)
    await expect(avatarIn(canvasElement)).toHaveAttribute('data-size', 'xs')
    await esperarAvatarComAresta(canvasElement, 16)
  },
}

export const PlainSurfaceHasNoFill: Story = {
  args: { variant: 'plain' },
  play: async ({ canvasElement }) => {
    await esperarSuperficiePlana(canvasElement)
    await esperarAvatarComAresta(canvasElement, 16)
  },
}

export const ReadOnlyIsNamedImage: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(
      canvas.getByRole('img', { name: 'Responsável: Gabriel Melo' }),
    ).toHaveAttribute('data-slot', 'property-surface')
    await expect(canvas.queryByRole('combobox')).toBeNull()
  },
}

export const EditableIsNamedCombobox: Story = {
  args: { onValueChange: fn(), readOnly: false },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(
      canvas.getByRole('combobox', { name: 'Responsável: Gabriel Melo' }),
    ).toHaveAttribute('data-slot', 'property-surface')
    await expect(canvas.queryByRole('img')).toBeNull()
    await expect(args.onValueChange).not.toHaveBeenCalled()
  },
}

export const AvatarOnlyKeepsAccessibleLabel: Story = {
  args: { display: 'avatar', value: 'ana', variant: 'plain' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(
      canvas.getByRole('img', { name: 'Responsável: Ana Souza' }),
    ).toBeInTheDocument()
    await expect(canvas.queryByText('Ana Souza')).toBeNull()
    await esperarAvatarComAresta(canvasElement, 16)
  },
}

export const EmptyShowsPlaceholder: Story = {
  args: { value: null },
  play: async ({ canvasElement }) => {
    const value = within(canvasElement).getByRole('img', {
      name: 'Responsável: Sem responsável',
    })

    await expect(value.textContent).toBe('Sem responsável')
    await expect(value).toHaveAttribute('data-empty', 'true')
    await expect(isIcon(value.querySelector('svg'), UserPlusIcon)).toBe(true)
  },
}

export const EmptyAvatarStaysIdentifiable: Story = {
  args: { display: 'avatar', value: null, variant: 'plain' },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('img', {
        name: 'Responsável: Sem responsável',
      }),
    ).toBeInTheDocument()
    await expect(fallbacks(canvasElement)).toEqual([''])
    await expect(
      isIcon(
        canvasElement.querySelector('[data-slot="avatar-fallback"] svg'),
        UserIcon,
      ),
    ).toBe(true)
  },
}

export const ListUsesSmAvatars: Story = {
  args: { onValueChange: fn(), readOnly: false },
  play: async ({ args, canvasElement }) => {
    const trigger = within(canvasElement).getByRole('combobox')

    await esperarAvatarComAresta(trigger, 16)
    await userEvent.click(trigger)
    const option = await screen.findByRole('option', { name: 'Ana Souza' })

    await expect(avatarIn(option)).toHaveAttribute('data-size', 'sm')
    await esperarAvatarComAresta(option, 24)

    await userEvent.keyboard('{Escape}')
    await listClosed()
    await expect(args.onValueChange).not.toHaveBeenCalled()
  },
}

export const PickingAnotherPersonEmits: Story = {
  args: { action: fn(), readOnly: false },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('combobox'))
    await userEvent.click(
      await screen.findByRole('option', { name: 'Ana Souza' }),
    )

    await expect(args.action).toHaveBeenCalledOnce()
    await expect(args.action).toHaveBeenLastCalledWith('ana', {
      option: options[1],
      previousValue: 'gm',
    })
    await listClosed()
  },
}

export const PickingCurrentPersonEmitsNothing: Story = {
  args: { onValueChange: fn(), readOnly: false },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('combobox'))
    await userEvent.click(
      await screen.findByRole('option', { name: 'Gabriel Melo' }),
    )

    await listClosed()
    await expect(args.onValueChange).not.toHaveBeenCalled()
  },
}

export const InitialsComeFromTheLabel: Story = {
  args: { avatarSize: 'sm' },
  play: async ({ canvasElement }) => {
    await expect(fallbacks(canvasElement)).toEqual(['GM'])
  },
}

export const ExplicitFallbackWins: Story = {
  args: { avatarSize: 'sm', value: 'ana' },
  play: async ({ canvasElement }) => {
    await expect(fallbacks(canvasElement)).toEqual(['A!'])
  },
}

export const XsKeepsTheFirstLetter: Story = {
  render: (args) => (
    <div className="flex gap-2">
      <PersonProperty {...args} value="gm" />
      <PersonProperty {...args} value="ana" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(fallbacks(canvasElement)).toEqual(['G', 'A'])
  },
}

export const AvatarSizeSetsTheValueAvatar: Story = {
  args: { avatarSize: 'lg', display: 'avatar', variant: 'plain' },
  play: async ({ canvasElement }) => {
    await expect(avatarIn(canvasElement)).toHaveAttribute('data-size', 'lg')
    await esperarAvatarComAresta(canvasElement, 40)
  },
}

export const FallbackHasAnOutline: Story = {
  play: async ({ canvasElement }) => {
    const fallback = canvasElement.querySelector<HTMLElement>(
      '[data-slot="avatar-fallback"]',
    )
    if (!fallback) throw new Error('The story did not render a fallback.')

    await expect(getComputedStyle(fallback).borderTopWidth).toBe('1px')
    await expect(getComputedStyle(fallback).borderTopStyle).toBe('solid')
  },
}

export const NameIsCutToOneLine: Story = {
  play: async ({ canvasElement }) => {
    const name = within(canvasElement).getByText('Gabriel Melo')

    await expect(getComputedStyle(name).textOverflow).toBe('ellipsis')
    await expect(getComputedStyle(name).whiteSpace).toBe('nowrap')
  },
}

export const SupportingLabelFromSm: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('Dono')).toBeVisible()
  },
}

export const SupportingLabelHiddenBelowSm: Story = {
  globals: { viewport: { isRotated: false, value: 'mobile2' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('Gabriel Melo')).toBeVisible()
    await expect(canvas.getByText('Dono')).not.toBeVisible()
  },
}
