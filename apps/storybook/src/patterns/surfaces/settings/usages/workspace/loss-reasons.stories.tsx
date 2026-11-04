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
import { EllipsisIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

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
        <EllipsisIcon aria-hidden="true" />
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
  title: 'Patterns/Surfaces/Settings/Usages/Workspace/Loss Reasons',
} satisfies Meta<typeof SettingsSection>

export default meta

type Story = StoryObj<typeof meta>

const interaction = ['!dev', '!autodocs']

export const LossReasons: Story = {
  name: 'Loss Reasons',
  render: () => <LossReasonsDemo />,
}

export const Empty: Story = {
  render: () => <EmptyDemo />,
}

export const Interaction: Story = {
  ...LossReasons,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(
      canvas.getByRole('heading', { level: 2, name: 'Lost leads' }),
    ).toBeVisible()
    expect(
      canvas.getByRole('heading', { level: 2, name: 'Loss reasons' }),
    ).toBeVisible()
    expect(canvas.getByRole('button', { name: 'New reason' })).toBeEnabled()

    const requireReason = canvas.getByRole('switch', {
      name: 'Require a loss reason',
    })
    const customReason = canvas.getByRole('switch', {
      name: 'Allow a custom reason',
    })
    expect(requireReason).not.toBeChecked()
    expect(customReason).toBeChecked()
    await userEvent.click(requireReason)
    await waitFor(() => expect(requireReason).toBeChecked())
    expect(onRequireReasonChange).toHaveBeenCalledTimes(1)
    expect(onRequireReasonChange.mock.calls[0]?.[0]).toBe(true)

    for (const { leads, name } of reasons) {
      expect(canvas.getByText(name)).toBeVisible()
      expect(
        canvas.getByRole('button', { name: `Actions for ${name}` }),
      ).toBeEnabled()
      expect(canvas.getByText(leadsLost(leads))).toBeVisible()
    }
    expect(canvas.getByText('1 lead lost')).toBeVisible()

    const archived = canvas.getByRole('region', { name: 'Archived' })
    const archivedTrigger = within(archived).getByRole('button', {
      name: 'Archived',
    })
    const archivedName = archivedReasons[0]?.name as string
    expect(archivedTrigger).toHaveAttribute('aria-expanded', 'false')
    expect(within(archived).queryByText(archivedName)).toBeNull()
    expect(
      canvas.queryByRole('button', { name: `Actions for ${archivedName}` }),
    ).toBeNull()

    await userEvent.click(archivedTrigger)
    expect(archivedTrigger).toHaveAttribute('aria-expanded', 'true')
    await waitFor(() =>
      expect(within(archived).getByText(archivedName)).toBeVisible(),
    )
    expect(
      canvas.getAllByRole('button', { name: /^Actions for / }),
    ).toHaveLength(reasons.length + archivedReasons.length)

    await userEvent.click(
      within(archived).getByRole('button', {
        name: `Actions for ${archivedName}`,
      }),
    )
    const body = within(document.body)
    expect(await body.findByRole('menuitem', { name: 'Restore' })).toBeVisible()
    expect(body.getByRole('menuitem', { name: 'Delete' })).toBeVisible()
    expect(body.queryByRole('menuitem', { name: 'Archive' })).toBeNull()
    await userEvent.keyboard('{Escape}')

    await userEvent.click(
      canvas.getByRole('button', { name: 'Actions for Price' }),
    )
    expect(await body.findByRole('menuitem', { name: 'Edit' })).toBeVisible()
    expect(body.getByRole('menuitem', { name: 'Archive' })).toBeVisible()
    expect(body.getByRole('menuitem', { name: 'Delete' })).toBeVisible()
    expect(body.queryByRole('menuitem', { name: 'Restore' })).toBeNull()
    await userEvent.keyboard('{Escape}')
  },
  tags: interaction,
}

export const EmptyInteraction: Story = {
  ...Empty,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(canvas.getByRole('status')).toHaveAttribute('data-kind', 'empty')
    expect(within(canvas.getByRole('status')).queryByRole('button')).toBeNull()
    expect(canvas.getByText('No loss reasons yet')).toBeVisible()
    expect(canvas.getByRole('button', { name: 'New reason' })).toBeEnabled()
    expect(canvas.queryByRole('button', { name: /^Actions for / })).toBeNull()
    expect(
      canvas.getByRole('switch', { name: 'Require a loss reason' }),
    ).toBeVisible()
  },
  tags: interaction,
}
