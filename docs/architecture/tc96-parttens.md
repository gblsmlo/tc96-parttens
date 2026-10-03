# Arquitetura do tc96-parttens

Status: as decisões de 2026-10-01 (UI base sem opinião, sem biblioteca npm) estão aplicadas no workspace. O CLI sai no npm como `@tc96/parttens`, na org `tc96`, a partir da 0.1.0.

## Objetivo e escopo

Reutilizar UI e padrões corrigidos entre projetos, sem incorporar regras de negócio. O TC96 anexado é a base; o Lemind é referência para melhorias. A primeira etapa reestrutura collection views e properties, mantendo também detail sheet e editable. Filter Builder está explicitamente fora desta versão, incluindo exports, registry, stories e documentação.

React 19, TypeScript, Tailwind CSS 4 e Base UI compõem a stack do consumidor. Bun é a ferramenta de desenvolvimento. Desktop e compatibilidade com SSR/hidratação estão no escopo; responsividade está fora. As collection views devem atender milhares de itens carregados, com virtualização onde necessária. Metas numéricas de desempenho ainda serão definidas por cenário.

Manutenção central, ausência de telemetria embutida e acessibilidade por teclado, foco e leitores de tela foram confirmadas como premissas.

## Organização e fronteiras

```text
apps/
  storybook/
  docs/
packages/
  ui/
  elements/
  parttens/
    src/
      collection-views/
        store/
        shared/
        types/
        views/
        composition/
      properties/
        store/
        shared/
        types/
        views/
        composition/
      detail-sheet/
        components/
        hooks/
      editable/
        store/
        shared/
        types/
        views/
        composition/
      checklist/
        composition/
        components/
        lib/
        types/
        test/
      index.ts
  utils/
  registry/
docs/
  architecture/
```

A landing será acrescentada quando houver escopo concreto. A grafia `parttens` acompanha o nome escolhido para o produto e o contrato público.

- `ui`: componentes COSS sem alterações, no papel da UI do consumidor.
- `elements`: componentes próprios do tc96 que não existem no COSS, como `Text` e `IconFrame`. Usam só os tokens do tema do consumidor. Decidido em 2026-10-03: o elemento `Title` foi removido e `Text` absorve os títulos pelas variantes `family="heading"`, `weight` e `size` (com `render={<h2 />}` para a semântica); `size` segue a escala do Tailwind, de `xs` a `8xl`, com `base` como padrão, e o antigo `md` deixou de existir. O `Checklist` usa `Text` no título e nos itens; a story `Elements/Text` reúne tamanhos, pesos, cores, famílias, títulos e truncamento.
- `parttens`: padrões, com componentes, hooks, tipos e testes próximos de cada padrão.
- `utils`: funções compartilhadas sem React ou dependências visuais.
- `registry`: manifestos, geração e ferramentas para instalação dos fontes.

## Estrutura interna dos patterns

`collection-views`, `properties` e `editable` organizam o código pelas responsabilidades de cada pattern. Em `collection-views`, `views/` identifica renderers de coleção; em `properties`, `display/` identifica padrões de apresentação. Os diretórios não representam páginas ou rotas de aplicação. Uma camada só recebe código quando há responsabilidade para ela.

`checklist/` foi acrescentado como primeiro pattern migrado do Lemind. Seu componente recebe itens e callbacks controlados pelo consumidor; criação, conclusão, edição, reordenação e exclusão não conhecem entidades nem persistência. Decidido em 2026-10-03, na correção do axe da story: o prazo de cada item usa os tokens de texto do tema, `text-destructive-foreground` quando vencido e `text-warning-foreground` quando vence hoje (5,1:1 a 6,8:1 no claro, acima de 5,7:1 no escuro), no lugar de `text-destructive` e da cor crua `text-amber-500`, que ficavam em 3,6:1 e 2,0:1 sobre a página. Decidido em 2026-10-03, no refactor de Tailwind: o pattern foi dividido em fragmentos (`checklist-header`, `checklist-row`, `checklist-read-only-row`, `checklist-draft-row`, `checklist-item-card` com o `ChecklistTitle`, `checklist-metadata`, `due-date`, `sortable`, `variants` e os tipos), descritos em `packages/parttens/src/checklist/AGENTS.md`; só o barrel é público. Decidido em 2026-10-03, na sequência: os fragmentos passaram a seguir o layout em camadas de `collection-views`, `detail-sheet` e `editable`: `composition/checklist/` com o `Checklist`, seu teste e barrel; `components/` com as seis peças da linha e do cabeçalho; `lib/` com `due-date.ts`, `sortable.ts` e `variants.ts`; `types/index.ts` com `ChecklistItem` e `ChecklistProps`; `test/dom.ts` próprio, no lugar do import de `properties/test/dom`; e `core.ts` expondo os tipos e as funções de prazo sem React. `index.ts` re-exporta `composition/` e `types/`, e a API pública não mudou. Na mesma data, o gate completo revelou que as stories `Default` e `AvatarOnly` de `PersonProperty` ainda esperavam avatar de 20 e 28 px, medidas anteriores ao commit do checklist, que fixou `size-4` (16 px) no badge e na exibição só de avatar; as stories passaram a medir 16 px, e `Plain` segue em 28 px. Estado vive em atributos `data-*` e é estilizado pela variante do atributo, nunca por classe condicional: `data-completed` no `li` (título riscado e em `muted-foreground` via `group-data-completed:`), `data-dragging` (`opacity-40`) e `data-due` (`overdue`, `today`, `upcoming`) na área de metadados; os eixos de design são variantes `cva` em `variants.ts` (`density` na linha, no alvo do checkbox e no input de rascunho; `status` no prazo). `cn` ficou só na `section` raiz, onde entra o `className` do consumidor; o input de rascunho ganhou `focus-visible:outline-ring`, que faltava ao remover o outline nativo.

