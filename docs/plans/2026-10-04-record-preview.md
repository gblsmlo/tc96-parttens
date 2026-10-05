# Record Preview: portar o `Preview` do Lemind no lugar de `detail-sheet`

Status: pesquisa, planejamento, implementação e validação concluídos em 2026-10-04.

Referência canônica: [arquitetura e decisões](../architecture/tc96-parttens.md).

## Problema

O consumidor precisa de uma unidade de construção para a prévia de um registro: um shell lateral, aberto à direita quando o usuário clica num registro de uma coleção, com cabeçalho e rodapé e sem conteúdo próprio, irmão do `record-dialog`. O caso de uso de origem é o `Preview` do Lemind montado na tarefa. O parttens já tem `detail-sheet`, quase uma cópia linha a linha desse shell, sem testes, sem stories e sem consumidor. Resolvido significa saber o que portar, o que acontece com `detail-sheet` e qual é o contrato público.

Escopo: produto (novo item no catálogo e remoção de um item público), depois arquitetura (lugar, nomes, fronteiras) e design (slots, foco, modalidade).

## Fatos

Prefixo `L` = `/Users/gabs/Workspaces/c/studio-risine/lemind`.

- F1. `Preview` em `L/packages/patterns/src/preview/preview.tsx:31-97`; props `actions`, `children`, `description`, `footer`, `onOpenChange`, `open`, `showCloseButton`, `title` (`:20-29`).
- F2. Compõe o `Sheet` do COSS: `SheetPopup side="right" variant="inset"`, `initialFocus` apontando para o próprio popup e `tabIndex={-1}` (`:50-59`). O comentário em `:42-46` registra o defeito que isso corrige: aberto pelo teclado, o foco ficava no gatilho e o `Escape` ia para o tooltip dele, sem como fechar.
- F3. O cabeçalho renderiza quando há título, descrição, ações ou fechar (`:60`); ações em `data-slot="preview-header-actions"` (`:73`); fechar é `SheetClose` com `aria-label="Fechar detalhes"`, `Button` ghost `icon-sm` (`:78-84`); corpo em `SheetPanel`, que rola (`:90-92`); `SheetFooter` só quando `footer` existe (`:93`).
- F4. As ações são um catálogo fechado `open | archive` com rótulos pt-BR e ícones (`preview-actions.tsx:7,28-31`), tipado `Partial<Record<id, () => void>>` (`:40`); ausência de handler é indisponibilidade; a ordem vem do catálogo (`:43`); botão de ícone com tooltip e `aria-label` (`:53-68`). O comentário em `:14-27` diz que o catálogo nasceu porque a mesma ação "abrir em tela completa" tinha quatro nomes e dois ícones.
- F5. Inferência: modal. `Sheet` sem prop `modal` (`preview.tsx:50`) e `SheetPopup` sempre renderiza um backdrop `fixed inset-0` com blur (`L/packages/ui/src/components/sheet.tsx:31,84`); o padrão do `Dialog.Root` do Base UI é modal.
- F6. O estado aberto mora no app: parâmetro de busca `selectedDetailsId` (`L/apps/web/src/features/tasks/route-search.ts:1`), definido por `selectTask` (`tasks-page-context.tsx:175`).
- F7. Cinco consumidores. Tarefa (`L/apps/web/src/features/tasks/pages/task-preview-surface.tsx:58`): ações `archive` e `open`, título de fallback `'Tarefa'` durante o carregamento (`:52`), sem rodapé. Agenda remonta a superfície da tarefa (`agenda-preview.tsx:17`). Campanha: ações e descrição (`campaign-preview.tsx:61-63`). Leads: ação `open` (`commercial-lead-home-sheet.tsx:53-54`). Notas: descrição (`note-detail-sheet.tsx:57-58`). Arquivo: descrição e rodapé com restaurar e excluir (`archived-record-preview.tsx:44-46`). Um de cinco usa o rodapé.
- F8. O que é da tarefa fica fora do shell: guarda de estado, widgets e diálogo de arquivamento (`task-preview-surface.tsx:58-102`).
- F9. Testes do shell no Lemind: 5 casos em `L/packages/patterns/src/preview/preview.test.tsx:24-96`.
- F10. Nenhum consumidor do Lemind passa `showCloseButton` (busca em `L/apps/web/src` sem resultado): o fechar aparece em todo uso real.
- F11. `DetailSheet` (`packages/parttens/src/detail-sheet/components/detail-sheet/detail-sheet.tsx:18-76`) é o mesmo shell de F1 a F3, sem `variant="inset"`, sem `initialFocus` e sem catálogo; `actions?: ReactNode` (`:19,52`); `aria-label="Fechar detalhes"` fixo em pt-BR (`:56`); props estendem `Dialog.Root.Props` (`:18`).
- F12. `detail-sheet` traz ainda `DetailGroup`, `DetailRow`, `DetailSheetAction` (botão de ícone com tooltip), hooks sem uso e um `styles/global.css` não importado; não tem testes nem stories e aguarda a revisão de Tailwind (`detail-sheet/AGENTS.md:3,10-11,16,44-46,70`).
- F13. Referências a `detail-sheet` fora do pattern: `packages/parttens/src/index.ts`, `packages/registry/src/manifest.ts:7`, `packages/registry/src/cli.ts:19` (ajuda), `scripts/test-patterns.ts:7`, `README.md:89`, `docs/architecture/public-api-exports.json`, `docs/architecture/tc96-parttens.md:36,76,90-91,100,146,235` e `AGENTS.md:15,31,39,43,50`. Nenhuma story ou app o usa.
- F14. `tc96-parttens.md:263` registra "Preservar API atual dos patterns" para evitar quebra a consumidores existentes.
- F15. O CLI resolve só o alias `view` (`manifest.ts:76`); o barrel do consumidor é regerado a partir do agregado do workspace e mantém só os exports cujo módulo está instalado (`packages/registry/src/barrel.ts:9-12`).
- F16. A versão do registry é `'0.4.0'` (`packages/registry/src/build-registry.ts:149`); não há CHANGELOG na raiz.
- F17. `collection-views` não tem prop de clique em registro; o consumidor abre a partir de `renderCard` ou do conteúdo da célula (`packages/parttens/src/collection-views/views/kanban/components/kanban-view.tsx:19-35`).
- F18. Precedentes no `record-dialog`: `actions?: ReactNode` no cabeçalho e rótulos como props sem padrão (`packages/parttens/src/record-dialog/core.ts:8-42`); story `Patterns/RecordDialog Kanban` com `Board` e `BoardInteraction` (`apps/storybook/src/patterns/record-dialog/kanban-records.stories.tsx:144-155`).
- F19. O `SheetPopup` do COSS aceita `side` e `variant: default | inset`, com `max-w-md` à direita e largura total menos o gutter abaixo de `sm` (`packages/ui/src/sheet.tsx:70-101`); seu fechar próprio diz `aria-label="Close"` e vem ligado por padrão (`:73,111`); `SheetFooter` tem `default` (borda e `bg-muted/72`) e `bare` (`:145-160`).

