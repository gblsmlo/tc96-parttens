import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { RecordGroupDemo } from './fixtures/group-demo'

const meta = {
  args: { title: 'Details' },
  component: RecordGroupDemo,
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'The header takes an optional `actions` slot that stays visible when the group is closed, and the title wraps instead of truncating. The optional `footer` sits inside the panel, so it hides with the body.',
      },
    },
  },
  tags: ['!autodocs'],
  title: 'Patterns/Records/Group/Header and Footer',
} satisfies Meta<typeof RecordGroupDemo>

export default meta

type Story = StoryObj<typeof meta>

const interaction = ['!dev', '!autodocs']

const longTitle =
  'Customer onboarding, compliance review and contract renewal details for the current quarter'

export const LongTitle: Story = {
  args: { actionLabel: 'Add property', title: longTitle },
}

export const LongTitleInteraction: Story = {
  ...LongTitle,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: longTitle })
    const text = trigger.querySelector('span') as HTMLElement
    const header = canvasElement.querySelector(
      '[data-slot="record-group-header"]',
    ) as HTMLElement
    const action = canvas.getByRole('button', { name: 'Add property' })

    expect(canvas.getByRole('region', { name: longTitle })).toBeVisible()
    expect(text.scrollWidth).toBeLessThanOrEqual(text.clientWidth)
    expect(action).toBeVisible()
    expect(action.getBoundingClientRect().right).toBeLessThanOrEqual(
      header.getBoundingClientRect().right + 0.5,
    )
    expect(header.scrollWidth).toBeLessThanOrEqual(header.clientWidth)
  },
  tags: interaction,
}

export const WithAction: Story = {
  args: { actionLabel: 'Add property', onAction: fn(), title: 'Details' },
}

export const WithActionInteraction: Story = {
  ...WithAction,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const action = canvas.getByRole('button', { name: 'Add property' })
    const title = canvas.getByRole('button', { name: 'Details' })

    expect(action).toHaveAccessibleName('Add property')
    expect(action.getAttribute('aria-label')).toBe(args.actionLabel)
    expect(action.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
    expect(canvas.getByRole('region', { name: 'Details' })).toBeVisible()

    await userEvent.click(action)
    expect(args.onAction).toHaveBeenCalledTimes(1)
    expect(title).toHaveAttribute('aria-expanded', 'true')

    await userEvent.click(title)
    await waitFor(() => expect(title).toHaveAttribute('aria-expanded', 'false'))
    expect(action).toBeVisible()
  },
  tags: interaction,
}

export const WithFooter: Story = {
  args: { footerLabel: 'Add property', title: 'Details' },
}

export const WithFooterInteraction: Story = {
  ...WithFooter,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const title = canvas.getByRole('button', { name: 'Details' })
    const footer = canvasElement.querySelector(
      '[data-slot="record-group-footer"]',
    ) as HTMLElement
    const content = canvasElement.querySelector(
      '[data-slot="record-group-content"]',
    ) as HTMLElement

    expect(footer).toBeVisible()
    expect(footer.getBoundingClientRect().top).toBeGreaterThanOrEqual(
      content.getBoundingClientRect().bottom - 0.5,
    )
    expect(
      within(footer).getByRole('button', { name: 'Add property' }),
    ).toBeVisible()

    await userEvent.click(title)
    await waitFor(() =>
      expect(
        canvasElement.querySelector('[data-slot="record-group-footer"]'),
      ).toBeNull(),
    )
    expect(canvas.queryByRole('button', { name: 'Add property' })).toBeNull()

    title.focus()
    await userEvent.tab()
    expect(canvasElement.contains(document.activeElement)).toBe(false)
  },
  tags: interaction,
}

export const FooterClosingInteraction: Story = {
  ...WithFooter,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const title = canvas.getByRole('button', { name: 'Details' })
    const panel = canvasElement.querySelector(
      '[data-slot="collapsible-panel"]',
    ) as HTMLElement
    const action = within(panel).getByRole('button', { name: 'Add property' })

    await userEvent.click(title)
    await waitFor(() =>
      expect(panel.hasAttribute('data-ending-style')).toBe(true),
    )
    expect(panel.isConnected).toBe(true)
    expect(panel.getAnimations().length).toBeGreaterThan(0)

    expect(action.closest('[inert]')).not.toBeNull()
    action.focus()
    expect(document.activeElement).not.toBe(action)
    title.focus()
    await userEvent.tab()
    expect(document.activeElement).not.toBe(action)

    await waitFor(() => expect(panel.isConnected).toBe(false))
    expect(canvas.queryByRole('button', { name: 'Add property' })).toBeNull()
  },
  tags: interaction,
}
