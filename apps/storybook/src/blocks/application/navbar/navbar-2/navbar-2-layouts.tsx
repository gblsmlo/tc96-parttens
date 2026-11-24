import { Navbar2 } from '@tc96/blocks/application/navbar/navbar-2'
import { useEffect, useState } from 'react'
import { environments, organizations, projects } from '../fixtures/navbar-2.ts'
import type { Navbar2Controls } from './navbar-2-controls.ts'

export const ComposedNavbar2 = ({
  environment,
  organization,
  project,
}: Readonly<Navbar2Controls>) => {
  const [organizationId, setOrganizationId] = useState(organization)
  const [projectId, setProjectId] = useState(project)
  const [environmentId, setEnvironmentId] = useState(environment)

  useEffect(() => setOrganizationId(organization), [organization])
  useEffect(() => setProjectId(project), [project])
  useEffect(() => setEnvironmentId(environment), [environment])

  return (
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
  )
}
