import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  avatarSizes,
} from '@tc96/elements/avatar'
import { expect, within } from 'storybook/test'

const imageSrc =
  'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=96&h=96&dpr=2&q=80'

const meta = {
  title: 'Elements/Avatar',
  component: Avatar,
  args: {
    size: 'default',
  },
  argTypes: {
    size: { control: 'select', options: avatarSizes },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Avatar do COSS com cinco tamanhos: `xs` (size-4), `sm` (size-6),`default` (size-8), `lg` (size-10) e `xl` (size-12). Compõe com `AvatarImage` e `AvatarFallback`; o texto do fallback acompanha o tamanho.',
      },
    },
  },
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage alt="User" src={imageSrc} />
      <AvatarFallback>AV</AvatarFallback>
    </Avatar>
  ),
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-end gap-4" data-testid="sizes">
      {avatarSizes.map((size) => (
        <Avatar key={size} {...args} size={size}>
          <AvatarImage alt="User" src={imageSrc} />
          <AvatarFallback>AV</AvatarFallback>
        </Avatar>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const avatars = within(canvasElement)
      .getByTestId('sizes')
      .querySelectorAll('[data-slot="avatar"]')
    await expect(avatars).toHaveLength(5)
    await expect(avatars[0]).toHaveAttribute('data-size', 'xs')
    await expect(avatars[4]).toHaveAttribute('data-size', 'xl')
  },
}

export const Fallback: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarFallback>AV</AvatarFallback>
    </Avatar>
  ),
  play: async ({ args, canvasElement }) => {
    await expect(within(canvasElement).getByText('AV')).toBeVisible()
    await expect(canvasElement.querySelector('img')).toBeNull()
    await expect(
      canvasElement.querySelector('[data-slot="avatar"]'),
    ).toHaveAttribute('data-size', args.size)
  },
}
