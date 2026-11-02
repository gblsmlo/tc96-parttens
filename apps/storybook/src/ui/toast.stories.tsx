import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import { Spinner } from '@tc96/ui/spinner'
import {
  AnchoredToastProvider,
  anchoredToastManager,
  ToastProvider,
  toastManager,
} from '@tc96/ui/toast'
import { Tooltip, TooltipPopup, TooltipTrigger } from '@tc96/ui/tooltip'
import { SaveIcon } from 'lucide-react'
import { useRef, useState } from 'react'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import type { UsageDocsParameters } from '../../.storybook/docs-page.tsx'

const usage = `
import {
  AnchoredToastProvider,
  ToastProvider,
  toastManager,
} from '@acme/ui/toast'

export function RootLayout({ children }) {
  return (
    <ToastProvider>
      <AnchoredToastProvider>{children}</AnchoredToastProvider>
    </ToastProvider>
  )
}

toastManager.add({
  description: 'Monday, January 3rd at 6:00pm',
  title: 'Event has been created',
})
`

const docs = {
  api: [
    {
      description: `Mounts the stacked toasts of \`toastManager\` in a portal, fixed to one corner or edge of the viewport. Styled wrapper for \`Toast.Provider\` from Base UI, so \`limit\` and \`timeout\` (5000 ms by default) apply to every toast. Mount it once, at the root of the app.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`position\` | \`"top-left"\`, \`"top-center"\`, \`"top-right"\`, \`"bottom-left"\`, \`"bottom-center"\` or \`"bottom-right"\` | \`"bottom-right"\` | Where the stack sits; it also sets the swipe direction that dismisses a toast |
| \`portalProps\` | \`Toast.Portal.Props\` | | Forwarded to the portal, for example \`container\` |`,
      name: 'ToastProvider',
    },
    {
      description:
        'Mounts the toasts of `anchoredToastManager`, each one positioned next to an element, in a region named `Anchored notifications`. Takes `portalProps`, as `ToastProvider` does.',
      name: 'AnchoredToastProvider',
    },
    {
      description: `The Base UI toast manager behind \`ToastProvider\`. \`add\` returns the id; adding with an id already on screen updates that toast in place, restarts its timer and replays a short animation (a shake for \`error\`, a pulse for the other types). \`close(id)\`, \`update(id, options)\` and \`promise(promise, { loading, success, error })\` complete it.

| Option | Type | Description |
| --- | --- | --- |
| \`title\`, \`description\` | \`ReactNode\` | Text of the toast |
| \`type\` | \`"success"\`, \`"error"\`, \`"info"\`, \`"warning"\` or \`"loading"\` | Adds the matching icon; \`loading\` spins |
| \`timeout\` | \`number\` | Milliseconds before it closes; \`0\` keeps it open |
| \`actionProps\` | \`Toast.Action.Props\` | Renders a \`Button\` at \`size="sm"\` with these props |
| \`id\` | \`string\` | Stable id to update a toast instead of stacking another |
| \`priority\` | \`"low"\` or \`"high"\` | \`high\` announces it assertively |`,
      name: 'toastManager',
    },
    {
      description:
        'Manager for `AnchoredToastProvider`, with the same methods. `positionerProps.anchor` is the element the toast points at (a toast without it is not rendered) and `sideOffset` is the gap, 4 by default. `data: { tooltipStyle: true }` renders only the title, in a compact tooltip.',
      name: 'anchoredToastManager',
    },
  ],
  description: {
    component:
      'COSS Toast with one change: the anchored viewport is named `Anchored notifications`, so the two notification regions stay distinct. Short, temporary notifications on Base UI Toast: the consumer calls `toastManager.add` from an event handler and the providers render the toasts. Hovering or focusing the stack expands it and pauses the timers. Each toast is announced by a live region without moving focus, so keep anything the user must act on reachable outside the toast as well. Reference: [coss ui Toast](https://coss.com/ui/docs/components/toast).',
  },
  story: { iframeHeight: 280, inline: false },
  usage,
} satisfies UsageDocsParameters & Record<string, unknown>

const meta = {
  title: 'UI/Toast',
  component: ToastProvider,
  args: {
    position: 'bottom-right',
  },
  argTypes: {
    position: {
      control: 'select',
      description:
        'Where the stack sits; it also sets the swipe direction that dismisses a toast.',
      options: [
        'top-left',
        'top-center',
        'top-right',
        'bottom-left',
        'bottom-center',
        'bottom-right',
      ],
      table: { defaultValue: { summary: 'bottom-right' } },
    },
  },
  decorators: [
    (Story, { args }) => (
      <ToastProvider position={args.position}>
        <AnchoredToastProvider>
          <Story />
        </AnchoredToastProvider>
      </ToastProvider>
    ),
  ],
  parameters: { docs },
  render: () => (
    <Button
      onClick={() =>
        toastManager.add({
          description: 'Monday, January 3rd at 6:00pm',
          title: 'Event has been created',
        })
      }
      variant="outline"
    >
      Show toast
    </Button>
  ),
} satisfies Meta<typeof ToastProvider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body)
    await userEvent.click(page.getByRole('button', { name: 'Show toast' }))
    await expect(
      await page.findByText('Event has been created'),
    ).toBeInTheDocument()
    await expect(
      page.getByText('Monday, January 3rd at 6:00pm'),
    ).toBeInTheDocument()
  },
}

