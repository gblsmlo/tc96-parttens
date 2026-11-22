import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconLabelProperty } from '@tc96/parttens'
import { CircleIcon } from 'lucide-react'
import {
  expect,
  isInaccessible,
  userEvent,
  waitFor,
  within,
} from 'storybook/test'
import {
  esperarSuperficieDeBadge,
  esperarSuperficiePlana,
} from '../../../../test-utils/property-surface'
import { IconLabelCanvas } from './icon-label-canvas.tsx'

const meta = {
  args: { label: 'Manual' },
  component: IconLabelProperty,
  decorators: [IconLabelCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Icon Label/Behavior',
} satisfies Meta<typeof IconLabelProperty>

export default meta

type Story = StoryObj<typeof meta>

const surfaceIn = (canvasElement: HTMLElement) => {
  const surface = canvasElement.querySelector<HTMLElement>(
    '[data-slot="property-surface"]',
  )
  if (!surface) throw new Error('The story did not render the surface.')
  return surface
}

const removeButton = (
  <button aria-label="Remover Manual" type="button">
    ×
  </button>
)

export const AriaLabelNamesTheSurfaceAsImage: Story = {
  args: { ariaLabel: 'Criado em', label: '27/09/2026' },
  play: async ({ canvasElement }) => {
    const value = within(canvasElement).getByRole('img', {
      name: 'Criado em: 27/09/2026',
    })

    await expect(value).toBe(surfaceIn(canvasElement))
    await expect(value.textContent).toBe('27/09/2026')
  },
}

export const PlainKeepsTheImageName: Story = {
  args: { ariaLabel: 'Criado em', label: '27/09/2026', variant: 'plain' },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('img', {
        name: 'Criado em: 27/09/2026',
      }),
    ).toBeInTheDocument()
  },
}

export const WithoutAriaLabelReadsAsText: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.queryByRole('img')).toBeNull()
    await expect(surfaceIn(canvasElement)).not.toHaveAttribute('aria-label')
    await expect(canvas.getByText('Manual')).toBeVisible()
  },
}

export const IconIsHiddenPropertyIcon: Story = {
  args: { icon: CircleIcon },
  play: async ({ canvasElement }) => {
    const icon = surfaceIn(canvasElement).querySelector('svg')

    await expect(icon).toHaveAttribute('data-slot', 'property-icon')
    await expect(isInaccessible(icon as Element)).toBe(true)
  },
}

export const NoIconWithoutIconProp: Story = {
  play: async ({ canvasElement }) => {
    await expect(surfaceIn(canvasElement).querySelector('svg')).toBeNull()
  },
}

export const BadgeFillsTheSurface: Story = {
  play: async ({ canvasElement }) => {
    await expect(surfaceIn(canvasElement)).toHaveAttribute(
      'data-variant',
      'badge',
    )
    await esperarSuperficieDeBadge(canvasElement)
  },
}

export const PlainHasNoFill: Story = {
  args: { variant: 'plain' },
  play: async ({ canvasElement }) => {
    await expect(surfaceIn(canvasElement)).toHaveAttribute(
      'data-variant',
      'plain',
    )
    await esperarSuperficiePlana(canvasElement)
  },
}

export const MutedMarksTheSurfaceEmpty: Story = {
  args: { muted: true },
  play: async ({ canvasElement }) => {
    await expect(surfaceIn(canvasElement)).toHaveAttribute('data-empty', 'true')
  },
}

export const TrailingWithAriaLabelIsGroup: Story = {
  args: { ariaLabel: 'Origem', trailing: removeButton },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const group = canvas.getByRole('group', { name: 'Origem: Manual' })

    await expect(canvas.queryByRole('img')).toBeNull()
    await expect(
      within(group).getByRole('button', { name: 'Remover Manual' }),
    ).toBeVisible()
  },
}

export const HoverTrailingShowsOnFocus: Story = {
  args: { trailing: removeButton, trailingVisibility: 'hover' },
  play: async ({ canvasElement }) => {
    const wrapper = canvasElement.querySelector<HTMLElement>(
      '[data-slot="property-trailing"]',
    )
    if (!wrapper) throw new Error('The story did not render the wrapper.')

    await expect(getComputedStyle(wrapper).opacity).toBe('0')

    await userEvent.tab()
    await expect(
      within(canvasElement).getByRole('button', { name: 'Remover Manual' }),
    ).toHaveFocus()
    await waitFor(() => expect(getComputedStyle(wrapper).opacity).toBe('1'))
  },
}

export const RenderedButtonKeepsItsRole: Story = {
  args: { ariaLabel: 'Origem' },
  render: (args) => (
    <IconLabelProperty
      {...args}
      render={(props) => <button {...props} type="button" />}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByRole('button', { name: 'Origem: Manual' })).toBe(
      surfaceIn(canvasElement),
    )
    await expect(canvas.queryByRole('img')).toBeNull()
  },
}