## Decisões

- D1 (dono). Acrescentar `record-preview` ao catálogo: shell com cabeçalho e rodapé, sem conteúdo próprio, aberto à direita ao clicar num registro de uma coleção. Vocabulário "record", irmão do `record-dialog`. Origem: o `Preview` do Lemind na tarefa (F1, F7).
- D2 (dono). `record-preview` substitui `detail-sheet`: a pasta e os quatro exports (`DetailSheet`, `DetailGroup`, `DetailRow`, `DetailSheetAction` e props) saem. Quebra aceita; nada no repo os usa (F13). Exceção datada à linha de F14.
- D3 (arquitetura, eixo distribuição). Pattern próprio em `packages/parttens/src/record-preview/` com `index.ts`, `core.ts` só com tipos, `AGENTS.md`, `test/dom.ts`, `composition/record-preview/` e `composition/record-preview-action/`, cada um com `index.ts` e teste. Entradas em `patternNames` e `scripts/test-patterns.ts`. Sem `components/`, `hooks/`, `lib/` ou `store/`, porque não há código para eles.
- D4 (arquitetura, eixo contrato). Exports: `RecordPreview`, `RecordPreviewAction`, `RecordPreviewProps`, `RecordPreviewActionProps`. `open` e `onOpenChange` são props explícitas e obrigatórias, sem estender `Dialog.Root.Props`, que vazaria a superfície do Base UI para o baseline público (F11).
- D5 (design). Cabeçalho: `title: ReactNode` obrigatório, que é o nome acessível do dialog; `description?: ReactNode`; `actions?: ReactNode` antes do fechar, na mesma linha, em `data-slot="record-preview-header-actions"`. Sem catálogo: o de F4 traz vocabulário de produto (`archive`) e rótulos pt-BR para dentro do pattern (F18). Título longo quebra linha, não trunca. `titleAncestor` fica fora: nenhum consumidor do Lemind o usa (F7); entra depois como prop opcional, sem quebra.
- D6 (design). Fechar sempre presente: `closeLabel: string` obrigatório e sem padrão, ghost `icon-sm`, sem `showCloseButton` (F3, F10, F18). Em toque não há `Escape`. O `SheetPopup` recebe `showCloseButton={false}` para não renderizar o segundo fechar do COSS (F19).
- D7 (design). `RecordPreviewAction`, herdeiro do `DetailSheetAction`: `Button` ghost `icon-sm` com `Tooltip`, `label` como `aria-label` e texto do tooltip. Dá a consistência que motivou o catálogo do Lemind sem fechar o vocabulário (F4, F12).
- D8 (design). Rodapé só quando `footer` é passado, em `SheetFooter` `default`, fora do painel que rola, com o layout do COSS (F3, F19). O pattern não confirma ação destrutiva; o consumidor abre `SurfaceStates` por cima (F7, arquivo).
- D9 (design). Modal como no Lemind (F5). `Escape` e clique fora fecham. Foco inicial no próprio popup, com `initialFocus` na ref e `tabIndex={-1}`, pelo defeito de F2. Ao fechar, o foco volta ao gatilho, que o consumidor monta como `button` ou link focável no card ou na célula.
- D10 (design). `side="right"` e `variant="inset"`, largura `max-w-md` do COSS, sem prop `size`; `className` vai ao popup. `variant` é prop do COSS, não override; sobrescrever borda ou raio exigiria entrada em `scripts/override-exceptions.json`.
- D11 (design). O shell não tem estado de carregamento nem de vazio. Título de fallback, carregando, falha e não encontrado são do corpo e das props do consumidor (F7, F8).
- D12 (arquitetura, eixo fronteira). Estado aberto, URL, busca do registro, guarda de estado, widgets e confirmação ficam com o consumidor (F6, F8). Uma prop de clique em registro no `collection-views` é unidade posterior, com aceite próprio (F17).
- D13 (arquitetura). Referências de F13: `index.ts` passa a `export * from './record-preview/index'`; `manifest.ts:7` troca o nome, sem alias, para que `add detail-sheet` falhe com `Unknown pattern` (F15); `cli.ts:19` e `test-patterns.ts:7` só trocam o nome; `README.md:89` vira a linha de `record-preview`; `public-api-exports.json` é regerado com `--record`; `tc96-parttens.md` e `AGENTS.md` trocam os exemplos de layout por `record-dialog` e `views/<view>/hooks/`, perdem as menções ao CSS de `detail-sheet`, ganham o parágrafo de `record-preview/` e a exceção de D2 em `:263`. Os inventários da 0.1.0 (`migration-map.md`, `public-api-baseline.md`, `ui-migration-map.json`) ficam como histórico. A pasta `detail-sheet/` sai inteira.
- D14 (arquitetura, eixo custo). A versão sobe para 0.5.0 no PR de release, não nesta unidade (F16). A nota de quebra vai no corpo do PR e em `tc96-parttens.md`: os quatro componentes saem; `add detail-sheet` falha; no próximo `add`, o barrel do consumidor deixa de exportar `./detail-sheet/index` e a pasta instalada fica órfã (F15); a migração é `DetailSheet` → `RecordPreview` com `closeLabel`. Inferência: `DetailGroup` e `DetailRow` viram marcação do consumidor ou `properties`, porque o preview não tem conteúdo próprio (D1).
- D15 (arquitetura, eixo contrato). Teste do item construído, como o D19 de `state-surface`: o item `record-preview` existe, `registryDependencies` só tem `@coss/*`, nenhum arquivo de teste vai junto e `dist/registry/detail-sheet.json` não existe.
- D16 (design). Stories: `Patterns/RecordPreview` (`Default`, `WithFooter`, `LongContent`) e `Patterns/RecordPreview Kanban` (`Board`, no molde de F18), cada uma com gêmeo `!dev` `<Story>Interaction`. Os plays provam: abrir pelo teclado, `role="dialog"` com nome igual ao título, foco no popup, `Escape` fecha e o foco volta ao gatilho (`Default`); rodapé fora do painel que rola e ausente sem `footer` (`WithFooter`); fechar visível com título e corpo longos a 320px (`LongContent`); clique no card abre e o foco volta ao card (`Board`). Sem stories de carregamento ou vazio (D11).
- D17 (design). Contraste a medir em claro e escuro, com razão numérica: `popover-foreground` e `muted-foreground` sobre `popover`; `foreground` e `muted-foreground` sobre `muted/72` composto em `popover` (rodapé); ícones ghost sobre `popover` e sobre o hover; anel `ring` sobre `popover`. Achado de token é nota para o consumidor.

