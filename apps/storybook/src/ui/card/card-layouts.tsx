import { Button } from '@tc96/ui/button'
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardFrame,
  CardFrameAction,
  CardFrameDescription,
  CardFrameFooter,
  CardFrameHeader,
  CardFrameTitle,
  CardHeader,
  CardPanel,
  CardTitle,
} from '@tc96/ui/card'
import { type ReactElement, type ReactNode, useId } from 'react'
import type { CardControls, CardElementName } from './card-controls.ts'

const elementRenders: Record<CardElementName, ReactElement | undefined> = {
  article: <article />,
  div: undefined,
  section: <section />,
}

const members = [
  { email: 'ana.souza@northwind.example', name: 'Ana Souza', role: 'Owner' },
  { email: 'bruno.lima@northwind.example', name: 'Bruno Lima', role: 'Admin' },
  { email: 'carla.reis@northwind.example', name: 'Carla Reis', role: 'Member' },
]

const SampleFrame = ({ children }: Readonly<{ children: ReactNode }>) => (
  <CardFrame>
    <CardFrameHeader>
      <CardFrameTitle>Frame title</CardFrameTitle>
      <CardFrameDescription>
        A sentence about the cards below.
      </CardFrameDescription>
      <CardFrameAction>
        <Button size="sm" variant="outline">
          Add
        </Button>
      </CardFrameAction>
    </CardFrameHeader>
    {children}
    <CardFrameFooter>
      <p className="text-muted-foreground text-sm">
        A note about every card in the frame.
      </p>
    </CardFrameFooter>
  </CardFrame>
)

export const ComposedCard = ({
  action,
  content,
  description,
  element,
  footer,
  frame,
  separators,
  title,
}: Readonly<CardControls>) => {
  const titleId = useId()
  const card = (
    <Card
      aria-labelledby={element !== 'div' && title ? titleId : undefined}
      render={elementRenders[element]}
    >
      {title || description || action ? (
        <CardHeader className={separators ? 'border-b' : undefined}>
          {title ? <CardTitle id={titleId}>{title}</CardTitle> : null}
          {description ? (
            <CardDescription>{description}</CardDescription>
          ) : null}
          {action ? (
            <CardAction>
              <Button size="sm" variant="outline">
                Edit
              </Button>
            </CardAction>
          ) : null}
        </CardHeader>
      ) : null}
      {content ? (
        <CardPanel>
          <p className="text-sm">{content}</p>
        </CardPanel>
      ) : null}
      {footer ? (
        <CardFooter className={separators ? 'border-t' : undefined}>
          <p className="text-muted-foreground text-sm">{footer}</p>
        </CardFooter>
      ) : null}
    </Card>
  )

  return frame ? <SampleFrame>{card}</SampleFrame> : card
}

export const FooterActionsCard = () => (
  <Card>
    <CardHeader>
      <CardTitle>Card title</CardTitle>
      <CardDescription>A sentence about what the card holds.</CardDescription>
      <CardAction>
        <Button size="sm" variant="outline">
          Edit
        </Button>
      </CardAction>
    </CardHeader>
    <CardPanel>
      <p className="text-sm">The panel holds the main content of the card.</p>
    </CardPanel>
    <CardFooter className="justify-end gap-2">
      <Button size="sm" variant="ghost">
        Cancel
      </Button>
      <Button size="sm">Save</Button>
    </CardFooter>
  </Card>
)

export const StackedFrameCards = () => (
  <SampleFrame>
    <Card>
      <CardPanel>
        <p className="text-sm">The first card holds one group.</p>
      </CardPanel>
    </Card>
    <Card>
      <CardPanel>
        <p className="text-sm">The second card holds another group.</p>
      </CardPanel>
    </Card>
  </SampleFrame>
)

export const TeamMembersFrame = () => (
  <section aria-labelledby="team-members-title">
    <CardFrame>
      <CardFrameHeader>
        <CardFrameTitle
          render={(props) => <h2 {...props} />}
          id="team-members-title"
        >
          Team members
        </CardFrameTitle>
        <CardFrameDescription>
          People with access to the Northwind workspace.
        </CardFrameDescription>
        <CardFrameAction>
          <Button size="sm" variant="outline">
            Invite member
          </Button>
        </CardFrameAction>
      </CardFrameHeader>
      <Card>
        <CardPanel className="p-0">
          <ul className="divide-y">
            {members.map(({ email, name, role }) => (
              <li
                className="flex items-center justify-between gap-4 px-6 py-3"
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
        </CardPanel>
      </Card>
      <CardFrameFooter>
        <p className="text-muted-foreground text-sm">3 of 10 seats used</p>
      </CardFrameFooter>
    </CardFrame>
  </section>
)
