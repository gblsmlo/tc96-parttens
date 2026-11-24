import type { NavbarTone } from '../shared/types'

export interface Navbar2Option {
  id: string
  name: string
}

export interface Navbar2Environment extends Navbar2Option {
  tone?: NavbarTone
}

export interface Navbar2Labels {
  breadcrumb: string
  environment: string
  environmentTrigger: (name: string) => string
  organization: string
  organizationTrigger: (name: string) => string
  project: string
  projectTrigger: (name: string) => string
}

export interface Navbar2Props {
  className?: string
  environmentId: string
  environments: Navbar2Environment[]
  labels?: Partial<Navbar2Labels>
  onEnvironmentChange: (environmentId: string) => void
  onOrgChange: (organizationId: string) => void
  onProjectChange: (projectId: string) => void
  organizationId: string
  organizations: Navbar2Option[]
  projectId: string
  projects: Navbar2Option[]
}