## Lacunas

- G1. Hipóteses sem evidência de usuário: trocar de registro exige fechar o painel modal (D9); 448px bastam para o corpo de uma tarefa (D10); foco no popup é melhor que na primeira ação para leitor de tela (D9); `titleAncestor` faria falta (D5).
- G2. O retorno de foco quando o gatilho desmonta ao fechar não foi verificado; o play de `Board` o prova.
- G3. Contraste não medido (D17). Vira critério de aceite do Plano.
- G4. A ajuda de `cli.ts:19` já omite quatro patterns além de `detail-sheet`. Fora desta unidade.

## Plano

Gates: Entendimento (problema e fronteiras em F1 a F19, D1 a D17), Aceite (cenários 1 a 12 abaixo, cada um executável), Decomposição (uma Task, D18), Evidência (comandos da raiz com leituras esperadas), Segurança de entrega (Task isolada, ver abaixo).

### Decisões de planejamento

- D18. Apetite: uma Task de frontend, teto de um dia de trabalho. Gatilho de corte: se a medição de contraste (D17) ou o play de `Board` (G2) revelar defeito de token ou de foco que exija mexer no COSS ou no consumidor, a Task entrega o que está verde, registra o achado como nota para o consumidor e abre issue para o restante; nada é corrigido em `packages/ui`. Decomposição: uma Task só, porque remover `detail-sheet` sem criar `record-preview` deixa `patternNames` sem shell lateral (D2, D13), e criar sem remover deixa dois shells públicos concorrentes; nenhuma metade tem aceite e evidência independentes.
- D19. Contraste (G3, D17) é medido a partir dos tokens de `apps/example/packages/ui/src/styles.css`, em claro e escuro, e as razões numéricas são gravadas em `docs/architecture/tc96-parttens.md` na seção de `record-preview`, com a regra: texto 4.5:1, gráficos e anel 3:1. Razão abaixo do limite não bloqueia a entrega; vira nota para o consumidor (D17).
- D20. A verificação de D13 é um grep fixo, definido uma vez e reusado na Evidência: `detail-sheet` e `DetailSheet` fora de `docs/plans/`, `node_modules`, `dist` e dos três inventários da 0.1.0 não retornam nada.

