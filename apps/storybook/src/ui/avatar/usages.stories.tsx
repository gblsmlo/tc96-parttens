import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from '@tc96/ui/avatar'
import { expect, within } from 'storybook/test'
import {
  ana,
  brokenPhoto,
  bruno,
  carla,
  diego,
  elisa,
} from './avatar-images.ts'

const meta = {
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Avatar/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const CommentAuthor: Story = {
  render: () => (
    <article className="flex w-80 gap-3 text-sm">
      <Avatar aria-hidden="true">
        <AvatarImage alt="" src={carla.photo} />
        <AvatarFallback>{carla.initials}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-1">
        <p>
          <span className="font-medium">{carla.name}</span>{' '}
          <span className="text-muted-foreground">2 hours ago</span>
        </p>
        <p>
          Moved the launch to Thursday so support can update the help center
          first.
        </p>
      </div>
    </article>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('Carla Mendes')).toBeVisible()
  },
}

const members = [
  { email: 'ana@northwind.io', person: ana, photo: ana.photo },
  { email: 'bruno@northwind.io', person: bruno, photo: brokenPhoto },
  { email: 'carla@northwind.io', person: carla, photo: undefined },
]

export const MissingPhotos: Story = {
  render: () => (
    <ul className="flex w-72 flex-col divide-y rounded-lg border">
      {members.map(({ email, person, photo }) => (
        <li className="flex items-center gap-3 px-3 py-2 text-sm" key={email}>
          <Avatar aria-hidden="true">
            {photo ? <AvatarImage alt="" src={photo} /> : null}
            <AvatarFallback>{person.initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{person.name}</span>
            <span className="text-muted-foreground">{email}</span>
          </div>
        </li>
      ))}
    </ul>
  ),
  play: async ({ canvasElement }) => {
    const rows = within(canvasElement).getAllByRole('listitem')
    await expect(rows).toHaveLength(members.length)
    await expect(
      await within(rows[1] as HTMLElement).findByText('BL'),
    ).toBeVisible()
  },
}

export const TaskAssignees: Story = {
  render: () => (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-muted-foreground">Assignees</span>
      <AvatarGroup
        aria-label="Assigned to Ana Souza, Bruno Lima, Carla Mendes and 2 others"
        className="[--avatar-size:--spacing(6)]"
        role="group"
      >
        {[ana, bruno, carla].map((person) => (
          <Avatar aria-hidden="true" key={person.name}>
            <AvatarImage alt="" src={person.photo} />
            <AvatarFallback>{person.initials}</AvatarFallback>
          </Avatar>
        ))}
        <AvatarGroupCount aria-hidden="true">+2</AvatarGroupCount>
      </AvatarGroup>
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('group', {
        name: 'Assigned to Ana Souza, Bruno Lima, Carla Mendes and 2 others',
      }),
    ).toBeVisible()
  },
}

export const EditingNow: Story = {
  render: () => (
    <div className="flex items-center gap-3 text-sm">
      <AvatarGroup
        aria-label="Editing now: Diego Rocha, Elisa Prado and you"
        className="[--avatar-size:--spacing(8)]"
        role="group"
        topmost="last"
      >
        {[diego, elisa].map((person) => (
          <Avatar aria-hidden="true" key={person.name}>
            <AvatarImage alt="" src={person.photo} />
            <AvatarFallback>{person.initials}</AvatarFallback>
          </Avatar>
        ))}
        <span aria-hidden="true" className="relative inline-flex">
          <Avatar>
            <AvatarImage alt="" src={ana.photo} />
            <AvatarFallback>{ana.initials}</AvatarFallback>
          </Avatar>
          <span className="absolute end-0 bottom-0 size-2.5 rounded-full bg-success outline-2 outline-background" />
        </span>
      </AvatarGroup>
      <span className="text-muted-foreground">Editing now</span>
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('group', {
        name: 'Editing now: Diego Rocha, Elisa Prado and you',
      }),
    ).toHaveAttribute('data-topmost', 'last')
  },
}

export const AccountButton: Story = {
  render: () => (
    <header className="flex w-80 items-center justify-between border-b pb-3 text-sm">
      <span className="font-medium">Northwind</span>
      <Avatar
        aria-label="Account menu for Ana Souza"
        render={<button type="button" />}
      >
        <AvatarImage alt="" src={ana.photo} />
        <AvatarFallback>{ana.initials}</AvatarFallback>
      </Avatar>
    </header>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', {
        name: 'Account menu for Ana Souza',
      }),
    ).toBeVisible()
  },
}

export const WorkspaceLogo: Story = {
  render: () => (
    <div className="flex items-center gap-3 text-sm">
      <Avatar
        aria-hidden="true"
        className="rounded-md [--avatar-size:--spacing(10)]"
      >
        <AvatarFallback>NW</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="font-medium">Northwind</span>
        <span className="text-muted-foreground">Business plan, 24 members</span>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('Northwind')).toBeVisible()
  },
}
