import { Navbar1 } from '@tc96/ui/blocks/application/navbar/navbar-1'
import { MenuItem, MenuSeparator } from '@tc96/ui/menu'
import { breadcrumbs, collaborators } from '../fixtures/navbar-1.ts'
import type { Navbar1Controls } from './navbar-1-controls.ts'

const projectMenu = (
  <>
    <MenuItem>Duplicar projeto</MenuItem>
    <MenuItem>Arquivar projeto</MenuItem>
    <MenuSeparator />
    <MenuItem variant="destructive">Excluir projeto</MenuItem>
  </>
)

export const ComposedNavbar1 = ({
  collaboratorCount,
  menu,
  share,
  shareable,
}: Readonly<Navbar1Controls>) => (
  <Navbar1
    breadcrumbs={breadcrumbs}
    collaborators={collaborators.slice(0, collaboratorCount)}
    labels={{ share }}
    menu={menu ? projectMenu : undefined}
    onShare={shareable ? () => {} : undefined}
  />
)