### STORY-PREVIEW-001: o consumidor monta uma prévia lateral de registro com `record-preview`, e `detail-sheet` deixa de existir

Cenários de aceite:

1. Dado `RecordPreview` com `open`, `title` e `closeLabel` (D4, D5, D6), quando renderizado, então existe `role="dialog"` cujo nome acessível é o título, e o botão de fechar tem `aria-label` igual a `closeLabel` e é o único fechar (D6, F19).
2. Dado `description` e `actions` passados, quando renderizado, então a descrição aparece e as ações ficam em `data-slot="record-preview-header-actions"`, antes do fechar, na mesma linha (D5).
3. Dado nenhum `footer`, quando renderizado, então não há `SheetFooter`; dado `footer`, então o rodapé existe fora do painel que rola (D8).
4. Dado `open={true}`, quando o usuário pressiona `Escape` ou clica fora, então `onOpenChange(false)` é chamado; quando clica no botão de fechar, idem (D9, D6).
5. Dado o popup aberto, quando monta, então o foco está no próprio popup, que tem `tabIndex={-1}` (D9, F2).
6. Dado `RecordPreviewAction` com `label`, quando renderizado, então é um botão com `aria-label` igual a `label` e tooltip com o mesmo texto, e `onClick` é chamado (D7).
7. Dado um título longo e corpo longo, quando renderizado, então o título quebra linha e o botão de fechar segue visível (D5, D16, D28).
8. Dado a story `Default`, quando o play abre pelo teclado, então `role="dialog"` tem o nome do título, o foco está no popup, `Escape` fecha e o foco volta ao gatilho; `WithFooter` e `LongContent` provam os cenários 3 e 7 (D9, D16).
9. Dado a story `Board`, quando o play clica num card, então o preview abre e, ao fechar, o foco volta ao card mesmo com o gatilho remontado (G2, D9, D16).
10. Dado os tokens do tema em claro e escuro, quando medidos os pares de D17, então as razões numéricas estão gravadas em `tc96-parttens.md` e cada uma está marcada como atende ou nota para o consumidor, e as stories passam axe (G3, D17, D19).
11. Dado o registry construído, quando inspecionado, então o item `record-preview` existe, `registryDependencies` só tem `@coss/*`, nenhum arquivo de teste vai junto e `dist/registry/detail-sheet.json` não existe; `add detail-sheet` falha com `Unknown pattern` (D15, D13, F15).
12. Dado o repositório, quando buscado, então `detail-sheet` e `DetailSheet` não aparecem fora de `docs/plans/` e dos três inventários da 0.1.0; `public-api-exports.json` lista `RecordPreview`, `RecordPreviewAction`, `RecordPreviewProps`, `RecordPreviewActionProps` e nenhum export de `detail-sheet`; `tc96-parttens.md` traz a nota de quebra de D14 e a exceção de D2 em `:263` (D2, D4, D13, D14, D20).

