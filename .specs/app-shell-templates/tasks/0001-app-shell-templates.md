---
capability: app-shell-templates
plan: 0001
owner: project-manager
status: Ready
issue: none
branch: feat/storybook-templates, a recomendação da lacuna e, sem objeção do dono em 2026-10-21
appetite: médio, um PR; nove unidades. Teto: quatro shells (AppShell1 a AppShell4), sem tema, sem lib de gráfico, sem pattern novo em packages/parttens. Se uma unidade pedir isso, o plano volta à tabela de decisão (WF-PLAN-02)
inputs: ADR 0005 Accepted em 2026-10-21; lacunas a a d fechadas pelo dono com as recomendações; pedido do dono de 2026-10-21; catálogo App Shell do ReUI lido em 2026-10-21 (só anatomia, blocos Pro)
---

### Inputs

| File | Status |
| --- | --- |
| `../requirements.md` | não necessário: o pedido do dono define o escopo (Application / Shell, registry, `Templates/Doc`, `Templates/.../AppShell{n}`) |
| `../design.md` | substituído pelo ADR 0005, que decide fronteira, destino e contrato do CLI |
| `../user-experience.md` | não necessário: a anatomia de cada shell vem da tabela "Catálogo" abaixo |
| `../../adr/0005-installable-templates.md` | Accepted pelo dono em 2026-10-21 |
| `../../adr/0004-templates-only-in-storybook.md` | Accepted; emendado pelo 0005 só para templates instaláveis |

### Lacunas abertas (fecha-em: planejamento)

Fechadas pelo dono em 2026-10-21 com as recomendações; a lacuna e seguiu a recomendação sem objeção.

| # | Lacuna | Recomendação |
| --- | --- | --- |
| a | Aceitar o ADR 0005, que tira templates instaláveis do D4/D5 do ADR 0004 | aceitar |
| b | Destino no consumidor: alias `templates` próprio, derivado do `ui` (`@acme/templates`), ou o alias `components` do app | alias próprio (ADR 0005, D6) |
| c | Peças comuns dos shells em `application/shell/shared/`, levadas com cada item, ou cada shell autossuficiente com cópia | `shared/` do grupo (ADR 0005, D1) |
| d | Lote inicial: AppShell1 a AppShell4 da tabela abaixo | os quatro; o resto vai para o backlog |
| e | Branch: seguir em `feat/storybook-templates` (já tem o ADR 0004 e `Templates/`) ou abrir `feat/app-shell-templates` a partir dela | seguir em `feat/storybook-templates` |

### Catálogo do lote

O ReUI tem 36 App Shells, todos Pro. A coluna de referência indica só a anatomia que cada shell segue; nenhum código, classe ou dado do ReUI entra no repositório (ADR 0005, D9).

| Story | Item do registry | Referência de anatomia | Composição com COSS e componentes internos |
| --- | --- | --- | --- |
| `Templates/Application/Shell/AppShell1` | `app-shell-1` | ReUI App Shell 1 (Icon Rail Dashboard) | `Sidebar collapsible="icon"` + `SidebarRail`; seletor de workspace (`Menu`) no cabeçalho; navegação em grupos com `Collapsible`, `SidebarMenuSub` e contadores (`SidebarMenuBadge`); grupo Fixados com `SidebarMenuAction` + `Menu` por linha; menu do usuário (`Avatar` de `@tc96/elements` + `Menu`) no rodapé; `SidebarInset` com cabeçalho (`SidebarTrigger`, `Separator`, `Breadcrumb`) e `children` |
| `Templates/Application/Shell/AppShell2` | `app-shell-2` | ReUI App Shell 2 (Floating Sidebar Admin) | `Sidebar variant="floating"`; botão de busca com `Kbd` ⌘K que abre o `CommandDialog` do COSS com as rotas da navegação; seletor de workspace no rodapé; breadcrumb |
| `Templates/Application/Shell/AppShell3` | `app-shell-3` | ReUI App Shell 3 e 9 (inset com cartão de rodapé) | `Sidebar variant="inset"`; grupo Projetos com `ProgressRing` de `widgets`; cartão de rodapé com `Meter` (uso do plano); cabeçalho com notificações em `Popover` e `Badge` de não lidas |
| `Templates/Application/Shell/AppShell4` | `app-shell-4` | ReUI App Shell 8 e 16 (trilho + navegação de seção) e o `app-shell` do Verve CRM (`docs/plans/2026-10-20-verve-crm-mapeamento.md`) | dois `Sidebar` aninhados: trilho de ícones `collapsible="none"` com as seções e navegação de seção que troca com a seção ativa; barra superior com busca ⌘K, botão Criar e notificações; slot de cabeçalho de página |

