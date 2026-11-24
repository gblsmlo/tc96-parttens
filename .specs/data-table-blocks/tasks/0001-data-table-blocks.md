# Blocos de tabela de dados a partir do ReUI Data Grid

Status: Draft (2026-11-24)

## Objetivo

Criar a categoria `data/` de blocks com dois grupos que simulam as telas de https://reui.io/blocks/data-grid: `data-grid/` (`data-grid-{n}`, `DataGrid{n}`) sobre o Data Grid do pattern `collection`, e `table/` (`table-{n}`, `Table{n}`) com as mesmas nove telas sobre o layout `table` (Data Table) da collection. Cada lacuna do Data Grid que uma tela exige é corrigida no pattern, não contornada no block.

Escopo decidido pelo dono em 2026-11-24: um block por categoria do ReUI nesta entrega (9 telas, em cada um dos dois grupos); o restante do mapa abaixo vira issues.

## Mapa do ReUI (inspecionado em 2026-11-24)

70 blocks em 9 categorias. Preview: `https://reui.io/preview/base/data-grid-<categoria>-<n>`.

| Categoria | Blocks |
| --- | --- |
| Base (9) | 1 Customer Balances, 2 Lead Scoring Contacts, 3 Deal Pipeline, 4 Weekly Timesheet, 5 Support Tickets, 6 Team Members, 7 Project Modules, 8 Cloud Rate Card, 9 API Request Logs |
| Columns (5) | 1 Access Permissions Matrix, 2 Course Catalog, 3 Work Queue, 4 Member Display Columns, 5 Company Attributes |
| Filtering (4) | 1 Billing transactions (filtro multicampo e skeleton), 2 Automation library (abas de status), 3 Renewals (construtor de filtros, ações em massa), 4 Renewals risk (linhas fixadas) |
| Editing (6) | 1 Labels manager, 2 Product inventory (validação por célula, barra de salvar), 3 Project intake, 4 Pricing plan editor, 5 Spreadsheet task grid, 6 Reorder plan |
| Expansion (3) | 1 Task queue com sub-tarefas, 2 Treasury waterfall, 3 Release review |
| Grouping (7) | 1 Roadmap por estágio, 2 Receita por região com subtotais, 3 Coorte com agrupamento trocável, 4 BOM em árvore, 5 Hierarquia de reporte, 6 Mesa editorial, 7 Delivery board |
| Drag & Drop (4) | 1 Sprint backlog, 2 Routing rules, 3 Dispatch com colunas reordenáveis, 4 Drive em árvore |
| Virtualization (2) | 1 Ledger de transações com rolagem infinita, 2 Fila de exceções de envio |
| Advanced (30) | 1 Campaign performance (sparklines, bullet, barras de share) e 29 grids analíticos (P&L, SLO, pro forma, escalas, scorecards) |

## Blocks desta entrega

| Block | Origem no ReUI | Lacuna corrigida no Data Grid |
| --- | --- | --- |
| `DataGrid1` | Base 5, Support Tickets | seletor de linhas por página na paginação |
| `DataGrid2` | Columns 4, Member Display Columns | nenhuma |
| `DataGrid3` | Filtering 3, Renewals | filtros por condição (campo, operador, valor) |
| `DataGrid4` | Editing 2, Product inventory | validação por célula editável |
| `DataGrid5` | Expansion 1, Task queue | linhas expansíveis com sub-linhas |
| `DataGrid6` | Grouping 2, Revenue by region | células por coluna na linha de grupo (subtotais) e expandir ou recolher todos |
| `DataGrid7` | Drag & Drop 2, Routing rules | reordenar linhas por arraste e teclado |
| `DataGrid8` | Virtualization 1, Transactions ledger | aviso de fim de rolagem para carregar mais |
| `DataGrid9` | Advanced 1, Campaign performance | nenhuma |

## Contrato comum dos blocks

- Controlado: dados por props, cada mudança por callback; o block não busca, não filtra no servidor e não persiste.
- `pending`, `error` e `onRetry` como nos demais blocks de dados (skeleton próprio, `StateSurface` de erro).
- Todo texto visível vem de `labels` com padrão pt-BR.
- A toolbar é o `CollectionToolbar` com `variant="text"`: o título e a descrição do block são os da toolbar, sem um cabeçalho separado (decisão do dono, 2026-11-24).
- Visões salvas pelo seletor de visões do pattern `toolbar`; colunas, ordenação, densidade e filtros pelo `ViewSettingsMenu` (decisão do dono, 2026-11-24).
- Linhas selecionadas abrem o `ActionBar` do pattern, nunca uma barra feita no block (decisão do dono, 2026-11-24).
- Stories em `Blocks/Data/DataGrid/DataGrid{n}` nas páginas API Reference, Playground, Behavior, States e Usages.
