import type { Meta, StoryObj } from '@storybook/react-vite'
import { PersonProperty, type PersonPropertyOption } from '@tc96/parttens'
import { expect, within } from 'storybook/test'

const options: PersonPropertyOption<'ana'>[] = [
  { fallback: 'AS', label: 'Ana Souza', value: 'ana' },
]

const meta = {
  args: { options, readOnly: true },
  component: PersonProperty,
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Person/Value',
} satisfies Meta<typeof PersonProperty>

export default meta

type Story = StoryObj<typeof PersonProperty<'ana'>>

export const AvatarOnlyKeepsAccessibleLabel: Story = {
  args: {
    ariaLabel: 'Responsável',
    display: 'avatar',
    value: 'ana',
    variant: 'plain',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(
      canvas.getByLabelText('Responsável: Ana Souza'),
    ).toBeInTheDocument()
    await expect(canvas.queryByText('Ana Souza')).toBeNull()
  },
}

export const ValueUsesXsAvatar: Story = {
  args: { value: 'ana' },
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement
        .querySelector('[data-slot="avatar"]')
        ?.getAttribute('data-size'),
    ).toBe('xs')
  },
}

export const EmptyAvatarStaysIdentifiable: Story = {
  args: {
    ariaLabel: 'Responsável',
    display: 'avatar',
    placeholder: 'Sem responsável',
    value: null,
    variant: 'plain',
  },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('Responsável: Sem responsável'),
    ).toBeInTheDocument()
    await expect(
      canvasElement.querySelector('.lucide-user'),
    ).toBeInTheDocument()
  },
}
