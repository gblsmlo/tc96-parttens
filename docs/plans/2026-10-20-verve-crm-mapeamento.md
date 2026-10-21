# Verve CRM: mapeamento para o catálogo de parttens

Status: pesquisa concluída em 2026-10-20. Nada implementado.

Fonte: <https://verve-crm.reui.io/> (ReUI), 26 rotas navegadas. Referência canônica: [arquitetura e decisões](../architecture/tc96-parttens.md).

Legenda da coluna "Catálogo":

- **Existe**: o pattern atual já cobre; no máximo uma usage nova.
- **Estender**: pattern existe, falta variante ou prop.
- **Novo**: não há pattern; candidato a entrar.

## Templates (páginas inteiras)

Cada linha abaixo é uma página que compõe patterns e entra como template, não como pattern. Templates vivem só no Storybook, em `Templates/`, e o CLI não os distribui ([ADR 0004](../../.specs/adr/0004-templates-only-in-storybook.md), Accepted).

| Template | Rota de origem | Composição |
| --- | --- | --- |
| `app-shell` (instalável desde 2026-10-21: `app-shell-4`, [ADR 0005](../../.specs/adr/0005-installable-templates.md)) | todas | rail de ícones + sidebar de seção + topbar (workspace switcher, busca com escopo e ⌘K, Create, notificações) + header de página (breadcrumb, filtro de período, Export) |
| `dashboard-home` | `/` | 4 KPI cards + card Performance + Quota Coverage + Pipeline Sourced + tabela Team Performance |
| `day-agenda` | `/today` | grid de cards de reunião |
| `activity-feed` | `/activity-feed`, `/activities` | timeline rica, agrupada por dia, com tabs de tipo |
| `quick-stats` | `/quick-stats` | breakdown por origem + barras por estágio + timesheet semanal |
| `attainment` | `/attainment` | data grid agrupado com linhas de resumo |
| `quota-plan` | `/quota-plan`, `/products` | tabela editável inline + barra de salvar |
| `approvals` | `/approvals` | tabela com ações Approve/Deny por linha |
| `quote-editor` | `/quotes/new` | formulário em seções + line items + resumo de totais |
| `forecast` | `/forecast` | gauge + cards de movimento + tabela com filtros |
| `deal-board` | `/pipeline` | kanban de deals |
| `record-index` | `/quotes`, `/contacts`, `/settings/team` | toolbar com chips de filtro + data table + paginação |
| `company-gallery` | `/companies` | galeria de cards de conta |
| `record-detail` | `/contacts/5` | header do registro + propriedades + deals abertos + atividade |
| `reports` | `/reports`, `/reports/conversion` | KPI cards + gráfico de linha por estágio + tabela |
| `settings-general` | `/settings` | settings surface em seções com salvar por seção |
| `settings-billing` | `/settings/billing` | banner de bloqueio + card de plano + cards de uso |
| `settings-integrations` | `/settings/integrations` | grid de cards com connect/toggle |
| `settings-api-keys` | `/settings/api-keys` | bloco de código com seletor de stack + lista de chaves |
| `settings-webhooks` | `/settings/webhooks` | lista de endpoints com status e toggle |

## Componentes

### Shell e navegação

| Componente | Onde aparece | Catálogo |
| --- | --- | --- |
| Rail de ícones + sidebar de seção com grupos e contadores | todas | Template instalável `app-shell-4` (2026-10-21) |
| Sidebar com facetas e mini barra por valor (Lifecycle) | `/contacts` | Novo |
| Card de anúncio dispensável empilhado (Read more / Dismiss) | sidebar Overview | Novo |
| Card de rodapé de sidebar: quota, live metrics com sparkline, security status, upgrade | sidebar de cada seção | Estender `widgets` (`MetricWidget`, `ProgressRing`) |
| Busca com seletor de escopo + atalho ⌘K | topbar | Novo |
| Header de página: breadcrumb + período + ações | todas | Novo (`page-header`) |

### Métricas e gráficos

