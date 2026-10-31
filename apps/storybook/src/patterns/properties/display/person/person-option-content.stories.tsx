import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  PersonAvatar,
  PersonOptionContent,
} from '@tc96/parttens/properties/display/person/person-option-content'
import { expect, within } from 'storybook/test'

const option = { label: 'Gabriel Melo', value: 'gm' }

const fallbacks = (canvasElement: HTMLElement) =>
  Array.from(
    canvasElement.querySelectorAll('[data-slot="avatar-fallback"]'),
    (fallback) => fallback.textContent,
  )

const meta = {
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Person/Option Content',
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const AvatarFallsBackToInitials: Story = {
  play: async ({ canvasElement }) => {
    await expect(fallbacks(canvasElement)).toEqual(['GM'])
  },
  render: () => <PersonAvatar option={option} />,
}

export const AvatarPrefersExplicitFallback: Story = {
  play: async ({ canvasElement }) => {
    await expect(fallbacks(canvasElement)).toEqual(['G!'])
  },
  render: () => <PersonAvatar option={{ ...option, fallback: 'G!' }} />,
}

export const AvatarShowsSingleLetterAtXs: Story = {
  play: async ({ canvasElement }) => {
    await expect(fallbacks(canvasElement)).toEqual(['G', 'A'])
  },
  render: () => (
    <div className="flex gap-2">
      <PersonAvatar option={option} size="xs" />
      <PersonAvatar option={{ ...option, fallback: 'AB' }} size="xs" />
    </div>
  ),
}

export const AvatarShowsUserIconWithoutPerson: Story = {
  play: async ({ canvasElement }) => {
    const fallback = canvasElement.querySelector(
      '[data-slot="avatar-fallback"]',
    )

    await expect(fallback?.textContent).toBe('')
    await expect(
      fallback?.querySelector('svg')?.classList.contains('lucide-user'),
    ).toBe(true)
  },
  render: () => <PersonAvatar option={null} />,
}

export const AvatarIsSmUnlessSizeIsPassed: Story = {
  play: async ({ canvasElement }) => {
    const [initial, large] = Array.from(
      canvasElement.querySelectorAll('[data-slot="avatar"]'),
    )

    await expect(initial?.getAttribute('data-size')).toBe('sm')
    await expect(initial?.className).toContain('size-6')
    await expect(large?.getAttribute('data-size')).toBe('lg')
    await expect(large?.className).toContain('size-10')
    await expect(large?.className).not.toContain('size-6')
  },
  render: () => (
    <div className="flex gap-2">
      <PersonAvatar option={option} />
      <PersonAvatar option={option} size="lg" />
    </div>
  ),
}

export const AvatarMatchesOutlinedRecordFallback: Story = {
  play: async ({ canvasElement }) => {
    const fallback = canvasElement.querySelector(
      '[data-slot="avatar-fallback"]',
    )

    await expect(fallback?.className).toContain('border')
    await expect(fallback?.className).toContain('border-input')
    await expect(fallback?.className).not.toContain('bg-muted/40')
  },
  render: () => <PersonAvatar option={option} />,
}

export const ContentRendersAvatarAndLabel: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('[data-slot="avatar"]'),
    ).toBeInTheDocument()
    await expect(
      within(canvasElement).getByText('Gabriel Melo').className,
    ).toContain('truncate')
  },
  render: () => <PersonOptionContent option={option} />,
}

export const ContentShowsSupportingLabelFromSm: Story = {
  play: async ({ canvasElement }) => {
    const [withoutSupport, withSupport] = Array.from(
      canvasElement.querySelectorAll<HTMLElement>('[data-person-option]'),
    )

    if (!withoutSupport || !withSupport) throw new Error('Missing options.')

    await expect(within(withoutSupport).queryByText('Owner')).toBeNull()
    const supporting = within(withSupport).getByText('Owner')
    await expect(supporting.className).toContain('hidden')
    await expect(supporting.className).toContain('sm:inline')
  },
  render: () => (
    <div className="flex flex-col gap-2">
      <div data-person-option="">
        <PersonOptionContent option={option} />
      </div>
      <div data-person-option="">
        <PersonOptionContent option={{ ...option, supportingLabel: 'Owner' }} />
      </div>
    </div>
  ),
}
