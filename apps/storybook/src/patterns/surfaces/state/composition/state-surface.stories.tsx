import type { Meta, StoryObj } from '@storybook/react-vite'
import { StateSurface } from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import { expect, fn, userEvent, within } from 'storybook/test'

const copy = { description: 'Nothing to show here.', title: 'Nothing here' }
const kindRoles = [
  ['empty', 'status'],
  ['no-result', 'status'],
  ['not-found', 'status'],
  ['error', 'alert'],
  ['permission', 'alert'],
] as const
const destructiveKinds = ['error', 'permission'] as const
const onRetry = fn()

const meta = {
  args: { ...copy, kind: 'empty' },
  component: StateSurface,
  decorators: [
    (Story) => (
      <div className="w-full max-w-2xl p-6">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Surfaces/State/Composition/Surface',
} satisfies Meta<typeof StateSurface>

export default meta
type Story = StoryObj<typeof meta>

export const KindRolesWithoutAriaLive: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {kindRoles.map(([kind]) => (
        <div data-testid={kind} key={kind}>
          <StateSurface {...copy} kind={kind} />
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    for (const [kind, role] of kindRoles) {
      const wrapper = canvas.getByTestId(kind)
      const root = wrapper.querySelector('[data-slot="empty"]')

      await expect(within(wrapper).getByRole(role)).toBe(root)
      await expect(root).toHaveAttribute('data-kind', kind)
      await expect(root?.hasAttribute('aria-live')).toBe(false)
    }
  },
}

export const DefaultIconInMutedFrame: Story = {
  play: async ({ canvasElement }) => {
    const frame = canvasElement.querySelector('[data-slot="icon-frame"]')

    await expect(frame).toHaveAttribute('aria-hidden', 'true')
    await expect(frame).toHaveAttribute('data-shape', 'rounded')
    await expect(frame).toHaveAttribute('data-variant', 'color')
    await expect(frame).toHaveAttribute('data-size', 'xl')
    await expect(frame?.querySelector('svg')).not.toBeNull()
    await expect(frame?.className).toContain('bg-muted/60')
    await expect(frame?.className).not.toContain('bg-muted ')
    await expect(frame?.getAttribute('style') ?? '').not.toContain('color')
    await expect(frame?.className).not.toMatch(/text-(?!foreground)/)
  },
}

export const DestructiveKindsTintTheFrame: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {destructiveKinds.map((kind) => (
        <div data-testid={kind} key={kind}>
          <StateSurface {...copy} kind={kind} />
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    for (const kind of destructiveKinds) {
      const frame = canvas
        .getByTestId(kind)
        .querySelector('[data-slot="icon-frame"]')
      const style = frame?.getAttribute('style') ?? ''

      await expect(frame).toHaveAttribute('data-shape', 'rounded')
      await expect(frame).toHaveAttribute('data-variant', 'color')
      await expect(frame).toHaveAttribute('data-size', 'xl')
      await expect(style).toContain('var(--destructive)')
      await expect(style).toContain('background-color')
      await expect(frame?.className).not.toContain('bg-muted/60')
    }
  },
}

export const ConsumerIconReplacesDefault: Story = {
  args: { icon: <i data-testid="custom" />, kind: 'error' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(
      canvas.getByTestId('custom').closest('[data-slot="icon-frame"]'),
    ).not.toBeNull()
    await expect(canvasElement.querySelector('svg')).toBeNull()
  },
}

export const NullIconHidesFrame: Story = {
  args: { icon: null, kind: 'error' },
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('[data-slot="icon-frame"]'),
    ).toBeNull()
    await expect(canvasElement.querySelector('svg')).toBeNull()
  },
}

export const ActionsKeepConsumerVariantAndHandler: Story = {
  args: {
    actions: (
      <Button onClick={onRetry} variant="destructive">
        Try again
      </Button>
    ),
    kind: 'error',
  },
  play: async ({ canvasElement }) => {
    onRetry.mockClear()
    const button = within(canvasElement).getByRole('button', {
      name: 'Try again',
    })

    await userEvent.click(button)

    await expect(onRetry).toHaveBeenCalledTimes(1)
    await expect(button).toHaveAttribute('data-slot', 'button')
    await expect(button.className.split(' ')).toContain('bg-destructive')
  },
}