| Componente | Onde aparece | Catálogo |
| --- | --- | --- |
| KPI card com ícone, trend pill e mini barras | `/` | Estender `MetricWidget` (série de barras) |
| Trio de métricas com trend + barra de progresso | `/` Performance | Existe (`StatList`, `TrendIndicator`) |
| Breakdown em barra segmentada + legenda com valor e % | `/` Pipeline Sourced, `/quick-stats` | Novo (`segmented-breakdown`) |
| Gauge semicircular com legenda por categoria | `/` Quota Coverage, `/forecast` | Novo; `ProgressRing` é círculo inteiro |
| Barras horizontais por estágio (funil) | `/quick-stats` Deals by Stage | Estender `PipelineWidget` |
| Cards de movimento (improved/worsened, pulled/slipped) | `/forecast` | Existe (`MetricWidget` + `MetricPill`) |
| Gráfico de linha com KPIs por série e range tabs | `/reports/conversion` | Novo; o repo não tem lib de gráfico |
| Meter segmentado de confiança | `/quota-plan` | Novo (célula) |

### Coleções e tabelas

| Componente | Onde aparece | Catálogo |
| --- | --- | --- |
| Data table com avatar + subtítulo, badges, paginação | `/quotes`, `/contacts`, `/settings/team`, `/` | Existe (`collection-views` data-table, `CollectionPagination`) |
| Toolbar com chip de filtro `campo contains valor` + Clear | `/quotes`, `/contacts`, `/forecast` | Estender `CollectionToolbar` |
| Data grid agrupado expansível com linhas de resumo e tabs de métrica | `/attainment` | Estender data-grid (grupos + summary rows) |
| Tree table com subtarefas expansíveis | `/tasks` | Estender data-table (linhas filhas) |
| Timesheet semanal (pessoa × dia, total e %) | `/quick-stats` | Novo |
| Tabela editável inline + barra "All changes saved / Discard / Save" | `/quota-plan`, `/products` | Estender `editable`; barra de salvar é Novo (`save-bar`) |
| Ações por linha Approve/Deny + contadores no header | `/approvals` | Estender data-table (coluna de ações) |
| Kanban com card de deal (win prob, local, data, faixa de valor) | `/pipeline` | Existe (kanban, usage `pipeline`) |
| Galeria de contas com barra segmentada e avatar stack | `/companies` | Existe (gallery + `AvatarStack`) |

### Atividade e agenda

| Componente | Onde aparece | Catálogo |
| --- | --- | --- |
| Timeline com anexos, menção citada, alerta, mudança de estágio, meta chips | `/activity-feed` | Estender `ActivityTimeline` |
| Timeline agrupada por dia com cards colapsáveis e tabs de tipo | `/activities` | Estender `ActivityTimeline` |
| Card de reunião (hora, duração, resumo, avatares, tag, Join) | `/today` | Estender `UpcomingEventWidget` |
| Lista "Up next / Later today" | sidebar de `/activities` | Existe (`AgendaWidget`) |

### Formulários e registros

| Componente | Onde aparece | Catálogo |
| --- | --- | --- |
| Formulário em seções com badge (Required, Net 14, Optional) | `/quotes/new` | Novo (`form-section`) |
| Editor de line items (item, qty, rate, tax, amount) | `/quotes/new` | Novo (`line-items`) |
| Resumo de totais (subtotal, desconto, imposto, total) | `/quotes/new` | Novo |
| Página de registro: header, propriedades, deals, atividade | `/contacts/5` | Existe (`properties`, `RecordGroup`, `ActivityTimeline`) |

### Settings

| Componente | Onde aparece | Catálogo |
| --- | --- | --- |
| Linhas label/descrição/controle, color picker, salvar por seção | `/settings` | Existe (`surfaces/settings`) |
| Banner de alerta com ação | `/settings/billing` | Existe (`StateSurface` ou COSS `Alert`) |
| Card de plano + cards de uso | `/settings/billing` | Existe (`WidgetShell`, `StatList`) |
| Card de integração com connect/toggle | `/settings/integrations` | Novo (usage de gallery) |
| Bloco de código com seletor de stack e copy | `/settings/api-keys` | Novo |
| Linha de credencial mascarada (copy, reveal, rotate, delete) | `/settings/api-keys` | Novo |
| Lista de endpoints com status e switch | `/settings/webhooks` | Existe (`list` view + `surfaces/settings`) |

## Lacunas

- O repo não tem biblioteca de gráfico. Linha, gauge e mini barras pedem decisão antes de qualquer pattern.
