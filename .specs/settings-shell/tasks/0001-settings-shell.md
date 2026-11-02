---
capability: settings-shell
plan: 0001
owner: project-manager
status: Ready
issue: none
branch: feat/settings-shell a partir de main; um PR (#277)
appetite: pequeno. Teto: nenhum template novo, nenhum pattern novo, nenhum item COSS novo, nenhuma dependência npm. Se pedir mais, o plano volta às lacunas
inputs: pedido do dono de 2026-11-02 (nível de sidebar para settings ou account, com "Back to app" no topo e a lista de menu); lacunas fechadas pelo dono em 2026-11-02; emenda do dono de 2026-11-02 (o nível vale para cada AppShell 1 a 4, não um template genérico); ADR 0005 Accepted
---

### Inputs

| File | Status |
| --- | --- |
| `../requirements.md` | não necessário: o pedido do dono define o escopo (sidebar de settings com voltar e menu) |
| `../design.md` | não necessário: ADR 0005 já decide template instalável, contrato controlado e `renderLink` |
| `../user-experience.md` | não necessário: a anatomia cabe na seção Anatomia abaixo |
| `../../adr/0005-installable-templates.md` | Accepted; vale para os quatro shells |

### Lacunas (fecha-em: planejamento)

Fechadas pelo dono em 2026-11-02, na conversa. A linha a foi emendada no mesmo dia.

| # | Lacuna | Decisão | Decide |
| --- | --- | --- | --- |
| a | Forma: template próprio `settings-shell` ou um modo nos quatro `AppShell{n}` | modo em cada shell, pela prop `settings`: cada shell tem um contexto próprio (flutuante, inset, trilho), e o nível de settings mantém esse contexto. A primeira escolha, um template `settings-shell` genérico, foi revertida pelo dono | dono |
| b | Rodapé da sidebar no modo settings | nada: a saída é "Voltar ao app" | dono |
| c | Cabeçalho do inset | `ShellHeader` sem mudança: breadcrumb, `actions` e, no 3 e no 4, notificações | dono |
| d | Colapso | o do shell (`collapsible="icon"`); voltar e itens viram ícones com tooltip, então os itens de settings levam `icon`. A recomendação anterior, `offcanvas`, valia só para o template genérico | dono |
| e | Rótulos | pt-BR por padrão: `backToApp` (`Voltar ao app`) e `settingsNavigation` (`Navegação de configurações`) | dono |

### Anatomia

`settings` em `AppShellBaseProps`: `{ navigation: ShellNavGroup[] }` com exatamente um de `backHref` (link pelo `renderLink`) ou `onBack` (botão). Sem `settings`, cada shell fica como está.

| Shell | Sidebar no modo settings |
| --- | --- |
| `AppShell1` | cabeçalho: "Voltar ao app" no lugar do seletor de workspace; conteúdo: `ShellNav` de settings; sem rodapé |
| `AppShell2` | flutuante; cabeçalho: "Voltar ao app" no lugar do seletor e da busca (a busca percorre a navegação do app); sem rodapé |
| `AppShell3` | inset; cabeçalho: "Voltar ao app"; conteúdo: `ShellNav` de settings, sem projetos; sem cartão de uso nem menu da conta |
| `AppShell4` | o trilho fica (workspace, seções sem nenhuma ativa, menu da conta); o painel troca o título da seção por "Voltar ao app" e a navegação da seção pela de settings |

- "Voltar ao app" é a peça `shared/shell-back-button.tsx`, com `ArrowLeft` e tooltip.
- A navegação de settings fica num `nav` chamado `labels.settingsNavigation`.

### Tasks

- [ ] **T1 · Modo settings nos quatro shells [ENGINEERING]**
  - Tipo `ShellSettings` e a prop `settings` em `shared/types.ts`; `ShellBackButton` em `shared/`; cada `AppShell{n}` conforme a Anatomia.
  - Remove o template `settings-shell` (pasta, `templateNames`, `templateSources`, linha da linha de base da API pública).
  - **Done when:** `typecheck`, `boundaries:check`, `overrides:check`, `verify:public-api` e `bun test --isolate packages/registry/src` passam.
- [ ] **T2 · Story `Settings` em cada `Application/Shell/AppShell{n}` [ENGINEERING]**
  - Fixtures `settingsNavigation` (com ícones), `settingsBreadcrumbs` e a página de Perfil em `fixtures/shell-data.tsx`; remove `settings-shell.stories.tsx`.
  - `play`: "Voltar ao app" aponta para `backHref`; o item ativo tem `aria-current="page"`; a navegação se chama `Navegação de configurações`; a navegação principal some. Uma story com `onBack` confere a chamada.
  - Screenshots claro e escuro no preset `Default`; razões na seção Templates: App Shells de `docs/architecture/tc96-parttens.md`.
  - **Done when:** `cd apps/storybook && bunx vitest run --project=storybook --project=storybook-dark src/application/shell` passa com axe em `error`.

### Fora deste plano

- Busca restrita às páginas de settings no `AppShell2` e no `AppShell4`.
- Transição animada entre o nível do app e o de settings.
