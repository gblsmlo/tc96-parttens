import type { Meta, StoryObj } from '@storybook/react-vite'
import { Text } from '@tc96/ui/text'
import { TaskProperties } from './record-properties-1-layouts.tsx'

function TaskDetails() {
  return (
    <div className="flex max-w-3xl flex-col gap-4">
      <h1>
        <Text family="heading" size="xl" weight="semibold">
          Revisar contrato de prestação de serviços
        </Text>
      </h1>
      <TaskProperties customProperty />
    </div>
  )
}

const meta = {
  component: TaskDetails,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Record Properties/RecordProperties1/Usages',
} satisfies Meta<typeof TaskDetails>

export default meta

type Story = StoryObj<typeof meta>

export const TaskDetailsPage: Story = {}