Backlog, fora deste plano: barra superior sem sidebar (ReUI 30), caixa de e-mail (4), painéis redimensionáveis (11, 21), sidebar dupla com calendário (5, 6).

### Contrato comum dos shells

Fecha em T4 e vale para T5 a T7. Fica em `packages/templates/src/application/shell/shared/types.ts`.

- Dados por props tipadas: grupos de navegação (`title`, `href`, ícone, contador, ativo, filhos), workspaces e o ativo, usuário, breadcrumb. O template não ordena, não filtra e não busca.
- Navegação por `renderLink`, com `<a>` como padrão, para o `Link` do roteador do consumidor (`SidebarMenuButton render`).
- Estado da sidebar por `defaultOpen`, `open` e `onOpenChange` do `SidebarProvider`. O COSS grava o cookie `sidebar_state`; ler o cookie é do consumidor e fica documentado.
- Tema: o menu do usuário só mostra a escolha de tema quando recebe `theme` e `onThemeChange`. Sem `next-themes`, sem token, sem `:root`.
- Ações (trocar workspace, sair, marcar notificação) são callbacks. Textos visíveis são props com padrão em pt-BR, como os patterns.

### Ordem

- T0 fecha as lacunas. Nada começa antes.
- T1, T2 e T3 são independentes entre si e podem correr em paralelo; T3 só fecha a evidência de consumidor depois de T4.
- T4 fecha o contrato comum e o `shared/` do grupo.
- T5, T6 e T7 são independentes entre si depois de T4: cada um toca a própria pasta, a própria story e as próprias fixtures. Um arquivo existente de `shared/` não muda nessas unidades; se precisar, volta para T4.
- T8 depende de T3 (comandos reais) e de T4.
- T9 fecha o PR.

### Tasks

- [x] **T0 · Fechar as lacunas a a e [DECISION]**
  - **Owner:** dono
  - **Depends on:** none
  - **Scope:** responder às cinco lacunas; mudar o status do ADR 0005 para `Accepted` e acrescentar ao ADR 0004 a linha `Amended by: ADR 0005`.
  - **Acceptance:** ADR 0005 `Accepted`; este plano passa a `Ready`.

- [x] **T1 · Sincronizar sidebar, breadcrumb e command do COSS [ENGINEERING]**
  - **Owner:** `tc96-core:repo-operator`
  - **Depends on:** T0
  - **Scope:** `bun run sync:coss sidebar breadcrumb command`. O `command` traz `autocomplete`; as demais dependências (`button`, `input`, `scroll-area`, `separator`, `sheet`, `skeleton`, `tooltip`, `use-media-query`, `kbd`) já estão no lock e ficam como estão. Nenhuma edição à mão em `packages/ui`.
  - **Acceptance:**
    - `packages/ui/src/{sidebar,breadcrumb,command,autocomplete}.tsx` existem e estão no `coss.lock.json`.
    - `select.tsx` e `combobox.tsx` não mudam (a exceção de 2026-10-20 continua aplicada).
  - **Evidence:**

    | Command | Expected reading |
    | --- | --- |
    | `bun run check:coss` | exit 0 |
    | `git diff --stat packages/ui/src/select.tsx packages/ui/src/combobox.tsx` | vazio |
    | `bun run typecheck` | exit 0 |

- [x] **T2 · Criar o pacote `packages/templates` e ligá-lo aos checks [ENGINEERING]**
  - **Owner:** `tc96-frontend:frontend-developer`
  - **Depends on:** T0
  - **Scope:**
    - `packages/templates/package.json` (`@tc96/templates`, privado, `exports` `"./*": "./src/*/index.ts"`, dependências de workspace como `parttens`), `tsconfig.json`, e `@tc96/templates/*` no `paths` de `tsconfig.base.json`.
    - `scripts/check-boundaries.ts`: `templates: ['parttens', 'elements', 'ui', 'utils', 'helpers']`; nenhum outro dono aceita `templates`. Teste novo em `check-boundaries.test.ts`.
    - `scripts/check-overrides.ts`: `packages/templates/src` entra em `roots`.
    - `scripts/verify-public-api.ts`: um módulo `template:<nome>` por item de `templateSources`.
    - `apps/storybook/package.json`: `@tc96/templates: workspace:*`.
    - `packages/templates/AGENTS.md` com as seções da casa (abertura, `Map`, `Dependents`, `Invariants`, `Styling`, `Verify`, `Pointers`), e a linha `templates/` no `Layout` do `AGENTS.md` da raiz.
  - **Acceptance:**
    - `templates` importando de um lugar fora da lista reprova o `boundaries:check`; `parttens` importando `@tc96/templates` também.
    - `overrides:check` lê `packages/templates/src`.
  - **Evidence:**

    | Command | Expected reading |
    | --- | --- |
    | `bun run boundaries:check && bun run overrides:check` | exit 0 |
    | `bun test --isolate scripts` | exit 0, com o teste novo de fronteira |
    | `bun run typecheck && bun run lint:ci` | exit 0 |

