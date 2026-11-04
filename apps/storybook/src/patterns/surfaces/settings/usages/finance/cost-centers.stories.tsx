import type { Meta, StoryObj } from '@storybook/react-vite'
import { Text } from '@tc96/elements/text'
import {
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
import { EllipsisIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { expect, userEvent, waitFor, within } from 'storybook/test'

interface CostCenter {
  entries: number
  name: string
}

const costCenters: CostCenter[] = [
  { entries: 62, name: 'Litigation' },
  { entries: 27, name: 'Labor practice' },
  { entries: 14, name: 'Downtown office' },
  { entries: 1, name: 'Pro bono' },
]

const archivedCostCenters: CostCenter[] = [
  { entries: 8, name: 'Riverside office' },
]

function count(entries: number) {
  return `${entries} ${entries === 1 ? 'entry' : 'entries'}`
}

function CostCenterRow({
  archived,
  costCenter,
}: {
  archived?: boolean
  costCenter: CostCenter
}) {
  const { entries, name } = costCenter

  return (
    <SettingsRow
      endSlot={
        <div className="flex items-center gap-3">
          <Text
            foreground="muted"
            render={<span>{count(entries)}</span>}
            size="sm"
          />
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
                  <MenuItem variant="destructive">Archive</MenuItem>
                </>
              )}
            </MenuPopup>
          </Menu>
        </div>
      }
      title={name}
    />
  )
}

function CostCentersSection({ children }: { children: ReactNode }) {
  return (
    <SettingsSection
      className="mx-auto w-full max-w-2xl"
      header={
        <SettingsSectionHeader
          actions={<Button size="sm">New cost center</Button>}
        >
          <SettingsSectionTitle>Cost centers</SettingsSectionTitle>
          <SettingsSectionDescription>
            Where a cost is charged: a practice area, an office, a project.
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
  title: 'Patterns/Surfaces/Settings/Usages/Finance/Cost Centers',
} satisfies Meta<typeof SettingsSection>

export default meta

type Story = StoryObj<typeof meta>

const interaction = ['!dev', '!autodocs']

export const CostCenters: Story = {
  name: 'Cost Centers',
  render: () => (
    <CostCentersSection>
      {costCenters.map((costCenter) => (
        <CostCenterRow costCenter={costCenter} key={costCenter.name} />
      ))}
      <div>
        <SettingsCollapsed defaultOpen={false} title="Archived">
          {archivedCostCenters.map((costCenter) => (
            <CostCenterRow
              archived
              costCenter={costCenter}
              key={costCenter.name}
            />
          ))}
        </SettingsCollapsed>
      </div>
    </CostCentersSection>
  ),
}

export const Empty: Story = {
  render: () => (
    <CostCentersSection>
      <StateSurface
        description="Create a cost center to see where money is spent."
        kind="empty"
        title="No cost centers yet"
      />
    </CostCentersSection>
  ),
}

export const Interaction: Story = {
  ...CostCenters,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    expect(
      canvas.getByRole('heading', { level: 2, name: 'Cost centers' }),
    ).toBeVisible()
    expect(
      canvas.getByRole('button', { name: 'New cost center' }),
    ).toBeEnabled()

    for (const { entries, name } of costCenters) {
      expect(canvas.getByText(name)).toBeVisible()
      expect(canvas.getByText(count(entries))).toBeVisible()
    }
    expect(
      canvas.getAllByRole('button', { name: /^Actions for / }),
    ).toHaveLength(costCenters.length)

    await userEvent.click(
      canvas.getByRole('button', { name: 'Actions for Litigation' }),
    )
    expect(await body.findByRole('menuitem', { name: 'Edit' })).toBeVisible()
    expect(body.getByRole('menuitem', { name: 'Archive' })).toBeVisible()
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(body.queryByRole('menu')).toBeNull())

    const archived = canvas.getByRole('region', { name: 'Archived' })
    const trigger = within(archived).getByRole('button', { name: 'Archived' })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(trigger)
    await waitFor(() =>
      expect(within(archived).getByText('Riverside office')).toBeVisible(),
    )
    await userEvent.click(
      within(archived).getByRole('button', {
        name: 'Actions for Riverside office',
      }),
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
    expect(canvas.getByText('No cost centers yet')).toBeVisible()
    expect(
      canvas.getByRole('button', { name: 'New cost center' }),
    ).toBeEnabled()
    expect(canvas.queryByRole('button', { name: /^Actions for / })).toBeNull()
  },
  tags: interaction,
}
