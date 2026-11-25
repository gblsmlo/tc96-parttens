import { Navbar9 } from '@tc96/ui/blocks/application/navbar/navbar-9'
import { fn } from 'storybook/test'
import { branches, path } from '../fixtures/navbar-9.ts'
import type { Navbar9Controls } from './navbar-9-controls.ts'

export const navbar9Handlers = {
  onBranchChange: fn(),
  onRun: fn(),
  onShare: fn(),
}

export const ComposedNavbar9 = ({
  branch,
  running,
  showBranches,
  showRun,
  showShare,
}: Readonly<Navbar9Controls>) => (
  <Navbar9
    branch={branch}
    branches={showBranches ? branches : undefined}
    name="Código Vivo"
    onBranchChange={showBranches ? navbar9Handlers.onBranchChange : undefined}
    onRun={showRun ? navbar9Handlers.onRun : undefined}
    onShare={showShare ? navbar9Handlers.onShare : undefined}
    path={path}
    running={running}
  />
)
