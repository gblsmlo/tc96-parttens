import { Navbar5 } from '@tc96/blocks/application/navbar/navbar-5'
import { fn } from 'storybook/test'
import { actions, breadcrumb, people } from '../fixtures/navbar-5.ts'
import type { Navbar5Controls } from './navbar-5-controls.ts'

export const navbar5Handlers = {
  onPublish: fn(),
  onPublishAction: fn(),
}

export const ComposedNavbar5 = ({
  maxPeople,
  pending,
  peopleCount,
  showActions,
  showPublish,
  status,
}: Readonly<Navbar5Controls>) => (
  <Navbar5
    actions={showActions ? actions : []}
    breadcrumb={breadcrumb}
    maxPeople={maxPeople}
    onPublish={showPublish ? navbar5Handlers.onPublish : undefined}
    onPublishAction={showActions ? navbar5Handlers.onPublishAction : undefined}
    pending={pending}
    people={people.slice(0, peopleCount)}
    status={status}
  />
)
