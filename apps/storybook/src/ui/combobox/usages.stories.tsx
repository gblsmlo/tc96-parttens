import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxValue,
  createComboboxItems,
} from '@tc96/ui/combobox'
import { Field, FieldDescription, FieldLabel } from '@tc96/ui/field'
import {
  ChevronsUpDownIcon,
  GlobeIcon,
  SearchIcon,
  TagIcon,
} from 'lucide-react'
import { Fragment } from 'react'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'
import { ComboboxCanvas } from './combobox-frame.tsx'

interface TeamMember {
  id: string
  name: string
}

interface IssueLabel {
  label: string
  value: string
}

interface TimeZone {
  label: string
  value: string
}

interface TimeZoneRegion {
  items: TimeZone[]
  value: string
}

const teamMembers: TeamMember[] = [
  { id: 'u-ana', name: 'Ana Lima' },
  { id: 'u-bruno', name: 'Bruno Costa' },
  { id: 'u-carla', name: 'Carla Mendes' },
  { id: 'u-diego', name: 'Diego Rocha' },
  { id: 'u-mariana', name: 'Mariana Souza' },
]

const owners = createComboboxItems(teamMembers, {
  getLabel: (member) => member.name,
  getValue: (member) => member.id,
})

const issueLabels: IssueLabel[] = [
  { label: 'Bug', value: 'bug' },
  { label: 'Documentation', value: 'documentation' },
  { label: 'Feature', value: 'feature' },
  { label: 'Performance', value: 'performance' },
  { label: 'Security', value: 'security' },
]

const timeZoneRegions: TimeZoneRegion[] = [
  {
    items: [
      { label: 'Los Angeles (UTC−8)', value: 'America/Los_Angeles' },
      { label: 'New York (UTC−5)', value: 'America/New_York' },
      { label: 'São Paulo (UTC−3)', value: 'America/Sao_Paulo' },
    ],
    value: 'Americas',
  },
  {
    items: [
      { label: 'Berlin (UTC+1)', value: 'Europe/Berlin' },
      { label: 'Lisbon (UTC+0)', value: 'Europe/Lisbon' },
      { label: 'London (UTC+0)', value: 'Europe/London' },
    ],
    value: 'Europe',
  },
  {
    items: [
      { label: 'Singapore (UTC+8)', value: 'Asia/Singapore' },
      { label: 'Tokyo (UTC+9)', value: 'Asia/Tokyo' },
    ],
    value: 'Asia',
  },
]

const countries = [
  { label: 'Brazil', value: 'BR' },
  { label: 'Canada', value: 'CA' },
  { label: 'Germany', value: 'DE' },
  { label: 'Japan', value: 'JP' },
  { label: 'Portugal', value: 'PT' },
  { label: 'United States', value: 'US' },
]

const meta = {
  decorators: [ComboboxCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Combobox/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const AssignOwner: Story = {
  render: () => (
    <Field>
      <FieldLabel>Owner</FieldLabel>
      <Combobox defaultValue="u-mariana" items={owners} name="ownerId">
        <ComboboxInput showClear />
        <ComboboxPopup>
          <ComboboxEmpty>No one in the workspace has that name.</ComboboxEmpty>
          <ComboboxList>
            {(member: TeamMember) => (
              <ComboboxItem key={member.id} value={member.id}>
                {member.name}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxPopup>
      </Combobox>
      <FieldDescription>
        The owner gets the follow-up reminders.
      </FieldDescription>
    </Field>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('combobox', { name: 'Owner' })).toHaveValue(
      'Mariana Souza',
    )
    await expect(
      canvasElement.querySelector('input[name="ownerId"]'),
    ).toHaveValue('u-mariana')
  },
}

export const IssueLabels: Story = {
  render: () => (
    <Combobox
      defaultValue={issueLabels.filter((item) =>
        ['bug', 'performance'].includes(item.value),
      )}
      items={issueLabels}
      multiple
    >
      <ComboboxChips startAddon={<TagIcon />}>
        <ComboboxValue>
          {(value: IssueLabel[]) => (
            <>
              {value.map((item) => (
                <ComboboxChip
                  key={item.value}
                  removeProps={{ 'aria-label': `Remove ${item.label}` }}
                >
                  {item.label}
                </ComboboxChip>
              ))}
              <ComboboxChipsInput
                aria-label="Labels"
                placeholder={value.length > 0 ? undefined : 'Add labels…'}
              />
            </>
          )}
        </ComboboxValue>
      </ComboboxChips>
      <ComboboxPopup>
        <ComboboxEmpty>No label with that name.</ComboboxEmpty>
        <ComboboxList>
          {(item: IssueLabel) => (
            <ComboboxItem key={item.value} value={item}>
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxPopup>
    </Combobox>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('button', { name: 'Remove Bug' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Remove Performance' }),
    ).toBeVisible()
  },
}

export const TimeZonePicker: Story = {
  render: () => (
    <Field>
      <FieldLabel>Time zone</FieldLabel>
      <Combobox autoHighlight items={timeZoneRegions}>
        <ComboboxInput startAddon={<GlobeIcon />} />
        <ComboboxPopup>
          <ComboboxEmpty>No time zone matches that city.</ComboboxEmpty>
          <ComboboxList>
            {(region: TimeZoneRegion) => (
              <Fragment key={region.value}>
                <ComboboxGroup items={region.items}>
                  <ComboboxGroupLabel>{region.value}</ComboboxGroupLabel>
                  <ComboboxCollection>
                    {(zone: TimeZone) => (
                      <ComboboxItem key={zone.value} value={zone}>
                        {zone.label}
                      </ComboboxItem>
                    )}
                  </ComboboxCollection>
                </ComboboxGroup>
                <ComboboxSeparator />
              </Fragment>
            )}
          </ComboboxList>
        </ComboboxPopup>
      </Combobox>
    </Field>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.type(
      within(canvasElement).getByRole('combobox', { name: 'Time zone' }),
      'lis',
    )
    await waitFor(() =>
      expect(
        screen.getByRole('option', { name: 'Lisbon (UTC+0)' }),
      ).toHaveAttribute('data-highlighted'),
    )
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())
  },
}

export const ShippingCountry: Story = {
  render: () => (
    <Combobox defaultValue={countries[0]} items={countries}>
      <ComboboxTrigger
        aria-label="Ship to"
        render={<Button className="w-full justify-between" variant="outline" />}
      >
        <ComboboxValue />
        <ChevronsUpDownIcon aria-hidden="true" />
      </ComboboxTrigger>
      <ComboboxPopup aria-label="Ship to">
        <div className="border-b p-2">
          <ComboboxInput
            aria-label="Search countries"
            placeholder="Search countries…"
            showTrigger={false}
            startAddon={<SearchIcon />}
          />
        </div>
        <ComboboxEmpty>We do not ship to that country yet.</ComboboxEmpty>
        <ComboboxList>
          {(country: (typeof countries)[number]) => (
            <ComboboxItem key={country.value} value={country}>
              {country.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxPopup>
    </Combobox>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('combobox', { name: 'Ship to' }),
    ).toHaveTextContent('Brazil')
  },
}