`widgets/` reúne widgets de dashboard, agrupados por domínio, todos sobre a mesma moldura e as mesmas peças de `widgets/shared/`: `CardWidgetShell`, `WidgetHeader`, `Amount`, `TrendIndicator`, `WidgetPeriodToggle`, `StatList` (lista de pares rótulo/valor em `dl`), `AvatarStack` (avatares sobrepostos com `+N`), `MetricWidget` (indicador genérico: rótulo, valor, variação, ícone e tom `inverted`) e `ExpandableList`. Decidido em 2026-10-03: toda lista de widget passa pela `ExpandableList`, configurada pela prop `expand` (`WidgetExpandProps`) do widget: acima de `visibleCount` (cinco por padrão) a lista fica recolhida sob um degradê de `card` com o botão `Ver todas (+N)`; expandida, vai para o `ScrollArea` do Base UI com `maxHeight` (420px por padrão) e um `Ver menos`; `expanded` pode ser controlado e `visibleCount: Infinity` desliga o recolhimento. Usam a peça `TransactionsWidget`, `BudgetWidget`, `InvoiceStatusWidget`, `PipelineWidget`, `DealsWidget`, `ActivityTimeline` (e por ela `ActivityFeedWidget` e `ContactWidget`), as subtarefas do `ProjectCardWidget` e os eventos do dia do `AgendaWidget`. Decidido em 2026-10-03: o círculo de ícone dos ativos virou o elemento `IconFrame`, nome neutro quanto à forma e à posição, (`@tc96/elements/icon-frame`), re-exportado pelo barrel dos widgets no lugar do antigo `AssetIcon`; tem três tamanhos (`default` em 36px, `lg` em 44px, `xl` em 56px), duas formas (`circle`, padrão, e `rounded`, com `rounded-lg`) e duas variantes, `color` (padrão: fundo com 6% da cor e ícone na cor; sem `color`, `muted` e `foreground`) e `plain` (só o ícone na cor). As stories de finanças usam a variante com cor em todos os ícones, de ativo, categoria ou transação. `widgets/finance/` atende finanças pessoais e empresariais: `MarketShareWidget` com `ShareBar` e `AssetList`, `AssetStatWidget`, `RiskScoreWidget`, `BalanceWidget`, `BudgetWidget` (gasto por categoria sobre o `Meter` do Base UI, com `data-over` quando passa do limite; o widget envolve o `icon` da categoria num `IconFrame` com a mesma `color` que preenche a barra, então ícone e barra nunca divergem), `CashFlowWidget` (entradas e saídas em barras agrupadas, com totais em `StatList`), `TransactionsWidget` com `TransactionList` (crédito em `success-foreground` com sinal, débito em `foreground`) e `InvoiceStatusWidget` (faturas por status sobre a `ShareBar`, com cor vinda do `tone`). `widgets/productivity/` atende tarefas e calendários: `TaskProgressWidget` (barras por período e contadores por status, com tom `inverted`), `UpcomingEventWidget` (próxima reunião com linha do tempo em `role="img"`, link de entrada e cópia pelo `copyToClipboard`), `ProjectCardWidget` (tags, subtarefas com o `Checkbox` do COSS, progresso no `Meter`, datas, pessoas e rodapé), `AgendaWidget` (o `Calendar` do COSS com os dias ocupados marcados por tipografia e a lista do dia selecionado) e `WorldClockWidget` (relógios por fuso, com `splitTimeOfDay`). `widgets/crm/` atende vendas e relacionamento: `PipelineWidget` (estágios do funil em barras próprias proporcionais ao maior valor), `DealsWidget` com `DealList` (estágio no `Badge` do COSS mapeado pelo `tone`, dono em `AvatarStack`), `ActivityFeedWidget` (linha do tempo de interações) e `ContactWidget` (ficha de contato com avatar, cargo e empresa, tags, canais de e-mail, telefone e WhatsApp como `Button` `outline` renderizado em `a` com `mailto:`, `tel:` e `wa.me`, e a atividade recente do contato); a linha do tempo é a `ActivityTimeline`, exportada e compartilhada pelos dois; os indicadores e as origens de lead reaproveitam `MetricWidget` e `MarketShareWidget`. A formatação sobre `Intl.NumberFormat` (`formatAmount`, `createAmountFormatter`, `splitAmountAtDecimal`, `AmountFormatOptions`) vive em `packages/helpers`, importada como `@tc96/helpers/format` e re-exportada pelo barrel dos widgets; horas vêm de `@tc96/helpers/time`. Os widgets recebem valores prontos e não interpretam a pontuação: qual faixa de risco é boa ou ruim, por exemplo, chega pelo `tone`. Os percentuais seguem a semântica do Intl (`0.0934` é `9,34%`). Decidido em 2026-10-02: o COSS não tem chart, e `BalanceWidget`, `TaskProgressWidget` e `CashFlowWidget` usam `recharts`, a mesma base do chart do shadcn; os demais gráficos são barras em CSS sobre o `Meter` do COSS e elementos próprios. O tom `inverted` aplica o `.dark` do tema do consumidor ao widget, sem cores próprias. Decidido em 2026-10-02, na auditoria de contraste e composição: a variação usa o `Badge` `lg` do COSS e o `TrendIndicator` `plain` acompanha o mesmo `text-sm`; o seletor de período é o `ToggleGroup` do COSS nos valores padrão; o título do widget é `text-base` `font-semibold`; rótulos que nomeiam um valor ficam em `text-sm` e legendas de eixo (datas sob a barra, extremos do medidor, ticks do gráfico) em `text-xs`, ambos `muted-foreground`; o valor principal de cada widget é `text-4xl` (relógios em `text-3xl`). Decidido em 2026-10-02: os widgets compartilham a moldura `CardWidgetShell`, o `Card` do COSS renderizado como `section` sem a sombra nativa (`shadow-none before:hidden`, sobrescrita neutra) com `border-border/80`, para separar o widget do fundo da página, e com `rounded-lg`, o mesmo raio dos cards do Kanban; são as exceções de borda e raio registradas. Decidido em 2026-10-03, na auditoria dos grupos de produtividade e CRM: o `Avatar` do COSS sobre o card some no tema do Storybook (o fallback é `background` mais 4% de preto, 1,1:1 sobre o card branco, e o mesmo ocorre no escuro), então `AvatarStack` e `ActivityFeedWidget` envolvem cada avatar num elemento próprio com `border-input`, sem tocar no componente. Contraste medido no tema do Storybook (card branco sobre página `stone-50` no claro): os textos semânticos `success`, `destructive`, `info` e `warning` em `-foreground` ficam entre 5,1:1 e 6,8:1 no claro e acima de 5,7:1 no escuro; `muted-foreground` fica em 5,7:1 no claro e 4,2:1 no escuro. Preenchimentos gráficos são do tema do consumidor e ficam abaixo de 3:1 em alguns pares: no claro `--chart-4` (1,7:1), `--chart-5` (2,2:1), `bg-success` (2,5:1) e `bg-warning` (2,2:1); no escuro `--chart-1` (2,4:1); `--chart-1` a `--chart-3`, `bg-destructive` e `bg-info` passam de 3:1 no claro e todos os `--chart-*` do escuro menos o primeiro passam. O valor segue sempre em texto ou em `sr-only`, e a cor é regra do tema, não do pattern. Decidido em 2026-10-03, na portagem do flash-card: `widgets/gamification/` atende progresso de aprendizagem e engajamento, sobre as mesmas peças e duas novas em `widgets/shared/`, `ProgressRing` (anel SVG próprio em `stroke-primary` sobre trilha `stroke-muted`, tracejado com `empty` quando ainda não há valor, que não é o mesmo que zero; `clampRatio` limita a razão a `[0, 1]`) e `MetricPill` (pílula de métrica em `span` ou `li`, tons `muted`, `primary`, `success` e `warning`). São seis peças: `LevelWidget` (anel `size-28` com o nível, `Nível N`, total de XP, XP do nível no `Meter` do COSS com `aria-label` e o `Faltam X XP para o nível N+1`), `StreakWidget` (dias seguidos em `text-4xl` ao lado de um `IconFrame` `lg` de chama e os últimos sete dias numa `ol` de sete colunas, cada dia um `IconFrame` com a cor da sequência quando ativo, `plain` com borda tracejada `border-input` quando não, anel `ring-ring` no dia de hoje e estado em `sr-only`), `AchievementsWidget` (medalhas em grade de duas ou três colunas, `IconFrame` `xl` com a cor quando desbloqueada e cadeado tracejado quando não, progresso `atual/alvo` da bloqueada e estado em `sr-only`; contagem `X de Y` no lugar da ação; `ExpandableList` com seis visíveis), `QuestsWidget` (missões abertas antes das concluídas via `orderQuests`, ícone em `IconFrame` `rounded`, barra no `Meter` enquanto aberta, `Badge` `success` e texto riscado quando concluída, contagem no `Badge` `secondary`; `ExpandableList`), `ProgressHud` (faixa de uma linha fora do card, `section` com `aria-label`, anel `size-10`, XP do nível e pílulas de sequência e conquistas) e `ProgressFooter` (linha para o pé de um card: métricas livres em pílulas e uma nota num anel `size-7`, tracejado sem nota). O pattern não conhece regra de pontuação: nível, XP, sequência, conquistas e missões chegam prontos, e os rótulos em pt-BR são props com padrão. As cores de papel são `--warning-foreground` para sequência e medalhas e `--success-foreground` para missão concluída, ambas em `IconFrame` `color` com o fundo a 6%: medido no tema do Storybook, o ícone fica em 4,6:1 (chama) e 5,0:1 (check) no claro e 8,8:1 e 7,8:1 no escuro; nas pílulas `warning/15` e `success/15` o ícone fica em 4,5:1 e 4,8:1 no claro e 7,5:1 e 6,8:1 no escuro. O anel e o `Meter` usam `primary` (15:1 sobre o card); a trilha do anel e as bordas tracejadas são decorativas (1,1:1 e 1,3:1) e o valor segue em texto ou `sr-only`.

