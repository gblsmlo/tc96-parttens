import { DotsThreeIcon } from '@phosphor-icons/react'
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
import { Switch } from '@tc96/ui/switch'
import type { ReactNode } from 'react'
import { expect, fn, within } from 'storybook/test'

interface LossReason {
  leads: number
  name: string
}

const reasons: LossReason[] = [
  { leads: 14, name: 'Price' },
  { leads: 9, name: 'Chose a competitor' },
  { leads: 6, name: 'No budget' },
  { leads: 4, name: 'No response' },
  { leads: 1, name: 'Bad timing' },
]

const archivedReasons: LossReason[] = [
  { leads: 3, name: 'Product missing a feature' },
]

const onRequireReasonChange = fn()
const onCustomReasonChange = fn()

function leadsLost(leads: number) {
  return `${leads} ${leads === 1 ? 'lead' : 'leads'} lost`
}

function ReasonMenu({ archived, name }: { archived?: boolean; name: string }) {
  return (
    <Menu>
      <MenuTrigger
        aria-label={`Actions for ${name}`}
        render={<Button size="icon-xs" variant="ghost" />}
      >
        <DotsThreeIcon aria-hidden="true" />
      </MenuTrigger>
      <MenuPopup align="end">
        {archived ? (
          <MenuItem>Restore</MenuItem>
        ) : (
          <>
            <MenuItem>Edit</MenuItem>
            <MenuItem>Archive</MenuItem>
          </>
        )}
        <MenuItem variant="destructive">Delete</MenuItem>
      </MenuPopup>
    </Menu>
  )
}

function ReasonRow({
  archived,
  reason,
}: {
  archived?: boolean
  reason: LossReason
}) {
  return (
    <SettingsRow
      description={leadsLost(reason.leads)}
      endSlot={<ReasonMenu archived={archived} name={reason.name} />}
      title={reason.name}
    />
  )
}

function LostLeadsSection() {
  return (
    <SettingsSection
      header={
        <SettingsSectionHeader>
          <SettingsSectionTitle>Lost leads</SettingsSectionTitle>
          <SettingsSectionDescription>
            Choose what sellers must provide when they mark a lead as lost.
          </SettingsSectionDescription>
        </SettingsSectionHeader>
      }
    >
      <SettingsRow
        description="Sellers pick a reason before a lead can be marked as lost"
        endSlot={
          <Switch
            aria-label="Require a loss reason"
            onCheckedChange={onRequireReasonChange}
          />
        }
        title="Require a loss reason"
      />
      <SettingsRow
        description="Sellers can write their own reason when none of the options fits"
        endSlot={
          <Switch
            aria-label="Allow a custom reason"
            defaultChecked
            onCheckedChange={onCustomReasonChange}
          />
        }
        title="Allow a custom reason"
      />
    </SettingsSection>
  )
}

function LossReasonsSection({ children }: { children: ReactNode }) {
  return (
    <SettingsSection
      header={
        <SettingsSectionHeader actions={<Button size="sm">New reason</Button>}>
          <SettingsSectionTitle>Loss reasons</SettingsSectionTitle>
          <SettingsSectionDescription>
            The reasons a seller can choose when a lead is lost.
          </SettingsSectionDescription>
        </SettingsSectionHeader>
      }
    >
      {children}
    </SettingsSection>
  )
}

function LossReasonsDemo() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-8">
      <LostLeadsSection />
      <LossReasonsSection>
        {reasons.map((reason) => (
          <ReasonRow key={reason.name} reason={reason} />
        ))}
        <div>
          <SettingsCollapsed defaultOpen={false} title="Archived">
            {archivedReasons.map((reason) => (
              <ReasonRow archived key={reason.name} reason={reason} />
            ))}
          </SettingsCollapsed>
        </div>
      </LossReasonsSection>
    </main>
  )
}

function EmptyDemo() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-8">
      <LostLeadsSection />
      <LossReasonsSection>
        <StateSurface
          description="Create a reason so sellers can say why a lead was lost."
          kind="empty"
          title="No loss reasons yet"
        />
      </LossReasonsSection>
    </main>
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

export const LossReasons: Story = {
  name: 'Loss Reasons',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('heading', { level: 2, name: 'Lost leads' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('heading', { level: 2, name: 'Loss reasons' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('switch', { name: 'Require a loss reason' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'New reason' }),
    ).toBeVisible()
  },
  render: () => <LossReasonsDemo />,
}

export const LossReasonsEmpty: Story = {
  name: 'Loss Reasons empty',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('status')).toHaveAttribute(
      'data-kind',
      'empty',
    )
    await expect(canvas.getByText('No loss reasons yet')).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'New reason' }),
    ).toBeEnabled()
  },
  render: () => <EmptyDemo />,
}
