import type { Meta, StoryObj } from '@storybook/react-vite'
import { appShellDocs, withAppShell } from '../fixtures/app-shell'
import { AgendaTemplate } from './agenda-template'

const meta = {
  component: AgendaTemplate,
  decorators: [
    withAppShell({
      breadcrumbs: [{ label: 'Agenda' }],
      href: '/agenda',
      scrollArea: false,
    }),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'An agenda page: the calendar toolbar and `CalendarView` of the `Calendar` usage mounted in `CollectionFrame`. It renders inside `Blocks/Application/Shell/AppShell1` with `scrollArea={false}`, so the shell adds no scroll area and the collection body is the only part that scrolls; the Code panel shows only the page, which goes in the `children` of the shell.',
      },
      story: appShellDocs,
    },
    layout: 'fullscreen',
  },
  title: 'Templates/Agenda',
} satisfies Meta<typeof AgendaTemplate>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Month: Story = {
  args: { defaultMode: 'month' },
}

export const Loading: Story = {
  args: { loading: true },
}