**Pronto quando** os cenários 1 a 12 passam com os comandos da Evidência, a pasta `detail-sheet/` não existe e a nota de quebra está no doc de arquitetura e pronta para o corpo do PR.

#### TASK-PREVIEW-001: criar `record-preview`, remover `detail-sheet` e limpar referências

- Perfil: `frontend-developer`.
- Escopo: pattern `record-preview` completo (D3 a D11), stories (D16), medição de contraste (D17, D19), remoção de `detail-sheet`, referências (D13), nota de quebra (D14), teste do registry (D15).
- Habilita cenários: 1 a 12.

Superfície:

- Criar:
  - `packages/parttens/src/record-preview/index.ts`
  - `packages/parttens/src/record-preview/core.ts` (só tipos)
  - `packages/parttens/src/record-preview/AGENTS.md` (seções na ordem do `AGENTS.md` da raiz; referência `properties/AGENTS.md`)
  - `packages/parttens/src/record-preview/test/dom.ts` (cópia de `packages/parttens/src/record-dialog/test/dom.ts`)
  - `packages/parttens/src/record-preview/composition/index.ts`
  - `packages/parttens/src/record-preview/composition/record-preview/index.ts`, `record-preview.tsx`, `record-preview.test.tsx`
  - `packages/parttens/src/record-preview/composition/record-preview-action/index.ts`, `record-preview-action.tsx`, `record-preview-action.test.tsx`
  - `apps/storybook/src/patterns/record-preview/` com as stories `Patterns/RecordPreview` (`Default`, `WithFooter`, `LongContent`) e `Patterns/RecordPreview Kanban` (`Board`), cada uma com gêmeo `!dev` `<Story>Interaction`, no molde de `apps/storybook/src/patterns/record-dialog/kanban-records.stories.tsx`
  - teste do item construído em `packages/registry/src/manifest.test.ts` (D15): roda `build-registry.ts` e lê `dist/registry/record-preview.json`, como o teste de `state-surface` em `feat/state-surface` (`manifest.test.ts:201-223`), mais a seleção de `detail-sheet` falhando com `Unknown pattern`