`rich-text-editor/` é o editor de texto estilo Notion portado do flash-card em 2026-10-03, sobre o Plate headless (`platejs` 53 com `@platejs/basic-nodes`, `@platejs/list-classic`, `@platejs/slash-command` e o `filterWords` de `@platejs/combobox`), instalado como dependência do pattern a exemplo do `recharts`. `RichTextEditor` não tem caixa: ocupa a coluna de quem o monta, sem borda nem fundo, e o cursor é o indicador de foco. O vocabulário é fechado em `RICH_TEXT_ELEMENTS` (`p`, `h2`, `h3`, `blockquote`, `ul`, `ol`, `li`, `lic`, no modelo clássico de lista do Plate) e `RICH_TEXT_MARKS` (`bold`, `italic`, `underline`, `strikethrough`, `code`); `h1` fica reservado ao título da página, que é o `EditorTitle`, um `h1` com `textarea` sem borda que nunca grava quebra de linha (`flattenTitle`) e entrega `Enter` e seta para baixo no fim a quem compõe, para o foco passar ao corpo; o corpo devolve o foco pelo início com `onExitStart` (seta para cima na primeira linha ou Backspace no início de um parágrafo que abre o documento) e `focusStart()` no ref. A formatação vem de três caminhos que convergem em `applyBlock`: a barra flutuante sobre a seleção (um `PopoverPopup` `tooltipStyle` do COSS sem gatilho, ancorado ao retângulo da seleção, com `Toggle` `sm` dentro de `ToolbarButton`; `Alt+F10` leva o foco à barra e `Esc` devolve), os atalhos markdown no início do bloco (`#`/`##`, `###`, `>`, `-`/`*`, `1.`; marcas por `**`, `*`/`_`, `~~` e crase; sublinhado só por `Mod+U`) e o menu `/` (uma `listbox` no mesmo `PopoverPopup`, que nunca recebe o foco: o editável anuncia a opção ativa por `aria-activedescendant` e `aria-controls`, e as setas, `Enter`, `Esc` e espaço são tratados no editável). Decidido: a barra usa o `ToolbarPrimitive.Root` do Base UI sem estilo, porque o `Toolbar` do COSS traz borda, raio e fundo que duplicariam a moldura do popup e exigiriam sobrescrita; `aria-expanded` não entra no editável porque o axe o recusa em `role="textbox"`. O `slash_input` do Plate é um inline com texto (o `/` e a consulta ficam no documento) em vez do `input` void padrão, que roubaria o foco; apagar o `/` esvazia e remove o nó, o cursor sair dele por qualquer mudança o desfaz em texto literal, e `onValueChange` nunca emite uma versão com `slash_input`. Listas aninham pelo Tab até `maxListDepth` (quatro por padrão) e uma colagem mais funda é achatada na normalização; sem o que indentar, o Tab segue para o próximo foco, que é a saída do editor pelo teclado. Uma citação achata blocos colados dentro dela com uma quebra de linha entre eles. O documento nunca carrega `id` de nó (`nodeId: false`). As funções puras (`flattenTitle`, `formatTitleCounter`, `richTextToPlainText`, `richTextElementTypes`, `richTextHasNodeId`) ficam em `@tc96/helpers/rich-text`, e as stories conferem cada documento emitido contra o vocabulário com elas. Os rótulos em pt-BR (`Negrito`, `Título de seção`, `Blocos`, `Nenhum bloco com esse nome`, `Formatação`) são props com padrão. No Storybook, `Patterns/Rich Text Editor` tem uma story por marca, por bloco e por gesto (barra, menu `/`, saída pelo início, teto de listas), `FullDocument` com uma nota completa (todos os blocos e marcas em contexto, listas aninhadas) e `Variations`, a galeria lado a lado com documento completo, vazio, rótulos em inglês, listas de um nível e coluna estreita; `Editor Title` cobre o título e a página composta com o corpo. Decidido em 2026-10-03: `RichTextEditor` e `EditorTitle` aceitam `autoFocus` (o editor foca no fim do documento, pelo `editor.tf.focus({ edge: 'endEditor' })`; o título foca o `textarea`), e as stories começam sem interação do usuário: o utilitário de teste posiciona o cursor por seleção programática (`placeCaretAtEnd`) em vez de clicar no editor, e `Empty` e `Note page` demonstram o `autoFocus` conferindo o foco ao carregar.

