import {
  ArrowSquareOutIcon,
  CheckCircleIcon,
  DotsThreeIcon,
  ReceiptIcon,
  TrashIcon,
} from '@phosphor-icons/react'
import {
  RecordGroup,
  RecordGroupItem,
  RecordStatusBadge,
  SelectProperty,
  type SelectPropertyOption,
} from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import {
  Menu,
  MenuItem,
  MenuPopup,
  MenuSeparator,
  MenuTrigger,
} from '@tc96/ui/menu'
import { useState } from 'react'

const ignore = (_id: string) => undefined

const statusOptions: readonly SelectPropertyOption[] = [
  { label: 'Paga', value: 'paid' },
  { label: 'Prevista', value: 'scheduled' },
  { label: 'Atrasada', value: 'overdue' },
]

export const installments = [
  { id: 'parcela-1', status: 'paid', title: 'Parcela 1' },
  { id: 'parcela-2', status: 'scheduled', title: 'Parcela 2' },
  {
    id: 'parcela-3',
    status: 'scheduled',
    title:
      'Parcela 3 do contrato de honorários da ação revisional bancária, renegociada em setembro',
  },
] as const

export function InstallmentsGroup({
  editable = false,
}: Readonly<{ editable?: boolean }>) {
  const [status, setStatus] = useState<Record<string, string | null>>(
    Object.fromEntries(installments.map(({ id, status }) => [id, status])),
  )

  return (
    <RecordGroup title="Parcelas">
      {installments.map((installment) => (
        <RecordGroupItem
          key={installment.id}
          leading={<ReceiptIcon aria-hidden />}
          title={installment.title}
        >
          <SelectProperty
            ariaLabel={`Status da ${installment.title}`}
            onValueChange={(next) =>
              setStatus((current) => ({ ...current, [installment.id]: next }))
            }
            options={statusOptions}
            readOnly={!editable}
            value={status[installment.id] ?? null}
            variant="plain"
          />
        </RecordGroupItem>
      ))}
    </RecordGroup>
  )
}

export function InstallmentsMenuGroup() {
  return (
    <RecordGroup title="Parcelas">
      {installments.map((installment) => (
        <RecordGroupItem
          key={installment.id}
          leading={<ReceiptIcon aria-hidden />}
          title={installment.title}
        >
          <Menu>
            <MenuTrigger
              aria-label={`Ações da ${installment.title}`}
              render={<Button size="icon-sm" variant="ghost" />}
            >
              <DotsThreeIcon aria-hidden="true" />
            </MenuTrigger>
            <MenuPopup align="end">
              <MenuItem>
                <ArrowSquareOutIcon aria-hidden="true" />
                Abrir
              </MenuItem>
              <MenuItem>
                <CheckCircleIcon aria-hidden="true" />
                Marcar como paga
              </MenuItem>
              <MenuSeparator />
              <MenuItem variant="destructive">
                <TrashIcon aria-hidden="true" />
                Excluir
              </MenuItem>
            </MenuPopup>
          </Menu>
        </RecordGroupItem>
      ))}
    </RecordGroup>
  )
}

const installmentStatus = {
  paid: { color: 'var(--success-foreground)', label: 'Paga' },
  scheduled: { color: 'var(--muted-foreground)', label: 'Prevista' },
} as const

export function InstallmentsLinkGroup({
  onOpen = ignore,
  title = 'Parcelas',
}: Readonly<{ onOpen?: (id: string) => void; title?: string }>) {
  return (
    <RecordGroup title={title}>
      {installments.map((installment) => {
        const status = installmentStatus[installment.status]
        return (
          <RecordGroupItem
            interactive
            key={installment.id}
            leading={<ReceiptIcon aria-hidden />}
            title={
              <a
                className="rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                href={`#/parcelas/${installment.id}`}
                onClick={(event) => {
                  event.preventDefault()
                  onOpen(installment.id)
                }}
              >
                {installment.title}
              </a>
            }
          >
            <RecordStatusBadge color={status.color}>
              {status.label}
            </RecordStatusBadge>
          </RecordGroupItem>
        )
      })}
    </RecordGroup>
  )
}
