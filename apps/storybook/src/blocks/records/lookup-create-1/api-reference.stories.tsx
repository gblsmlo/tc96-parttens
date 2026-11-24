import type { Meta, StoryObj } from '@storybook/react-vite'
import { LookupCreate1 } from '@tc96/blocks/records/lookup-create-1'
import { Slot } from '../../../test-utils/anatomy-slot'

const meta = {
  parameters: { docs: { story: { iframeHeight: '520px', inline: false } } },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Records/LookupCreate1/API Reference',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const ignore = () => undefined

export const Anatomy: Story = {
  render: () => (
    <LookupCreate1
      identifier=""
      identifierState="available"
      onIdentifierChange={ignore}
      onOpenChange={ignore}
      onRetry={ignore}
      onStepChange={ignore}
      onSubmit={() => true}
      onTitleChange={ignore}
      open
      recordTitle="Título"
      sources={[
        {
          detail: <Slot name="detail" />,
          id: 'source',
          status: 'running',
          title: <Slot name="title" />,
        },
      ]}
      step="details"
    >
      <Slot name="children" />
    </LookupCreate1>
  ),
}
