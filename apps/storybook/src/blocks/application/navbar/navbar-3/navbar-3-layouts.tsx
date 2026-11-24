import { Navbar3 } from '@tc96/blocks/application/navbar/navbar-3'
import {
  notifications,
  routes,
  user,
  userActions,
} from '../fixtures/navbar-3.ts'
import type { Navbar3Controls } from './navbar-3-controls.ts'

export const ComposedNavbar3 = ({
  hasUserActions,
  notificationCount,
  searchPlaceholder,
}: Readonly<Navbar3Controls>) => (
  <Navbar3
    labels={{ searchPlaceholder }}
    notifications={notifications.slice(0, notificationCount)}
    onNavigate={() => {}}
    onUserAction={() => {}}
    routes={routes}
    user={user}
    userActions={hasUserActions ? userActions : undefined}
  />
)
