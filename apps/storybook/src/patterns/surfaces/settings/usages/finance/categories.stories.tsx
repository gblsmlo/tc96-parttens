import type { Meta, StoryObj } from '@storybook/react-vite'
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
import { Text } from '@tc96/ui/text'
import { CornerDownRightIcon, EllipsisIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { expect, within } from 'storybook/test'

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
  title: 'Patterns/Surfaces/Settings/Usages',
} satisfies Meta<typeof SettingsSection>

export default meta

type Story = StoryObj<typeof meta>

export const Categories: Story = {
  name: 'Categories',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('heading', { level: 2, name: 'Categories' }),
    ).toBeVisible()
    await expect(canvas.getByText('48 entries')).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'New category' }),
    ).toBeVisible()
  },
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

export const CategoriesEmpty: Story = {
  name: 'Categories empty',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('status')).toHaveAttribute(
      'data-kind',
      'empty',
    )
    await expect(canvas.getByText('No categories yet')).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'New category' }),
    ).toBeEnabled()
  },
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
