import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  type AvatarPrimitive,
} from '@tc96/ui/avatar'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { avatarControlArgs } from './avatar-controls.ts'
import { ana, brokenPhoto } from './avatar-images.ts'
import { ComposedAvatar } from './avatar-layouts.tsx'

interface BehaviorArgs {
  onClick: () => void
  onLoadingStatusChange: NonNullable<
    AvatarPrimitive.Image.Props['onLoadingStatusChange']
  >
}

const meta = {
  args: { onClick: fn(), onLoadingStatusChange: fn() },
  argTypes: {
    onClick: { control: false },
    onLoadingStatusChange: { control: false },
  },
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Avatar/Behavior',
} satisfies Meta<BehaviorArgs>

export default meta

type Story = StoryObj<BehaviorArgs>

const avatarIn = (canvasElement: HTMLElement) => {
  const avatar = canvasElement.querySelector('[data-slot="avatar"]')
  if (!(avatar instanceof HTMLElement))
    throw new Error('The avatar did not render.')
  return avatar
}

const groupIn = (canvasElement: HTMLElement) => {
  const group = canvasElement.querySelector('[data-slot="avatar-group"]')
  if (!(group instanceof HTMLElement))
    throw new Error('The avatar group did not render.')
  return [group, [...group.children] as HTMLElement[]] as const
}

export const DefaultSize: Story = {
  render: () => <ComposedAvatar {...avatarControlArgs} image={false} />,
  play: async ({ canvasElement }) => {
    const avatar = avatarIn(canvasElement)
    await expect(avatar.tagName).toBe('SPAN')
    const { height, width } = avatar.getBoundingClientRect()
    await expect(width).toBe(32)
    await expect(height).toBe(32)
    await expect(getComputedStyle(avatar).fontSize).toBe('12px')
  },
}

export const SizeFromAncestor: Story = {
  render: () => (
    <div className="[--avatar-size:--spacing(12)]">
      <ComposedAvatar {...avatarControlArgs} image={false} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const avatar = avatarIn(canvasElement)
    await expect(avatar.getBoundingClientRect().width).toBe(48)
    await expect(getComputedStyle(avatar).fontSize).toBe('18px')
  },
}

export const ImageReplacesFallback: Story = {
  render: () => <ComposedAvatar {...avatarControlArgs} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const image = await canvas.findByRole('img', { name: 'Ana Souza' })
    await waitFor(() => expect(canvas.queryByText('AS')).toBeNull())
    const avatarBox = avatarIn(canvasElement).getBoundingClientRect()
    const imageBox = image.getBoundingClientRect()
    await expect(imageBox.width).toBe(avatarBox.width)
    await expect(imageBox.height).toBe(avatarBox.height)
  },
}

export const FallbackWithoutImage: Story = {
  render: () => <ComposedAvatar {...avatarControlArgs} image={false} />,
  play: async ({ canvasElement }) => {
    const fallback = within(canvasElement).getByText('AS')
    await expect(fallback).toHaveAttribute('data-slot', 'avatar-fallback')
    await expect(canvasElement.querySelector('img')).toBeNull()
    await expect(fallback.getBoundingClientRect().width).toBe(
      avatarIn(canvasElement).getBoundingClientRect().width,
    )
  },
}

export const LoadingStatus: Story = {
  render: ({ onLoadingStatusChange }) => (
    <Avatar>
      <AvatarImage
        alt={ana.name}
        onLoadingStatusChange={onLoadingStatusChange}
        src={ana.photo}
      />
      <AvatarFallback>{ana.initials}</AvatarFallback>
    </Avatar>
  ),
  play: async ({ args, canvasElement }) => {
    await waitFor(() =>
      expect(args.onLoadingStatusChange).toHaveBeenLastCalledWith('loaded'),
    )
    await expect(args.onLoadingStatusChange).not.toHaveBeenCalledWith('error')
    await expect(
      within(canvasElement).getByRole('img', { name: 'Ana Souza' }),
    ).toBeVisible()
  },
}