Decidido em 2026-10-03: o editor cresce pelo Plate com a UI toda do COSS, sem a camada de componentes do Plate. A barra flutuante ganhou um `Select` de tipo de bloco (parágrafo, títulos, citação, listas) dentro de `ToolbarButton render`, e o popup do select e do popover de link contam como "dentro" da barra para o controle de foco; o botão de link abre um `Popover` com `Input` e aplica `upsertLink` (elemento `a`, com autolink do plugin). Os blocos extras vêm de `RICH_TEXT_EXTRA_BLOCKS` (`todo`, `callout`, `code`, `hr`, `date`, `table`), entram só pelo menu `/` e pelo `applyExtraBlock`, e acrescentam os elementos `action_item`, `callout`, `code_block`, `hr`, `date`, `table`, `tr`, `td` e `th` a `RICH_TEXT_ELEMENTS`. O destaque de texto é a marca booleana `highlight` (`mark` com `bg-yellow-300/50` e `dark:bg-yellow-400/30`, trocados em 2026-10-03, na auditoria de Tailwind, por `bg-warning/30 text-foreground dark:bg-warning/25`); não há cor de texto livre, porque um valor fixo no documento não acompanha o tema escuro do consumidor. Menções (`@`) usam o mesmo hook do menu `/` com outro tipo de input (`mention_input`) e só existem quando o consumidor passa `mentions`; o editor não busca pessoas. Decidido em 2026-10-03: o editor usa `id` de nó por dentro (`nodeId: { initialValueIds: 'always' }`) e nunca o emite, porque `onValueChange` passa por `stripRichTextNodeIds`, de `@tc96/helpers/rich-text`; o documento continua sem `id`. Isso liberou `draggableBlocks`, opt-in que liga `@platejs/dnd` e `@platejs/selection`: alça de arrastar na margem esquerda de cada bloco de topo (o consumidor reserva a margem), `Alt+↑`/`Alt+↓` na alça como alternativa por teclado, `Esc` no editor para selecionar o bloco, setas para estender, `Backspace` para apagar. O `input` oculto do plugin de seleção recebe `aria-label` e o teclado dele é tratado por um listener nativo, porque o `onKeyDown` do React nunca disparava nesse portal. A imagem é o bloco `img` (void), inserido pelo menu `/` só quando o consumidor passa `onPickImage`; o pattern não faz upload nem guarda arquivo. Fora: o toggle do Plate depende do modelo de `indent`, que o vocabulário não tem; comentários, sugestões e IA pedem backend; equação e emoji ficam de fora até haver consumidor. As stories de uso ficam em `Patterns/Rich Text Editor/Usages/{Blog,Tasks,Other}`: cada uma monta título e corpo com `UsageDocument` (`apps/storybook/src/test-utils/usage-kit.tsx`) e persiste o rascunho em `localStorage`, sem backend, com o botão "Restaurar exemplo".

```text
<pattern>/
  index.ts       barrel público; o registry e a baseline da API pública leem este arquivo
  core.ts        superfície sem React: tipos e funções puras do pattern
  store/         estado compartilhado e ações
  shared/        componentes e helpers usados por mais de um display
  components/    peças de um único composto, nunca públicas (detail-sheet)
  hooks/         hooks React (detail-sheet, views/<view>/hooks/)
  lib/           funções puras e variantes de classe
  types/         contratos compartilhados pelo pattern
  views/         renderers de coleção em collection-views
  display/       padrões de apresentação em properties
  composition/   composição de displays e componentes compartilhados
  test/dom.ts    JSDOM dos testes bun do pattern; cada pattern tem a própria cópia
```

Uma camada só existe quando tem código; `editable/views/README.md` marca a camada vazia. `vite-env.d.ts` nos patterns mais antigos vem do desenvolvimento isolado: nada o importa e o registry não o distribui, por isso um pattern novo ou reestruturado não o cria. Os `styles/global.css` de `collection-views`, `properties` e `editable` tinham a mesma origem e foram removidos em 2026-10-03, na auditoria de Tailwind; só o de `detail-sheet` permanece até a revisão daquele pattern. O `AGENTS.md` da raiz descreve o mesmo layout em inglês para os agentes. Decidido em 2026-10-03: cada pattern e a pasta `shared/` têm o próprio `AGENTS.md`, escrito a exemplo do de `checklist` (mapa de arquivos com o que é público, API pública, comportamento que os testes fixam, contrato de `data-*` e comandos de verificação); o arquivo acompanha qualquer mudança de arquivo ou de API do pattern.

- `collection-views/views/` contém Calendar, Data Grid, Kanban e List. `store/` mantém o `CollectionProvider` e as preferências compartilhadas; `composition/` contém `CollectionViewOutlet`, que seleciona o renderer ativo; toolbar e paginação ficam em `shared/`.
- `properties/display/` contém os padrões de apresentação de propriedade, como Text, Date, Select e Person. `composition/` contém `AssignedProperty`, uma composição semântica de Person, e `PropertyCollection`; `shared/` reúne catálogo, superfícies e o shell comum de seleção única. Select e Person fornecem seu próprio conteúdo e suas opções ao shell. O diretório `store/` fica reservado, mas não há store global de properties: rascunhos de interação continuam locais a cada controle.
- `editable/composition/` contém o composto Editable e seus controles. `store/` abriga o contexto e o estado compartilhado entre as partes. O `cn` é sempre o de `@tc96/utils`: nenhum pattern mantém cópia própria, e funções puras compartilhadas ficam em `packages/helpers`. A implementação atual usa React Context e hooks; a camada não obriga Zustand.
- `types/` nas três áreas expõe contratos organizados por pattern. Tipos específicos de um renderer ou display podem permanecer junto dele.

Cada área tem um barrel próprio. O CLI gera o barrel agregado no projeto do consumidor, só com os patterns instalados. O layout interno pode evoluir sem exigir que o consumidor importe caminhos privados.

O barrel agregado é o `index.ts` no diretório do alias de patterns. A fonte é o agregado do workspace, `packages/parttens/src/index.ts`, distribuído no registry como `aggregate.json`. O CLI mantém as diretivas e cada re-export cujo módulo está instalado, contando execuções anteriores, de modo que o apelido `Kanban` acompanha `collection-views`. Uma área compartilhada como `shared/` entra no item de cada pattern que usa algum arquivo dela, com o barrel da área; hoje só `collection-views` usa `shared/`. O arquivo gerado começa com um comentário que o identifica e é regravado a cada `add`; um `index.ts` escrito pelo consumidor é preservado com aviso. Por isso o agregado do workspace só pode conter diretivas e re-exports.

No Storybook, `Patterns/Collection Views/Overview` apresenta a mesma coleção em List, Kanban e Data Grid. As stories sob `Patterns/Collection Views/Views` documentam cada renderer isoladamente; `Shared Components` documenta toolbar e paginação. As stories de properties ficam em `Patterns/Properties/Display`; o agrupamento de properties fica em `Patterns/Properties/Groups`.

`parttens` depende de `ui`, `elements` e `utils`; `ui` e `elements` dependem de `utils`; `elements` não depende de `parttens`. Os três não dependem do registry. Dependências entre padrões são explícitas e não podem criar ciclos. Os fontes de UI têm uma implementação canônica, sem cópias mantidas por padrão.

