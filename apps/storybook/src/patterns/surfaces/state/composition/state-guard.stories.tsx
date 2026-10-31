import type { Meta, StoryObj } from '@storybook/react-vite'
import { StateGuard } from '@tc96/parttens'
import { expect, within } from 'storybook/test'

const surface = { description: 'Ask an admin for access.', title: 'Restricted' }
const child = <p>Confidential record</p>
const surfaceStates = [
  'error',
  'permission',
  'empty',
  'no-result',
  'not-found',
] as const

const meta = {
  component: StateGuard,
  decorators: [
    (Story) => (
      <div className="w-full max-w-2xl p-6">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Surfaces/State/Composition/Guard',
} satisfies Meta<typeof StateGuard>

export default meta
type Story = StoryObj

export const LoadingBlockWithoutChildren: Story = {
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

export const SpinnerHiddenFromAssistiveTechnology: Story = {
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
      {surfaceStates.map((state) => (
        <div data-testid={state} key={state}>
          <StateGuard state={state} surface={surface}>
            {child}
          </StateGuard>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    for (const state of surfaceStates) {
      const wrapper = canvas.getByTestId(state)

      await expect(
        wrapper.querySelector('[data-slot="empty"]')?.getAttribute('data-kind'),
      ).toBe(state)
      await expect(
        within(wrapper).queryByText('Confidential record'),
      ).toBeNull()
    }
  },
}

export const DataMountsChildren: Story = {
  render: () => (
    <StateGuard state="data" surface={surface}>
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
