import {
  ArrowSquareOutIcon,
  LinkIcon,
  type Icon as PhosphorIcon,
  PlusIcon,
  ScalesIcon,
} from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import { Menu, MenuItem, MenuPopup, MenuTrigger } from '@tc96/ui/menu'
import {
  RecordGroup,
  RecordGroupDivider,
  RecordGroupLink,
  RecordGroupRow,
  RecordGroupSubgroup,
  type RecordGroupVariant,
  SelectProperty,
  type SelectPropertyOption,
} from '@tc96/ui/patterns'
import { Fragment, useState } from 'react'

type ProceedingRole =
  | 'origin'
  | 'appeal'
  | 'enforcement'
  | 'precautionary'
  | 'incidental'
  | 'attachment'

type CourtInstance =
  | 'first_degree'
  | 'second_degree'
  | 'superior'
  | 'supreme'
  | 'other'

interface Proceeding {
  caseNumber: string
  courtLink: string
  courtName: string
  courtInstance: CourtInstance
  href: string
  id: string
  role: ProceedingRole
  stage: string
}

const ignore = (..._values: unknown[]) => undefined
const onAdd = ignore

const roleOptions: readonly SelectPropertyOption[] = [
  { label: 'Originário', value: 'origin' },
  { label: 'Recurso', value: 'appeal' },
  { label: 'Cumprimento', value: 'enforcement' },
  { label: 'Cautelar', value: 'precautionary' },
  { label: 'Incidental', value: 'incidental' },
  { label: 'Apenso', value: 'attachment' },
]

const instanceOptions: readonly SelectPropertyOption[] = [
  { label: '1º grau', value: 'first_degree' },
  { label: '2º grau', value: 'second_degree' },
  { label: 'Tribunal superior', value: 'superior' },
  { label: 'STF', value: 'supreme' },
  { label: 'Outra', value: 'other' },
]

const courtOptions: readonly SelectPropertyOption[] = [
  {
    label: '2ª Vara Cível do Foro Central',
    value: '2ª Vara Cível do Foro Central',
  },
  {
    label: '15ª Câmara de Direito Privado do TJSP',
    value: '15ª Câmara de Direito Privado do TJSP',
  },
  { label: 'Terceira Turma do STJ', value: 'Terceira Turma do STJ' },
]

const addItems: readonly {
  icon: PhosphorIcon
  label: string
  value: ProceedingRole
}[] = [
  { icon: ScalesIcon, label: 'Recurso', value: 'appeal' },
  { icon: ScalesIcon, label: 'Cumprimento', value: 'enforcement' },
  { icon: ScalesIcon, label: 'Cautelar', value: 'precautionary' },
  { icon: ScalesIcon, label: 'Incidental', value: 'incidental' },
  { icon: LinkIcon, label: 'Apenso', value: 'attachment' },
]

const proceedings: readonly Proceeding[] = [
  {
    caseNumber: '1002345-67.2025.8.26.0100',
    courtInstance: 'first_degree',
    courtLink: 'https://tribunal.example/processos/1002345-67.2025.8.26.0100',
    courtName: '2ª Vara Cível do Foro Central',
    href: '#/juridico/processos/originario',
    id: 'origin',
    role: 'origin',
    stage: '1º grau',
  },
  {
    caseNumber: '2104567-89.2026.8.26.0000',
    courtInstance: 'second_degree',
    courtLink: 'https://tribunal.example/processos/2104567-89.2026.8.26.0000',
    courtName: '15ª Câmara de Direito Privado do TJSP',
    href: '#/juridico/processos/apelacao',
    id: 'appeal',
    role: 'appeal',
    stage: 'TJSP',
  },
  {
    caseNumber: '1987654-32.2026.3.00.0000',
    courtInstance: 'superior',
    courtLink: 'https://tribunal.example/processos/1987654-32.2026.3.00.0000',
    courtName: 'Terceira Turma do STJ',
    href: '#/juridico/processos/recurso-especial',
    id: 'special-appeal',
    role: 'appeal',
    stage: 'STJ',
  },
  {
    caseNumber: '0012345-12.2026.8.26.0100',
    courtInstance: 'first_degree',
    courtLink: 'https://tribunal.example/processos/0012345-12.2026.8.26.0100',
    courtName: '2ª Vara Cível do Foro Central',
    href: '#/juridico/processos/cumprimento',
    id: 'enforcement',
    role: 'enforcement',
    stage: '1º grau',
  },
  {
    caseNumber: '0034567-90.2026.8.26.0100',
    courtInstance: 'first_degree',
    courtLink: 'https://tribunal.example/processos/0034567-90.2026.8.26.0100',
    courtName: '2ª Vara Cível do Foro Central',
    href: '#/juridico/processos/embargos',
    id: 'attachment',
    role: 'attachment',
    stage: '1º grau',
  },
]

