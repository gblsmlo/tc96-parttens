import type { Meta, StoryObj } from '@storybook/react-vite'
import { Text } from '@tc96/elements/text'
import {
  IconLabelProperty,
  SettingsCollapsed,
  SettingsRow,
  SettingsSection,
  SettingsSectionDescription,
  SettingsSectionHeader,
  SettingsSectionTitle,
  StateSurface,
} from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import { Menu, MenuItem, MenuPopup, MenuTrigger } from '@tc96/ui/menu'
import { CornerDownRightIcon, EllipsisIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { expect, userEvent, waitFor, within } from 'storybook/test'

type Direction = 'Income' | 'Expense'

const directionDots: Record<Direction, string> = {
  Expense: 'bg-red-700 dark:bg-red-500',
  Income: 'bg-green-700 dark:bg-green-500',
}

interface Category {
  direction: Direction
  entries: number
  name: string
  subcategories?: Category[]
}

const categories: Category[] = [
  { direction: 'Income', entries: 48, name: 'Legal fees' },
  { direction: 'Income', entries: 6, name: 'Success fees' },
  {
    direction: 'Expense',
    entries: 21,
    name: 'Court costs',
    subcategories: [
      { direction: 'Expense', entries: 9, name: 'Filing fees' },
      { direction: 'Expense', entries: 1, name: 'Expert fees' },
    ],
  },
  { direction: 'Expense', entries: 34, name: 'Office expenses' },
]

const archivedCategories: Category[] = [
  { direction: 'Expense', entries: 3, name: 'Travel' },
]

function count(entries: number) {
  return `${entries} ${entries === 1 ? 'entry' : 'entries'}`
}

function CategoryMenu({
  archived,
  name,
  parent,
}: {
  archived?: boolean
  name: string
  parent?: string
}) {
  return (
    <Menu>
      <MenuTrigger
        aria-label={`Actions for ${name}`}
        render={<Button size="icon-xs" variant="ghost" />}
      >
        <EllipsisIcon aria-hidden="true" />
      </MenuTrigger>
      <MenuPopup align="end">
        {archived ? (
          <MenuItem>Restore</MenuItem>
        ) : (
          <>
            <MenuItem>Edit</MenuItem>
            {parent ? null : <MenuItem>Add subcategory</MenuItem>}
            <MenuItem variant="destructive">Archive</MenuItem>
          </>
        )}
      </MenuPopup>
    </Menu>
  )
}

function CategoryRow({
  archived,
  category,
  parent,
}: {
  archived?: boolean
  category: Category
  parent?: string
}) {
  const { direction, entries, name } = category

  return (
    <SettingsRow
      className={parent ? 'ps-2' : undefined}
      description={parent ? `Subcategory of ${parent}` : undefined}
      endSlot={
        <div className="flex items-center gap-3">
          <Text
            foreground="muted"
            render={<span>{count(entries)}</span>}
            size="sm"
          />
          {parent ? null : (
            <IconLabelProperty
              leading={
                <span
                  aria-hidden="true"
                  className={`size-2 rounded-full ${directionDots[direction]}`}
                />
              }
              label={direction}
            />
          )}
          <CategoryMenu archived={archived} name={name} parent={parent} />
        </div>
      }
      startSlot={
        parent ? (
          <CornerDownRightIcon
            aria-hidden="true"
            className="text-muted-foreground"
          />
        ) : undefined
      }
      title={name}
    />
  )
}

function categoryRows(list: Category[], archived?: boolean) {
  return list.flatMap((category) => [
    <CategoryRow archived={archived} category={category} key={category.name} />,
    ...(category.subcategories ?? []).map((subcategory) => (
      <CategoryRow
        archived={archived}
        category={subcategory}
        key={subcategory.name}
        parent={category.name}
      />
    )),
  ])
}

function CategoriesSection({ children }: { children: ReactNode }) {
  return (
    <SettingsSection
      className="mx-auto w-full max-w-2xl"
      header={
        <SettingsSectionHeader
          actions={<Button size="sm">New category</Button>}
        >
          <SettingsSectionTitle>Categories</SettingsSectionTitle>
          <SettingsSectionDescription>
            How entries are classified: fees, court costs, expenses.
          </SettingsSectionDescription>
        </SettingsSectionHeader>
      }
    >
      {children}
    </SettingsSection>
  )
}

const meta = {
  component: SettingsSection,
  decorators: [
    (Story) => (
      <div className="w-full max-w-2xl">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Surfaces/Settings/Usages/Finance/Categories',
} satisfies Meta<typeof SettingsSection>

export default meta

type Story = StoryObj<typeof meta>

const interaction = ['!dev', '!autodocs']

export const Categories: Story = {
  name: 'Categories',
  render: () => (
    <CategoriesSection>
      {categoryRows(categories)}
      <div>
        <SettingsCollapsed defaultOpen={false} title="Archived">
          {categoryRows(archivedCategories, true)}
        </SettingsCollapsed>
      </div>
    </CategoriesSection>
  ),
}

export const Empty: Story = {
  render: () => (
    <CategoriesSection>
      <StateSurface
        description="Create a category to classify income and expenses."
        kind="empty"
        title="No categories yet"
      />
    </CategoriesSection>
  ),
}

export const Interaction: Story = {
  ...Categories,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    expect(
      canvas.getByRole('heading', { level: 2, name: 'Categories' }),
    ).toBeVisible()
    const newCategory = canvas.getByRole('button', { name: 'New category' })
    expect(newCategory).toBeEnabled()
    expect(newCategory.closest('[data-slot="card"]')).toBeNull()

    expect(canvas.getByText('48 entries')).toBeVisible()
    expect(canvas.getByText('1 entry')).toBeVisible()
    expect(canvas.getAllByText('Subcategory of Court costs')).toHaveLength(2)
    expect(canvas.getAllByText('Income')).toHaveLength(2)
    expect(canvas.getAllByText('Expense')).toHaveLength(2)

    const active = categories.flatMap((category) => [
      category.name,
      ...(category.subcategories ?? []).map(({ name }) => name),
    ])
    for (const name of active) {
      expect(canvas.getByText(name)).toBeVisible()
    }
    expect(
      canvas.getAllByRole('button', { name: /^Actions for / }),
    ).toHaveLength(active.length)

    await userEvent.click(
      canvas.getByRole('button', { name: 'Actions for Court costs' }),
    )
    expect(
      await body.findByRole('menuitem', { name: 'Add subcategory' }),
    ).toBeVisible()
    expect(body.getByRole('menuitem', { name: 'Archive' })).toBeVisible()
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(body.queryByRole('menu')).toBeNull())

    await userEvent.click(
      canvas.getByRole('button', { name: 'Actions for Filing fees' }),
    )
    expect(await body.findByRole('menuitem', { name: 'Edit' })).toBeVisible()
    expect(body.queryByRole('menuitem', { name: 'Add subcategory' })).toBeNull()
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(body.queryByRole('menu')).toBeNull())

    const archived = canvas.getByRole('region', { name: 'Archived' })
    const trigger = within(archived).getByRole('button', { name: 'Archived' })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(within(archived).queryByText('Travel')).toBeNull()
    await userEvent.click(trigger)
    await waitFor(() =>
      expect(within(archived).getByText('Travel')).toBeVisible(),
    )
    await userEvent.click(
      within(archived).getByRole('button', { name: 'Actions for Travel' }),
    )
    expect(await body.findByRole('menuitem', { name: 'Restore' })).toBeVisible()
    expect(body.queryByRole('menuitem', { name: 'Archive' })).toBeNull()
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(body.queryByRole('menu')).toBeNull())
  },
  tags: interaction,
}

export const EmptyInteraction: Story = {
  ...Empty,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(canvas.getByRole('status')).toHaveAttribute('data-kind', 'empty')
    expect(within(canvas.getByRole('status')).queryByRole('button')).toBeNull()
    expect(canvas.getByText('No categories yet')).toBeVisible()
    expect(canvas.getByRole('button', { name: 'New category' })).toBeEnabled()
    expect(canvas.queryByRole('button', { name: /^Actions for / })).toBeNull()
  },
  tags: interaction,
}
