# Acessibilidade e usabilidade

Fonte única das regras, responsabilidades, exceções e registros de acessibilidade e usabilidade do tc96-parttens. Decidido em 2026-11-14 pelo dono. O [doc de arquitetura](architecture/tc96-parttens.md) e os `AGENTS.md` apontam para cá; o `AGENTS.md` de um pattern guarda só os invariantes de ARIA e foco daquele pattern.

## Premissas

- Acessibilidade por teclado, foco e leitores de tela é premissa do projeto desde a primeira versão.
- Limites de contraste da WCAG 2.2: texto 4,5:1 (1.4.3); ícone, anel de foco e componente de interface 3:1 (1.4.11). Borda decorativa, que não identifica componente nem é objeto gráfico, não tem limite.
- Todo par é verificado no claro e no escuro, no preset `Default` do tema do exemplo.

## Camadas e responsabilidades

| Camada | Onde | Responsabilidade |
| --- | --- | --- |
| 1. Tema | `apps/example/packages/ui/src/styles.css` e `themes/` | Tokens do consumidor. Uma correção de contraste nunca muda valor de token; a correção global é uma regra por `data-slot`. |
| 2. UI e patterns | `packages/ui`, `packages/elements`, `packages/parttens`, `packages/templates` | Markup, ARIA, foco e o par cor/superfície certo. Uma violação real se corrige aqui, onde o elemento encontra a superfície. |
| 3. Story | `apps/storybook/src/**/*.stories.tsx` | Renderiza cada estado e testa o comportamento no `play`. Não contorna o axe: uma exceção na story precisa de motivo registrado em [Exceções](#exceções). |
| 4. Config do Storybook | `apps/storybook/.storybook/preview.ts` | O `@storybook/addon-a11y` com `test: 'error'` roda o axe depois de cada story; as regras e exclusões que valem para todas as stories ficam aqui. |
| 5. Runner | `@storybook/addon-vitest` em `apps/storybook/vitest.config.ts` | Executa render, `play` e axe no Chromium, nos projetos `storybook` (claro) e `storybook-dark` (escuro). |
| 6. Desenvolvimento | Storybook (`bun run storybook`) | O painel a11y e o "Run tests" da sidebar mostram a violação enquanto se trabalha. |
| 7. CI | `.github/workflows/check.yml`, job `storybook` | No PR roda as stories afetadas (`--changed`) e a suíte inteira quando a config do Storybook ou o tema mudam. |

A validação de acessibilidade é das camadas 4 a 7. Nenhum script local de gate a substitui.

## Regras

- **Contraste sem mudar tokens.** Os valores de `:root` e `.dark` do tema ficam como estão, e `packages/ui` não é editado por contraste. Um par que falha é um elemento sobre uma superfície para a qual seus tokens não foram feitos, então a correção fica onde ele encontra a superfície:
  - Num ponto: o elemento usa o foreground da superfície onde está, com opacidade quando precisa de tom (a dica de envio do `RecordDialog` sobre o botão primário usa `bg-primary-foreground/16 text-primary-foreground`). Num componente do COSS isso é sobrescrita e entra em `scripts/override-exceptions.json`.
  - Global, quando um componente do COSS falha onde quer que apareça: uma regra no `styles.css` do exemplo restrita ao `data-slot` do componente, como `[data-slot="switch"] { --input: var(--switch-track); }`, registrada aqui como nota para o consumidor.
  - Nos dois casos, as razões de antes e depois, no claro e no escuro, entram em [Registros de contraste](#registros-de-contraste).
- **Medição.** Cores computadas no navegador, convertidas para sRGB e com o alfa composto sobre a superfície efetiva, como faz o axe.
- **Auditoria visual.** Refinar um pattern visual inclui auditar contraste (com as razões numéricas), espaçamento e composição, e conferir um screenshot claro e um escuro da story.
- **Fundo da story.** O invólucro de uma story não tem fundo: a página herda `bg-background` e o contraste do card continua visível.
- **Nada só no hover.** Toda affordance que aparece no hover também aparece no foco (`group-focus-within`, `focus-visible`) e em `pointer-coarse`, porque `hover:` não dispara em toque.
- **Presets.** Verificação visual, axe e razões usam o `Default`. Um preset novo registra o contraste em [Temas do exemplo](#temas-do-exemplo).

## Validação no Storybook

- O `@storybook/addon-a11y` roda o axe em cada story com `parameters.a11y.test: 'error'` (`apps/storybook/.storybook/preview.ts`), e uma violação reprova o `storybook:test`.
- O `storybook:test` roda cada story duas vezes: no projeto `storybook`, claro, e no `storybook-dark`, que inicia a story com o global `theme` em `dark` (desde 2026-10-04, #58).
- Um `play` termina num estado estável. Quando algo depende do fechamento de um popup, o `play` espera por ele com uma asserção de comportamento: o `listbox` do `Select` continua montado depois de fechar, então as stories de `SelectProperty` esperam ele sair da árvore de acessibilidade (`queryByRole('listbox')`).

### Exceções

- **Global: guardas de foco do Base UI** (decidido em 2026-11-14 pelo dono). `a11y.context.exclude` tira `[data-base-ui-focus-guard]` do axe em todas as stories. O `FloatingFocusManager` do Base UI cerca todo popup aberto ou fechando com dois `span` visualmente ocultos, `tabindex=0` sob `aria-hidden`, que seguram o Tab e devolvem o foco ao lugar certo; o axe os reprova em `aria-hidden-focus` sem saber que eles nunca ficam com o foco. Antes cada story contornava isso (o `rich-text-editor` limitando a regra, oito arquivos esperando a guarda sumir), e as que não contornavam falhavam de forma intermitente (issues #145, #198, #208 e #280).
- **Na story, contraste vindo do COSS sem alterações:**
  - Os dias da semana e os dias fora do mês do calendar (3,14:1), nas stories `Trigger` e `CalendarLocale` do `DateRangeProperty`, nas stories `Default`, `Reminders`, `TimeInput`, `DateOnly`, `NoPastDays`, `EnglishLabels`, `ShortWindow`, `BelowTrigger` e `DrillIn` do `ScheduleProperty` e nas stories `Overview` e `AgendaCalendar` dos widgets de produtividade.
  - O exemplo de força de senha do COSS (3,65:1).
  - O variant `warning` do `Badge` em `text-xs` (4,36:1), nas stories `Overview` e `Deals` dos widgets de CRM.
- **Na story, widgets com tom invertido:** a regra de contraste de `Overview` e `AssetStatInverted` de finanças, `Overview` e `TaskProgressInverted` de produtividade e `Overview` de CRM ignora só o widget invertido: o `muted-foreground` escuro do tema do Storybook fica em 4,2:1 sobre o card (medição anterior, do tema do Storybook com o widget invertido; a de 2026-10-12 sobre `bg-card` do tema padrão, 5,10:1, não cobre o tom invertido).

## Decisões

Decidido em 2026-10-01, na triagem das violações do axe.

- **Arraste:** o dnd-kit transforma o ativador do arraste em botão, e um botão esconde o que contém da tecnologia assistiva. Por isso o ativador de teclado do card do kanban e do item do calendar é uma alça dedicada, um botão com ícone de grip que só aparece no foco por teclado. É ela que recebe o teclado e a tecnologia assistiva. O card continua um contêiner comum, com as ações acessíveis. O ponteiro e o toque pegam o card ou o item inteiro, exceto botões, campos e itens de menu dentro dele; o botão que abre o card ou o item só arrasta depois da distância mínima. Decidido em 2026-10-06: o item do calendar deixou de ter a alça lateral visível no hover e passou a arrastar pelo corpo, como o card do kanban. No mesmo dia, o bloco do time grid ganhou redimensionamento pelas bordas superior e inferior: as bordas só atendem ao ponteiro e não entram na ordem de tabulação, o ponteiro arrasta com pré-visualização e a borda movida cai na grade de `snapMinutes` do relógio de parede do `timeZone`; o teclado redimensiona pela alça de mover (Alt+setas para o início, Shift+setas para o fim, uma linha da grade por vez), para o item manter as duas paradas de tabulação do card do kanban; o resultado sai pelo mesmo `onRecordReschedule` do arraste, sem prop nova. Item sem fim, item de dia inteiro e chip do mês ficam sem redimensionamento. Sem arraste, o calendar não tem alça.
- **Troca de coluna no kanban:** o React é o único dono do nó do card entre colunas. Na mesma coluna, o plugin de ordenação otimista do dnd-kit reordena o DOM sem render. Entre colunas o plugin é impedido e a troca passa pelo estado, porque um nó movido por fora do React quebrava a remoção (`removeChild`). O conteúdo do card fica memoizado: trocar de coluna só re-renderiza o invólucro dos cards cujo índice mudou, e o `renderCard` do consumidor roda só para o card movido.
- **Seletor de views:** `ViewSwitcherMenu` é um popover (`role="dialog"`), não um menu, porque reúne um campo de busca e, em cada view, um botão de opções, e um `role="menu"` não pode conter nenhum dos dois. Nomes e props continuam os mesmos, mas os filhos deixam de ser itens de menu: rótulo de grupo, separador e estado vazio são elementos comuns, como o `Separator` do COSS. Entre as views o teclado usa Tab, e as opções de cada view ficam num menu próprio. Escolher uma view, criar outra ou usar uma opção fecha o popover. Desde 2026-10-31, a pedido do dono, a família `ViewSwitcher*` chama-se `ViewSwitcher*` (`ViewSwitcherMenu`, `ViewSwitcherSearch`, `ViewSwitcherItems`, `ViewSwitcherItem`, `ViewSwitcherCreate`), nome usado por Airtable e Notion para o mesmo padrão, e as stories ficam em `Patterns/Collection/Views/View Switcher`; os nomes `ViewSwitcher*` e `Patterns/Collection/Views/View Switcher` citados em decisões anteriores são os antigos.
- **Linhas do `record-group`** (decidido em 2026-10-08, issue #83; revisto em 2026-10-09 pelo dono): cada `RecordGroupRow` é um `dl` com um `dt` (rótulo, `record-group-row-label`) e um `dd` (valor, `record-group-row-value`), e o corpo do grupo (`data-slot="record-group-content"`) é um `div`. O leitor de tela associa "Owner" a "Mariana Souza". Até 2026-10-09 o corpo era o `dl` e cada linha um `div` com `dt` e `dd`; com `RecordGroupLink`, `RecordGroupItem`, `RecordGroupSubgroup` e o `Checklist` `plain` no corpo, que um `dl` não aceita como filhos, 17 stories falharam no axe (`definition-list` e `dlitem`, este nas linhas dentro de um `RecordGroupSubgroup`). Com o `dl` na linha, qualquer filho é válido no corpo, num subgrupo ou num `RecordPreview`, e uma linha vale fora do `RecordGroup`. O custo: o leitor de tela anuncia cada linha como uma lista de um item, em vez de uma lista com todas as linhas. O `dd` hospeda o editor de `properties` sem perda: o botão ou combobox mantém o nome do seu `ariaLabel`, o axe passa nos dois temas, e os nomes de `data-slot` e a API pública não mudam. Alternativas: `role="group"` com `aria-labelledby` por linha, que anuncia um grupo por linha e exige `id` por rótulo, ou seja, ARIA para refazer o que o HTML já tem; tabela (`table`/`th`/`td`), que promete cabeçalhos de coluna e navegação por células que o par rótulo e valor não tem, e obrigaria a grade `start`/`between` a abandonar o `flex` e o `grid` das linhas.
- **Popups e listas** dos patterns têm nome acessível, e mensagens de erro usam `text-destructive-foreground`, como o `Field` do COSS.

Decidido em 2026-10-03, na auditoria de Tailwind de `packages/parttens` (fora `checklist`, que serviu de referência):

- **Condição emite uma classe só.** Um condicional interno nunca entrega duas utilities da mesma propriedade ao `cn` para o merge escolher: o esqueleto do calendar, a célula do mês, o cabeçalho da coluna do kanban e o punho de redimensionar do data grid passaram a ternários que emitem `px`, `bg` ou `flex-direction` uma vez. A opção do menu `/` do editor é estilizada por `data-highlighted:`, o atributo que já carregava o estado.
- **Nada só no hover.** O checkbox do marcador de linha do data grid e a alça de arraste do bloco do editor ganharam `group-focus-within:`/`focus-within:` e `pointer-coarse:opacity-100`, porque em v4 `hover:` não dispara em toque; `icon-label-property` já seguia esse par.
- **Foco do chip do calendar.** O gatilho de abrir o chip remove o outline nativo; o chip (`article`) passou a desenhar `has-focus-visible:ring-2 ring-primary`, o mesmo desenho do `KanbanCard`.
- **Só token semântico.** A marca de destaque do editor usa `bg-warning/30` (`/25` no escuro) no lugar de `bg-yellow-*`, e o ladrilho do ícone das abas de modo usa `bg-primary text-primary-foreground` no lugar de `#c65c50` com `text-white` (4,2:1); a cor crua ignorava o tema do consumidor. `rounded` sem sufixo virou `rounded-sm`, o menor raio do tema.
- **Valor arbitrário repetido.** As oito ocorrências de ~10 px em três grafias (`text-[10px]`, `text-[0.6rem]`, `text-[0.625rem]`) convergiram para `text-[0.625rem]`: nos rótulos de hora do calendar, nas iniciais do avatar de 16 px e no `AvatarStack` pequeno. O pattern não declara tokens, então a promoção fica como nota ao consumidor: um `--text-2xs: 0.625rem` no tema cobre todas. As larguras da coluna do kanban usam a escala (`w-76`, `xl:w-88`) e `translate-y-[-50%]` virou `-translate-y-1/2`.
- **Não é achado.** `outline-none` com `focus-visible:` na mesma string ou no invólucro segue a convenção do COSS (27 usos em `packages/ui`); `style={{ minWidth: 0 }}` em `ScrollArea.Content` é a única forma de vencer o `minWidth: fit-content` inline do Base UI; o campo do `EditableText` e o conteúdo do editor usam o cursor como indicador de foco; `dark:` em opacidade de tom nos chips segue o COSS.

Decidido em 2026-10-09 (dono), na página de briefing de campanha: o `EditorTitle` perdeu o fundo `has-focus-visible:bg-muted` e passa a usar só o cursor como indicador de foco, como o corpo do editor e o `EditableText`; o menu do `PropertyCollection` perdeu o rótulo de grupo `Propriedades` e a prop `menuLabel`.

Decidido em 2026-10-08 (#51), contraste do `Button` `destructive` no tema de exemplo. O variant pinta `text-white` sobre `bg-destructive`, com `hover:bg-destructive/90` e `data-pressed:bg-destructive/90`. Com `--destructive` em `red-500` no claro e em 90% de `red-500` com branco no escuro, o rótulo ficava em 3,82:1 e 3,53:1 (o axe media 3,52:1 no escuro), e a exceção de `color-contrast` da story `UI/Button/Destructive` foi removida. Em `apps/example/packages/ui/src/styles.css`, `--destructive` passou a `red-600` nos dois temas, sem mudança em `packages/ui`. Medido no navegador sobre o fundo da página (texto 4,5:1, gráfico 3:1):

| Par | Antes | Depois |
| --- | --- | --- |
| Rótulo branco, repouso, claro | 3,82:1 | 4,77:1 |
| Rótulo branco, hover e pressionado, claro | 3,54:1 | 4,55:1 |
| Rótulo branco, repouso, escuro | 3,53:1 | 4,77:1 |
| Rótulo branco, hover e pressionado, escuro | 4,14:1 | 5,54:1 |
| `destructive-foreground` (`red-700`) sobre `destructive/8`, claro | 5,49:1 | 5,34:1 |
| `destructive-foreground` (`red-400`) sobre `destructive/16`, escuro | 5,06:1 | 5,53:1 |
| Asterisco obrigatório (`destructive-foreground`) sobre `background`, claro | 3,66:1 | 6,15:1 |
| Asterisco obrigatório (`destructive-foreground`) sobre `background`, escuro | 4,96:1 | 6,05:1 |

O texto de erro, de alerta e do `Badge` usa `destructive-foreground`, que não mudou e segue acima de 4,5:1 nos dois temas. O ícone de `state-surface` (`var(--destructive)`, gráfico) fica em 3,67:1 no escuro sobre `background`, acima dos 3:1. O asterisco de campo obrigatório do `Editable` era o único texto em `text-destructive` e passou a `text-destructive-foreground`, o token de texto, como no `checklist`: 6,15:1 no claro e 6,05:1 no escuro sobre `background`, medidos no navegador em `getComputedStyle(label, '::after').color` (antes 3,66:1 e 4,96:1). Não há valor de `--destructive` que dê 4,5:1 nos dois lados no escuro, porque o rótulo branco exige fundo de luminância relativa abaixo de 0,18 e o texto sobre `stone-900` exige acima de 0,2; por isso o texto não usa `text-destructive`. Os pares "antes" e as linhas de `destructive-foreground` e `text-destructive` são calculados a partir dos tokens; os do rótulo "depois" foram medidos nas cores computadas da story.

Decidido em 2026-10-17, contraste da dica de atalho do `RecordDialog`. Com `submitOnModEnter`, o botão de enviar mostra um `Kbd` (`⌘ ↵` ou `Ctrl ↵`) dentro do `Button` padrão, que é `bg-primary`. O `Kbd` do COSS pinta `bg-muted text-muted-foreground`, par feito para `background` e `muted`; sobre `primary` o texto de 12 px ficava abaixo de 4,5:1 nos dois temas, e o axe reprovava no `storybook-dark` as stories que terminam com o diálogo aberto e o botão habilitado (o envio que falha). A causa é a composição do pattern, não um token do consumidor: `muted-foreground` não promete contraste sobre `primary`. O `Kbd` passou a `bg-primary-foreground/16 text-primary-foreground`, o par que o tema garante para `primary`, o mesmo do rótulo, com duas exceções em `scripts/override-exceptions.json` e sem mudança em `packages/ui`. Medido com o axe 4.13 nas cores computadas da story `Patterns/Records/Dialog/Failed Submit`, com o botão em foco e o diálogo aberto depois do erro; o hover é `bg-primary/90` sobre o `popover` (texto 4,5:1):

| Par | Antes | Depois |
| --- | --- | --- |
| Dica, repouso, claro | 2,69:1 | 8,81:1 |
| Dica, hover, claro | 2,03:1 | 6,64:1 |
| Dica, repouso, escuro | 3,00:1 | 10,22:1 |
| Dica, hover, escuro | 2,50:1 | 8,52:1 |

O rótulo do botão não mudou: 14,52:1 no claro e 13,90:1 no escuro, 10,75:1 e 11,48:1 no hover. A tecla se distingue do botão por 1,65:1 no claro e 1,36:1 no escuro (calculado dos tokens); ela é `aria-hidden` e decorativa, porque o texto da dica já carrega a informação, então fica fora do 3:1 de gráfico. A dica não usa opacidade no texto para não perder mais contraste do que a tecla já tira. Nota para o consumidor: o tema de exemplo tem folga, com o par `primary`/`primary-foreground` acima de 13:1; num tema com esse par perto de 4,5:1, a tecla de 16% leva a dica abaixo do mínimo, e o ajuste é uma regra no `styles.css` restrita a `[data-slot="record-dialog-submit-hint"]`, sem mudar o valor dos tokens (regra de contraste de 2026-10-17, no registro de decisões).

Decidido em 2026-10-18 (dono), contraste do placeholder do `RichTextEditor`. O Slate aplica `opacity: 0.333` inline no `span[data-slate-placeholder]`, por cima do `text-muted-foreground` que o pattern dá ao placeholder, e a cor composta ficava abaixo de 2:1. Nenhuma story pegava, porque as que abrem o editor vazio digitam antes de o axe rodar; a violação apareceu na story `Create` de `Patterns/Records/Dialog/Usages/Notes`. O `renderPlaceholder` passa a sobrescrever só a opacidade (`style={{ ...attributes.style, opacity: 1 }}`): os tokens não mudaram, e o placeholder fica no `muted-foreground` que o tema promete para `background` e para o popup. A story `Patterns/Rich Text Editor/Placeholder` deixa o editor vazio para o axe checar o par.

| Par | Antes | Depois |
| --- | --- | --- |
| Placeholder sobre o popup do `Dialog`, claro | 1,60:1 | 5,73:1 |
| Placeholder sobre `background`, claro | 1,59:1 | 5,48:1 |
| Placeholder sobre o popup do `Dialog`, escuro | 1,69:1 | 5,07:1 |
| Placeholder sobre `background`, escuro | 1,70:1 | 5,34:1 |

Medido no navegador: as cores computadas do tema de exemplo foram convertidas para sRGB e a opacidade foi composta em sRGB, como faz o axe; o "antes" sobre o popup bate com os 1,6:1 e 1,69:1 que o axe reportou.

Decidido em 2026-11-14 (issue #250), contraste do rótulo da agregação da `DataTable`. O gatilho do rodapé é um `Button` `ghost`, que pinta `bg-accent` no hover e no pressionado, e o rótulo (`Contagem`, `Soma`) seguia em `text-muted-foreground`, par feito para o `background`. Sobre o `accent` o rótulo passa a `text-accent-foreground/72`, por `group-hover/aggregation` e `group-data-pressed/aggregation` no gatilho; em repouso segue `muted-foreground`. Não sobrescreve classe do COSS, então não entra em `scripts/override-exceptions.json`. Medido pelo axe nas cores computadas da story `Controlled Aggregation Is Followed`:

| Par | Antes | Depois |
| --- | --- | --- |
| Rótulo, repouso, claro | 5,48:1 | 5,48:1 |
| Rótulo, hover, claro | 4,79:1 | 5,55:1 |
| Rótulo, depois de escolher no menu, claro | 5,02:1 | 5,63:1 |
| Rótulo, repouso, escuro | 4,82:1 | 4,82:1 |
| Rótulo, hover, escuro | 4,54:1 | 7,76:1 |
| Rótulo, depois de escolher no menu, escuro | 4,29:1 | 7,41:1 |

## Registros de contraste

### Temas do exemplo

Contraste dos presets, medido em 2026-10-21 nas cores computadas de cada preset no Storybook (convertidas para sRGB num canvas, com o alfa composto sobre a superfície; texto 4,5:1, anel e trilho do `Switch` 3:1). Pares: `foreground` sobre `background`; `muted-foreground` sobre `background`, `card` e `muted`; `card-foreground`, `popover-foreground`, `primary-foreground` e `secondary-foreground` sobre a própria superfície; `accent-foreground` sobre o `accent` em `popover`; `destructive-foreground` sobre `background` e `card`; texto branco sobre `destructive`; `info-`, `success-` e `warning-foreground` sobre `background`; os três pares de texto do sidebar; `ring` sobre `background`; `sidebar-ring` sobre `sidebar`; `switch-track` sobre `card`. As razões do `Default` batem com as já registradas neste documento, com um achado: `sidebar-ring` sobre `sidebar` no claro mede 2,48:1, abaixo de 3:1. Pela regra de contraste de 2026-10-17, o token do `Default` não muda; fica como nota para o consumidor.

Os presets do tweakcn entram como publicados, e o par abaixo do limite é do preset: nota para o consumidor que adotar um deles. Os mais comuns, contando presets com falha em pelo menos um modo: texto branco sobre `destructive` em 35 dos 42 (o `destructive` do tweakcn é quase sempre `oklch(0.6368 0.2078 25.33)`, 3,76:1), `muted-foreground` sobre `muted` em 27, `primary-foreground` sobre `primary` em 24 (25 no sidebar) e `sidebar-ring` em 21. Só T3 Chat passa em tudo, nos dois modos.

| Preset | Claro | Escuro |
| --- | --- | --- |
| Amber Minimal | white/destructive 3,76; sidebar-primary-foreground/sidebar-primary 2,15; ring/background 2,15; sidebar-ring/sidebar 2,06 | white/destructive 3,76; sidebar-primary-foreground/sidebar-primary 2,15 |
| Amethyst Haze | muted-foreground/muted 3,85; primary-foreground/primary 3,64; white/destructive 3,73; sidebar-primary-foreground/sidebar-primary 3,64 | white/destructive 2,99 |
| Bold Tech | primary-foreground/primary 4,23; white/destructive 3,76; sidebar-primary-foreground/sidebar-primary 4,23 | primary-foreground/primary 4,23; white/destructive 3,76; sidebar-primary-foreground/sidebar-primary 4,23 |
| Bubblegum | muted-foreground/background 3,57; muted-foreground/card 3,71; muted-foreground/muted 3,04; primary-foreground/primary 3,99; white/destructive 2,79; success-foreground/background 4,46; warning-foreground/background 4,19; sidebar-primary-foreground/sidebar-primary 3,53; ring/background 2,40; sidebar-ring/sidebar 2,69 | accent-foreground/accent 2,54; white/destructive 3,28; sidebar-primary-foreground/sidebar-primary 3,53 |
| Caffeine | white/destructive 3,87; sidebar-ring/sidebar 1,98 | white/destructive 3,87 |
| Candyland | muted-foreground/muted 3,59; white/destructive 3,76; ring/background 1,46; sidebar-ring/sidebar 1,46 | muted-foreground/muted 3,86; destructive-foreground/card 4,37; white/destructive 3,76 |
| Catppuccin | muted-foreground/background 4,37; muted-foreground/muted 3,73; accent-foreground/accent 2,79; warning-foreground/background 4,45; sidebar-accent-foreground/sidebar-accent 2,79 | white/destructive 2,32 |
| Claude | muted-foreground/background 3,65; muted-foreground/card 3,65; muted-foreground/muted 3,17; primary-foreground/primary 3,90; sidebar-primary-foreground/sidebar-primary 3,77; sidebar-ring/sidebar 1,86 | primary-foreground/primary 3,12; white/destructive 3,76 |
| Claymorphism | muted-foreground/background 3,85; muted-foreground/card 4,43; muted-foreground/muted 3,85; primary-foreground/primary 4,47; white/destructive 3,76; success-foreground/background 4,27; warning-foreground/background 4,01; sidebar-primary-foreground/sidebar-primary 4,47 | white/destructive 3,76 |
| Clean Slate | muted-foreground/muted 4,39; primary-foreground/primary 4,47; white/destructive 3,76; sidebar-primary-foreground/sidebar-primary 4,47 | white/destructive 3,76 |
| Cosmic Night | muted-foreground/muted 4,47; white/destructive 3,11 | white/destructive 3,11 |
| Cyberpunk | primary-foreground/primary 3,45; white/destructive 3,55; sidebar-primary-foreground/sidebar-primary 3,45 | muted-foreground/card 4,44; primary-foreground/primary 3,45; white/destructive 3,55; sidebar-primary-foreground/sidebar-primary 3,45 |
| Darkmatter | muted-foreground/muted 4,39; primary-foreground/primary 3,12; white/destructive 3,76; sidebar-primary-foreground/sidebar-primary 3,12; sidebar-ring/sidebar 2,83 | muted-foreground/muted 4,49; white/destructive 3,96 |
| Doom 64 | muted-foreground/card 4,09; muted-foreground/muted 4,47; accent-foreground/accent 4,11; destructive-foreground/background 4,00; destructive-foreground/card 2,96; white/destructive 2,79; info-foreground/background 4,25; success-foreground/background 3,34; warning-foreground/background 3,13; sidebar-accent-foreground/sidebar-accent 4,11; switch-track/card 2,90 | primary-foreground/primary 4,23; white/destructive 2,04; sidebar-primary-foreground/sidebar-primary 4,23 |
| Elegant Luxury | nenhum | white/destructive 3,76; ring/background 2,70; sidebar-ring/sidebar 2,70 |
| Graphite | muted-foreground/muted 4,07; warning-foreground/background 4,41 | muted-foreground/background 4,41; muted-foreground/card 4,13; muted-foreground/muted 3,63; white/destructive 3,35 |
| Kodama Grove | muted-foreground/background 3,05; muted-foreground/card 3,19; muted-foreground/muted 2,80; primary-foreground/primary 2,87; destructive-foreground/background 4,48; white/destructive 2,64; success-foreground/background 3,74; warning-foreground/background 3,51; sidebar-primary-foreground/sidebar-primary 2,23; ring/background 1,61; sidebar-ring/sidebar 1,52 | muted-foreground/card 4,24; muted-foreground/muted 3,74; destructive-foreground/background 4,22; destructive-foreground/card 3,79; white/destructive 3,64 |
| Midnight Bloom | muted-foreground/muted 2,93; accent-foreground/accent 3,22; white/destructive 3,76; sidebar-accent-foreground/sidebar-accent 3,22 | muted-foreground/muted 3,86; accent-foreground/accent 2,36; destructive-foreground/card 4,37; white/destructive 3,76; sidebar-accent-foreground/sidebar-accent 2,36 |
| Mocha Mousse | muted-foreground/background 4,48; muted-foreground/card 4,48; muted-foreground/muted 3,22; primary-foreground/primary 3,90; secondary-foreground/secondary 2,25; warning-foreground/background 4,39; sidebar-accent-foreground/sidebar-accent 2,45; sidebar-primary-foreground/sidebar-primary 3,90; sidebar-ring/sidebar 2,79 | muted-foreground/muted 4,14; secondary-foreground/secondary 4,48; destructive-foreground/card 4,26; white/destructive 2,99 |
| Modern Minimal | primary-foreground/primary 3,68; white/destructive 3,76; sidebar-primary-foreground/sidebar-primary 3,68 | primary-foreground/primary 3,68; white/destructive 3,76; sidebar-primary-foreground/sidebar-primary 3,68 |
| Mono | muted-foreground/muted 4,48; ring/background 2,58; sidebar-ring/sidebar 2,48 | white/destructive 2,89; sidebar-ring/sidebar 2,29 |
| Nature | nenhum | accent-foreground/accent 3,47; destructive-foreground/card 4,14; sidebar-accent-foreground/sidebar-accent 3,47 |
| Neo Brutalism | primary-foreground/primary 3,64; sidebar-primary-foreground/sidebar-primary 3,64 | destructive-foreground/card 4,37; white/destructive 1,00 |
| Northern Lights | muted-foreground/muted 3,59; primary-foreground/primary 3,05; secondary-foreground/secondary 2,97; white/destructive 3,76; sidebar-primary-foreground/sidebar-primary 3,05; ring/background 2,89; sidebar-ring/sidebar 2,89 | muted-foreground/muted 3,86; primary-foreground/primary 3,05; secondary-foreground/secondary 3,26; accent-foreground/accent 2,36; destructive-foreground/card 4,37; white/destructive 3,76; sidebar-accent-foreground/sidebar-accent 2,36; sidebar-primary-foreground/sidebar-primary 3,05 |
| Notebook | white/destructive 3,22; ring/background 2,48; sidebar-ring/sidebar 2,29 | muted-foreground/muted 3,67; secondary-foreground/secondary 3,79; destructive-foreground/card 4,37; white/destructive 1,96 |
| Ocean Breeze | muted-foreground/muted 4,39; primary-foreground/primary 2,28; white/destructive 3,76; sidebar-primary-foreground/sidebar-primary 2,28; ring/background 2,12; sidebar-ring/sidebar 1,99 | muted-foreground/background 3,69; muted-foreground/card 3,03; muted-foreground/muted 3,35; accent-foreground/accent 4,02; white/destructive 3,76; sidebar-accent-foreground/sidebar-accent 4,02 |
| Pastel Dreams | muted-foreground/background 4,41; muted-foreground/muted 4,10; primary-foreground/primary 2,72; white/destructive 1,90; sidebar-primary-foreground/sidebar-primary 2,72; ring/background 2,48; sidebar-ring/sidebar 2,04 | white/destructive 1,90 |
| Perpetuity | muted-foreground/background 4,21; muted-foreground/muted 3,97; primary-foreground/primary 4,42; warning-foreground/background 4,35; sidebar-primary-foreground/sidebar-primary 4,42 | white/destructive 4,08 |
| Quantum Rose | muted-foreground/background 4,39; muted-foreground/muted 4,03 | white/destructive 3,61 |
| Retro Arcade | secondary-foreground/secondary 3,16; sidebar-accent-foreground/sidebar-accent 3,16 | muted-foreground/muted 2,01; secondary-foreground/secondary 3,16; sidebar-accent-foreground/sidebar-accent 3,16 |
| Sage Garden | muted-foreground/muted 3,88; primary-foreground/primary 3,40; sidebar-primary-foreground/sidebar-primary 3,40 | white/destructive 3,76; sidebar-primary-foreground/sidebar-primary 3,40 |
| Soft Pop | secondary-foreground/secondary 2,49; white/destructive 3,76; ring/background 1,88; sidebar-ring/sidebar 1,88 | white/destructive 2,77 |
| Solar Dusk | muted-foreground/card 4,38; muted-foreground/muted 3,98; secondary-foreground/secondary 4,45 | primary-foreground/primary 2,80; sidebar-primary-foreground/sidebar-primary 2,80 |
| Starry Night | accent-foreground/accent 2,63; ring/background 1,45; sidebar-ring/sidebar 1,29 | muted-foreground/card 4,23 |
| Sunset Horizon | muted-foreground/muted 4,32; primary-foreground/primary 2,50; secondary-foreground/secondary 4,39; white/destructive 4,17; sidebar-primary-foreground/sidebar-primary 2,50; ring/background 2,39; sidebar-ring/sidebar 2,25 | primary-foreground/primary 2,50; destructive-foreground/card 4,46; white/destructive 4,17; sidebar-primary-foreground/sidebar-primary 2,50 |
| Supabase | ring/background 1,54; sidebar-ring/sidebar 1,54 | nenhum |
| T3 Chat | nenhum | nenhum |
| Tangerine | muted-foreground/background 4,04; primary-foreground/primary 3,63; white/destructive 3,76; success-foreground/background 4,48; warning-foreground/background 4,20; sidebar-primary-foreground/sidebar-primary 3,63; sidebar-ring/sidebar 2,72 | primary-foreground/primary 3,63; white/destructive 3,76; sidebar-primary-foreground/sidebar-primary 3,63 |
| Twitter | primary-foreground/primary 2,94; accent-foreground/accent 2,46; white/destructive 4,11; sidebar-accent-foreground/sidebar-accent 2,46; sidebar-primary-foreground/sidebar-primary 2,94; ring/background 2,83; sidebar-ring/sidebar 2,66 | muted-foreground/card 3,88; muted-foreground/muted 3,88; primary-foreground/primary 2,97; white/destructive 4,11; sidebar-primary-foreground/sidebar-primary 2,83 |
| Vercel | white/destructive 3,85 | white/destructive 3,04 |
| Vintage Paper | muted-foreground/muted 4,08; primary-foreground/primary 3,73; warning-foreground/background 4,46; sidebar-primary-foreground/sidebar-primary 3,73; sidebar-ring/sidebar 2,98 | destructive-foreground/card 4,35 |
| Violet Bloom | accent-foreground/accent 4,27; white/destructive 3,85 | primary-foreground/primary 4,13; white/destructive 2,77; sidebar-accent-foreground/sidebar-accent 3,38; sidebar-primary-foreground/sidebar-primary 4,13 |

### `state-surface`

Contraste de `state-surface`, medido no navegador sobre o `--background` do tema de exemplo (texto 4,5:1, ícone 3:1). Claro: título 14,52:1, descrição 5,48:1. Escuro: título 16,03:1, descrição 5,35:1. Ícone sobre a moldura composta sobre o fundo (gráfico, 3:1): `text-foreground` sobre `bg-muted/60`, claro 13,80:1 e escuro 15,12:1; `var(--destructive)` sobre o fundo de 6%, claro 3,37:1 e escuro 4,68:1. A descrição em escuro (`text-muted-foreground` do `EmptyDescription` do COSS) media 4,44:1; em 2026-10-04 (#57), o `--muted-foreground` escuro do tema de exemplo passou de 90% para 80% de `stone-500`, e ela subiu para 5,35:1, sem mudança em `packages/ui`.

### `record-preview`

Contraste de `record-preview`, calculado a partir dos tokens de `apps/example/packages/ui/src/styles.css` (oklch convertido para sRGB, alfa composto sobre `popover`; texto 4,5:1, ícone e anel 3:1). Claro: `popover-foreground` sobre `popover` 15,20:1; `muted-foreground` sobre `popover` 5,69:1; `foreground` sobre o rodapé (`muted/72` sobre `popover`) 14,27:1; `muted-foreground` sobre o rodapé 5,34:1; ícone ghost (`foreground` a 80% de opacidade) sobre `popover` 7,92:1 e sobre o hover (`accent` sobre `popover`) 7,49:1; anel `ring` sobre `popover` 4,73:1. Escuro: `popover-foreground` 15,27:1; `muted-foreground` sobre `popover` 5,10:1; `foreground` sobre o rodapé 14,13:1; `muted-foreground` sobre o rodapé 4,72:1; ícone ghost 10,16:1 sobre `popover` e 9,27:1 sobre o hover; anel 3,52:1. Nenhum par fica abaixo do limite. Em 2026-10-04 (#58), as stories passaram a rodar o axe nos dois temas: no claro pelo projeto `storybook` e no escuro pelo projeto `storybook-dark`, que inicia cada story com o global `theme` em `dark`; o `storybook:test` roda os dois. Em 2026-10-04 (#62), o `--ring` claro do tema do exemplo passou de `neutral-400` para `neutral-500`: 4,73:1 sobre `popover` (antes 2,59:1) e 4,53:1 sobre `background` (antes 2,48:1). Em 2026-10-04 (#57), o `--muted-foreground` escuro do tema do exemplo passou de 90% para 80% de `stone-500` com branco: 5,35:1 sobre `background` (antes 4,44:1), 5,10:1 sobre `popover` (antes 4,22:1) e 4,72:1 sobre o rodapé (antes 3,91:1).

### `record-group`

Contraste de `record-group`, medido nas cores computadas das stories sobre o `background` do tema de `apps/example/packages/ui/src/styles.css` (alfa do hover composto sobre `background`; texto 4,5:1, ícone e anel 3:1). Claro: `muted-foreground` do rótulo da linha 5,48:1 e, sobre o hover, 5,03:1; `foreground` do valor e do título 14,52:1; chevron e ícone de `RecordGroupAction` (`foreground`) 14,52:1 e, sobre o hover do `Button` ghost (`accent`), 13,33:1; anel `ring` do gatilho 4,54:1. Escuro: rótulo 5,34:1 e, sobre o hover, 4,83:1; `foreground` 16,03:1; chevron e ícone 16,03:1 e 14,49:1 sobre o hover; anel 3,69:1. Nenhum par fica abaixo do limite. O rótulo é o par de menor margem (4,83:1 no escuro, sobre o hover), e o `muted-foreground` escuro continua sendo token do consumidor.

As stories rodam o axe nos dois temas (projetos `storybook` e `storybook-dark`).

Links e subgrupos (`RecordGroupLink`, `RecordGroupSubgroup`): contraste medido nas cores computadas das stories sobre o `background` de `apps/example/packages/ui/src/styles.css` (alfa do hover composto sobre o fundo): claro, nome do link 14,52:1 e 13,33:1 sobre o hover, `meta` e ícone 5,48:1 e 5,03:1 sobre o hover, anel 4,54:1; escuro, título do subitem 16,03:1, `meta` 5,34:1, anel 3,69:1, e o link, nos mesmos tokens, 14,49:1 e 4,83:1 sobre o hover. São os mesmos pares de token do `RecordGroup` e nenhum fica abaixo do limite.

Variante `inset`: contraste medido sobre o `card` do tema (alfa do hover composto sobre o card): claro, título 15,17:1, ícone 5,73:1, valor da propriedade em `plain` 15,17:1, nome do link 15,17:1 e 13,91:1 sobre o hover, `meta` 5,73:1 e 5,25:1, anel 4,74:1; escuro, nome 15,23:1 e 13,67:1, `meta` 5,07:1 e 4,55:1 sobre o hover, o par de menor margem, e anel 3,50:1.

Invólucro de `card` e `inset`: contraste medido nas cores computadas da story `Card`, com o fundo do invólucro composto sobre o `background` do tema: claro, rótulo (`muted-foreground`) 5,16:1, valor e título (`foreground`) 13,66:1; escuro, rótulo 4,94:1, valor e título 14,84:1.

Métricas (`RecordGroupMetrics`): contraste medido na story `Usages/Indicators` sobre o `card` do tema do exemplo: rótulo e `target` (`muted-foreground`) 5,73:1 no claro e 5,07:1 no escuro; indicador do `Meter` (`primary`) 15,17:1 e 11,00:1 contra o card.

`actionsAlign`: contraste medido no botão `ghost` da versão apagada: texto 14,52:1 no claro e 16,03:1 no escuro; no hover (`bg-accent` sobre o fundo) 13,30:1 e 14,49:1; anel de foco 4,54:1 e 3,69:1.

### `settings`

Na vitrine de Project Statuses, medidos sobre o tema do exemplo: o título tem contraste de 14,52:1 no claro e 16,03:1 no escuro; a descrição, 5,48:1 e 5,34:1; os títulos e chevrons dos grupos sobre o cabeçalho translúcido, 5,49:1 e 4,89:1; os títulos dos itens, 15,17:1 e 15,23:1; as descrições dos itens, 5,73:1 e 5,07:1. Para os ícones dos status, com o fundo `bg-muted` composto sobre o card, o menor contraste é 4,04:1 no claro e 3,38:1 no escuro. Backlog e In Progress usam tons 700 no claro e 500 no escuro, porque os tons 500 ficavam em 1,96:1 e 1,75:1 no claro.

Tags (`Usages/Tags`): as bolinhas de cor são `aria-hidden` e usam tons 700 no claro e 500 no escuro (`bg-red-700 dark:bg-red-500`), como Backlog e In Progress em Project Statuses; o nome da tag carrega o significado. Contraste calculado a partir dos tokens do tema do exemplo (oklch convertido para sRGB; `card` branco no claro e `background` com 2% de branco no escuro; gráfico 3:1), não medido no navegador. Claro (700): red 6,42:1, orange 5,23:1, pink 5,89:1, blue 6,82:1, green 4,94:1, violet 7,29:1, yellow 4,92:1. Escuro (500): red 4,36:1, orange 5,76:1, pink 4,65:1, blue 4,43:1, green 7,49:1, violet 3,78:1, yellow 8,70:1. Nenhum par fica abaixo de 3:1. Os tons 500 no claro ficavam em 2,89:1 (orange), 2,22:1 (green) e 1,91:1 (yellow).

Contraste de `settings`, medido nas cores computadas da story `Patterns/Settings/Preferences` sobre o tema de `apps/example/packages/ui/src/styles.css` (alfa composto sobre `card`, e `card` sobre `background`; texto 4,5:1, gráfico 3:1). Claro: título da seção sobre o fundo 14,52:1, título da linha sobre o card 15,17:1, descrição 5,73:1, texto do `SelectTrigger` 14,52:1. Escuro: 16,03:1, 15,23:1, 5,07:1 e 14,15:1. Trilho do `Switch` desligado, sem mudança em `packages/ui`: o tema do exemplo redefine `--input` como `--switch-track` só em `[data-slot="switch"]` (45% de preto no claro, 38% de branco no escuro), então o `bg-input` do COSS lê o valor novo e as bordas de `Input` e `SelectTrigger` seguem em `--input` (1,26:1 sobre o card, inalteradas). Trilho sobre o card 3,36:1 no claro e 3,54:1 no escuro (antes 1,26:1), sobre o `background` 3,34:1 e 3,57:1, e polegar sobre o trilho 3,22:1 e 3,73:1 (antes 1,21:1 e 1,32:1), todos acima dos 3:1 de componente de interface; a borda do card (1,17:1 a 1,19:1) é decorativa.

As stories rodam o axe nos dois temas (projetos `storybook` e `storybook-dark`).

Contraste da story `Usages/Automation`, medido nas cores computadas sobre o tema de `apps/example/packages/ui/src/styles.css` (texto 4,5:1, gráfico 3:1). Claro: texto do `Badge` `outline` do valor Urgent 14,52:1 sobre o fundo e ícone do chip (`opacity-80` do `Badge`, composto) 7,65:1; ícone da ação (`foreground`) 15,17:1 sobre o card. Escuro: 14,18:1, 9,55:1 e 15,23:1. Nenhum par fica abaixo do limite.

### `checklist`

Contraste do texto sobre o `bg-card`, claro e escuro: `foreground` 15,20:1 e 15,27:1, `muted-foreground` 5,69:1 e 5,10:1 (antes, sobre a página, 14,56:1 e 5,45:1 no claro, 16,04:1 e 5,35:1 no escuro); no hover `bg-muted/60` da linha o par mais apertado, `muted-foreground` no escuro, fica em cerca de 4,55:1.

Prazo dos itens: Decidido em 2026-10-03, na correção do axe da story: o prazo de cada item usa os tokens de texto do tema, `text-destructive-foreground` quando vencido e `text-warning-foreground` quando vence hoje (5,1:1 a 6,8:1 no claro, acima de 5,7:1 no escuro), no lugar de `text-destructive` e da cor crua `text-amber-500`, que ficavam em 3,6:1 e 2,0:1 sobre a página.

### `ScheduleProperty`

As stories em `Patterns/Properties/Display/Schedule` desligam só `color-contrast` quando o calendário fica aberto, pela mesma exceção do calendário do COSS registrada em [Exceções](#exceções).

### `widgets`

Nota de token para o consumidor: sem borda, o widget se separa da página em 1,04:1 no claro e 1,05:1 no escuro (a borda antiga `border-border/80` media 1,15:1 e 1,14:1); a borda do card não é objeto gráfico nem identifica componente (WCAG 1.4.11 não se aplica, como a borda decorativa de 1,17:1 a 1,19:1 acima), então não há limiar, e uma separação mais forte é escolha do consumidor, por `--card` ou por sombra.

O texto sobre o card mede `foreground` 15,20:1 (claro) e 15,27:1 (escuro) e `muted-foreground` 5,69:1 e 5,10:1.

Decidido em 2026-10-03, na auditoria dos grupos de produtividade e CRM: o `Avatar` do COSS sobre o card some no tema do Storybook (o fallback é `background` mais 4% de preto, 1,1:1 sobre o card branco, e o mesmo ocorre no escuro), então `AvatarStack` e `ActivityFeedWidget` envolvem cada avatar num elemento próprio com `border-input`, sem tocar no componente.

Contraste medido no tema do Storybook (card branco sobre página `stone-50` no claro): os textos semânticos `success`, `destructive`, `info` e `warning` em `-foreground` ficam entre 5,1:1 e 6,8:1 no claro e acima de 5,7:1 no escuro; `muted-foreground` fica em 5,7:1 no claro e 4,2:1 no escuro (medido em 2026-10-03 sobre o fundo do tema do Storybook; sobre `bg-card`, a medição de 2026-10-12 dá 5,69:1 e 5,10:1 e vale no lugar desta para o texto sobre o card).

Preenchimentos gráficos são do tema do consumidor e ficam abaixo de 3:1 em alguns pares: no claro `--chart-4` (1,7:1), `--chart-5` (2,2:1), `bg-success` (2,5:1) e `bg-warning` (2,2:1); no escuro `--chart-1` (2,4:1); `--chart-1` a `--chart-3`, `bg-destructive` e `bg-info` passam de 3:1 no claro e todos os `--chart-*` do escuro menos o primeiro passam.

As cores de papel são `--warning-foreground` para sequência e medalhas e `--success-foreground` para missão concluída, ambas em `IconFrame` `color` com o fundo a 6%: medido no tema do Storybook, o ícone fica em 4,6:1 (chama) e 5,0:1 (check) no claro e 8,8:1 e 7,8:1 no escuro; nas pílulas `warning/15` e `success/15` o ícone fica em 4,5:1 e 4,8:1 no claro e 7,5:1 e 6,8:1 no escuro.

O anel e o `Meter` usam `primary` (15:1 sobre o card); a trilha do anel e as bordas tracejadas são decorativas (1,1:1 e 1,3:1) e o valor segue em texto ou `sr-only`.

### `Toast`

Decidido em 2026-11-02: o viewport do `AnchoredToastProvider` se chama `Anchored notifications`. No COSS os dois viewports são `role="region"` com o `aria-label="Notifications"` do Base UI. Com os dois providers montados, como a instalação do COSS pede, a página fica com duas landmarks iguais, e o axe reprova (`landmark-unique`). Os providers não repassam props ao viewport, então a correção fica no arquivo.

### `chats-panel`

Contraste: a hora e a prévia lida usam `muted-foreground`, que sobre a linha selecionada no painel do `card` ficava em 4,46:1 no escuro; na linha selecionada ou com hover elas passam a `accent-foreground/72`, com 5,48:1 (claro) e 7,67:1 (escuro) no painel e 5,66:1 e 8,15:1 em `plain`, e o nome fica em 12,53:1 e 13,38:1.

### `wizard`

Contraste no plano de trás: título 13,30:1 (claro) e 18,11:1 (escuro), descrição em `muted-foreground` 5,02:1 e 6,03:1, e na linha com hover (`bg-accent`) 4,63:1 e 5,61:1.

### `Avatar`

Iniciais: As iniciais medem 12,19:1 no claro e 13,69:1 no escuro sobre o fallback.

### Gallery

Story de documentos: Medido sobre `bg-card`, `foreground` fica em 15,20:1 no claro e 15,27:1 no escuro, e `muted-foreground` em 5,69:1 e 5,10:1; o ícone significativo herda `foreground` e tem 15,20:1 e 15,27:1.

### App Shells

Contraste (medido em 2026-10-21, `AppShell1/Default`): item ativo 13,3:1 (claro) e 16,03:1 (escuro); item comum, rótulo de grupo e contador 4,58:1 e 18,11:1; página atual do breadcrumb 14,52:1 e 16,03:1; link do breadcrumb 5,48:1 e 5,34:1. As iniciais do avatar no menu da conta herdavam o `sidebar-foreground` sobre o `bg-border` do fallback e mediam 3,83:1 no claro; o `AvatarFallback` recebe `text-foreground`, o par que ele tem no resto do app, e passa a 12,15:1 e 16,22:1. O `overrides:check` não vê o `AvatarFallback` reexportado por `@tc96/elements/avatar` (o mesmo vale para `person-option-content.tsx`) e recusa exceção que não detecta, por isso o registro fica aqui. O quadro do logo do workspace usa `bg-sidebar-primary text-sidebar-primary-foreground`, o par do sidebar, porque o `bg-muted` do `IconFrame` sumia sobre o `bg-sidebar` no escuro.

Nível de settings: contraste medido em 2026-11-02 (`AppShell1/Settings`, tema `Default`): texto e ícone de "Voltar ao app" sobre `sidebar` 4,58:1 (claro) e 18,11:1 (escuro), o mesmo par do item comum.

Badge no subitem: O badge do COSS troca de cor pelo `peer-*/menu-button`, que não alcança um filho do botão, e ficava em `sidebar-foreground` sobre o `sidebar-accent` do subitem ativo: 4,22:1 no claro (16,04:1 no escuro). Com `text-current`, registrado em `scripts/override-exceptions.json`, o badge herda a cor do botão, como o de primeiro nível: 13,33:1 (claro) e 16,04:1 (escuro) no ativo, e 4,6:1 e 18,11:1 no subitem comum (medido em `AppShell1/SubItemBadge`, tema `Default`).

### Flow Inspector, `Alert` e `Toast` do COSS

Contraste (medido em 2026-10-23, tema `Default`, cores do Tailwind 4.3.3 em sRGB e alfa composto sobre `background`):

| Par | Claro | Escuro |
| --- | --- | --- |
| Valor (`foreground`) sobre `background` | 14,56:1 | 16,04:1 |
| Rótulo, contagem e descrição (`muted-foreground`) sobre `background` | 5,45:1 | 5,35:1 |
| `Badge` sucesso, texto sobre o fundo tingido | 4,78:1 | 7,04:1 |
| `Badge` info | 5,96:1 | 5,52:1 |
| `Badge` erro | 5,34:1 | 5,53:1 |
| `Badge` aviso | 4,56:1 | 7,59:1 |
| `Badge` outline | 14,56:1 | 15,05:1 |
| Ícone de estado do log (sucesso, falha, em execução, ignorado), gráfico, sobre `background` | 5,14:1, 6,15:1, 6,54:1, 4,84:1 | 9,05:1, 6,05:1, 6,63:1, 10,19:1 |
| Ícone de log não executado (`muted-foreground`) | 5,45:1 | 5,35:1 |
| Texto do `Alert` (`foreground`, `muted-foreground`) sobre a superfície do alerta | 14,13:1, 5,29:1 | 15,08:1, 5,03:1 |
| Ícone do `Alert` `warning` com `--warning`, antes | 1,99:1 | 7,66:1 |
| Ícone do `Alert` `warning` com `--warning-foreground`, depois | 4,70:1 | 9,58:1 |

O ícone do `Alert` `warning` do COSS usa `--warning`, que no claro não chega a 3:1; o inspector aplica `[&>svg]:text-warning-foreground` no `Alert`. `overrides:check` só acompanha borda, raio e sombra, e rejeitou uma exceção de cor como sem uso, então a classe não entra em `scripts/override-exceptions.json`. Nenhum valor de token mudou, e o axe das oito stories passa no claro e no escuro.

Contraste do `Alert` em `UI/Alert`, medido em 2026-11-02 nas cores computadas de cada variante (alfa composto sobre o `background`; texto 4,5:1, ícone 3:1). O ícone de `success` e de `warning` falha em todo lugar onde o `Alert` renderiza, então a correção é global: o `styles.css` do exemplo redefine `--success` como `--success-foreground` e `--warning` como `--warning-foreground` só em `[data-slot="alert"]`, sem mudar o valor dos tokens nem `packages/ui`. O fundo tingido dessas duas variantes passa a sair do mesmo tom. Nota para o consumidor: sem essa regra no tema dele, os dois ícones voltam a reprovar no claro, e por isso o inspector mantém a própria classe.

| Par (claro / escuro) | Antes | Depois |
| --- | --- | --- |
| Ícone `success` | 2,29:1 / 6,69:1 | 4,87:1 / 8,53:1 |
| Ícone `warning` | 1,99:1 / 7,71:1 | 4,57:1 / 9,48:1 |
| Ícone `info`, `error` e `default` | 3,45:1, 4,26:1, 5,48:1 / 4,47:1, 3,62:1, 4,99:1 | sem mudança |
| Título (`card-foreground`), cinco variantes | 13,56:1 a 14,52:1 / 14,97:1 a 15,81:1 | 13,56:1 a 14,52:1 / 14,96:1 a 15,81:1 |
| Descrição (`muted-foreground`), cinco variantes | 5,12:1 a 5,48:1 / 4,99:1 a 5,27:1 | 5,12:1 a 5,48:1 / 4,98:1 a 5,27:1 |

Contraste do `Toast` em `UI/Toast`, medido em 2026-11-02 nas cores computadas dos toasts abertos sobre `popover` (texto 4,5:1, ícone 3:1). O ícone de estado usa os mesmos `--success` e `--warning`, e falha no claro do mesmo jeito; a mesma regra do `styles.css` passou a valer também em `[data-slot="toast-icon"]`, o que cobre os toasts empilhados e os ancorados. O ícone de `loading` é o `popover-foreground` com 80% de opacidade, e o texto não muda. A mesma nota para o consumidor vale aqui.

| Par (claro / escuro) | Antes | Depois |
| --- | --- | --- |
| Ícone `success` | 2,47:1 / 6,72:1 | 5,36:1 / 8,57:1 |
| Ícone `warning` | 2,13:1 / 7,78:1 | 5,03:1 / 9,65:1 |
| Ícone `info` e `error` | 3,76:1, 4,77:1 / 4,42:1, 3,48:1 | sem mudança |
| Título (`popover-foreground`) | 15,17:1 / 15,23:1 | sem mudança |
| Descrição (`muted-foreground`) | 5,73:1 / 5,07:1 | sem mudança |

### Flow Canvas

Contraste (medido em 2026-10-23, `Horizontal` e `Vertical`, tema `Default`; texto 4,5:1, gráfico 3:1):

| Par | Claro | Escuro |
| --- | --- | --- |
| título do nó sobre `card` | 15,17:1 | 15,23:1 |
| descrição e rodapé do nó (`muted-foreground`) | 5,73:1 | 5,07:1 |
| badge `Sucesso` / `Falhou` | 14,52:1 / 4,77:1 (antes 4,99:1 / 5,59:1, `success` e `error`) | 14,15:1 / 4,77:1 (antes 6,63:1 / 5,30:1) |
| rodapé de `Falhou` (`destructive-foreground`) | 6,42:1 | 5,75:1 |
| badge `Não executado` / `Ignorado` | 14,52:1 / 13,91:1 | 14,15:1 / 13,67:1 |
| rótulo da aresta | 14,52:1 | 14,97:1 |
| iniciais do responsável (`text-foreground` sobre `border`) | 12,72:1 | 12,89:1 (antes 4,25:1 com `muted-foreground`, texto de 10 px, axe) |
| aresta (gráfico) / aresta percorrida | 5,48:1 / 14,52:1 | 5,34:1 / 16,03:1 |
| handle (gráfico) | 5,73:1 | 5,07:1 |
| anel do nó selecionado (`ring-primary`) | 14,52:1 | 16,03:1 |
| anel de foco (`ring`) | 4,54:1 | 3,69:1 |
| nó do minimapa sobre o fundo do minimapa | 5,73:1 | 5,07:1 |
| nível de zoom e botões dos controles | 15,17:1 e 13,19:1 | 14,15:1 e 12,11:1 |
| link de atribuição | 5,48:1 (antes 2,73:1) | 5,34:1 |

A borda do cartão do nó (`border`) mede 1,19:1 e 1,17:1: é moldura, a leitura do nó está no texto e no badge, e o nó selecionado e o foco têm os pares acima. Os pontos do fundo são decoração.

### Flow Step Library

Contraste medido no Storybook (`Patterns/Flow/Step Library`, `Default` com o cartão `Failed`), pelo texto do elemento contra o fundo efetivo do ancestral:

| Elemento | Claro | Escuro | Limite |
| --- | --- | --- | --- |
| Título e nome do passo (`foreground`) | 15,17 | 15,23 | 4,5:1 |
| Dica, rótulo do grupo, descrição do passo, descrição do cartão (`muted-foreground`) | 5,73 | 5,07 | 4,5:1 |
| Badge `Falhou` (`destructive`, texto branco) | 4,77 | 4,77 | 4,5:1 |
| Ícone do passo contra o quadro `IconFrame` | 13,91 | 13,64 | 3:1 |
| Indicador do progresso contra a trilha (`bg-primary` contra `bg-input`) | 4,02 | 12,09 | 3:1 |
| Trilha do progresso contra o cartão | 1,26 | 1,26 | 3:1 (não atende) |

A trilha fica abaixo de 3:1 contra o cartão porque o token `input` é a superfície do campo, não a borda de um controle; o progresso é lido pelo indicador contra a trilha, que atende nos dois temas. Não há token alterado: a nota fica para o consumidor, que pode escurecer `--input` no seu tema se quiser a trilha mais marcada (regra de sobrescrita por `data-slot="progress-track"`, se a auditoria do consumidor pedir). As medidas foram tomadas com o tema `Default` do exemplo, esperando a transição de cor (500 ms do indicador) antes de ler.

### Chat Assistant

Auditoria de contraste (2026-10-23, medida no Storybook com o tema `Default`; texto precisa de 4,5:1, gráficos de 3:1; nenhum valor de token foi mudado):

| Par | Claro | Escuro |
| --- | --- | --- |
| título e saudação (`foreground` sobre o cartão) | 15,17 | 15,23 |
| descrição, "Experimente perguntar", aviso fixo e hora (`muted-foreground` sobre o cartão) | 5,73 | 5,07 |
| balão do assistente (`foreground` sobre `foreground/4`) | 14,06 | 13,67 |
| balão do usuário (`foreground` sobre `foreground/12`) | 11,95 | 10,65 |
| sugestão e ícones do cabeçalho e do compositor | 14,52 a 15,17 | 13,90 a 15,23 |
| erro: texto da mensagem e botão Tentar de novo | 14,06 e 15,17 | 13,67 e 12,62 |
| erro: ícone `destructive-foreground` (gráfico) | 5,95 | 5,16 |
| placeholder do compositor antes (`muted-foreground/72`, COSS) | 3,08 | 3,15 |
| placeholder do compositor depois (`placeholder:text-muted-foreground`) | 5,48 | 4,71 |

O placeholder é o único par que falhava: o texto de orientação do compositor precisa de 4,5:1, e o ajuste entrou onde o elemento encontra a superfície, como exceção registrada, sem tocar `packages/ui`. O axe passa nos dois temas (`bunx vitest run --project=storybook --project=storybook-dark src/patterns/chat/assistant`). A posição flutuante sobre um canvas real só se prova no viewport (T5).

### Editores de fluxo

Contraste (medido em 2026-10-23 no Storybook, tema `Default`, pelo texto de cada nó de `flow-page` contra o fundo efetivo composto; texto 4,5:1, gráfico 3:1; nenhum token mudou):

| Par | Claro | Escuro |
| --- | --- | --- |
| rótulo do formulário (`foreground` sobre o inspector) | 14,52 | 16,03 |
| erro de nome (`FieldError`) | 6,15 | 6,05 |
| breadcrumb, dica e rótulo de grupo da biblioteca, descrição do nó (`muted-foreground`) | 5,48 | 5,07 |
| badge `Falhou` e `Falhou` do cartão da última execução (texto branco sobre `destructive`) | 4,77 | 4,77 |
| menor texto de todo `flow-page`: `Default` do workflow (claro) e `Failed` do workflow (escuro) e do agent (claro) | 5,48 (`Failed`: 4,77) | 5,07 (`Failed`: 4,77) |
| borda do campo inválido (gráfico) | 3,27 | 1,36 |

A borda do campo inválido é do `Input` do COSS (`border-destructive/64` com foco): no escuro mede 1,36:1, abaixo de 3:1; o erro não depende dela, porque o texto do `FieldError` mede 6,05:1 e o campo leva `aria-invalid` e o foco, e o token `destructive` não muda. Ratios do canvas, da biblioteca, do inspector e do assistente estão nas seções de cada pattern. O axe passa nas 10 stories, nos dois temas (`bunx vitest run --project=storybook --project=storybook-dark src/application/flow`, 20 testes).
