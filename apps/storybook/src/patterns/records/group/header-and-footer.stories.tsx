import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  DateProperty,
  RecordGroup,
  RecordGroupAction,
  type RecordGroupActionProps,
  RecordGroupRow,
  TextProperty,
} from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import { CalendarDaysIcon, PlusIcon, ShapesIcon, UserIcon } from 'lucide-react'
import type { ReactElement } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { recordGroupArgTypes } from '../../../test-utils/story-arg-types'

const meta = {
  argTypes: recordGroupArgTypes,
  args: {
    children: (
      <>
        <RecordGroupRow label="Type" leading={<ShapesIcon aria-hidden />}>
          <TextProperty value="Document request" variant="plain" />
        </RecordGroupRow>
        <RecordGroupRow label="Owner" leading={<UserIcon aria-hidden />}>
          <TextProperty value="Mariana Souza" variant="plain" />
        </RecordGroupRow>
        <RecordGroupRow label="Due" leading={<CalendarDaysIcon aria-hidden />}>
          <DateProperty readOnly value="2026-10-21" variant="plain" />
        </RecordGroupRow>
      </>
    ),
    title: 'Details',
  },
  component: RecordGroup,
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
} satisfies Meta<typeof RecordGroup>

export default meta

type Story = StoryObj<typeof meta>

const interaction = ['!dev', '!autodocs']

export const LongTitle: Story = {
  args: {
    actions: <RecordGroupAction icon={PlusIcon} label="Add property" />,
    title:
      'Customer onboarding, compliance review and contract renewal details for the current quarter',
  },
}

export const LongTitleInteraction: Story = {
  ...LongTitle,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const title = args.title as string
    const trigger = canvas.getByRole('button', { name: title })
    const text = trigger.querySelector('span') as HTMLElement
    const header = canvasElement.querySelector(
      '[data-slot="record-group-header"]',
    ) as HTMLElement
    const action = canvas.getByRole('button', { name: 'Add property' })

    expect(canvas.getByRole('region', { name: title })).toBeVisible()
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
  args: {
    actions: (
      <RecordGroupAction icon={PlusIcon} label="Add property" onClick={fn()} />
    ),
  },
}

export const WithActionInteraction: Story = {
  ...WithAction,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const action = canvas.getByRole('button', { name: 'Add property' })
    const title = canvas.getByRole('button', { name: 'Details' })
    const { onClick } = (args.actions as ReactElement<RecordGroupActionProps>)
      .props

    expect(action).toHaveAccessibleName('Add property')
    expect(action.getAttribute('aria-label')).toBe('Add property')
    expect(action.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
    expect(canvas.getByRole('region', { name: 'Details' })).toBeVisible()

    await userEvent.click(action)
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(title).toHaveAttribute('aria-expanded', 'true')

    await userEvent.click(title)
    await waitFor(() => expect(title).toHaveAttribute('aria-expanded', 'false'))
    expect(action).toBeVisible()
  },
  tags: interaction,
}

export const WithFooter: Story = {
  args: {
    footer: <Button variant="ghost">Add property</Button>,
  },
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
