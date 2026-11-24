import type { Navbar2Labels } from './types'

export const defaultNavbar2Labels: Navbar2Labels = {
  breadcrumb: 'Contexto atual',
  environment: 'Ambiente',
  environmentTrigger: (name) => `Ambiente: ${name}`,
  organization: 'Organização',
  organizationTrigger: (name) => `Organização: ${name}`,
  project: 'Projeto',
  projectTrigger: (name) => `Projeto: ${name}`,
}
