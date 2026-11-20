import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from '@tc96/ui/alert'
import { Button } from '@tc96/ui/button'
import {
  CircleAlertIcon,
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
} from 'lucide-react'
import { expect, fn, userEvent, within } from 'storybook/test'
import type { UsageDocsParameters } from '../../.storybook/docs-page.tsx'

const onDismiss = fn()
const onConfirm = fn()

const usage = `
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from '@acme/ui/alert'

<Alert variant="info">
  <InfoIcon aria-label="Information" role="img" />
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>Describe what can be done about it here.</AlertDescription>
  <AlertAction>
    <Button size="sm" variant="ghost">Dismiss</Button>
    <Button size="sm">Ok</Button>
  </AlertAction>
</Alert>
`

const docs = {
  api: [
    {
      description: `Root container. A \`div\` with \`role="alert"\`, so a screen reader announces it as soon as it is inserted. It is a grid: an \`svg\` as the first child takes a narrow first column, and an \`AlertAction\` adds a column at the end.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`variant\` | \`"default"\`, \`"error"\`, \`"info"\`, \`"success"\` or \`"warning"\` | \`"default"\` | Controls the alert styling and color scheme |`,
      name: 'Alert',
    },
    {
      description:
        'Title text. A `div` in `font-medium`; it moves to the second column when an icon comes before it.',
      name: 'AlertTitle',
    },
    {
      description:
        'Description text. A `div` in `text-muted-foreground` that stacks its children with `gap-2.5`, so it can hold several paragraphs.',
      name: 'AlertDescription',
    },
    {
      description:
        'Container for action buttons, which use the `Button` at `size="sm"`. On screens from `sm` up it sits on the right, centered across the title and the description; below `sm` it drops under the text.',
      name: 'AlertAction',
    },
  ],
  description: {
    component:
      'COSS Alert with one change: every variant keeps the default `border`, as the `Card` does, and the status shows only in the icon and the tinted background. A callout for important information in the flow of the page. The root always carries `role="alert"`: render it when the message appears, not as static copy on load. An icon is the first child; label it with `role="img"` and `aria-label` when it carries the status, as in the variant stories, and hide it with `aria-hidden` when the title already says it. Reference: [coss ui Alert](https://coss.com/ui/docs/components/alert).',
  },
  usage,
} satisfies UsageDocsParameters & Record<string, unknown>

const meta = {
  title: 'UI/Alert',
  component: Alert,
  args: {
    variant: 'default',
  },
  argTypes: {
    variant: {
      control: 'select',
      description: 'Controls the alert styling and color scheme.',
      options: ['default', 'error', 'info', 'success', 'warning'],
      table: { defaultValue: { summary: 'default' } },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-lg max-w-full">
        <Story />
      </div>
    ),
  ],
  parameters: { docs },
  render: (args) => (
    <Alert {...args}>
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        Describe what can be done about it here.
      </AlertDescription>
    </Alert>
  ),
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const alert = within(canvasElement).getByRole('alert')
    await expect(alert).toHaveAttribute('data-slot', 'alert')
    await expect(within(alert).getByText('Heads up!')).toBeVisible()
  },
}

export const WithIcon: Story = {
  render: (args) => (
    <Alert {...args}>
      <InfoIcon aria-hidden="true" />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        Describe what can be done about it here.
      </AlertDescription>
    </Alert>
  ),
}

export const WithAction: Story = {
  render: (args) => (
    <Alert {...args}>
      <InfoIcon aria-hidden="true" />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        Describe what can be done about it here.
      </AlertDescription>
      <AlertAction>
        <Button onClick={onDismiss} size="sm" variant="ghost">
          Dismiss
        </Button>
        <Button onClick={onConfirm} size="sm">
          Ok
        </Button>
      </AlertAction>
    </Alert>
  ),
  play: async ({ canvasElement }) => {
    const alert = within(canvasElement).getByRole('alert')
    await userEvent.click(within(alert).getByRole('button', { name: 'Ok' }))
    await expect(onConfirm).toHaveBeenCalledOnce()
    await expect(onDismiss).not.toHaveBeenCalled()
  },
}

export const Info: Story = {
  args: { variant: 'info' },
  render: (args) => (
    <Alert {...args}>
      <InfoIcon aria-label="Information" role="img" />
      <AlertTitle>A new version is available</AlertTitle>
      <AlertDescription>
        Reload the page to get the latest changes.
      </AlertDescription>
    </Alert>
  ),
}

export const Success: Story = {
  args: { variant: 'success' },
  render: (args) => (
    <Alert {...args}>
      <CircleCheckIcon aria-label="Success" role="img" />
      <AlertTitle>Changes saved</AlertTitle>
      <AlertDescription>
        Everyone in the workspace sees the new settings.
      </AlertDescription>
    </Alert>
  ),
}

export const Warning: Story = {
  args: { variant: 'warning' },
  render: (args) => (
    <Alert {...args}>
      <TriangleAlertIcon aria-label="Warning" role="img" />
      <AlertTitle>Your trial ends in 3 days</AlertTitle>
      <AlertDescription>
        Choose a plan to keep your projects and members.
      </AlertDescription>
    </Alert>
  ),
  play: async ({ canvasElement }) => {
    const alert = within(canvasElement).getByRole('alert')
    await expect(within(alert).getByRole('img', { name: 'Warning' })).toBe(
      alert.querySelector('svg'),
    )
  },
}

export const ErrorAlert: Story = {
  name: 'Error',
  args: { variant: 'error' },
  render: (args) => (
    <Alert {...args}>
      <CircleAlertIcon aria-label="Error" role="img" />
      <AlertTitle>Payment failed</AlertTitle>
      <AlertDescription>
        <p>The card on file was declined.</p>
        <p>Update the payment method to retry the charge.</p>
      </AlertDescription>
    </Alert>
  ),
}
