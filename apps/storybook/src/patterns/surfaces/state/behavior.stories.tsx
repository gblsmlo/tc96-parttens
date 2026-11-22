import type { Meta, StoryObj } from '@storybook/react-vite'
import { StateGuard, StateSurface, type StateSurfaceKind } from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import { expect, fn, mocked, userEvent, within } from 'storybook/test'
import { StateCanvas } from './state-canvas.tsx'
import { stateControlArgs } from './state-controls.ts'
import { ComposedState } from './state-layouts.tsx'

interface BehaviorArgs {
  onAction: () => void
}

const copy = { description: 'Nothing to show here.', title: 'Nothing here' }
const child = <p>Confidential record</p>
const kindRoles: readonly (readonly [StateSurfaceKind, 'alert' | 'status'])[] =
  [
    ['empty', 'status'],
    ['no-result', 'status'],
    ['not-found', 'status'],
    ['error', 'alert'],
    ['permission', 'alert'],
  ]
const destructiveKinds: readonly StateSurfaceKind[] = ['error', 'permission']

const meta = {
  args: { onAction: fn() },
  argTypes: { onAction: { control: false } },
  decorators: [StateCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Surfaces/State/Behavior',
} satisfies Meta<BehaviorArgs>

export default meta

type Story = StoryObj<BehaviorArgs>

export const RoleFollowsKindWithoutAriaLive: Story = {
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
      await expect(
        within(wrapper).queryByRole(role === 'alert' ? 'status' : 'alert'),
      ).toBeNull()
      await expect(root).toHaveAttribute('data-kind', kind)
      await expect(root?.hasAttribute('aria-live')).toBe(false)
    }
  },
}

export const DefaultIconInMutedFrame: Story = {
  render: () => <ComposedState {...stateControlArgs} state="empty" />,
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
  render: () => (
    <StateSurface {...copy} icon={<i data-testid="custom" />} kind="error" />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(
      canvas.getByTestId('custom').closest('[data-slot="icon-frame"]'),
    ).not.toBeNull()
    await expect(canvasElement.querySelector('svg')).toBeNull()
  },
}

export const NullIconHidesFrame: Story = {
  render: () => <StateSurface {...copy} icon={null} kind="error" />,
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('[data-slot="icon-frame"]'),
    ).toBeNull()
    await expect(canvasElement.querySelector('svg')).toBeNull()
  },
}

export const ActionsKeepConsumerVariantAndHandler: Story = {
  render: ({ onAction }) => (
    <StateSurface
      {...copy}
      actions={
        <Button onClick={onAction} variant="destructive">
          Try again
        </Button>
      }
      kind="error"
    />
  ),
  play: async ({ args, canvasElement }) => {
    mocked(args.onAction).mockClear()
    const button = within(canvasElement).getByRole('button', {
      name: 'Try again',
    })

    await userEvent.click(button)

    await expect(args.onAction).toHaveBeenCalledOnce()
    await expect(button).toHaveAttribute('data-slot', 'button')
    await expect(button.className.split(' ')).toContain('bg-destructive')
  },
}

export const LoadingBlockHidesChildren: Story = {
  render: () => (
    <StateGuard
      state="loading"
      surface={{ description: 'Please wait.', title: 'Loading' }}
    >
      {child}
    </StateGuard>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const block = canvasElement.querySelector(
      '[data-slot="state-guard-loading"]',
    )

    await expect(canvas.getByRole('status')).toBe(block)
    await expect(block?.hasAttribute('data-kind')).toBe(false)
    await expect(canvasElement.querySelector('[data-slot="empty"]')).toBeNull()
    await expect(canvas.getByText('Loading')).toBeVisible()
    await expect(canvas.getByText('Please wait.')).toBeVisible()
    await expect(canvas.queryByText('Confidential record')).toBeNull()
  },
}

export const LoadingSpinnerHiddenFromAssistiveTechnology: Story = {
  render: () => (
    <StateGuard state="loading" surface={{ title: 'Loading' }}>
      {child}
    </StateGuard>
  ),
  play: async ({ canvasElement }) => {
    const spinner = canvasElement.querySelector(
      '[data-slot="state-guard-loading"] svg',
    )

    await expect(spinner).toHaveAttribute('aria-hidden', 'true')
  },
}

export const SurfaceStatesHideChildren: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {kindRoles.map(([state]) => (
        <div data-testid={state} key={state}>
          <StateGuard state={state} surface={copy}>
            {child}
          </StateGuard>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    for (const [state, role] of kindRoles) {
      const wrapper = canvas.getByTestId(state)
      const root = wrapper.querySelector('[data-slot="empty"]')

      await expect(root).toHaveAttribute('data-kind', state)
      await expect(within(wrapper).getByRole(role)).toBe(root)
      await expect(
        within(wrapper).queryByText('Confidential record'),
      ).toBeNull()
    }
  },
}

export const DataMountsChildren: Story = {
  render: () => (
    <StateGuard state="data" surface={copy}>
      {child}
    </StateGuard>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('Confidential record')).toBeVisible()
    await expect(canvasElement.querySelector('[data-slot="empty"]')).toBeNull()
    await expect(
      canvasElement.querySelector('[data-slot="state-guard-loading"]'),
    ).toBeNull()
  },
}
