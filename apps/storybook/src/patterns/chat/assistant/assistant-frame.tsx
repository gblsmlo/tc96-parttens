import type { Decorator } from '@storybook/react-vite'

export const AssistantCanvas: Decorator = (Story) => (
  <div className="relative h-176 w-[56rem] max-w-full">
    <Story />
  </div>
)

export const WorkflowCanvas: Decorator = (Story) => (
  <div className="relative h-176 w-[56rem] max-w-full rounded-xl border border-dashed">
    <Story />
  </div>
)

export const ComposerCanvas: Decorator = (Story) => (
  <div className="w-96 max-w-full">
    <Story />
  </div>
)