- Alterar:
  - `packages/parttens/src/index.ts` (`export * from './record-preview/index'`)
  - `packages/registry/src/manifest.ts:7` (troca o nome, sem alias)
  - `packages/registry/src/cli.ts:19` (só o nome na ajuda)
  - `scripts/test-patterns.ts:7` (só o nome)
  - `README.md:89` (linha de `record-preview`)
  - `docs/architecture/public-api-exports.json` (regerado com `--record`; mencionar no PR que o diff pode trazer exports pendentes alheios)
  - `docs/architecture/tc96-parttens.md` (`:36,76,90-91,100,146,235`, parágrafo de `record-preview/`, medição de contraste, nota de quebra, exceção de D2 em `:263`)
  - `AGENTS.md` da raiz do repo (`:15,31,39,43,50`: exemplos de layout por `record-dialog` e `views/<view>/hooks/`, sem menção ao CSS de `detail-sheet`)
- Remover: `packages/parttens/src/detail-sheet/` inteira (D2, D13).
- Não tocar:
  - `packages/ui/` (read-only, COSS)
  - `scripts/override-exceptions.json`, salvo se algum `className` sobrescrever borda ou raio do COSS (D10)
  - `docs/architecture/migration-map.md`, `public-api-baseline.md`, `ui-migration-map.json` (histórico da 0.1.0)
  - `packages/parttens/src/collection-views/` (D12)
  - versão do registry em `packages/registry/src/build-registry.ts:149` (D14)
  - `apps/example/packages/ui/src/styles.css` (token é nota para o consumidor)

Evidência (da raiz do repo):

1. `bunx biome check <arquivos tocados>`: sem erros nem avisos.
2. `bun run typecheck`: saída 0.
3. `bun test --isolate packages/parttens/src/record-preview`: todos os testes passam; cobrem cenários 1 a 7 (D4 a D9) em JSDOM; zero falhas.
4. `bun run check:coss && bun run boundaries:check && bun run overrides:check`: os três saem 0.
5. `bun scripts/verify-public-api.ts --record && bun run verify:public-api`: sai 0; o diff de `public-api-exports.json` adiciona os quatro exports de D4 e remove os de `detail-sheet`.
6. `bun run test:registry`: passa, inclusive o teste do item construído (cenário 11).
7. `bun run build:registry`: sai 0; `dist/registry/record-preview.json` existe e `dist/registry/detail-sheet.json` não existe.
8. `bun run storybook:typecheck && bun run storybook:lint`: saem 0.
9. `cd apps/storybook && bunx vitest run --project=storybook src/patterns/record-preview`: todas as stories e plays passam, axe sem violação (cenários 8, 9, 10).
10. `rg -n "detail-sheet|DetailSheet" --glob '!docs/plans/**' --glob '!node_modules/**' --glob '!dist/**' --glob '!docs/architecture/migration-map.md' --glob '!docs/architecture/public-api-baseline.md' --glob '!docs/architecture/ui-migration-map.json'`: só as cinco linhas de D21 (nota de quebra, parágrafo e exceção em `tc96-parttens.md`, dois casos em `manifest.test.ts`) (D20, D21, cenário 12).
11. Leitura de `docs/architecture/tc96-parttens.md`: a seção de `record-preview` tem as razões numéricas de D17 em claro e escuro e a nota de quebra de D14 (cenários 10 e 12).
12. `bun run check` antes do PR: sai 0.

