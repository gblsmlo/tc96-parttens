import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  createRecordProperties1Catalog,
  RecordProperties1 as RecordProperties1Block,
} from '@tc96/ui/blocks/application/record-properties/record-properties-1'
import {
  taskCatalogLabels,
  taskPropertiesLabels,
  useTaskProperties,
} from '../fixtures/task-properties.tsx'

const catalog = createRecordProperties1Catalog(taskCatalogLabels)

function TaskProperties() {
  const items = useTaskProperties('plain')

  return (
    <RecordProperties1Block
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
  title: 'Blocks/Application/Record Properties/RecordProperties1',
} satisfies Meta<typeof TaskProperties>

export default meta

type Story = StoryObj<typeof meta>

export const RecordProperties1: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Label and value rows whose labels take the catalog icon (`createRecordProperties1Catalog`) and whose values are `plain`. A row with a label icon hides the icon of its value (`data-slot="property-icon"`), so Status and Prioridade show only the label icon; `icon: null` on an item drops its label icon. The rows start `pending`, with a skeleton named by `labels.loadingValue`, until the mocked request returns the task.',
      },
    },
  },
}