const labelOf = (options: readonly SelectPropertyOption[], value: string) =>
  options.find((option) => option.value === value)?.label ?? value

const roleLabel = (role: string) => labelOf(roleOptions, role)

const rowMeta = (proceeding: Proceeding) =>
  `${roleLabel(proceeding.role)} · ${proceeding.stage}`

const rowName = (proceeding: Proceeding) =>
  `${proceeding.caseNumber} ${rowMeta(proceeding)} · ${proceeding.courtName}`

export function AddProceedingMenu() {
  return (
    <Menu>
      <MenuTrigger
        aria-label="Adicionar processo vinculado"
        render={<Button size="icon-sm" variant="ghost" />}
      >
        <PlusIcon aria-hidden="true" />
      </MenuTrigger>
      <MenuPopup align="end">
        {addItems.map(({ icon: Icon, label, value }) => (
          <MenuItem key={value} onClick={() => onAdd(value)}>
            <Icon aria-hidden="true" />
            {label}
          </MenuItem>
        ))}
      </MenuPopup>
    </Menu>
  )
}

export function CourtGroup({
  title,
  variant,
}: Readonly<{ title: string; variant: RecordGroupVariant }>) {
  return (
    <RecordGroup
      actions={<AddProceedingMenu />}
      title={title}
      variant={variant}
    >
      {proceedings.map((proceeding) => (
        <RecordGroupLink
          aria-label={rowName(proceeding)}
          href={proceeding.href}
          key={proceeding.id}
          meta={rowMeta(proceeding)}
          title={proceeding.courtName}
        >
          <span className="tabular-nums">{proceeding.caseNumber}</span>
        </RecordGroupLink>
      ))}
    </RecordGroup>
  )
}

type ProceedingValues = Record<
  string,
  { court: string | null; instance: string | null; role: string | null }
>

export function CourtPropertiesGroup({
  title,
  variant,
}: Readonly<{ title: string; variant: RecordGroupVariant }>) {
  const [values, setValues] = useState<ProceedingValues>(
    Object.fromEntries(
      proceedings.map((proceeding) => [
        proceeding.id,
        {
          court: proceeding.courtName,
          instance: proceeding.courtInstance,
          role: proceeding.role,
        },
      ]),
    ),
  )
  const change =
    (id: string, field: keyof ProceedingValues[string]) =>
    (next: string | null) =>
      setValues((current) => ({
        ...current,
        [id]: { ...current[id], [field]: next },
      }))

  return (
    <RecordGroup
      actions={<AddProceedingMenu />}
      title={title}
      variant={variant}
    >
      {proceedings.map((proceeding, index) => {
        const value = values[proceeding.id]
        return (
          <Fragment key={proceeding.id}>
            {index > 0 ? <RecordGroupDivider /> : null}
            <RecordGroupSubgroup
              defaultOpen={index === 0}
              meta={value.role ? roleLabel(value.role) : null}
              title={
                <span className="tabular-nums">{proceeding.caseNumber}</span>
              }
            >
              <RecordGroupRow label="Papel">
                <SelectProperty
                  ariaLabel={`Papel de ${proceeding.caseNumber}`}
                  onValueChange={change(proceeding.id, 'role')}
                  options={roleOptions}
                  value={value.role}
                  variant="plain"
                />
              </RecordGroupRow>
              <RecordGroupRow label="Instância">
                <SelectProperty
                  ariaLabel={`Instância de ${proceeding.caseNumber}`}
                  onValueChange={change(proceeding.id, 'instance')}
                  options={instanceOptions}
                  value={value.instance}
                  variant="plain"
                />
              </RecordGroupRow>
              <RecordGroupRow label="Vara/Tribunal">
                <SelectProperty
                  ariaLabel={`Vara/Tribunal de ${proceeding.caseNumber}`}
                  onValueChange={change(proceeding.id, 'court')}
                  options={courtOptions}
                  value={value.court}
                  variant="plain"
                />
              </RecordGroupRow>
              <RecordGroupLink
                href={proceeding.courtLink}
                leading={<ArrowSquareOutIcon aria-hidden />}
                meta={proceeding.stage}
                rel="noopener noreferrer"
                target="_blank"
              >
                Abrir no tribunal
              </RecordGroupLink>
            </RecordGroupSubgroup>
          </Fragment>
        )
      })}
    </RecordGroup>
  )
}