Leituras esperadas: um comando com saída diferente da indicada reprova a Task; razão de contraste abaixo do limite não reprova, desde que esteja marcada como nota para o consumidor (D19).

Fora desta Task: prop de clique em registro no `collection-views` (D12), `titleAncestor` (D5), validação das hipóteses de G1, atualização da lista da ajuda do CLI além do nome (G4), bump de versão e CHANGELOG (D14), estado de carregamento ou vazio (D11).

Pronto quando: cenários 1 a 12 verdes, comandos 1 a 12 com a leitura esperada, nenhum arquivo fora da Superfície alterado.

Entrega isolada com segurança porque: é uma mudança reversível por `git revert`; `packages/ui` e `collection-views` não mudam; nada no repo usa `detail-sheet` (F13), então a remoção não quebra build, story nem app; a quebra para consumidores externos é aceita pelo dono (D2) e documentada (D14); a versão só sobe no PR de release.

### Decisões de implementação

- D21. O grep de D20 não retorna vazio, e o cenário 12 contradiz D2, D14 e D15: a nota de quebra, a exceção datada em `:263` e o teste do registry precisam nomear `detail-sheet` e `DetailSheet`. As cinco linhas restantes são só essas: três em `docs/architecture/tc96-parttens.md` (parágrafo de `record-preview/`, nota de quebra, exceção do registro de decisões) e duas em `packages/registry/src/manifest.test.ts` (`Unknown pattern` e ausência de `dist/registry/detail-sheet.json`). Nenhuma outra referência sobrevive, nem o código, o README, a baseline pública, o `AGENTS.md` da raiz ou o do pattern.
- D22. `RecordPreviewActionProps` tem `children`, `label`, `onClick` e `disabled`, em vez de estender `ButtonProps` como o `DetailSheetAction`. Estender vazaria a superfície do `Button` do COSS para a baseline pública, o mesmo motivo de D4; `variant` e `size` ficam fixos em ghost e `icon-sm` (D7). Uma prop nova entra depois, sem quebra.
- D23. G2 medido, gatilho de corte de D18 disparado. No `Board`, `Escape` devolve o foco ao card (gatilho montado). Quando o gatilho desmonta com o preview aberto (a ação "Move to Done" muda o card de coluna), Base UI devolve o foco ao elemento desconectado e o foco cai em `body`. O pattern não tem prop para isso (D4) e corrigir exige mexer no consumidor ou no contrato. `BoardInteraction` prova só o caminho com o gatilho montado; o trecho remontado do cenário 9 não passa e acompanhado em #61. Nada foi mudado em `packages/ui`. Substituída por D27.
- D24 (viewport substituído por D28). `LongContent` usa `globals.viewport` `mobile1` (320px) e o play assere `window.innerWidth <= 320`. O cenário 3 sem rodapé ganhou a story `WithoutFooterInteraction`, sem gêmea de desenvolvimento, porque a `Default` fecha por padrão.
- D25 (dono). A ação do cabeçalho que abre a página inteira do registro usa `Maximize2Icon` do lucide-react, o mesmo ícone das stories do `record-dialog` para essa ação, no lugar de `ExternalLinkIcon`, em todas as stories de `record-preview`.
- D26 (dono). O rodapé das stories segue o do `record-dialog`: Cancelar com `variant="ghost"` primeiro, que fecha o preview por `onOpenChange(false)`, e depois a ação primária na variante padrão. Substitui Restore (outline) e Delete (destructive-outline) por Cancel (ghost) e Restore (padrão). O rodapé continua um `ReactNode`; o contrato de `RecordPreview` não muda. O play de `WithFooter` prova a ordem no DOM e que Cancel fecha.
- D27 (dono). `RecordPreview` ganha `finalFocus?: () => HTMLElement | null`, repassado ao `finalFocus` do popup do Base UI, só como função (sem `boolean`, `RefObject` nem argumento `closeType`), então `RecordPreviewProps` continua sem expor a superfície do Base UI (D4). `null` mantém o padrão do Base UI, que devolve o foco ao gatilho. Mudança sem quebra. O `Board` ganha a ação "Move to Done" e resolve o card movido por id no fechamento; o play de `BoardInteraction` assere o foco no gatilho montado e no gatilho do card movido, e o cenário 9 volta a ficar totalmente coberto. O gatilho é buscado entre os visíveis, porque o Kanban monta também o layout móvel (`md:hidden`, `packages/parttens/src/collection-views/views/kanban/components/kanban-view.tsx:153`) com o mesmo card, oculto por `display: none` no desktop.
- D28 (dono). `LongContent` deixa de usar o viewport `mobile1` (Small mobile) e roda na largura padrão da story; o play não assere mais `window.innerWidth <= 320` e segue provando que o título quebra linha, não estoura e que o fechar fica visível dentro do painel.
- D29 (dono). As stories de uso em Kanban saem do topo e vão para o contexto de cada pattern, na convenção `Usages` do repo (`Patterns/Rich Text Editor/Usages/*`): `Patterns/RecordPreview Kanban` vira `Patterns/RecordPreview/Usages/Kanban` (`apps/storybook/src/patterns/record-preview/usages/kanban.stories.tsx`) e `Patterns/RecordDialog Kanban` vira `Patterns/RecordDialog/Usages/Kanban` (`apps/storybook/src/patterns/record-dialog/usages/kanban.stories.tsx`).
- D30 (dono). Em `Patterns/RecordPreview/Usages/Kanban`, o cabeçalho fica só com a ação de abrir a página do registro (`RecordPreviewAction` "Open as page" com `Maximize2Icon`, como em `Default`), e "Move to Done" sai do cabeçalho para um `Button` no corpo do preview. O play de `BoardInteraction` assere essa divisão e segue movendo o card com o preview aberto, então a prova do #61 (D27) continua.
- D31 (dono). Em `Patterns/RecordDialog`, entra a story `DeleteRecord` (com `DeleteRecordInteraction`) com o diálogo de confirmação de exclusão mostrado em `Patterns/RecordDialog/Usages/Kanban` > `Board`. O título é só "Delete Implement onboarding", sem o breadcrumb: `DeleteCardDialog` ganha `titleAncestor` opcional, `Patterns/SurfaceStates` mantém "Lemind" pelos args do meta e o diálogo do Kanban também passa a não exibir o breadcrumb.