- [x] **T3 · Ensinar o registry e o CLI a instalar templates [ENGINEERING]**
  - **Owner:** `tc96-frontend:frontend-developer`
  - **Depends on:** T2 (pacote), T4 (só para a evidência de consumidor)
  - **Scope:**
    - `manifest.ts`: `templateNames` e `templateSources` (`'app-shell-1': 'application/shell/app-shell-1'` e assim por diante); a seleção separa patterns e templates e recusa nome desconhecido; `prepareItem` leva `templates/src/...` ao caminho `templates` e reescreve `@tc96/templates` para o alias.
    - `config.ts`: alias `templates` derivado do `ui`, como `patterns`; o `paths` dele só é resolvido quando a seleção tem template (ADR 0005, D6).
    - `build-registry.ts`: o mesmo percurso de imports a partir de `packages/templates/src/<fonte>/index.ts`; grava `dist/registry/<template>.json` e copia para `dist/cli/registry/`.
    - `coss.ts` e `cli.ts`: item COSS de um arquivo em `registry/default/hooks/<item>.ts` vai para `<ui>/hooks/<item>.ts`, e `installed()` procura esse caminho para hooks (ADR 0005, D7).
    - `help` do CLI lista `Templates: app-shell-1 ...`.
    - `scripts/test-consumer-registry.ts`: instala `app-shell-1` num consumidor sem `sidebar`.
  - **Acceptance:**
    - `add app-shell-1` num consumidor sem `@acme/templates/*` no tsconfig falha com a linha sugerida; `add collection-views` no mesmo consumidor continua passando.
    - `add app-shell-1` num consumidor sem `sidebar` grava `sidebar.tsx`, `breadcrumb.tsx` e `hooks/use-media-query.ts`, e o template passa na verificação de tipos depois da instalação.
    - Um template que importa um pattern leva os arquivos do pattern e o `index.ts` de patterns passa a exportá-lo.
  - **Evidence:**

    | Command | Expected reading |
    | --- | --- |
    | `bun run test:registry` | exit 0, com testes novos em `manifest.test.ts`, `config.test.ts`, `coss.test.ts` e `cli.test.ts` |
    | `bun run build:registry` | gera `app-shell-1.json` a `app-shell-4.json` |
    | `bun run test:consumer:registry` | exit 0, com `app-shell-1` instalado |
    | `bun run lint:ci` | exit 0 |