export const FallbackOnError: Story = {
  render: ({ onLoadingStatusChange }) => (
    <Avatar>
      <AvatarImage
        alt={ana.name}
        onLoadingStatusChange={onLoadingStatusChange}
        src={brokenPhoto}
      />
      <AvatarFallback>{ana.initials}</AvatarFallback>
    </Avatar>
  ),
  play: async ({ args, canvasElement }) => {
    await waitFor(() =>
      expect(args.onLoadingStatusChange).toHaveBeenLastCalledWith('error'),
    )
    await expect(canvasElement.querySelector('img')).toBeNull()
    await expect(within(canvasElement).getByText('AS')).toBeVisible()
  },
}

export const KeepMountedOnError: Story = {
  render: ({ onLoadingStatusChange }) => (
    <Avatar>
      <AvatarImage
        alt={ana.name}
        keepMounted
        onLoadingStatusChange={onLoadingStatusChange}
        src={brokenPhoto}
      />
      <AvatarFallback>{ana.initials}</AvatarFallback>
    </Avatar>
  ),
  play: async ({ args, canvasElement }) => {
    await waitFor(() =>
      expect(args.onLoadingStatusChange).toHaveBeenLastCalledWith('error'),
    )
    const image = canvasElement.querySelector('img')
    await expect(image).toHaveAttribute('data-error')
    await expect(image).toHaveAttribute('aria-hidden', 'true')
    await expect(image).not.toBeVisible()
    await expect(within(canvasElement).getByText('AS')).toBeVisible()
  },
}

export const FallbackDelay: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback delay={1500}>{ana.initials}</AvatarFallback>
    </Avatar>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByText('AS')).toBeNull()
    await expect(
      await canvas.findByText('AS', undefined, { timeout: 3000 }),
    ).toBeVisible()
  },
}

export const GroupOverlap: Story = {
  render: () => <ComposedAvatar {...avatarControlArgs} group />,
  play: async ({ canvasElement }) => {
    const [group, avatars] = groupIn(canvasElement)
    await expect(group).toHaveAttribute('data-topmost', 'first')
    await expect(avatars).toHaveLength(3)
    const [first, second, third] = avatars.map((avatar) =>
      avatar.getBoundingClientRect(),
    )
    await expect((first?.right ?? 0) - (second?.left ?? 0)).toBeCloseTo(9.6, 1)
    await expect((second?.right ?? 0) - (third?.left ?? 0)).toBeCloseTo(9.6, 1)
    const masks = avatars.map((avatar) => getComputedStyle(avatar).maskImage)
    await expect(masks[0]).toBe('none')
    await expect(masks[1]).not.toBe('none')
    await expect(masks[2]).not.toBe('none')
  },
}

export const LastOnTop: Story = {
  render: () => <ComposedAvatar {...avatarControlArgs} group topmost="last" />,
  play: async ({ canvasElement }) => {
    const [group, avatars] = groupIn(canvasElement)
    await expect(group).toHaveAttribute('data-topmost', 'last')
    const masks = avatars.map((avatar) => getComputedStyle(avatar).maskImage)
    await expect(masks[0]).not.toBe('none')
    await expect(masks[1]).not.toBe('none')
    await expect(masks[2]).toBe('none')
  },
}

export const GroupCount: Story = {
  render: () => <ComposedAvatar {...avatarControlArgs} count group />,
  play: async ({ canvasElement }) => {
    const [, avatars] = groupIn(canvasElement)
    const count = avatars.at(-1)
    await expect(count).toHaveAttribute('data-slot', 'avatar-group-count')
    await expect(count).toHaveTextContent('+3')
    const countBox = count?.getBoundingClientRect()
    const firstBox = avatars[0]?.getBoundingClientRect()
    await expect(countBox?.width).toBe(firstBox?.width)
    await expect(countBox?.height).toBe(firstBox?.height)
  },
}

export const ButtonAvatar: Story = {
  render: ({ onClick }) => (
    <Avatar
      aria-label={`Account menu for ${ana.name}`}
      onClick={onClick}
      render={<button type="button" />}
    >
      <AvatarFallback>{ana.initials}</AvatarFallback>
    </Avatar>
  ),
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole('button', {
      name: 'Account menu for Ana Souza',
    })
    await expect(button).toHaveAttribute('data-slot', 'avatar')
    await userEvent.tab()
    await expect(button).toHaveFocus()
    await userEvent.click(button)
    await expect(args.onClick).toHaveBeenCalledOnce()
  },
}
