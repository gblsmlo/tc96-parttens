import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { ContactsUsage } from '../patterns/collection-views/fixtures/contacts-usage'

const meta = {
  component: ContactsUsage,
  parameters: {
    docs: {
      description: {
        component:
          'A record index page: the `Patterns/CollectionViews/Usages/Contacts` screen with saved views, search, view settings and the Table, Spreadsheet and List views over one collection.',
      },
    },
    layout: 'fullscreen',
  },
  title: 'Templates/Contacts',
} satisfies Meta<typeof ContactsUsage>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Marcos Tavares')).toBeVisible()
    await expect(
      canvasElement.querySelector('[data-slot="table-container"]'),
    ).not.toBeNull()
  },
}

export const Loading: Story = {
  args: { loading: true },
}

export const Empty: Story = {
  args: { initialContacts: [] },
}