export const WithStatus: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button
        onClick={() =>
          toastManager.add({
            description: 'Your changes have been saved.',
            title: 'Success!',
            type: 'success',
          })
        }
        variant="outline"
      >
        Success
      </Button>
      <Button
        onClick={() =>
          toastManager.add({
            description: 'There was a problem with your request.',
            title: 'Uh oh! Something went wrong.',
            type: 'error',
          })
        }
        variant="outline"
      >
        Error
      </Button>
      <Button
        onClick={() =>
          toastManager.add({
            description: 'You can add components to your app using the CLI.',
            title: 'Heads up!',
            type: 'info',
          })
        }
        variant="outline"
      >
        Info
      </Button>
      <Button
        onClick={() =>
          toastManager.add({
            description: 'Your session is about to expire.',
            title: 'Warning!',
            type: 'warning',
          })
        }
        variant="outline"
      >
        Warning
      </Button>
    </div>
  ),
}

export const Loading: Story = {
  render: () => (
    <Button
      onClick={() =>
        toastManager.add({
          description: 'Please wait while we process your request.',
          title: 'Loading…',
          type: 'loading',
        })
      }
      variant="outline"
    >
      Loading toast
    </Button>
  ),
}

export const WithAction: Story = {
  render: () => (
    <Button
      onClick={() => {
        const id = toastManager.add({
          actionProps: {
            children: 'Undo',
            onClick: () => {
              toastManager.close(id)
              toastManager.add({
                description: 'The action has been reverted.',
                title: 'Action undone',
                type: 'info',
              })
            },
          },
          description: 'You can undo this action.',
          timeout: 0,
          title: 'Action performed',
          type: 'success',
        })
      }}
      variant="outline"
    >
      Perform action
    </Button>
  ),
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body)
    await userEvent.click(page.getByRole('button', { name: 'Perform action' }))
    await userEvent.click(await page.findByRole('button', { name: 'Undo' }))
    await expect(await page.findByText('Action undone')).toBeInTheDocument()
    await waitFor(() =>
      expect(page.queryByText('Action performed')).not.toBeInTheDocument(),
    )
  },
}

export const PromiseToast: Story = {
  name: 'Promise',
  render: () => (
    <Button
      onClick={() =>
        toastManager.promise(
          new Promise<string>((resolve) =>
            setTimeout(() => resolve('3 files uploaded'), 2000),
          ),
          {
            error: () => ({
              description: 'Please try again.',
              title: 'Something went wrong',
            }),
            loading: {
              description: 'The files are uploading.',
              title: 'Uploading…',
            },
            success: (data: string) => ({
              description: data,
              title: 'Upload complete',
            }),
          },
        )
      }
      variant="outline"
    >
      Upload files
    </Button>
  ),
}

export const Deduplicated: Story = {
  render: () => (
    <Button
      onClick={() =>
        toastManager.add({
          description: 'Repeated clicks update this toast instead of stacking.',
          id: 'storybook-dedup-toast',
          title: 'Saved',
          type: 'success',
        })
      }
      variant="outline"
    >
      Save
    </Button>
  ),
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body)
    const save = page.getByRole('button', { name: 'Save' })
    await userEvent.click(save)
    await page.findByText('Saved')
    await userEvent.click(save)
    await expect(page.getAllByText('Saved')).toHaveLength(1)
  },
}

const messages = [
  'Short message.',
  'A message long enough to wrap onto a second line in the toast.',
  'A longer message that runs across several lines, so the stack has to measure each toast before it lays them out and expands.',
  'Done.',
]

function VaryingHeightsDemo() {
  const [count, setCount] = useState(0)
  return (
    <Button
      onClick={() => {
        toastManager.add({
          description: messages[count % messages.length],
          title: `Toast ${count + 1} created`,
        })
        setCount(count + 1)
      }}
      variant="outline"
    >
      Add toast
    </Button>
  )
}

export const VaryingHeights: Story = {
  render: () => <VaryingHeightsDemo />,
}

function AnchoredDemo() {
  const saveRef = useRef<HTMLButtonElement>(null)
  return (
    <Tooltip>
      <TooltipTrigger
        delay={0}
        render={
          <Button
            aria-label="Save draft"
            onClick={() =>
              anchoredToastManager.add({
                data: { tooltipStyle: true },
                id: 'storybook-anchored-save-toast',
                positionerProps: { anchor: saveRef.current, sideOffset: 6 },
                timeout: 2000,
                title: 'Draft saved',
              })
            }
            ref={saveRef}
            size="icon"
            variant="outline"
          />
        }
      >
        <SaveIcon aria-hidden="true" />
      </TooltipTrigger>
      <TooltipPopup>Save draft</TooltipPopup>
    </Tooltip>
  )
}

export const Anchored: Story = {
  render: () => <AnchoredDemo />,
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body)
    await userEvent.click(page.getByRole('button', { name: 'Save draft' }))
    await expect(await page.findByText('Draft saved')).toBeInTheDocument()
  },
}

function AnchoredErrorDemo() {
  const submitRef = useRef<HTMLButtonElement>(null)
  const toastId = useRef<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const submit = async () => {
    if (toastId.current) anchoredToastManager.close(toastId.current)
    setSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setSubmitting(false)
    toastId.current = anchoredToastManager.add({
      description: 'The server did not respond. Try again in a moment.',
      positionerProps: { anchor: submitRef.current, sideOffset: 4 },
      title: 'Error submitting form',
      type: 'error',
    })
  }

  return (
    <Button disabled={submitting} onClick={submit} ref={submitRef}>
      {submitting && <Spinner />}
      {submitting ? 'Submitting…' : 'Submit'}
    </Button>
  )
}

export const AnchoredError: Story = {
  render: () => <AnchoredErrorDemo />,
}
