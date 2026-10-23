import type { Meta, StoryObj } from '@storybook/react-vite'
import { FlowRunCard, FlowStepLibrary, groupStepTypes } from '@tc96/parttens'
import { expect, fn, userEvent, within } from 'storybook/test'
import type { UsageDocsParameters } from '../../../../.storybook/docs-page.tsx'
import { agentStepTypes } from './fixtures/agent'
import { failedRun, notRunRun, passedRun } from './fixtures/runs'
import { workflowStepTypes } from './fixtures/workflow'

const usage = `
import {
  FlowRunCard,
  FlowStepLibrary,
  groupStepTypes,
} from '@acme/patterns'

<FlowStepLibrary groups={groupStepTypes(stepTypes)} onAdd={addStep}>
  <FlowRunCard run={lastRun} />
</FlowStepLibrary>
`

const docs = {
  api: [
    {
      description:
        'Panel of step types grouped by `group`, on the left of a flow editor. Each group is a `group` named by its label and each step is a draggable button that writes the step type under `FLOW_STEP_TRANSFER_TYPE` on drag start and calls `onAdd` on click. The list scrolls in a `ScrollArea`; `loading` shows skeletons and `aria-busy`; without groups it shows an empty message. `children` fill the footer, where the run card goes. `collapsed` keeps only the icons, with the names read by screen readers. Texts come from `labels` in pt-BR.',
      name: 'FlowStepLibrary',
    },
    {
      description:
        'The last run of the flow: a COSS `Card` region named by `labels.title`, with the step icon, the status `Badge`, the note or the count of completed steps, and a `Progress` named with the percentage. The consumer passes the `run` summary and the status labels.',
      name: 'FlowRunCard',
    },
  ],
  description: {
    component:
      'Step library of the flow editors: the consumer passes the step types grouped by `groupStepTypes`, receives `onAdd` for a click and renders the last run in the footer. The pattern does not fetch, persist or sort; it reads the step types it receives.',
  },
  usage,
} satisfies UsageDocsParameters & Record<string, unknown>

const workflowGroups = groupStepTypes(workflowStepTypes)
const agentGroups = groupStepTypes(agentStepTypes)

const meta = {
  args: {
    className: 'h-[32rem] w-72 rounded-xl border bg-card p-4',
    groups: workflowGroups,
    onAdd: fn((_type) => {}),
  },
  component: FlowStepLibrary,
  parameters: { docs, layout: 'padded' },
  title: 'Patterns/Flow/Step Library',
} satisfies Meta<typeof FlowStepLibrary>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: <FlowRunCard run={failedRun} />,
  },
  play: async ({ args, canvasElement }) => {
    const item = within(canvasElement).getByRole('button', {
      name: 'Enviar e-mail',
    })

    await userEvent.click(item)

    expect(args.onAdd).toHaveBeenCalledWith(workflowStepTypes[0])
  },
}

export const Loading: Story = {
  args: {
    groups: [],
    loading: true,
  },
}

export const Empty: Story = {
  args: {
    groups: [],
  },
}

export const WithRunCardFailed: Story = {
  args: {
    children: <FlowRunCard run={failedRun} />,
  },
}

export const WithRunCardPassed: Story = {
  args: {
    children: <FlowRunCard run={passedRun} />,
  },
}

export const WithRunCardNotRun: Story = {
  args: {
    children: <FlowRunCard run={notRunRun} />,
  },
}

export const Collapsed: Story = {
  args: {
    className: 'h-[32rem] rounded-xl border bg-card p-3',
    collapsed: true,
  },
}

export const AgentGroups: Story = {
  args: {
    groups: agentGroups,
    children: <FlowRunCard run={notRunRun} />,
  },
}
