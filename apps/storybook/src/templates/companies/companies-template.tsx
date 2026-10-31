import { Text } from '@tc96/elements/text'
import { formatAmount } from '@tc96/helpers/format'
import { AvatarStack, GalleryView, IconFrame } from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import { Card } from '@tc96/ui/card'
import { Separator } from '@tc96/ui/separator'
import { BuildingIcon, PlusIcon } from 'lucide-react'
import {
  type Contact,
  initialContacts,
} from '../../patterns/collection/fixtures/contacts'
import {
  type Deal,
  initialDeals,
  isOpenStage,
} from '../../patterns/collection/fixtures/deals'

const LOCALE = 'pt-BR'

export interface Company {
  contacts: readonly Contact[]
  name: string
  openDeals: number
  openPipeline: number
}

export const buildCompanies = (
  contacts: readonly Contact[],
  deals: readonly Deal[],
): Company[] => {
  const names = [
    ...new Set([
      ...contacts.map((contact) => contact.company),
      ...deals.map((deal) => deal.company),
    ]),
  ]

  return names
    .map((name) => {
      const open = deals.filter(
        (deal) => deal.company === name && isOpenStage(deal.stage),
      )
      return {
        contacts: contacts.filter((contact) => contact.company === name),
        name,
        openDeals: open.length,
        openPipeline: open.reduce((total, deal) => total + deal.value, 0),
      }
    })
    .sort((a, b) => b.openPipeline - a.openPipeline)
}

const formatPipeline = (value: number) =>
  formatAmount(value, {
    currency: 'BRL',
    locale: LOCALE,
    maximumFractionDigits: 0,
  })

const pluralize = (count: number, one: string, other: string) =>
  `${count} ${count === 1 ? one : other}`

const createCompanyCollection = (records: readonly Company[]) => ({
  getKey: (company: Company) => company.name,
  getLabel: (company: Company) => company.name,
  groupings: [],
  records,
})

function CompanyCard({ company }: Readonly<{ company: Company }>) {
  return (
    <Card className="h-full" render={<article aria-label={company.name} />}>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex min-w-0 items-center gap-3">
          <IconFrame>
            <BuildingIcon />
          </IconFrame>
          <div className="grid min-w-0">
            <Text
              render={<h2>{company.name}</h2>}
              size="sm"
              truncate
              weight="medium"
            />
            <Text foreground="muted" size="xs">
              {pluralize(company.contacts.length, 'contato', 'contatos')}
            </Text>
          </div>
        </div>

        <div className="mt-4 grid gap-0.5">
          <Text foreground="muted" size="xs">
            Pipeline aberto
          </Text>
          <div className="flex items-baseline justify-between gap-3">
            <Text size="xl" weight="semibold">
              {formatPipeline(company.openPipeline)}
            </Text>
            <Text foreground="muted" size="xs">
              {pluralize(
                company.openDeals,
                'negócio aberto',
                'negócios abertos',
              )}
            </Text>
          </div>
        </div>

        <div className="mt-auto pt-4">
          <Separator />
          <div className="flex min-h-10 items-center pt-3">
            {company.contacts.length > 0 ? (
              <AvatarStack
                aria-label={`Contatos de ${company.name}`}
                people={company.contacts.map((contact) => ({
                  id: contact.id,
                  label: contact.name,
                }))}
                size="sm"
              />
            ) : (
              <Text foreground="muted" size="xs">
                Nenhum contato
              </Text>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

export interface CompaniesTemplateProps {
  companies?: readonly Company[]
  loading?: boolean
}

export function CompaniesTemplate({
  companies = buildCompanies(initialContacts, initialDeals),
  loading = false,
}: Readonly<CompaniesTemplateProps>) {
  const totalPipeline = companies.reduce(
    (total, company) => total + company.openPipeline,
    0,
  )

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-semibold text-2xl">Empresas</h1>
          <p className="text-muted-foreground text-sm">
            {pluralize(companies.length, 'empresa', 'empresas')} ·{' '}
            {formatPipeline(totalPipeline)} em pipeline aberto
          </p>
        </div>
        <Button>
          <PlusIcon aria-hidden="true" />
          Nova empresa
        </Button>
      </header>

      <GalleryView
        collection={createCompanyCollection(companies)}
        emptyMessage="Nenhuma empresa cadastrada."
        loading={loading}
        loadingRecordCount={8}
        loadingRecordLabel="Carregando empresa"
        renderRecord={(company) => <CompanyCard company={company} />}
      />
    </div>
  )
}
