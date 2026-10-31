import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconLabelProperty } from '@tc96/parttens'
import { CircleIcon } from 'lucide-react'
import { expect, within } from 'storybook/test'

const meta = {
  args: { label: 'Manual' },
  component: IconLabelProperty,
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Icon Label/Behavior',
} satisfies Meta<typeof IconLabelProperty>

export default meta

type Story = StoryObj<typeof meta>

export const SecondaryBadge: Story = {
  args: { ariaLabel: 'Origem' },
  play: async ({ canvasElement }) => {
    const badge = within(canvasElement).getByLabelText('Origem: Manual')

    await expect(badge.textContent).toContain('Manual')
  },
}

export const WithoutIcon: Story = {
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('svg')).toBeNull()
  },
}

export const WithIcon: Story = {
  args: { icon: CircleIcon },
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('svg[aria-hidden="true"]'),
    ).not.toBeNull()
  },
}

export const IconIsPropertyIcon: Story = {
  args: { icon: CircleIcon },
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement
        .querySelector('svg[aria-hidden="true"]')
        ?.getAttribute('data-slot'),
    ).toBe('property-icon')
  },
}

export const AriaLabelAsImg: Story = {
  args: { ariaLabel: 'Criado em', label: '27/09/2026' },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('img', {
        name: 'Criado em: 27/09/2026',
      }),
    ).toBeInTheDocument()
  },
}

export const AriaLabelAsImgWhenPlain: Story = {
  args: { ariaLabel: 'Criado em', label: '27/09/2026', variant: 'plain' },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('img', {
        name: 'Criado em: 27/09/2026',
      }),
    ).toBeInTheDocument()
  },
}

export const PlainWithoutBadge: Story = {
  args: { variant: 'plain' },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('Manual')).toBeInTheDocument()
  },
}