- [x] **T4 · AppShell1 e o `shared/` do grupo Shell [ENGINEERING]**
  - **Owner:** `tc96-frontend:frontend-developer`, com a skill `tc96-frontend:storybook-story` para as stories e `tc96-frontend:storybook-test` para os `play`
  - **Depends on:** T1, T2
  - **Scope:**
    - `packages/templates/src/application/shell/shared/`: tipos do contrato comum, seletor de workspace, navegação em grupos, menu do usuário e cabeçalho com breadcrumb. Internos: nenhum é exportado pelo `index.ts` de um template.
    - `packages/templates/src/application/shell/app-shell-1/`: `index.ts` e `app-shell-1.tsx` (`AppShell1`), como na tabela.
    - `apps/storybook/src/templates/application/shell/app-shell-1.stories.tsx`, título `Templates/Application/Shell/AppShell1`, `layout: 'fullscreen'`, dados em `fixtures/shell-navigation.ts`. Stories por estado: `Default` (aberta), `Collapsed` (`defaultOpen: false`) e `Mobile` (viewport como ambiente, não como `args`), se a verificação do ADR 0005 confirmar o viewport no `storybook:test`.
    - `parameters.docs.usage` com o comando de instalação e a montagem; `parameters.docs.api` com cada prop (a casa não usa JSDoc em componente, então a descrição vai aqui, não em `argTypes`).
    - Auditoria visual: contraste dos tokens `--sidebar-*` no claro e no escuro (texto 4.5:1, gráfico 3:1), espaçamento e composição em screenshot; resultados no `docs/architecture/tc96-parttens.md`.
  - **Acceptance:**
    - `AppShell1` monta sem regra de negócio: sem fetch, sem cookie, sem `next-themes`.
    - `play` de `Default`: há uma `navigation` nomeada, o item ativo tem `aria-current="page"`, o breadcrumb termina na página atual e trocar de workspace chama `onWorkspaceChange`.
    - `play` de `Collapsed`: os rótulos da navegação ficam acessíveis por tooltip e o `SidebarTrigger` reabre.
    - Nenhuma classe de borda, raio, cor ou sombra sobre parte do COSS fora de `scripts/override-exceptions.json`.
    - `bun run story:source` do `Default` imprime um componente pronto.
  - **Evidence:**

    | Command | Expected reading |
    | --- | --- |
    | `bunx biome check <arquivos tocados>` | exit 0 |
    | `bun run typecheck && bun run storybook:typecheck && bun run storybook:lint` | exit 0 |
    | `bun run overrides:check && bun run boundaries:check` | exit 0 |
    | `vitest --project=storybook --project=storybook-dark` filtrado para AppShell1 | todos passam, zero violação de axe |
    | screenshots claro e escuro de `Default` e `Collapsed` | anexados ao PR |
  - **Out of this Task:** AppShell2 a AppShell4; qualquer pattern novo.

- [x] **T5 · AppShell2, sidebar flutuante com ⌘K [ENGINEERING]**
  - **Owner:** `tc96-frontend:frontend-developer`
  - **Depends on:** T4
  - **Scope:** `app-shell-2/` e a story `Templates/Application/Shell/AppShell2`, como na tabela. A busca lista as rotas da navegação recebida; o atalho ⌘K/Ctrl+K abre o diálogo e Esc fecha.
  - **Acceptance:** `play` abre a busca pelo atalho e pelo botão, filtra por texto e escolher uma rota chama `onNavigate` com o `href`; axe sem violação no claro e no escuro.
  - **Evidence:** as mesmas linhas de T4, filtradas para AppShell2.

- [x] **T6 · AppShell3, sidebar inset com cartão de rodapé e notificações [ENGINEERING]**
  - **Owner:** `tc96-frontend:frontend-developer`
  - **Depends on:** T4
  - **Scope:** `app-shell-3/` e a story `Templates/Application/Shell/AppShell3`, como na tabela. O progresso dos projetos usa `ProgressRing` de `widgets` pelo barrel `@tc96/parttens`, então o item `app-shell-3` leva o pattern `widgets`.
  - **Acceptance:** `play` abre as notificações, confere a contagem de não lidas no nome acessível do botão e `onMarkAllRead` é chamado; o `Meter` tem rótulo; axe sem violação no claro e no escuro.
  - **Evidence:** as mesmas linhas de T4, filtradas para AppShell3, e `bun run build:registry` com os arquivos de `widgets` dentro de `app-shell-3.json`.

- [x] **T7 · AppShell4, trilho de ícones com navegação de seção [ENGINEERING]**
  - **Owner:** `tc96-frontend:frontend-developer`
  - **Depends on:** T4
  - **Scope:** `app-shell-4/` e a story `Templates/Application/Shell/AppShell4`, como na tabela; é o shell do Verve CRM e atende a linha `app-shell` do mapeamento.
  - **Acceptance:** `play` troca a seção pelo trilho e a navegação de seção muda; o trilho tem nome acessível e cada ícone tem rótulo; axe sem violação no claro e no escuro.
  - **Evidence:** as mesmas linhas de T4, filtradas para AppShell4.

