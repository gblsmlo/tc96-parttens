import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  createRecordProperties2Catalog,
  RecordProperties2 as RecordProperties2Block,
} from '@tc96/ui/blocks/application/record-properties/record-properties-2'
import {
  taskCatalogLabels,
  taskPropertiesLabels,
  useTaskProperties,
} from '../fixtures/task-properties.tsx'

const catalog = createRecordProperties2Catalog(taskCatalogLabels)

function TaskProperties() {
  const items = useTaskProperties('plain')

  return (
    <RecordProperties2Block
      ariaLabel="Propriedades da tarefa"
      catalog={catalog}
      items={items}
      labels={taskPropertiesLabels}
    />
  )
}

const meta = {
  component: TaskProperties,
  decorators: [
    (Story) => (
      <div className="w-150 max-w-full">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Record Properties/RecordProperties2',
} satisfies Meta<typeof TaskProperties>

export default meta

type Story = StoryObj<typeof meta>

export const RecordProperties2: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Label and value rows whose labels have no icon: the catalog (`createRecordProperties2Catalog`) holds only labels. The values are `plain` and keep their own icons, so Status and Prioridade start with the option icon. The rows start `pending`, with a skeleton named by `labels.loadingValue`, until the mocked request returns the task.',
      },
    },
  },
}
