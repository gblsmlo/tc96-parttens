import {
  SettingsRow,
  SettingsSection,
  SettingsSectionDescription,
  SettingsSectionHeader,
  SettingsSectionTitle,
} from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import { Input } from '@tc96/ui/input'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@tc96/ui/input-group'
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from '@tc96/ui/select'
import { Switch } from '@tc96/ui/switch'
import { useState } from 'react'

interface SettingOption {
  label: string
  value: string
}

const landingViewOptions: SettingOption[] = [
  { label: 'Painel', value: 'dashboard' },
  { label: 'Pipeline de vendas', value: 'pipeline' },
  { label: 'Contatos', value: 'contacts' },
]

const currencyOptions: SettingOption[] = [
  { label: 'Real (BRL)', value: 'BRL' },
  { label: 'Dólar (USD)', value: 'USD' },
  { label: 'Euro (EUR)', value: 'EUR' },
]

export interface WorkspaceDetails {
  name: string
  slug: string
  supportEmail: string
}

export interface WorkspacePreferences {
  currency: string
  landingView: string
  weeklyDigest: boolean
}

interface SettingSelectProps {
  ariaLabel: string
  items: SettingOption[]
  onValueChange: (value: string) => void
  value: string
}

function SettingSelect({
  ariaLabel,
  items,
  onValueChange,
  value,
}: Readonly<SettingSelectProps>) {
  return (
    <Select
      items={items}
      onValueChange={(next) => {
        if (next) onValueChange(next)
      }}
      value={value}
    >
      <SelectTrigger aria-label={ariaLabel} className="w-56">
        <SelectValue />
      </SelectTrigger>
      <SelectPopup>
        {items.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectPopup>
    </Select>
  )
}

const sameValues = <T extends object>(a: T, b: T) =>
  JSON.stringify(a) === JSON.stringify(b)

export interface WorkspaceSettingsTemplateProps {
  initialDetails?: WorkspaceDetails
  initialPreferences?: WorkspacePreferences
  onSaveDetails?: (details: WorkspaceDetails) => void
  onSavePreferences?: (preferences: WorkspacePreferences) => void
}

export function WorkspaceSettingsTemplate({
  initialDetails = {
    name: 'Studio Risine',
    slug: 'risine',
    supportEmail: 'suporte@risine.example',
  },
  initialPreferences = {
    currency: 'BRL',
    landingView: 'pipeline',
    weeklyDigest: true,
  },
  onSaveDetails,
  onSavePreferences,
}: Readonly<WorkspaceSettingsTemplateProps>) {
  const [savedDetails, setSavedDetails] = useState(initialDetails)
  const [details, setDetails] = useState(initialDetails)
  const [savedPreferences, setSavedPreferences] = useState(initialPreferences)
  const [preferences, setPreferences] = useState(initialPreferences)

  const updateDetails = (patch: Partial<WorkspaceDetails>) =>
    setDetails((current) => ({ ...current, ...patch }))
  const updatePreferences = (patch: Partial<WorkspacePreferences>) =>
    setPreferences((current) => ({ ...current, ...patch }))

  const saveDetails = () => {
    setSavedDetails(details)
    onSaveDetails?.(details)
  }
  const savePreferences = () => {
    setSavedPreferences(preferences)
    onSavePreferences?.(preferences)
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-8 p-6">
      <header>
        <h1 className="font-semibold text-2xl">Configurações</h1>
        <p className="text-muted-foreground text-sm">
          Dados e preferências do workspace.
        </p>
      </header>

      <SettingsSection
        header={
          <SettingsSectionHeader
            actions={
              <Button
                disabled={sameValues(details, savedDetails)}
                onClick={saveDetails}
                size="sm"
              >
                Salvar workspace
              </Button>
            }
          >
            <SettingsSectionTitle>Workspace</SettingsSectionTitle>
            <SettingsSectionDescription>
              Nome e contato exibidos para o time e para clientes.
            </SettingsSectionDescription>
          </SettingsSectionHeader>
        }
      >
        <SettingsRow
          description="Aparece na navegação e nos links compartilhados"
          endSlot={
            <Input
              aria-label="Nome do workspace"
              className="w-56"
              onChange={(event) => updateDetails({ name: event.target.value })}
              value={details.name}
            />
          }
          title="Nome do workspace"
        />
        <SettingsRow
          description="Endereço para o time e para clientes"
          endSlot={
            <InputGroup className="w-56">
              <InputGroupInput
                aria-label="Endereço do workspace"
                onChange={(event) =>
                  updateDetails({ slug: event.target.value })
                }
                value={details.slug}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupText>.crm.app</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          }
          title="Endereço do workspace"
        />
        <SettingsRow
          description="Exibido nas telas de ajuda"
          endSlot={
            <Input
              aria-label="E-mail de suporte"
              className="w-56"
              onChange={(event) =>
                updateDetails({ supportEmail: event.target.value })
              }
              type="email"
              value={details.supportEmail}
            />
          }
          title="E-mail de suporte"
        />
      </SettingsSection>

      <SettingsSection
        header={
          <SettingsSectionHeader
            actions={
              <Button
                disabled={sameValues(preferences, savedPreferences)}
                onClick={savePreferences}
                size="sm"
              >
                Salvar preferências
              </Button>
            }
          >
            <SettingsSectionTitle>Preferências</SettingsSectionTitle>
            <SettingsSectionDescription>
              Padrões de navegação, valores e avisos.
            </SettingsSectionDescription>
          </SettingsSectionHeader>
        }
      >
        <SettingsRow
          description="A primeira tela depois de entrar"
          endSlot={
            <SettingSelect
              ariaLabel="Tela inicial"
              items={landingViewOptions}
              onValueChange={(landingView) =>
                updatePreferences({ landingView })
              }
              value={preferences.landingView}
            />
          }
          title="Tela inicial"
        />
        <SettingsRow
          description="Moeda dos valores de negócios e relatórios"
          endSlot={
            <SettingSelect
              ariaLabel="Moeda"
              items={currencyOptions}
              onValueChange={(currency) => updatePreferences({ currency })}
              value={preferences.currency}
            />
          }
          title="Moeda"
        />
        <SettingsRow
          description="Resumo do pipeline toda segunda-feira por e-mail"
          endSlot={
            <Switch
              aria-label="Resumo semanal"
              checked={preferences.weeklyDigest}
              onCheckedChange={(weeklyDigest) =>
                updatePreferences({ weeklyDigest })
              }
            />
          }
          title="Resumo semanal"
        />
      </SettingsSection>
    </main>
  )
}
