# Arquitetura do tc96-parttens

Status: arquitetura aplicada no workspace até 2026-09-30. As decisões de 2026-10-01 (UI base sem opinião, sem biblioteca npm) ainda não foram aplicadas no código; decisões externas de publicação continuam pendentes.

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
      editable/
        store/
        shared/
        types/
        views/
        composition/
      index.ts
  utils/
  registry/
docs/
  architecture/
```

A landing será acrescentada quando houver escopo concreto. A grafia `parttens` acompanha o nome escolhido para o produto e o contrato público.

- `ui`: componentes básicos COSS/Base UI e fundações visuais.
- `parttens`: padrões, com componentes, hooks, tipos e testes próximos de cada padrão.
- `utils`: funções compartilhadas sem React ou dependências visuais.
- `registry`: manifestos, geração e ferramentas para instalação dos fontes.

## Estrutura interna dos patterns

`collection-views`, `properties` e `editable` organizam o código pelas responsabilidades de cada pattern. Em `collection-views`, `views/` identifica renderers de coleção; em `properties`, `display/` identifica padrões de apresentação. Os diretórios não representam páginas ou rotas de aplicação. Uma camada só recebe código quando há responsabilidade para ela.

```text
<pattern>/
  store/         estado compartilhado e ações
  shared/        componentes e helpers usados por mais de um display
  types/         contratos compartilhados pelo pattern
  views/         renderers de coleção em collection-views
  display/       padrões de apresentação em properties
  composition/   composição de displays e componentes compartilhados
