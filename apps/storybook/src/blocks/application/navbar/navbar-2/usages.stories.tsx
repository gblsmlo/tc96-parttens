import type { Meta, StoryObj } from '@storybook/react-vite'
import { Navbar2 } from '@tc96/ui/blocks/application/navbar/navbar-2'
import { Text } from '@tc96/ui/text'
import { useState } from 'react'
import { environments, organizations, projects } from '../fixtures/navbar-2.ts'

const DeployConsole = () => {
  const [organizationId, setOrganizationId] = useState('acme')
  const [projectId, setProjectId] = useState('checkout')
  const [environmentId, setEnvironmentId] = useState('staging')
  const environment = environments.find((item) => item.id === environmentId)
  const project = projects.find((item) => item.id === projectId)

  return (
    <div className="flex min-h-96 flex-col">
      <Navbar2
        environmentId={environmentId}
        environments={environments}
        onEnvironmentChange={setEnvironmentId}
        onOrgChange={setOrganizationId}
        onProjectChange={setProjectId}
        organizationId={organizationId}
        organizations={organizations}
        projectId={projectId}
        projects={projects}
      />
      <main className="p-6">
        <Text>
          {`Último deploy de ${project?.name} em ${environment?.name}: há 12 minutos, sem falhas.`}
        </Text>
      </main>
    </div>
  )
}

const meta = {
  component: DeployConsole,
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Navbar/Navbar2/Usages',
} satisfies Meta<typeof DeployConsole>

export default meta

type Story = StoryObj<typeof meta>

export const SwitchingTheEnvironmentOfADeployConsole: Story = {}
