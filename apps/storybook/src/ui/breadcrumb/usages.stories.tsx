import { FileTextIcon, FolderIcon } from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@tc96/ui/breadcrumb'
import { Fragment, useState } from 'react'
import { expect, within } from 'storybook/test'
import { CollapsedLevelsMenu } from './breadcrumb-layouts.tsx'

const meta = {
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Breadcrumb/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const ProjectSettingsHeader: Story = {
  render: () => (
    <div className="flex w-lg max-w-full flex-col gap-2">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#/acme">Acme Inc</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#/acme/projects">Projects</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#/acme/projects/website-redesign">
              Website redesign
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Settings</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="font-semibold text-2xl">Settings</h1>
      <p className="text-muted-foreground text-sm">
        Manage the name, members and deploy targets of Website redesign.
      </p>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const nav = within(canvasElement).getByRole('navigation', {
      name: 'breadcrumb',
    })
    await expect(
      within(nav).getByRole('link', { name: 'Website redesign' }),
    ).toHaveAttribute('href', '#/acme/projects/website-redesign')
    await expect(within(nav).getByText('Settings')).toHaveAttribute(
      'aria-current',
      'page',
    )
  },
}

const docsHiddenLevels = [
  { href: '#/docs/guides', label: 'Guides' },
  { href: '#/docs/guides/deployment', label: 'Deployment' },
]

export const DocumentationWithCollapsedLevels: Story = {
  render: () => (
    <Breadcrumb aria-label="Documentation path">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#/docs">Docs</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <CollapsedLevelsMenu element="a" levels={docsHiddenLevels} />
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#/docs/guides/deployment/environments">
            Environments
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Environment variables</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
  play: async ({ canvasElement }) => {
    const nav = within(canvasElement).getByRole('navigation', {
      name: 'Documentation path',
    })
    await expect(
      within(nav).getByRole('button', { name: 'Show 2 more levels' }),
    ).toBeVisible()
    await expect(within(nav).getByText('Environment variables')).toBeVisible()
  },
}

export const StoreCategory: Story = {
  render: () => (
    <Breadcrumb aria-label="Category">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#/store">Store</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink href="#/store/women">Women</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink href="#/store/women/shoes">Shoes</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>Trail running</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
  play: async ({ canvasElement }) => {
    const nav = within(canvasElement).getByRole('navigation', {
      name: 'Category',
    })
    await expect(within(nav).getAllByRole('link')).toHaveLength(3)
    await expect(within(nav).getByText('Trail running')).toBeVisible()
  },
}

interface Folder {
  files: string[]
  folders: string[]
  name: string
}

const folders: Record<string, Folder> = {
  'Q3 close': {
    files: ['Balance sheet.xlsx', 'Cash flow.xlsx', 'Notes to accounts.docx'],
    folders: [],
    name: 'Q3 close',
  },
  Finance: {
    files: ['Budget 2026.xlsx'],
    folders: ['Q3 close'],
    name: 'Finance',
  },
  'Shared drive': { files: [], folders: ['Finance'], name: 'Shared drive' },
}

const FileBrowser = () => {
  const [path, setPath] = useState(['Shared drive', 'Finance', 'Q3 close'])
  const current = folders[path.at(-1) ?? 'Shared drive']
  const ancestors = path.slice(0, -1)

  return (
    <div className="flex w-sm max-w-full flex-col gap-3">
      <Breadcrumb aria-label="Folder path">
        <BreadcrumbList>
          {ancestors.map((name, index) => (
            <Fragment key={name}>
              <BreadcrumbItem>
                <BreadcrumbLink
                  onClick={() => setPath(path.slice(0, index + 1))}
                  render={(props) => <button {...props} type="button" />}
                >
                  {name}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </Fragment>
          ))}
          <BreadcrumbItem>
            <BreadcrumbPage>{current?.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <ul className="divide-y rounded-lg border text-sm">
        {current?.folders.map((name) => (
          <li key={name}>
            <button
              className="flex w-full items-center gap-2 p-3 text-start"
              onClick={() => setPath([...path, name])}
              type="button"
            >
              <FolderIcon aria-hidden="true" className="size-4" />
              {name}
            </button>
          </li>
        ))}
        {current?.files.map((name) => (
          <li className="flex items-center gap-2 p-3" key={name}>
            <FileTextIcon
              aria-hidden="true"
              className="size-4 text-muted-foreground"
            />
            {name}
          </li>
        ))}
      </ul>
    </div>
  )
}

export const FileBrowserPath: Story = {
  render: () => <FileBrowser />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const nav = canvas.getByRole('navigation', { name: 'Folder path' })
    await expect(
      within(nav).getByRole('button', { name: 'Finance' }),
    ).toBeVisible()
    await expect(within(nav).getByText('Q3 close')).toHaveAttribute(
      'aria-current',
      'page',
    )
    await expect(canvas.getByText('Balance sheet.xlsx')).toBeVisible()
  },
}
