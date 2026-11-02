---
capability: settings-shell
plan: 0001
owner: project-manager
status: Ready
issue: none
branch: feat/settings-shell a partir de main; um PR
appetite: pequeno, uma sessão por task (três tasks). Teto: um template novo, nenhum pattern novo, nenhum item COSS novo, nenhuma dependência npm. Se pedir mais, o plano volta às lacunas
inputs: pedido do dono de 2026-11-02 (nível de sidebar para settings ou account, com "Back to app" no topo e a lista de menu); lacunas a a e fechadas pelo dono com as recomendações em 2026-11-02; ADR 0005 Accepted
---

### Inputs

| File | Status |
| --- | --- |
| `../requirements.md` | não necessário: o pedido do dono define o escopo (sidebar de settings com voltar e menu) |
| `../design.md` | não necessário: ADR 0005 já decide template instalável, contrato controlado e `renderLink` |
| `../user-experience.md` | não necessário: a anatomia cabe na seção Anatomia abaixo |
| `../../adr/0005-installable-templates.md` | Accepted; vale para o template novo |

### Lacunas abertas (fecha-em: planejamento)

Fechadas pelo dono em 2026-11-02, na conversa, com as recomendações de cada linha.

| # | Lacuna | Recomendação | Decide |
| --- | --- | --- | --- |
| a | Forma: template próprio `settings-shell` (layout da rota `/settings/*`, ao lado do shell do app) ou um modo `view="settings"` nos quatro `AppShell{n}` que troca o conteúdo da sidebar | template próprio: um template não importa outro (`packages/templates/AGENTS.md`), o modo multiplicaria a API por quatro, e no roteador do consumidor settings já é uma rota de layout separada | dono |
| b | Rodapé da sidebar: `UserMenu` como nos shells, ou nada | nada: a saída é "Back to app"; conta e tema já são itens do menu de settings | dono |
| c | Cabeçalho do inset: `ShellHeader` com breadcrumb e `actions`, ou só o conteúdo | `ShellHeader`: mantém o botão de alternar a sidebar no mobile e a trilha (`Configurações / Membros`) | dono |
| d | Colapso: `collapsible="icon"` (voltar e itens viram ícones com tooltip) ou `offcanvas` | `offcanvas`: itens de settings raramente têm ícone próprio, e uma coluna de ícones sem rótulo não se lê | dono |
| e | Rótulo do botão: pt-BR `Voltar ao app` como os demais rótulos, com "Back to app" só como referência | pt-BR por padrão, sobrescrevível por `labels.backToApp` | dono |

### Anatomia

```text
Sidebar
  SidebarHeader
    SidebarMenuButton "Voltar ao app"   ← renderLink(backHref), ícone ArrowLeft
  SidebarContent
    ShellNav groups={navigation}        ← ex.: Conta (Perfil, Preferências, Notificações, Segurança)
                                              Workspace (Geral, Membros, Faturamento, Integrações)
SidebarInset min-w-0
  ShellHeader breadcrumbs actions
  div flex-col gap-4 p-4 (padded)
    children                            ← páginas com Patterns/Surfaces/Settings
```

- `ShellNav` já cobre grupos, item ativo com `aria-current="page"`, ramos com sub itens e badge; nenhuma mudança nele.
- `<nav aria-label>` usa um rótulo novo `settingsNavigation` (`Navegação de configurações`), distinto de `navigation`, para o leitor de tela distinguir os dois níveis.
- Se o consumidor passar `onBack` em vez de `backHref`, o botão é `button` e chama `onBack`; um dos dois é obrigatório.

### Tasks

- [ ] **T1 · Template `SettingsShell` [ENGINEERING]**
  - **Owner:** `tc96-frontend:frontend-developer`
  - **Depends on:** none
  - **Scope:**
    - Pasta `packages/templates/src/application/shell/settings-shell/` com `settings-shell.tsx` e `index.ts` (reexporta os tipos de `shared/types.ts` como `app-shell-1/index.ts`).
    - `SettingsShellProps`: `navigation`, `backHref` ou `onBack`, `breadcrumbs`, `actions`, `children`, `labels`, `renderLink`, `open`, `defaultOpen`, `onOpenChange`, `padded`.
    - Rótulos novos em `shared/types.ts` e `shared/labels.ts`: `backToApp`, `settingsNavigation`.
    - Invariantes dos shells mantidas: `SidebarInset className="min-w-0"`, `padded`, `renderLink` como `render` do `SidebarMenuButton`.
  - **Done when:** `bun run typecheck` e `boundaries:check` passam; nenhuma classe de borda, raio ou cor em parte COSS.

- [ ] **T2 · Registry e API pública [ENGINEERING]**
  - **Owner:** `tc96-frontend:frontend-developer`
  - **Depends on:** T1
  - **Scope:**
    - `settings-shell` em `templateNames` e `templateSources` (`packages/registry/src/manifest.ts:44-61`).
    - `bun scripts/verify-public-api.ts --record` (`template:settings-shell`).
    - `packages/templates/AGENTS.md`: linha no Map, invariante de `backHref`/`onBack`, Dependents com a story.
  - **Done when:** `bun test --isolate packages/registry/src` e `bun run verify:public-api` passam.

- [ ] **T3 · Story `Application/Shell/SettingsShell` [ENGINEERING]**
  - **Owner:** `tc96-frontend:frontend-developer`
  - **Depends on:** T1
  - **Scope:**
    - `apps/storybook/src/application/shell/settings-shell.stories.tsx` com `Doc` (`parameters.docs.usage` e `api`), fixture de navegação de settings em `fixtures/shell-data.tsx`.
    - Conteúdo da story com `SettingsSection` e `SettingsRow` para a página ativa.
    - `play`: o link "Voltar ao app" aponta para `backHref`; com `onBack`, o clique chama `fn()`; o item ativo tem `aria-current="page"`; a navegação tem o nome `Navegação de configurações`.
    - Screenshot claro e escuro no preset `Default`; razões de contraste do botão voltar na seção Templates: App Shells de `docs/architecture/tc96-parttens.md`.
  - **Done when:** `cd apps/storybook && bunx vitest run --project=storybook --project=storybook-dark src/application` passa com axe em `error`.

### Ordem

- T1 primeiro; T2 e T3 dependem só de T1 e podem correr em paralelo.
- Portão final: o bloco Verify de `packages/templates/AGENTS.md` e `bun run test:consumer:registry`.

### Fora deste plano

- Modo de settings dentro dos `AppShell{n}` (lacuna a, se o dono escolher o template).
- Transição animada entre o nível do app e o de settings.
- Busca (`ShellSearch`) restrita às páginas de settings.
