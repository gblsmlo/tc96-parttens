import type { Meta, StoryObj } from '@storybook/react-vite'
import { ScrollArea } from '@tc96/ui/scroll-area'
import { expect, within } from 'storybook/test'

const releases = [
  {
    changes: [
      'Invoices can be split across two payment methods.',
      'The customer list remembers the last filter you applied.',
      'Exports to CSV keep the column order of the table.',
    ],
    date: 'November 18, 2026',
    version: '4.2',
  },
  {
    changes: [
      'New dark theme for the dashboard and the reports.',
      'Comments on a record notify everyone who follows it.',
      'Fixed a delay when opening large spreadsheets.',
    ],
    date: 'October 29, 2026',
    version: '4.1',
  },
  {
    changes: [
      'Recurring tasks repeat on weekdays only, if you choose.',
      'Bulk edit now covers due dates and assignees.',
      'The calendar shows holidays for 42 countries.',
    ],
    date: 'October 7, 2026',
    version: '4.0',
  },
  {
    changes: [
      'Two-factor sign in with passkeys.',
      'Shared folders show who opened a file last.',
      'Faster search across archived projects.',
    ],
    date: 'September 15, 2026',
    version: '3.9',
  },
]

const products = [
  { name: 'Linen shirt', price: '$48.00' },
  { name: 'Canvas tote bag', price: '$22.00' },
  { name: 'Wool socks, 2 pairs', price: '$16.00' },
  { name: 'Leather belt', price: '$39.00' },
  { name: 'Denim jacket', price: '$96.00' },
  { name: 'Cotton cap', price: '$18.00' },
  { name: 'Rain boots', price: '$74.00' },
  { name: 'Merino scarf', price: '$45.00' },
]

const members = [
  { name: 'Ana Souza', role: 'Owner' },
  { name: 'Bruno Lima', role: 'Admin' },
  { name: 'Carla Mendes', role: 'Admin' },
  { name: 'Diego Rocha', role: 'Member' },
  { name: 'Elisa Prado', role: 'Member' },
  { name: 'Felipe Costa', role: 'Member' },
  { name: 'Gabriela Nunes', role: 'Member' },
  { name: 'Henrique Alves', role: 'Member' },
  { name: 'Isabela Martins', role: 'Member' },
  { name: 'João Ribeiro', role: 'Guest' },
  { name: 'Larissa Teixeira', role: 'Guest' },
  { name: 'Marcos Pereira', role: 'Guest' },
]

const meta = {
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/ScrollArea/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const ReleaseNotes: Story = {
  render: () => (
    <ScrollArea
      aria-label="Release notes"
      className="h-80 w-96 max-w-full rounded-lg border"
      role="region"
      scrollFade
    >
      <div className="flex flex-col gap-6 p-4 text-sm">
        {releases.map((release) => (
          <section className="flex flex-col gap-2" key={release.version}>
            <h3 className="font-medium">
              Version {release.version}
              <span className="ms-2 font-normal text-muted-foreground">
                {release.date}
              </span>
            </h3>
            <ul className="flex list-disc flex-col gap-1 ps-5 text-muted-foreground">
              {release.changes.map((change) => (
                <li key={change}>{change}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </ScrollArea>
  ),
  play: async ({ canvasElement }) => {
    const region = within(canvasElement).getByRole('region', {
      name: 'Release notes',
    })
    await expect(
      within(region).getAllByRole('heading', { level: 3 }),
    ).toHaveLength(releases.length)
  },
}

export const RecentlyViewed: Story = {
  render: () => (
    <div className="flex w-96 max-w-full flex-col gap-2">
      <h3 className="font-medium text-sm">Recently viewed</h3>
      <ScrollArea scrollbarGutter>
        <ul aria-label="Recently viewed" className="flex w-max gap-3">
          {products.map((product) => (
            <li
              className="flex w-32 shrink-0 flex-col gap-1 rounded-md border p-3 text-sm"
              key={product.name}
            >
              <span className="truncate">{product.name}</span>
              <span className="text-muted-foreground tabular-nums">
                {product.price}
              </span>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const list = within(canvasElement).getByRole('list', {
      name: 'Recently viewed',
    })
    await expect(within(list).getAllByRole('listitem')).toHaveLength(
      products.length,
    )
  },
}

export const WorkspaceMembers: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-2">
      <h3 className="font-medium text-sm">
        Workspace members ({members.length})
      </h3>
      <ScrollArea className="h-64 rounded-lg border" scrollbarGutter>
        <ul aria-label="Workspace members" className="flex flex-col p-1">
          {members.map((member) => (
            <li
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm"
              key={member.name}
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted font-medium text-xs">
                {member.name
                  .split(' ')
                  .map((part) => part[0])
                  .join('')}
              </span>
              <span className="truncate">{member.name}</span>
              <span className="ms-auto text-muted-foreground">
                {member.role}
              </span>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const list = within(canvasElement).getByRole('list', {
      name: 'Workspace members',
    })
    await expect(within(list).getByText('Ana Souza')).toBeVisible()
    await expect(within(list).getAllByRole('listitem')).toHaveLength(
      members.length,
    )
  },
}
