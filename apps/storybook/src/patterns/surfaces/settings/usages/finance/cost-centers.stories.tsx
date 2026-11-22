import type { Meta, StoryObj } from '@storybook/react-vite'
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
import { Text } from '@tc96/ui/text'
import { EllipsisIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { expect, within } from 'storybook/test'

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
  title: 'Patterns/Surfaces/Settings/Usages',
} satisfies Meta<typeof SettingsSection>

export default meta

type Story = StoryObj<typeof meta>

export const CostCenters: Story = {
  name: 'Cost Centers',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('heading', { level: 2, name: 'Cost centers' }),
    ).toBeVisible()
    await expect(canvas.getByText('Litigation')).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'New cost center' }),
    ).toBeVisible()
  },
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

export const CostCentersEmpty: Story = {
  name: 'Cost Centers empty',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('status')).toHaveAttribute(
      'data-kind',
      'empty',
    )
    await expect(canvas.getByText('No cost centers yet')).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'New cost center' }),
    ).toBeEnabled()
  },
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
