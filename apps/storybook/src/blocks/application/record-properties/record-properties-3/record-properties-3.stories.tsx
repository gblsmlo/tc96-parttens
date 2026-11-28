import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  createRecordProperties3Catalog,
  RecordProperties3 as RecordProperties3Block,
} from '@tc96/ui/blocks/application/record-properties/record-properties-3'
import {
  taskCatalogLabels,
  taskPropertiesLabels,
  useTaskProperties,
} from '../fixtures/task-properties.tsx'

const catalog = createRecordProperties3Catalog(taskCatalogLabels)

function TaskProperties() {
  const items = useTaskProperties('badge')

  return (
    <RecordProperties3Block
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
  title: 'Blocks/Application/Record Properties/RecordProperties3',
} satisfies Meta<typeof TaskProperties>

export default meta

type Story = StoryObj<typeof meta>

export const RecordProperties3: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Label and value rows whose values are badges. A row never shows a label icon and a value icon together: the catalog (`createRecordProperties3Catalog`) gives no icon to Status, Prioridade, Responsável and the dates, whose badge starts with the option icon or the avatar, and keeps it on Tipo and Tags, whose badge has none. The rows start `pending`, with a skeleton named by `labels.loadingValue`, until the mocked request returns the task.',
      },
    },
  },
}
