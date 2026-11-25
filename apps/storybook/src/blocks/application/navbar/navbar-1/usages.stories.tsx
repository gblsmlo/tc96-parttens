import type { Meta, StoryObj } from '@storybook/react-vite'
import { Navbar1 } from '@tc96/ui/blocks/application/navbar/navbar-1'
import { MenuItem } from '@tc96/ui/menu'
import { Text } from '@tc96/ui/text'
import { breadcrumbs, collaborators } from '../fixtures/navbar-1.ts'

const ProjectPage = () => (
  <div className="flex min-h-96 flex-col">
    <Navbar1
      breadcrumbs={breadcrumbs}
      collaborators={collaborators}
      menu={<MenuItem>Duplicar projeto</MenuItem>}
      onShare={() => {}}
    />
    <main className="p-6">
      <Text>
        A entrega está prevista para 12 de dezembro, com 18 de 24 tarefas
        concluídas.
      </Text>
    </main>
  </div>
)

const meta = {
  component: ProjectPage,
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Navbar/Navbar1/Usages',
} satisfies Meta<typeof ProjectPage>

export default meta

type Story = StoryObj<typeof meta>

export const ProjectPageHeader: Story = {}