Nomes internos: `@tc96/ui`, `@tc96/parttens`, `@tc96/elements`, `@tc96/helpers`, `@tc96/utils` e `@tc96/registry`. São pacotes privados do workspace. O produto publica só o CLI, como `@tc96/parttens` (comando `tc96-parttens`), com o registry embutido; não há biblioteca npm. O nome npm coincide com o do pacote privado `packages/parttens`, que nunca é publicado. `ui` e `utils` existem para desenvolvimento, Storybook e testes, no papel de projeto consumidor (ver [UI base sem opinião](#ui-base-sem-opinião)).

## API e compatibilidade

No projeto consumidor, os imports usam os aliases do próprio projeto:

```tsx
import { CollectionViewOutlet, TextProperty } from '@acme/patterns'
import { Button } from '@acme/ui/button'
import { cn } from '@acme/ui/lib/utils'
```

A entrada agregada continua sendo a experiência escolhida, agora como barrel gerado pelo CLI no alias de patterns do consumidor. Os especificadores `tc96/parttens`, `tc96/ui`, `tc96/utils`, `tc96/components` e `tc96/blocks` deixam de existir. Preservar nomes e props dos patterns, com a exceção explícita do Filter Builder. Entradas antigas do registry devem mapear para os padrões correspondentes quando ainda estiverem no escopo.

`collection-views` identifica o conjunto. Preservar nomes como `KanbanView`, `ListView`, `CalendarView` e `DataGrid`. Não renomear componentes apenas por uniformidade.

A preservação de API vale para os patterns. A camada de UI segue a seção [UI base sem opinião](#ui-base-sem-opinião).

O nome npm só importa para o CLI. Decidido em 2026-10-01: `@tc96/parttens`, na org `tc96`, com o comando `tc96-parttens` (`npx @tc96/parttens add ...`). A 0.1.0 saiu antes como `tc96-parttens`, sem escopo, e foi despublicada. O repositório continua privado, e o pacote npm é público: o tarball leva o registry com o fonte dos patterns, sob MIT. Por isso o manifesto não aponta para o GitHub, e o README publicado para antes da seção sobre o repositório.

## UI base sem opinião

Decidido em 2026-10-01. O tc96 reutiliza patterns em projetos que já usam COSS, com a menor sobrescrita de estilo possível. A UI base não é opinativa e usa os componentes COSS sem alterações.

- O COSS vence a API própria. Os patterns usam a API do COSS. Saem `size` `sm | md | lg`, `variant: 'primary'`, `buttonSizes`, `inputSizes` e o `control-radius`. O `Text`, que não existe no COSS, migra para `packages/elements`. O `tc96/ui` público é removido, sem re-export.
- O consumidor é dono dos componentes COSS. Os patterns declaram `registryDependencies` do COSS como `@coss/<item>`; o CLI deixa de fora as que o projeto já tem, e o shadcn instala as que faltam. O tc96 não distribui UI. Ver [Dependências do COSS](#dependências-do-coss).
- O `cn` também é do consumidor. Os imports de `@tc96/utils` são reescritos para o `aliases.utils` do `components.json` do consumidor, e o arquivo não é distribuído.
- Os patterns não redefinem tema. Tokens, `:root`, `.dark` e utilitários próprios pertencem ao consumidor.

`packages/ui` continua no workspace, privado, como a UI que um consumidor COSS teria. Ele é gerado por `bun run sync:coss`, que grava cada item do registry do COSS como publicado e só troca os aliases de import (`@/registry/default/...`) pelos do workspace, como o `shadcn add` faria. Nunca é editado à mão. O lock `packages/ui/coss.lock.json` registra, por item, a URL `coss.com/ui/r/<item>.json`, o hash do conteúdo publicado e o hash do arquivo gravado. O `check:coss` compara cada arquivo com o lock, e o `check:coss --remote` compara com o registry. O diretório fica fora do Biome. Os patterns só importam `@tc96/ui/<item>` presente no lock.

Situação em 2026-10-01: os 27 itens de `packages/ui/src` são o COSS sem alterações. Antes, 8 deles divergiam (button, input, input-group, group, calendar, combobox, sheet e textarea) e havia cópias em `compat/`. O COSS fixa `@base-ui/react` 1.8.0 e usa `@daypicker/react` no calendar, e o workspace acompanha essas versões. O `styles/global.css` que resta em `detail-sheet` não é importado.

Sem biblioteca npm, decidido em 2026-10-01. Um pacote compilado não consegue importar o COSS do consumidor sem embutir uma cópia própria ou depender de um caminho que não resolve. Por isso o tc96 é distribuído só como fontes. A atualização passa a ser `tc96-parttens add --diff` com incorporação manual. Reabrir esta decisão só se surgir como requisito um consumidor sem COSS. O build da biblioteca foi removido; o `verify-public-api` confere os barrels dos patterns e o agregado `packages/parttens/src/index.ts` contra `public-api-exports.json`, e o `pack:check` confere só o CLI.

Locale do calendar, resolvido no planejamento: o calendar do COSS fala inglês por padrão, como o rótulo dos patterns (`en-US`). Outro idioma entra por `calendarProps.locale`.

Faixa de datas do calendar, decidida em 2026-10-01: o intervalo selecionado usa o desenho do calendar do COSS sem alterações, com o miolo reto em `bg-accent` e as pontas arredondadas por fora. O degradê com pontas `rounded-full` do fork antigo não volta.

### Regra de sobrescrita

Decidida em 2026-10-01. Sobre um componente COSS com estilo, um pattern só passa classes de:

- layout e dimensão (`flex`, `gap-*`, `w-*`, `h-*`, `p-*`, posição);
- tipografia (`text-sm`, `font-medium`, `truncate`);
- neutralização: zerar o que o componente traz, com `transparent`, `none` ou `0` (`bg-transparent`, `shadow-none`, `border-0`, `rounded-none`), inclusive com `!` quando uma variante de estado do COSS ganharia;
- mostrar e esconder (`opacity-0` e `opacity-100`);
- o formato do `Skeleton`, que é o desenho do que ele substitui.

Cor, raio, borda e sombra novos ficam com o tema do consumidor. Quando o pattern precisa de outra aparência, usa uma variante ou um tamanho do COSS: o valor de uma propriedade é o `Badge` `secondary` e a ausência o `outline`; o botão de adicionar card é o `Button` `outline`. Aplicar o estilo de outro componente COSS (`badgeVariants` num `Button`) também é sobrescrita; o caminho é o próprio componente com `render`, como o `Badge` com `render={<button />}`.

Partes do COSS sem estilo (os primitivos do base-ui, `MenuTrigger`, `MenuRadioGroup`, `ComboboxTrigger`) não têm o que sobrescrever: estilizá-las é como estilizar um elemento do próprio pattern. O mesmo vale para o markup próprio, que usa os tokens do tema.

O `bun run overrides:check` (`scripts/check-overrides.ts`) aplica a regra e roda no `bun run check`. Ele lê o fonte de `packages/ui` para saber quais exports têm estilo e segue as constantes de classe locais e importadas. Exceção só em `scripts/override-exceptions.json`, com o motivo; o check também reprova exceção sem motivo ou sem uso. Hoje são quatro: o fundo do `AvatarFallback` nas properties de pessoa e, na moldura dos widgets, a borda `border-border/80` e o raio `rounded-lg` do `Card`.

## Comportamento e dados

A aplicação fornece os dados preparados e executa filtros, ordenação, paginação, agrupamento, persistência e mutações. Os padrões renderizam e emitem eventos. Estado visual transitório pode permanecer local. Permissões, API, vocabulário de produto e regras de domínio pertencem ao consumidor.

Exceção de compatibilidade aceita: preservar o agrupamento interno atual e acrescentar uma entrada para grupos preparados pelo consumidor. Quando esta entrada estiver presente, não executar a projeção interna. Os dois contratos compartilham a renderização. Inventariar outros comportamentos locais da API atual antes de propor mudanças incompatíveis.

## Distribuição e instalação

Há um modo só: instalação editável dos fontes.

### Estrutura do consumidor

Decidido em 2026-10-01. O consumidor monta um design system em camadas, no espírito do atomic design. O `components.json` fica na raiz do monorepo e é a única configuração; o `tc96.json` deixa de existir.

Decidido em 2026-10-02: `packages/helpers` (`@tc96/helpers`) reúne funções sem React que mais de um pattern usa, a começar pela formatação de valores dos widgets. É distribuído como `elements`, no alias `helpers`, com um arquivo por módulo (`@tc96/helpers/format`), para o consumidor receber só o que o pattern importa; `utils` continua sendo o `cn` do consumidor e não é distribuído. O alias passa a ser obrigatório no `components.json`. Módulos atuais: `format` (valores), `initials`, `clipboard`, `date` (ISO, dia curto, deslocamento de dias por fuso, dia relativo), `time` (hora do dia por fuso e locale, inteira ou separada em hora, segundos e período), `calendar-date` (`CalendarDate` e aritmética de dias em Y/M/D), `zoned-date-time` (relógio de parede por fuso) e `rich-text` (título em uma linha, contador, texto plano, tipos de elemento e `id` de nó de um documento Slate), usado pelo `rich-text-editor` e pelas stories que conferem o vocabulário. O calendar e o checklist usam os três últimos; `properties/date` mantém `formatDateProperty`, `parseDatePropertyValue` e `serializeDatePropertyValue` como API pública, delegando ao helper, e o checklist deixou de importar funções de `properties`.

```text
components.json        aliases: ui, utils, elements, helpers, patterns
packages/
  ui/                  átomos: componentes COSS (aliases.ui)
  elements/            componentes próprios fora do COSS, como Text e IconFrame (aliases.elements)
  helpers/             funções sem React, como a formatação de valores (aliases.helpers)
  patterns/            organismos: patterns do tc96 (aliases.patterns)
apps/
  web/                 templates e páginas da aplicação
```

- `ui` e `utils` vêm dos aliases que o shadcn já define. O shadcn instala ali os componentes COSS.
- `elements`, `helpers` e `patterns` são aliases acrescentados ao mesmo objeto `aliases`. O shadcn 4.21 valida `aliases` com um `z.object` não estrito, que aceita e ignora chaves desconhecidas; o objeto de topo é estrito, por isso as chaves novas ficam dentro de `aliases`. O CLI do tc96 lê o arquivo bruto para obter esses três aliases.
- Imports só descem de camada: `patterns` importa `elements`, `ui`, `utils` e `helpers`; `elements` importa `ui`, `utils` e `helpers`; `ui` não importa nenhuma das outras; `helpers` e `utils` não importam React nem UI.
- Cada alias precisa de entrada exata e de wildcard nos `paths` do `tsconfig` da raiz, conforme o [contrato de instalação](installation-contract.md).

Situação em 2026-10-01: o CLI lê os aliases do `components.json` e reprova, com a lista das chaves que faltam, quando algum está ausente. O destino de `elements`, `helpers` e `patterns` é o diretório que o wildcard de cada alias resolve no `tsconfig`. O build do registry não segue os imports de `@tc96/ui` e `@tc96/utils`, e o `assertDistributable` reprova qualquer item com arquivo de `ui/` ou `utils/` ou com `:root`, `.dark`, `@theme` ou `@utility`. Cada `@tc96/ui/<item>` importado vira `@coss/<item>` nas `registryDependencies` do item; o CLI também resolve o diretório do alias `ui` para saber quais o consumidor já tem.

### Dependências do COSS

Decidido em 2026-10-01, depois de medir o shadcn 4.21 no consumidor de exemplo, com os componentes COSS instalados e o `button.tsx` personalizado. Eram as decisões adiadas até o primeiro consumidor.

- **Forma:** `@coss/<item>`, a mesma que o próprio COSS usa entre os seus itens. Sem configuração, o shadcn resolve `@coss` pelo índice público e grava `registries.@coss` no `components.json`, mantendo `elements` e `patterns`. Um endereço que o consumidor configure para `@coss` é respeitado; a URL completa o ignoraria.
- **Reaproveitamento:** o CLI deixa de fora as dependências cujo `<ui>/<item>.tsx` já existe antes de chamar o shadcn. Medido: o shadcn pula arquivo igual, e não sobrescreve variável de tema que o consumidor alterou, mas pergunta antes de sobrescrever um componente personalizado, mesmo com `--yes`. Responder sim apaga a personalização; sem terminal, ele para na pergunta e sai com status 0 sem gravar os arquivos. A pergunta ainda pode aparecer quando um componente que falta depende de outro personalizado, como ao rodar `shadcn add @coss/<item>`. Um componente instalado numa versão antiga do COSS aparece na verificação de tipos depois da instalação.
- **Persistência dos aliases:** `shadcn add` mantém `elements` e `patterns`. `shadcn init --force` regrava o `components.json` do zero, sem essas chaves e com outro alias `ui`. O CLI avisa sem reaplicar: a mensagem lista as chaves que faltam e cita o `init --force`. Não há outra fonte para reaplicar os valores, e o `ui` alterado precisa de revisão do consumidor. `shadcn apply` não foi medido.

Contrato proposto do comando:

```sh
npx @tc96/parttens add collection-views properties
```

O CLI aceita vários padrões, resolve dependências compartilhadas uma vez e ajusta imports para os pacotes do consumidor. Os imports `@tc96/ui`, `@tc96/utils`, `@tc96/elements`, `@tc96/helpers` e `@tc96/parttens` são reescritos para `aliases.ui`, `aliases.utils`, `aliases.elements`, `aliases.helpers` e `aliases.patterns` do consumidor. Exemplo: `@tc96/ui/button` se torna `@lemind/ui/button`.

Decisão confirmada: utilizar o instalador do shadcn. `tc96-parttens` será uma camada fina de configuração, seleção e verificações; não terá um segundo mecanismo de cópia e resolução de dependências. O registry será compatível com o schema do shadcn. Validar destinos em monorepo e aliases personalizados antes de finalizar esse adaptador. Bun não será exigido para executar o CLI via npm.

Preservar arquivos existentes por padrão; perguntar antes de sobrescrever. A primeira versão oferece comparação e orientação para incorporar correções manualmente, sem atualização ou mesclagem automática.

Proposta de verificação: conferir exports e compatibilidade dos contratos TypeScript, reportando limitações. Essa verificação não garante equivalência visual ou comportamental. Não anunciar compatibilidade completa somente com base no nome ou na existência de um arquivo.

## Acessibilidade dos patterns

Decidido em 2026-10-01, na triagem das violações do axe.

- **Arraste:** o dnd-kit transforma o ativador do arraste em botão, e um botão esconde o que contém da tecnologia assistiva. Por isso o ativador do card do kanban e do item do calendar é uma alça dedicada, um botão com ícone de grip ao lado do conteúdo, que aparece no hover e no foco. É ela que recebe o teclado e a tecnologia assistiva. O card continua um contêiner comum, com as ações acessíveis. No kanban, o ponteiro e o toque também pegam o card inteiro, exceto botões, campos e itens de menu dentro dele; o botão que abre o card só arrasta depois da distância mínima. Sem arraste, o calendar não tem alça.
- **Troca de coluna no kanban:** o React é o único dono do nó do card entre colunas. Na mesma coluna, o plugin de ordenação otimista do dnd-kit reordena o DOM sem render. Entre colunas o plugin é impedido e a troca passa pelo estado, porque um nó movido por fora do React quebrava a remoção (`removeChild`). O conteúdo do card fica memoizado: trocar de coluna só re-renderiza o invólucro dos cards cujo índice mudou, e o `renderCard` do consumidor roda só para o card movido.
- **Seletor de views:** `SelectedViewMenu` é um popover (`role="dialog"`), não um menu, porque reúne um campo de busca e, em cada view, um botão de opções, e um `role="menu"` não pode conter nenhum dos dois. Nomes e props continuam os mesmos, mas os filhos deixam de ser itens de menu: rótulo de grupo, separador e estado vazio são elementos comuns, como o `Separator` do COSS. Entre as views o teclado usa Tab, e as opções de cada view ficam num menu próprio. Escolher uma view, criar outra ou usar uma opção fecha o popover.
- **Popups e listas** dos patterns têm nome acessível, e mensagens de erro usam `text-destructive-foreground`, como o `Field` do COSS.

Decidido em 2026-10-03, na auditoria de Tailwind de `packages/parttens` (fora `checklist`, que serviu de referência, e `detail-sheet`, ainda em ajuste):

- **Condição emite uma classe só.** Um condicional interno nunca entrega duas utilities da mesma propriedade ao `cn` para o merge escolher: o esqueleto do calendar, a célula do mês, o cabeçalho da coluna do kanban e o punho de redimensionar do data grid passaram a ternários que emitem `px`, `bg` ou `flex-direction` uma vez. A opção do menu `/` do editor é estilizada por `data-highlighted:`, o atributo que já carregava o estado.
- **Nada só no hover.** O checkbox do marcador de linha do data grid e a alça de arraste do bloco do editor ganharam `group-focus-within:`/`focus-within:` e `pointer-coarse:opacity-100`, porque em v4 `hover:` não dispara em toque; `icon-label-property` já seguia esse par.
- **Foco do chip do calendar.** O gatilho de abrir o chip remove o outline nativo; o chip (`article`) passou a desenhar `has-focus-visible:ring-2 ring-primary`, o mesmo desenho do `KanbanCard`.
- **Só token semântico.** A marca de destaque do editor usa `bg-warning/30` (`/25` no escuro) no lugar de `bg-yellow-*`, e o ladrilho do ícone das abas de modo usa `bg-primary text-primary-foreground` no lugar de `#c65c50` com `text-white` (4,2:1); a cor crua ignorava o tema do consumidor. `rounded` sem sufixo virou `rounded-sm`, o menor raio do tema.
- **Valor arbitrário repetido.** As oito ocorrências de ~10 px em três grafias (`text-[10px]`, `text-[0.6rem]`, `text-[0.625rem]`) convergiram para `text-[0.625rem]`: nos rótulos de hora do calendar, nas iniciais do avatar de 16 px e no `AvatarStack` pequeno. O pattern não declara tokens, então a promoção fica como nota ao consumidor: um `--text-2xs: 0.625rem` no tema cobre todas. As larguras da coluna do kanban usam a escala (`w-76`, `xl:w-88`) e `translate-y-[-50%]` virou `-translate-y-1/2`.
- **Não é achado.** `outline-none` com `focus-visible:` na mesma string ou no invólucro segue a convenção do COSS (27 usos em `packages/ui`); `style={{ minWidth: 0 }}` em `ScrollArea.Content` é a única forma de vencer o `minWidth: fit-content` inline do Base UI; o campo do `EditableText` e o conteúdo do editor usam o cursor como indicador de foco; `dark:` em opacidade de tom nos chips segue o COSS.

## Validação proposta

- Fronteiras: impedir imports em direção proibida, ciclos e UI duplicada por padrão. `packages/parttens` só importa `@tc96/ui/<item>` presente no lock COSS.
- UI: todo arquivo de `packages/ui/src` é igual ao snapshot COSS fixado. Um job separado procura versão nova no upstream.
- Registry: nenhum item distribui arquivo de UI, nem `:root`, `.dark`, `@theme` ou `@utility`. Todo `@tc96/ui/<item>` usado aparece em `registryDependencies`.
- Consumidor: num projeto COSS com alias e caminho fora do padrão e um botão marcado, instalar `collection-views properties`. O `tsc --noEmit` passa, a renderização contém o marcador e nenhum arquivo é escrito no caminho de UI. Implementado em `apps/example`, um consumidor com aliases `@acme/*` e patterns em `packages/organisms/src`. O `test:consumer:registry` instala todos os patterns e o `test:consumer:ssr` renderiza `collection-views` e `properties` no servidor; os dois copiam o exemplo para `.test-output`, instalam nele o COSS do lock com um marcador no `button.tsx` e reprovam se o CLI escrever em `packages/ui` ou deixar import `@tc96/*`.
- Registry/CLI: instalar padrões isolados e em conjunto com aliases personalizados; verificar dependências, conflitos e preservação de arquivos.
- Storybook: cobrir interação, teclado, foco, edição e arraste. Docs e Storybook consomem os pacotes do workspace. O framework é `@storybook/react-vite`, porque nenhuma story depende do `@tanstack/react-router`. O `bun run check` roda também o typecheck e o lint do Storybook.
- Acessibilidade: o addon de a11y roda o axe em cada story com `test: 'error'`, e uma violação reprova o `storybook:test`. Exceção só na própria story, com o motivo. Hoje são seis. Cinco são de contraste vindo do COSS sem alterações: os dias da semana e os dias fora do mês do calendar (3,14:1), nas stories `Trigger` e `CalendarLocale` do `DateRangeProperty` e nas stories `Overview` e `AgendaCalendar` dos widgets de produtividade, o variant `destructive` do botão (3,8:1), o exemplo de força de senha do COSS (3,65:1) e o variant `warning` do `Badge` em `text-xs` (4,36:1), nas stories `Overview` e `Deals` dos widgets de CRM. A sexta, nas stories do `rich-text-editor` (editor e título), limita `aria-hidden-focus` a `[aria-hidden="true"]:not([data-base-ui-focus-guard])`: o `Popover` do Base UI cerca o popup com guardas de foco (`tabindex=0` sob `aria-hidden`) enquanto a barra ou o menu `/` estão abertos, e elas são do COSS, não do pattern. Fora da contagem, a regra de contraste das stories de widgets com tom invertido (`Overview` e `AssetStatInverted` de finanças, `Overview` e `TaskProgressInverted` de produtividade, `Overview` de CRM) ignora só o widget invertido: o `muted-foreground` escuro do tema do Storybook fica em 4,2:1 sobre o card. Ver [Acessibilidade dos patterns](#acessibilidade-dos-patterns).
- SSR: validar renderização e hidratação num consumidor real com SSR, preservando fronteiras de componentes cliente. SSR não implica executar interações no servidor.
- Desempenho: medir cenários com milhares de itens por view, incluindo scroll, seleção e arraste; verificar virtualização sem fixar limites numéricos não acordados.

## Registro de decisões

| Decisão | Alternativa | Motivo |
| --- | --- | --- |
| Monorepo com pacotes internos por responsabilidade | Uma pasta pública única ou releases independentes | Apps e fronteiras claras sem multiplicar versões da biblioteca |
| API agregada como barrel gerado pelo CLI no alias do consumidor; antes `tc96/parttens`, substituída em 2026-10-01 | Imports públicos obrigatórios por padrão | Preferência do consumidor |
| Só fontes, sem biblioteca npm; antes "Fontes locais e biblioteca versionada", substituída em 2026-10-01 | Biblioteca com cópia COSS embutida, ou alias/peer fixo | Pacote compilado não importa o COSS do consumidor sem cópia paralela ou caminho que não resolve |
| Preservar API atual dos patterns; substituída para a UI em 2026-10-01 | Redesenhar todos os contratos | Evitar quebra para consumidores existentes |
| UI base é COSS sem alterações, com API COSS; `tc96/ui` removido | Manter a API própria de `tc96/ui` | Reutilizar patterns sobre o COSS do consumidor com a menor sobrescrita |
| Componentes COSS de posse do consumidor via `registryDependencies` | tc96 mantém cópia vendorizada | O tema e as personalizações do consumidor valem sem cópia paralela |
| `registryDependencies` como `@coss/<item>` | URL completa do item COSS | Mesma forma que o COSS usa; respeita o endereço de `@coss` configurado pelo consumidor |
| CLI deixa de fora os componentes COSS já instalados | Passar tudo e deixar o shadcn decidir | O shadcn pergunta antes de sobrescrever componente personalizado, mesmo com `--yes`, e para sem terminal |
| Avisar quando `elements` ou `patterns` somem do `components.json`, sem reaplicar | Guardar uma cópia dos aliases | Uma configuração só; o `init --force` também troca o `ui`, que o consumidor precisa revisar |
| `Text` e outros componentes fora do COSS em `packages/elements`, distribuídos pelo registry com destino configurável | Manter em `packages/ui` | `packages/ui` só contém COSS sem alterações |
| `Title` removido; `Text` cobre títulos pelas variantes e `size` segue a escala do Tailwind (`xs`…`8xl`, padrão `base`) | Manter `Title` como alias com `font-heading` e `semibold` | Dois nomes para a mesma peça; a escala `sm | md | lg` não cobria os títulos de página e os valores grandes dos widgets |
| `components.json` na raiz como única configuração, com `aliases.elements` e `aliases.patterns`; `tc96.json` removido | Manter `tc96.json` para os destinos do tc96 | Uma configuração só, numa estrutura em camadas no consumidor |
| `cn` resolvido pelo `aliases.utils` do consumidor | Distribuir `@tc96/utils` | O COSS já instala `cn` no consumidor |
| Grupos preparados com agrupamento antigo preservado | Remover projeção interna | Separar operações novas sem quebrar comportamento atual |
| UI compartilhada e destino configurável | UI duplicada por padrão | Reaproveitar a base e as personalizações do consumidor |
| Correções locais manuais | Mesclagem automática | Escopo definido para a primeira versão |
| Instalador do shadcn com camada fina do produto | Instalador próprio | Reutilizar o mecanismo adotado pelo COSS |
| Sem Filter Builder nem responsividade | Todo o catálogo e mobile | Exclusões explícitas do usuário |
| Editor de texto sobre o Plate headless, portado do flash-card em 2026-10-03 | Editor próprio sobre `contenteditable` ou outra biblioteca (Tiptap, Lexical) | Reaproveitar o editor já validado, com menu `/`, barra flutuante, atalhos markdown e vocabulário fechado; a dependência entra no item do registry como o `recharts` |
| UI do editor feita com COSS sobre plugins do Plate, sem os componentes do registry do Plate | Migrar para o Tiptap | A barra, o select de bloco e o botão de link já saem do COSS sem sobrescrita nem edição em `packages/ui`; o Plate entra só para estado, comandos e o modelo do documento |
| Gamificação como quarto grupo de widgets, sobre `CardWidgetShell`, `Meter`, `IconFrame` e `ExpandableList` | Portar o `GamifiedProgress` do flash-card como um componente com três modelos | Um widget por responsabilidade compõe em qualquer grade e segue a escala, a moldura e o recolhimento dos demais widgets |

## Pontos ainda em revisão

- Aprovação da estratégia de validação e do limite da verificação de compatibilidade.
- Configuração e integração do CLI com shadcn, preservando o comando desejado e validando destinos em monorepo.
- Metas mensuráveis por view e matriz inicial de ambientes SSR/navegadores.
- Execução da migração conforme o [plano em revisão](../plans/2026-09-29-reestruturacao-tc96-parttens.md).

## Data Grid: linhas memoizadas e estado derivado

Decisão de 2026-10-03. O `DataGrid` deixou de ser um arquivo de 1271 linhas com `renderDataRow`: ficou em `components/`, `hooks/` e `lib/`. Linhas e células são `memo` e recebem primitivos (foco, seleção, densidade); o foco e a seleção de células chegam só à linha que os possui, então mover o foco ou selecionar uma célula re-renderiza uma linha, não a página. O TanStack Table v9 continua assinando o estado inteiro no componente que chama `useTable`; a memoização está abaixo dele e as linhas se invalidam por `row`, pelas colunas visíveis e seus layouts, pela densidade e pelo handler de valor. Os handlers das células são um conjunto estável compartilhado, ligado em cada célula (não delegado no viewport) para manter os eventos que sobem pelo portal do `Select`. A célula focada e a seleção de células são derivadas na leitura, sem `useEffect`; um único `useLayoutEffect` sem dependências devolve o foco à célula corrente. O benchmark (`bun run bench:data-grid`) e seus números estão em `views/data-grid/README.md`.

Seleção de células e foco sobrevivem a ocultar coluna e a filtrar: a seleção é filtrada na leitura contra as linhas e colunas visíveis, então reexibir a coluna ou remover o filtro devolve as células selecionadas e o foco à célula anterior. A seleção guardada só é descartada quando o id da linha sai do conjunto de dados (core row model). Decidido pelo owner em 2026-10-03. Células de `useDataGrid` recebem `meta` memoizado e `onCellValueChange` estável; renderizadores devem derivar de row, column, cell e `table.options.meta`.

## Collection views: benchmark por view

Decisão de 2026-10-03. As cinco views de `collection-views` têm benchmark no mesmo harness (`scripts/bench/bench-harness.ts` e `bench-compare.ts`, copiados da skill `react-component-performance` do tc96-marketplace, versão `bench-harness v1`). Cada adaptador em `scripts/bench/<view>.bench.ts` importa só a API pública da view e conta as chamadas do renderizador que o consumidor passa (`cell`, `renderItem`, `renderCard`); o baseline fica em `scripts/bench/results/<view>.base.json` e os números no `README.md` de cada view. A contagem de renders é determinística e é o gate (`--compare <baseline> --gate` sai com 1 se algum contador subir); tempo é só relatório, e diferenças abaixo de 10% são ruído. Esta é a primeira resposta ao ponto "metas mensuráveis por view": a meta de cada view é a contagem de renders da tabela do seu README, e uma mudança que a aumenta precisa justificar e regravar o baseline.

No kanban, os cenários de arrastar usam o sensor de teclado do dnd-kit fora do `act` e sem `Profiler`, porque o tempo de animation frame do dnd-kit faz `commits` variar em 1 entre execuções; esses cenários contam só os renders dos outros cards (o card arrastado é re-renderizado pelo overlay um número variável de vezes). No calendar, data, fuso e "agora" são fixos e o layout é um grid simulado, para o arrasto por teclado funcionar no JSDOM.