### Acompanhamento (fora deste plano)

- Prop de clique em registro no `collection-views`, unidade posterior com aceite próprio (D12, F17).
- `titleAncestor` como prop opcional, sem quebra, se um consumidor real o pedir (D5).
- G1: validar com usuário as quatro hipóteses (trocar de registro fechando o modal, 448px, foco no popup para leitor de tela, `titleAncestor`).
- G4: revisar a lista de patterns da ajuda de `packages/registry/src/cli.ts:19`, que já omite quatro patterns (#52).
- Release 0.5.0 com a nota de quebra (D14).
- Foco ao fechar quando o gatilho remonta (D23): resolvido por D27 (#61).

## Envelope

```yaml
pilar: validacao
resultado: aprovado por revisão independente; pattern após uma rodada de correção (achados 1 a 5 fechados) e correção do #61 (D27) aprovada, com cenário 9 coberto
artefato: working tree em feat/record-preview, sem commit
evidencia: bun run check verde; bun test record-preview 15, test:registry 26, vitest storybook record-preview 9; BoardInteraction falha sem finalFocus (record-preview-kanban.stories.tsx:165) e passa com ele
decisoes: [D21, D22, D23 (substituída por D27), D24, D25, D26, D27]
lacunas: [G1, anel claro 2,59:1 (#62), muted-foreground escuro sobre popover (#57), axe só no tema claro (#58), ajuda do CLI (#52)]
proximo: fechado tecnicamente; commit, push e PR com o dono (o PR fecha #61)
```
