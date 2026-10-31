import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  SettingsRow,
  SettingsSection,
  SettingsSectionDescription,
  SettingsSectionHeader,
  SettingsSectionTitle,
} from '@tc96/parttens'
import { expect, within } from 'storybook/test'

const slotIn = (root: Element, name: string) =>
  root.querySelector(`[data-slot="settings-section-${name}"]`)

function header(title: string) {
  return (
    <SettingsSectionHeader>
      <SettingsSectionTitle>{title}</SettingsSectionTitle>
    </SettingsSectionHeader>
  )
}

const meta = {
  component: SettingsSection,
  decorators: [
    (Story) => (
      <div className="w-lg">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'Patterns/Surfaces/Settings/Composition/Section',
} satisfies Meta<typeof SettingsSection>

export default meta
type Story = StoryObj<typeof meta>

export const HeaderNamesTheRegion: Story = {
  args: {
    children: (
      <>
        <SettingsRow title="Display names" />
        <SettingsRow title="Theme" />
      </>
    ),
    header: header('General'),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const region = canvas.getByRole('region', { name: 'General' })
    const heading = canvas.getByRole('heading', { level: 2, name: 'General' })

    await expect(region).toHaveAttribute('data-slot', 'settings-section')
    await expect(region).toHaveAttribute('aria-labelledby', heading.id)
    await expect(
      slotIn(canvasElement, 'header')?.nextElementSibling?.getAttribute(
        'data-slot',
      ),
    ).toBe('card')
    await expect(
      canvasElement.querySelectorAll(
        '[data-slot="card"] > [data-slot="settings-section-rows"] > [data-slot="settings-row"]',
      ),
    ).toHaveLength(2)
  },
}

export const HeaderDescriptionAndActionsOnlyWhenPassed: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div data-testid="title-only">
        <SettingsSection header={header('General')} />
      </div>
      <div data-testid="full-header">
        <SettingsSection
          header={
            <SettingsSectionHeader
              actions={<button type="button">New label</button>}
            >
              <SettingsSectionTitle>Labels</SettingsSectionTitle>
              <SettingsSectionDescription>
                Organize leads and tasks
              </SettingsSectionDescription>
            </SettingsSectionHeader>
          }
        />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const titleOnly = canvas.getByTestId('title-only')
    const fullHeader = canvas.getByTestId('full-header')

    await expect(slotIn(titleOnly, 'description')).toBeNull()
    await expect(slotIn(titleOnly, 'actions')).toBeNull()

    await expect(slotIn(fullHeader, 'description')?.textContent).toBe(
      'Organize leads and tasks',
    )
    await expect(
      slotIn(fullHeader, 'description')?.previousElementSibling,
    ).toBe(slotIn(fullHeader, 'title'))
    await expect(slotIn(fullHeader, 'actions')?.textContent).toBe('New label')
  },
}

export const WithoutHeaderOnlyTheCard: Story = {
  args: { children: <SettingsRow title="Email" /> },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.queryByRole('region')).toBeNull()
    await expect(canvas.queryByRole('heading')).toBeNull()
    const card = canvasElement.querySelector(
      '[data-slot="settings-section"] > [data-slot="card"]',
    )

    await expect(card).not.toBeNull()
    await expect(card?.className).toContain('rounded-2xl')
  },
}

export const DistinctHeadingIds: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <SettingsSection header={header('General')} />
      <SettingsSection header={header('Interface and theme')} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const [first, second] = canvas.getAllByRole('heading', { level: 2 })

    await expect(first?.id).not.toBe(second?.id)
    await expect(
      canvas.getByRole('region', { name: 'Interface and theme' }),
    ).toBeVisible()
  },
}