```

- `collection-views/views/` contém Calendar, Data Grid, Kanban e List. `store/` mantém o `CollectionProvider` e as preferências compartilhadas; `composition/` contém `CollectionViewOutlet`, que seleciona o renderer ativo; toolbar e paginação ficam em `shared/`.
- `properties/display/` contém os padrões de apresentação de propriedade, como Text, Date, Select e Person. `composition/` contém `AssignedProperty`, uma composição semântica de Person, e `PropertyCollection`; `shared/` reúne catálogo, superfícies e o shell comum de seleção única. Select e Person fornecem seu próprio conteúdo e suas opções ao shell. O diretório `store/` fica reservado, mas não há store global de properties: rascunhos de interação continuam locais a cada controle.
- `editable/composition/` contém o composto Editable e seus controles. `store/` abriga o contexto e o estado compartilhado entre as partes; helpers comuns ficam em `shared/`. A implementação atual usa React Context e hooks; a camada não obriga Zustand.
- `types/` nas três áreas expõe contratos organizados por pattern. Tipos específicos de um renderer ou display podem permanecer junto dele.

Cada área tem um barrel próprio. O CLI gera o barrel agregado no projeto do consumidor, só com os patterns instalados. O layout interno pode evoluir sem exigir que o consumidor importe caminhos privados.

No Storybook, `Patterns/Collection Views/Overview` apresenta a mesma coleção em List, Kanban e Data Grid. As stories sob `Patterns/Collection Views/Views` documentam cada renderer isoladamente; `Shared Components` documenta toolbar e paginação. As stories de properties ficam em `Patterns/Properties/Display`; o agrupamento de properties fica em `Patterns/Properties/Groups`.

`parttens` depende de `ui` e `utils`; `ui` depende de `utils`. Os três não dependem do registry. Dependências entre padrões são explícitas e não podem criar ciclos. Os fontes de UI têm uma implementação canônica, sem cópias mantidas por padrão.

Nomes internos: `@tc96/ui`, `@tc96/parttens`, `@tc96/utils` e `@tc96/registry`. São pacotes privados do workspace. O produto publica só o CLI `tc96-parttens` com o registry embutido; não há biblioteca npm. `ui` e `utils` existem para desenvolvimento, Storybook e testes, no papel de projeto consumidor (ver [UI base sem opinião](#ui-base-sem-opinião)).

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

O nome npm só importa para o CLI `tc96-parttens`. O README da base relata recusa anterior do nome `tc96` pelo registry. Confirmar o nome do CLI antes de divulgar comandos como funcionais.

## UI base sem opinião

Decidido em 2026-10-01. O tc96 reutiliza patterns em projetos que já usam COSS, com a menor sobrescrita de estilo possível. A UI base não é opinativa e usa os componentes COSS sem alterações.

- O COSS vence a API própria. Os patterns usam a API do COSS. Saem `size` `sm | md | lg`, `variant: 'primary'`, `buttonSizes`, `inputSizes`, o `control-radius` e o `Text`, que não existe no COSS. O `tc96/ui` público é removido, sem re-export.
- O consumidor é dono dos componentes COSS. Os patterns declaram `registryDependencies` do COSS, e o shadcn instala ou reutiliza o que o projeto já tem. O tc96 não distribui UI.
- O `cn` também é do consumidor. Os imports de `@tc96/utils` são reescritos para o `aliases.utils` do `components.json` do consumidor, e o arquivo não é distribuído.
- Os patterns não redefinem tema. Tokens, `:root`, `.dark` e utilitários próprios pertencem ao consumidor.

`packages/ui` continua no workspace, privado, como a UI que um consumidor COSS teria. Ele é gerado pelo mesmo `shadcn add` do COSS e nunca editado à mão. Um lock registra, por item, a URL `coss.com/ui/r/<item>.json` e o hash. Um check compara cada arquivo com esse snapshot, normalizando só os imports. O diretório fica fora do formatador.

Situação em 2026-10-01, medida por diff contra `coss.com/ui/r/*.json`. Dos 28 arquivos de `packages/ui/src`, 16 são idênticos ao COSS e 3 diferem só na formatação. Outros 8 divergem: button, input, input-group, group, calendar (locale `ptBR` fixo), combobox, sheet e textarea. `compat/collection-views/button.tsx` e `compat/collection-views/input.tsx` são o COSS sem alterações, e o `button.tsx` e o `input.tsx` canônicos são o fork. `scripts/build-library.ts` publica `ui/styles.css` com tokens próprios. Os quatro `styles/global.css` dos patterns não são importados.

Sem biblioteca npm, decidido em 2026-10-01. Um pacote compilado não consegue importar o COSS do consumidor sem embutir uma cópia própria ou depender de um caminho que não resolve. Por isso o tc96 é distribuído só como fontes. A atualização passa a ser `tc96-parttens add --diff` com incorporação manual. Reabrir esta decisão só se surgir como requisito um consumidor sem COSS.

Questões abertas:

- Destino do `Text` e do locale e da faixa de datas do calendar. É pré-requisito para limpar `packages/ui`.
- Namespace das dependências COSS no registry e reescrita de `@tc96/ui/<item>` para o `aliases.ui` do consumidor. É o caminho crítico do registry, e o contrato de instalação só foi provado com itens locais.
- Regra objetiva de sobrescrita nos patterns. A proposta é permitir só layout e dimensão, sem cor, raio ou sombra.

## Comportamento e dados

A aplicação fornece os dados preparados e executa filtros, ordenação, paginação, agrupamento, persistência e mutações. Os padrões renderizam e emitem eventos. Estado visual transitório pode permanecer local. Permissões, API, vocabulário de produto e regras de domínio pertencem ao consumidor.

Exceção de compatibilidade aceita: preservar o agrupamento interno atual e acrescentar uma entrada para grupos preparados pelo consumidor. Quando esta entrada estiver presente, não executar a projeção interna. Os dois contratos compartilham a renderização. Inventariar outros comportamentos locais da API atual antes de propor mudanças incompatíveis.

## Distribuição e instalação

Há um modo só: instalação editável dos fontes. O destino padrão é `packages/patterns`. A UI e o `cn` vêm do COSS do consumidor, pelos aliases do `components.json`.

Contrato proposto do comando:

```sh
npx tc96-parttens add collection-views properties
```

O CLI aceita vários padrões, resolve dependências compartilhadas uma vez e ajusta imports para os pacotes do consumidor. Exemplo: `@tc96/ui/button` se torna `@lemind/ui/button` quando esse for o `aliases.ui` do consumidor.

Decisão confirmada: utilizar o instalador do shadcn. `tc96-parttens` será uma camada fina de configuração, seleção e verificações; não terá um segundo mecanismo de cópia e resolução de dependências. O registry será compatível com o schema do shadcn. Validar destinos em monorepo e aliases personalizados antes de finalizar esse adaptador. Bun não será exigido para executar o CLI via npm.

Preservar arquivos existentes por padrão; perguntar antes de sobrescrever. A primeira versão oferece comparação e orientação para incorporar correções manualmente, sem atualização ou mesclagem automática.

Proposta de verificação: conferir exports e compatibilidade dos contratos TypeScript, reportando limitações. Essa verificação não garante equivalência visual ou comportamental. Não anunciar compatibilidade completa somente com base no nome ou na existência de um arquivo.

## Validação proposta

- Fronteiras: impedir imports em direção proibida, ciclos e UI duplicada por padrão. `packages/parttens` só importa `@tc96/ui/<item>` presente no lock COSS.
- UI: todo arquivo de `packages/ui/src` é igual ao snapshot COSS fixado. Um job separado procura versão nova no upstream.
- Registry: nenhum item distribui arquivo de UI, nem `:root`, `.dark`, `@theme` ou `@utility`. Todo `@tc96/ui/<item>` usado aparece em `registryDependencies`.
- Consumidor: num projeto COSS com alias e caminho fora do padrão e um botão marcado, instalar `collection-views properties`. O `tsc --noEmit` passa, a renderização contém o marcador e nenhum arquivo é escrito no caminho de UI.
- Registry/CLI: instalar padrões isolados e em conjunto com aliases personalizados; verificar dependências, conflitos e preservação de arquivos.
- Storybook: cobrir interação, teclado, foco, edição e arraste. Docs e Storybook consomem os pacotes do workspace.
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
| `cn` resolvido pelo `aliases.utils` do consumidor | Distribuir `@tc96/utils` | O COSS já instala `cn` no consumidor |
| Grupos preparados com agrupamento antigo preservado | Remover projeção interna | Separar operações novas sem quebrar comportamento atual |
| UI compartilhada e destino configurável | UI duplicada por padrão | Reaproveitar a base e as personalizações do consumidor |
| Correções locais manuais | Mesclagem automática | Escopo definido para a primeira versão |
| Instalador do shadcn com camada fina do produto | Instalador próprio | Reutilizar o mecanismo adotado pelo COSS |
| Sem Filter Builder nem responsividade | Todo o catálogo e mobile | Exclusões explícitas do usuário |

## Pontos ainda em revisão

- Destino do `Text` e do calendar, namespace COSS no registry e regra de sobrescrita. Ver [UI base sem opinião](#ui-base-sem-opinião).
- Aprovação da estratégia de validação e do limite da verificação de compatibilidade.
- Configuração e integração do CLI com shadcn, preservando o comando desejado e validando destinos em monorepo.
- Nome npm disponível para o CLI.
- Metas mensuráveis por view e matriz inicial de ambientes SSR/navegadores.
- Execução da migração conforme o [plano em revisão](../plans/2026-09-29-reestruturacao-tc96-parttens.md).
