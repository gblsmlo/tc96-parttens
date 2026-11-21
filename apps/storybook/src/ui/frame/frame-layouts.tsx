import { Button } from '@tc96/ui/button'
import {
  Frame,
  FrameDescription,
  FrameFooter,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from '@tc96/ui/frame'
import type { FrameControls } from './frame-controls.ts'

const members = [
  { email: 'ana.souza@northwind.example', name: 'Ana Souza', role: 'Owner' },
  { email: 'bruno.lima@northwind.example', name: 'Bruno Lima', role: 'Admin' },
  { email: 'carla.reis@northwind.example', name: 'Carla Reis', role: 'Member' },
]

export const ComposedFrame = ({
  content,
  description,
  footer,
  secondPanel,
  title,
}: Readonly<FrameControls>) => (
  <Frame>
    {title || description ? (
      <FrameHeader>
        {title ? <FrameTitle>{title}</FrameTitle> : null}
        {description ? (
          <FrameDescription>{description}</FrameDescription>
        ) : null}
      </FrameHeader>
    ) : null}
    <FramePanel>
      {content ? <p className="text-sm">{content}</p> : null}
    </FramePanel>
    {secondPanel ? (
      <FramePanel>
        <p className="text-sm">A second panel holds a separate group.</p>
      </FramePanel>
    ) : null}
    {footer ? (
      <FrameFooter>
        <p className="text-muted-foreground text-sm">{footer}</p>
      </FrameFooter>
    ) : null}
  </Frame>
)

export const TeamMembersFrame = () => (
  <section aria-labelledby="team-members-title">
    <Frame>
      <FrameHeader>
        <FrameTitle>
          <h2 id="team-members-title">Team members</h2>
        </FrameTitle>
        <FrameDescription>
          People with access to the Northwind workspace.
        </FrameDescription>
      </FrameHeader>
      <FramePanel className="p-0">
        <ul className="divide-y">
          {members.map(({ email, name, role }) => (
            <li
              className="flex items-center justify-between gap-4 px-5 py-3"
              key={email}
            >
              <div className="flex min-w-0 flex-col">
                <span className="font-medium text-sm">{name}</span>
                <span className="truncate text-muted-foreground text-sm">
                  {email}
                </span>
              </div>
              <span className="text-muted-foreground text-sm">{role}</span>
            </li>
          ))}
        </ul>
      </FramePanel>
      <FrameFooter className="flex items-center justify-between gap-4">
        <p className="text-muted-foreground text-sm">3 of 10 seats used</p>
        <Button size="sm" variant="outline">
          Invite member
        </Button>
      </FrameFooter>
    </Frame>
  </section>
)
