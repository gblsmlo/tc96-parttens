import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { appShellDocs, withAppShell } from '../fixtures/app-shell'
import { ContactDetailTemplate } from './contact-detail-template'

const meta = {
  component: ContactDetailTemplate,
  decorators: [
    withAppShell({
      breadcrumbs: [
        { href: '/contacts', label: 'Contatos' },
        { label: 'Marcos Tavares' },
      ],
      href: '/contacts',
    }),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'A record detail page for one contact: a header with the contact actions, a `RecordGroup` of read-only properties, and the `DealsWidget` and `ActivityFeedWidget` of the contact company, all from the `Patterns/CollectionViews` fixtures. It renders inside `Application/Shell/AppShell1`, the layout it mounts in; the Code panel shows only the page, which goes in the `children` of the shell.',
      },
      story: appShellDocs,
    },
    layout: 'fullscreen',
  },
  title: 'Templates/Contact Detail',
} satisfies Meta<typeof ContactDetailTemplate>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('heading', { level: 1, name: 'Marcos Tavares' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('list', { name: 'Negócios' }),
    ).toHaveTextContent('Padaria Estrela')
    await expect(
      canvas.getByRole('list', { name: 'Atividade' }),
    ).toBeInTheDocument()
  },
}

export const NoActivity: Story = {
  args: { activities: [], deals: [] },
}
