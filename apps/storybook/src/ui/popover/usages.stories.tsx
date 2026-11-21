import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import {
  Popover,
  PopoverClose,
  PopoverDescription,
  PopoverPopup,
  PopoverTitle,
  PopoverTrigger,
} from '@tc96/ui/popover'
import { Textarea } from '@tc96/ui/textarea'
import { BellIcon, XIcon } from 'lucide-react'
import type { FormEvent } from 'react'
import { expect, screen, within } from 'storybook/test'
import { PasswordHintPopover } from './popover-layouts.tsx'

const meta = {
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Popover/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const preventSubmit = (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault()
}

export const SendFeedback: Story = {
  render: () => (
    <Popover defaultOpen>
      <PopoverTrigger render={<Button variant="outline" />}>
        Feedback
      </PopoverTrigger>
      <PopoverPopup align="end" className="w-80">
        <form className="flex flex-col gap-4" onSubmit={preventSubmit}>
          <div className="flex flex-col gap-1">
            <PopoverTitle>Send us feedback</PopoverTitle>
            <PopoverDescription>
              Tell us what works and what gets in your way. The product team
              reads every message.
            </PopoverDescription>
          </div>
          <Textarea
            aria-label="Feedback"
            name="feedback"
            placeholder="The export to CSV drops the time zone…"
          />
          <Button type="submit">Send feedback</Button>
        </form>
      </PopoverPopup>
    </Popover>
  ),
  play: async () => {
    const popup = await screen.findByRole('dialog', {
      name: 'Send us feedback',
    })
    await expect(within(popup).getByLabelText('Feedback')).toBeVisible()
    await expect(
      within(popup).getByRole('button', { name: 'Send feedback' }),
    ).toHaveAttribute('type', 'submit')
  },
}

const notifications = [
  {
    id: 'invite',
    text: 'Marina Costa invited you to the “Q4 planning” project.',
    time: '5 minutes ago',
  },
  {
    id: 'comment',
    text: 'João Lima commented on “Update the onboarding checklist”.',
    time: '1 hour ago',
  },
  {
    id: 'export',
    text: 'Your export of 1,284 contacts is ready to download.',
    time: 'Yesterday',
  },
]

export const Notifications: Story = {
  render: () => (
    <Popover defaultOpen>
      <PopoverTrigger
        aria-label="Notifications"
        render={<Button size="icon" variant="outline" />}
      >
        <BellIcon aria-hidden="true" />
      </PopoverTrigger>
      <PopoverPopup align="end" className="w-80">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <PopoverTitle>Notifications</PopoverTitle>
            <PopoverClose
              aria-label="Close"
              render={<Button size="icon-xs" variant="ghost" />}
            >
              <XIcon aria-hidden="true" />
            </PopoverClose>
          </div>
          <ul className="flex flex-col gap-3">
            {notifications.map(({ id, text, time }) => (
              <li className="flex flex-col gap-0.5 text-sm" key={id}>
                <span>{text}</span>
                <span className="text-muted-foreground text-xs">{time}</span>
              </li>
            ))}
          </ul>
          <PopoverClose render={<Button size="sm" variant="outline" />}>
            Mark all as read
          </PopoverClose>
        </div>
      </PopoverPopup>
    </Popover>
  ),
  play: async () => {
    const popup = await screen.findByRole('dialog', { name: 'Notifications' })
    await expect(within(popup).getAllByRole('listitem')).toHaveLength(3)
    await expect(
      within(popup).getByRole('button', { name: 'Mark all as read' }),
    ).toBeVisible()
  },
}

export const PasswordHint: Story = {
  render: () => <PasswordHintPopover />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('Password'),
    ).toHaveAttribute('type', 'password')
    const popup = await screen.findByRole('dialog', {
      name: 'Password requirements',
    })
    await expect(popup).toHaveTextContent(
      'At least 8 characters, with one number and one symbol.',
    )
  },
}
