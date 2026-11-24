import { EnvelopeSimpleIcon, MagnifyingGlassIcon } from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Autocomplete,
  AutocompleteCollection,
  AutocompleteEmpty,
  AutocompleteGroup,
  AutocompleteGroupLabel,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
  AutocompletePopup,
  AutocompleteSeparator,
} from '@tc96/ui/autocomplete'
import { Field, FieldDescription, FieldLabel } from '@tc96/ui/field'
import { Fragment } from 'react'
import { expect, within } from 'storybook/test'
import { AutocompleteCanvas } from './autocomplete-frame.tsx'

interface Suggestion {
  label: string
  value: string
}

interface SuggestionGroup {
  items: Suggestion[]
  value: string
}

const cities: Suggestion[] = [
  { label: 'Berlin', value: 'berlin' },
  { label: 'Lisbon', value: 'lisbon' },
  { label: 'London', value: 'london' },
  { label: 'Madrid', value: 'madrid' },
  { label: 'Porto', value: 'porto' },
  { label: 'São Paulo', value: 'sao-paulo' },
  { label: 'Toronto', value: 'toronto' },
]

const helpSuggestions: SuggestionGroup[] = [
  {
    items: [
      { label: 'Reset two-factor authentication', value: 'reset-2fa' },
      { label: 'Export invoices as CSV', value: 'export-invoices' },
    ],
    value: 'Recent searches',
  },
  {
    items: [
      { label: 'Change the billing email', value: 'billing-email' },
      { label: 'Invite people to a workspace', value: 'invite-people' },
      { label: 'Move a project to another team', value: 'move-project' },
      { label: 'Set up single sign-on', value: 'sso' },
    ],
    value: 'Articles',
  },
]

const teammates: Suggestion[] = [
  { label: 'ana.lima@northwind.io', value: 'u-ana' },
  { label: 'bruno.costa@northwind.io', value: 'u-bruno' },
  { label: 'carla.mendes@northwind.io', value: 'u-carla' },
  { label: 'diego.rocha@northwind.io', value: 'u-diego' },
  { label: 'mariana.souza@northwind.io', value: 'u-mariana' },
]

const meta = {
  decorators: [AutocompleteCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Autocomplete/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const ShippingCity: Story = {
  render: () => (
    <Field>
      <FieldLabel>City</FieldLabel>
      <Autocomplete defaultValue="Lisbon" items={cities} name="city">
        <AutocompleteInput
          clearProps={{ 'aria-label': 'Clear city' }}
          placeholder="Start typing a city…"
          showClear
        />
        <AutocompletePopup>
          <AutocompleteEmpty>
            No saved city matches. You can keep what you typed.
          </AutocompleteEmpty>
          <AutocompleteList>
            {(city: Suggestion) => (
              <AutocompleteItem key={city.value} value={city}>
                {city.label}
              </AutocompleteItem>
            )}
          </AutocompleteList>
        </AutocompletePopup>
      </Autocomplete>
      <FieldDescription>
        Not on the list? Type it as it appears on your mail.
      </FieldDescription>
    </Field>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('combobox', { name: 'City' })).toHaveValue(
      'Lisbon',
    )
    await expect(
      canvas.getByRole('button', { name: 'Clear city' }),
    ).toBeVisible()
  },
}

export const HelpCenterSearch: Story = {
  render: () => (
    <Autocomplete autoHighlight items={helpSuggestions}>
      <AutocompleteInput
        aria-label="Search the help center"
        placeholder="How do I…"
        startAddon={<MagnifyingGlassIcon aria-hidden="true" />}
        type="search"
      />
      <AutocompletePopup>
        <AutocompleteEmpty>
          No article matches. Press Enter to search every page.
        </AutocompleteEmpty>
        <AutocompleteList>
          {(group: SuggestionGroup) => (
            <Fragment key={group.value}>
              <AutocompleteGroup items={group.items}>
                <AutocompleteGroupLabel>{group.value}</AutocompleteGroupLabel>
                <AutocompleteCollection>
                  {(item: Suggestion) => (
                    <AutocompleteItem key={item.value} value={item}>
                      {item.label}
                    </AutocompleteItem>
                  )}
                </AutocompleteCollection>
              </AutocompleteGroup>
              <AutocompleteSeparator />
            </Fragment>
          )}
        </AutocompleteList>
      </AutocompletePopup>
    </Autocomplete>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('combobox', {
        name: 'Search the help center',
      }),
    ).toHaveAttribute('placeholder', 'How do I…')
  },
}

export const InviteByEmail: Story = {
  render: () => (
    <Field>
      <FieldLabel>Invite by email</FieldLabel>
      <Autocomplete items={teammates} mode="both" name="email">
        <AutocompleteInput
          placeholder="name@northwind.io"
          startAddon={<EnvelopeSimpleIcon aria-hidden="true" />}
          type="email"
        />
        <AutocompletePopup>
          <AutocompleteEmpty>
            No teammate matches. The invite goes to the address you typed.
          </AutocompleteEmpty>
          <AutocompleteList>
            {(person: Suggestion) => (
              <AutocompleteItem key={person.value} value={person}>
                {person.label}
              </AutocompleteItem>
            )}
          </AutocompleteList>
        </AutocompletePopup>
      </Autocomplete>
      <FieldDescription>
        Pick a teammate or type any address outside the company.
      </FieldDescription>
    </Field>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('combobox', { name: 'Invite by email' }),
    ).toHaveAccessibleDescription(
      'Pick a teammate or type any address outside the company.',
    )
  },
}