- [x] **T8 · Documentar em `Templates/Doc` [DOCS]**
  - **Owner:** `tc96-frontend:frontend-developer`
  - **Depends on:** T3, T4
  - **Scope:**
    - `apps/storybook/src/templates/doc.mdx` com `<Meta title="Templates/Doc" />`: o que é um template instalável; `npx @tc96/parttens add app-shell-1` (e `bunx`, `pnpm dlx`); `--dry-run`, `--view` e `--diff`; a configuração do alias `templates` no `components.json` e a linha do `paths` no tsconfig; o import pela pasta e a montagem com `renderLink` e o cookie da sidebar; a tabela dos quatro shells com item, story e referência; os tokens `--sidebar-*` que o tema do consumidor precisa; e os templates só do Storybook, levados com `bun run story:source <id>`.
    - `.storybook/preview.ts`: `storySort` põe `Templates/Doc` primeiro dentro de `Templates`.
    - `get-started.mdx`: uma linha que aponta para `Templates/Doc`.
    - `README.md` (seção pública, antes de `## Development`) e `docs/architecture/tc96-parttens.md`: templates instaláveis, alias `templates`, hooks do COSS no instalador.
    - ADR 0004 e `docs/plans/2026-10-20-verve-crm-mapeamento.md`: nota de que o `app-shell` agora é instalável (ADR 0005).
  - **Acceptance:** cada comando da página roda como escrito contra o CLI de T3 (conferido em T9); `Templates/Doc` aparece primeiro em `Templates` na sidebar.
  - **Evidence:**

    | Command | Expected reading |
    | --- | --- |
    | `bun run storybook:build` | exit 0 |
    | sidebar do Storybook | `Templates/Doc` primeiro, depois `Application/Shell/AppShell1` a `AppShell4` |

- [ ] **T9 · Gate do PR [VALIDATION]**
  - **Owner:** `tc96-core:qa-engineer` para a leitura, revisão por `tc96-core:code-reviewer` em contexto novo
  - **Depends on:** T1 a T8
  - **Scope:** rodar o gate completo e conferir os comandos de `Templates/Doc` num consumidor.
  - **Evidence:**

    | Command | Expected reading |
    | --- | --- |
    | `bun run check` | exit 0 |
    | `bun run test:consumer:registry` | exit 0, com `app-shell-1` |
    | `bun run verify:public-api` depois de `--record` | baseline com `template:app-shell-1` a `template:app-shell-4`; o resumo do PR cita a mudança |
    | `git diff --stat packages/parttens` | vazio, ou só o que T6 confirmar como necessário |
  - **Out of this Task:** publicar no npm. A versão nova do CLI sai por release própria, com pausa para o `npm login` do dono.

### Fora deste plano

- Mover os templates só do Storybook (`Templates/Contacts` e os outros) para a estrutura por categoria.
- Página no `apps/docs`.
- Publicação da versão do CLI com os templates.

### Registro da execução (2026-10-21)

T1 a T8 feitos na mesma sessão, em `feat/storybook-templates`. Desvios do plano, cada um registrado onde vale:

- **Pattern por arquivo, não pelo barrel** (ADR 0005, D3): pelo barrel `@tc96/parttens`, o build seguiria o agregado e o item levaria todos os patterns. O template importa `@tc96/parttens/widgets/shared/progress-ring`; `@tc96/parttens` passou a exportar `./*` para `./src/*.tsx`, e o `tsconfig.base.json` ganhou `@tc96/parttens/*`.
- **Dois defeitos do CLI achados pelo consumidor real:** o build grava `@tc96/parttens/...` como `@tc96/patterns/...`, que o CLI não reescrevia; e o `sidebar` declara `@coss/utils`, que o CLI tentava instalar como componente. Os dois têm teste em `manifest.test.ts` e `cli.test.ts`.
- **Tema do exemplo:** a regra `a { color: inherit }` saiu de fora de camada para `@layer base`, porque vencia os utilitários e derrubava o item ativo do sidebar para 4,19:1 (ver `docs/architecture/tc96-parttens.md`, Templates: App Shells).
- **`test:consumer:registry`:** a etapa dos patterns posteriores já reprovava em `HEAD` (TS2322 do `rich-text-editor` com os tipos do Slate que o npm resolve no consumidor). A correção, feita numa sessão à parte, tipa o `renderPlaceholder` pelo prop do `PlateContent` e foi trazida para esta branch; o teste passa de ponta a ponta: instala os patterns iniciais, os quatro shells (com `autocomplete`, `breadcrumb`, `command`, `sidebar` e `hooks/use-media-query.ts`) e os demais patterns, e o consumidor compila em cada etapa.
- **`AppShell4`** mantém a seção em estado local semeado pelo arg, porque o `useArgs` não re-renderiza no `storybook:test`.

- **Stories na raiz:** depois do commit `0a4f000`, o dono pediu `Application` fora de `Templates`, na raiz da sidebar. As stories passaram a `Application/Shell/AppShell{n}`, em `apps/storybook/src/application/shell/`; os títulos `Templates/Application/...` acima são os do plano original.

T9 (gate e revisão independente) fica para o PR.

