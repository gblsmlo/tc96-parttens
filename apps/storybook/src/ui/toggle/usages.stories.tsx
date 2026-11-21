import type { Meta, StoryObj } from '@storybook/react-vite'
import { Toggle } from '@tc96/ui/toggle'
import { BoldIcon, ItalicIcon, StarIcon, UnderlineIcon } from 'lucide-react'
import { useId, useState } from 'react'
import { expect, within } from 'storybook/test'

const meta = {
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Toggle/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const messages = [
  {
    from: 'Ana Souza',
    id: 'm1',
    subject: 'Q3 board deck, final review',
    unread: true,
  },
  {
    from: 'Billing',
    id: 'm2',
    subject: 'Your invoice INV-1042 is ready',
    unread: false,
  },
  {
    from: 'Marcos Lima',
    id: 'm3',
    subject: 'Can we move the sync to Thursday?',
    unread: true,
  },
  {
    from: 'Product updates',
    id: 'm4',
    subject: 'New: saved filters in reports',
    unread: false,
  },
] as const

const projects = [
  { favorite: true, name: 'Website redesign', owner: 'Ana Souza' },
  { favorite: false, name: 'Mobile onboarding', owner: 'Marcos Lima' },
  { favorite: true, name: 'Billing migration', owner: 'Júlia Castro' },
] as const

const FormattingToggles = () => (
  <div className="flex items-center gap-1">
    <Toggle aria-label="Bold" defaultPressed size="sm" variant="outline">
      <BoldIcon aria-hidden="true" />
    </Toggle>
    <Toggle aria-label="Italic" size="sm" variant="outline">
      <ItalicIcon aria-hidden="true" />
    </Toggle>
    <Toggle aria-label="Underline" size="sm" variant="outline">
      <UnderlineIcon aria-hidden="true" />
    </Toggle>
  </div>
)

const Inbox = () => {
  const headingId = useId()
  const [unreadOnly, setUnreadOnly] = useState(false)
  const shown = unreadOnly
    ? messages.filter((message) => message.unread)
    : messages
  return (
    <section aria-labelledby={headingId} className="flex w-96 flex-col">
      <header className="flex items-center justify-between border-b pb-2">
        <h2 className="font-semibold text-sm" id={headingId}>
          Inbox
        </h2>
        <Toggle
          onPressedChange={setUnreadOnly}
          pressed={unreadOnly}
          size="sm"
          variant="outline"
        >
          Unread only
        </Toggle>
      </header>
      <ul className="flex flex-col">
        {shown.map((message) => (
          <li className="flex flex-col border-b py-2" key={message.id}>
            <span
              className={message.unread ? 'font-semibold text-sm' : 'text-sm'}
            >
              {message.subject}
            </span>
            <span className="text-muted-foreground text-xs">
              {message.from}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

const ProjectList = () => (
  <ul className="flex w-80 flex-col">
    {projects.map((project) => (
      <li
        className="flex items-center justify-between gap-3 border-b py-2"
        key={project.name}
      >
        <div className="flex min-w-0 flex-col">
          <span className="truncate font-medium text-sm">{project.name}</span>
          <span className="truncate text-muted-foreground text-xs">
            {project.owner}
          </span>
        </div>
        <Toggle
          aria-label={`Favorite ${project.name}`}
          defaultPressed={project.favorite}
          size="sm"
        >
          <StarIcon
            aria-hidden="true"
            className="in-data-pressed:fill-current"
          />
        </Toggle>
      </li>
    ))}
  </ul>
)

export const TextFormatting: Story = {
  render: () => <FormattingToggles />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('button', { name: 'Bold' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    await expect(
      canvas.getByRole('button', { name: 'Italic' }),
    ).toHaveAttribute('aria-pressed', 'false')
  },
}

export const UnreadOnlyFilter: Story = {
  render: () => <Inbox />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('button', { name: 'Unread only' }),
    ).toHaveAttribute('aria-pressed', 'false')
    await expect(canvas.getAllByRole('listitem')).toHaveLength(messages.length)
  },
}

export const FavoriteProjects: Story = {
  render: () => <ProjectList />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('button', { name: 'Favorite Website redesign' }),
    ).toHaveAttribute('aria-pressed', 'true')
    await expect(
      canvas.getByRole('button', { name: 'Favorite Mobile onboarding' }),
    ).toHaveAttribute('aria-pressed', 'false')
  },
}
