import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { appShellDocs, withAppShell } from '../fixtures/app-shell'
import { CompaniesTemplate } from './companies-template'

const meta = {
  component: CompaniesTemplate,
  decorators: [
    withAppShell({ breadcrumbs: [{ label: 'Empresas' }], href: '/companies' }),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'A company gallery page: a `GalleryView` of accounts derived from the contacts and deals fixtures of `Patterns/Collection`, each card with its open pipeline, open deal count and an `AvatarStack` of contacts. It renders inside `Application/Shell/AppShell1`, the layout it mounts in; the Code panel shows only the page, which goes in the `children` of the shell.',
      },
      story: appShellDocs,
    },
    layout: 'fullscreen',
  },
  title: 'Templates/Companies',
} satisfies Meta<typeof CompaniesTemplate>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const card = within(
      canvas.getByRole('article', { name: 'Padaria Estrela' }),
    )
    await expect(card.getByText('Pipeline aberto')).toBeVisible()
    await expect(
      card.getByRole('list', { name: 'Contatos de Padaria Estrela' }),
    ).toBeVisible()
  },
}

export const Loading: Story = {
  args: { loading: true },
}

export const Empty: Story = {
  args: { companies: [] },
}
