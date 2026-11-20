import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import { expect, fn, userEvent, within } from 'storybook/test'
import { LinkElementButton } from './button-layouts.tsx'
import { buttonTextSizeNames } from './button-variants.ts'

interface BehaviorArgs {
  onClick: () => void
  onSubmit: () => void
}

const meta = {
  args: { onClick: fn(), onSubmit: fn() },
  argTypes: {
    onClick: { control: false },
    onSubmit: { control: false },
  },
  tags: ['!autodocs'],
  title: 'UI/Button/Behavior',
} satisfies Meta<BehaviorArgs>

export default meta

type Story = StoryObj<BehaviorArgs>

export const CallsOnClick: Story = {
  render: ({ onClick }) => <Button onClick={onClick}>Create</Button>,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Create' }))
    await expect(args.onClick).toHaveBeenCalledOnce()
  },
}

export const SizesGrowInHeight: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      {buttonTextSizeNames.map((size) => (
        <Button key={size} size={size}>
          {size}
        </Button>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const heights = buttonTextSizeNames.map((size) =>
      Number.parseFloat(
        getComputedStyle(canvas.getByRole('button', { name: size })).height,
      ),
    )

    await expect(heights).toEqual([...heights].sort((a, b) => a - b))
    await expect(new Set(heights).size).toBe(buttonTextSizeNames.length)
  },
}

export const LoadingDisables: Story = {
  render: () => <Button loading>Saving</Button>,
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole('button', {
      name: /^Saving/,
    })
    await expect(button).toBeDisabled()
    await expect(button).toHaveAttribute('aria-disabled', 'true')
    await expect(button).toHaveAttribute('data-loading')
    await expect(
      within(button).getByRole('status', { name: 'Loading' }),
    ).toHaveAttribute('data-slot', 'button-loading-indicator')
  },
}

export const NeverSubmitsByDefault: Story = {
  render: ({ onSubmit }) => (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
    >
      <Button>Create</Button>
    </form>
  ),
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole('button', {
      name: 'Create',
    })
    await expect(button).toHaveAttribute('type', 'button')
    await userEvent.click(button)
    await expect(args.onSubmit).not.toHaveBeenCalled()
  },
}

export const RendersAsLink: Story = {
  render: () => <LinkElementButton />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const link = canvas.getByRole('link', { name: 'Create' })
    await expect(canvas.queryByRole('button')).toBeNull()
    await expect(link).toHaveAttribute('data-slot', 'button')
    await expect(link).toHaveAttribute('href', '#create')
    await expect(link).not.toHaveAttribute('type')
  },
}
