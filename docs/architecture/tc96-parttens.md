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

- `ui`: componentes COSS sem alterações, no papel da UI do consumidor.
- `elements`: componentes próprios do tc96 que não existem no COSS, como `Text`. Usam só os tokens do tema do consumidor.
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

`parttens` depende de `ui`, `elements` e `utils`; `ui` e `elements` dependem de `utils`; `elements` não depende de `parttens`. Os três não dependem do registry. Dependências entre padrões são explícitas e não podem criar ciclos. Os fontes de UI têm uma implementação canônica, sem cópias mantidas por padrão.

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

- O COSS vence a API própria. Os patterns usam a API do COSS. Saem `size` `sm | md | lg`, `variant: 'primary'`, `buttonSizes`, `inputSizes` e o `control-radius`. O `Text`, que não existe no COSS, migra para `packages/elements`. O `tc96/ui` público é removido, sem re-export.
- O consumidor é dono dos componentes COSS. Os patterns declaram `registryDependencies` do COSS, e o shadcn instala ou reutiliza o que o projeto já tem. O tc96 não distribui UI.
- O `cn` também é do consumidor. Os imports de `@tc96/utils` são reescritos para o `aliases.utils` do `components.json` do consumidor, e o arquivo não é distribuído.
- Os patterns não redefinem tema. Tokens, `:root`, `.dark` e utilitários próprios pertencem ao consumidor.

`packages/ui` continua no workspace, privado, como a UI que um consumidor COSS teria. Ele é gerado por `bun run sync:coss`, que grava cada item do registry do COSS como publicado e só troca os aliases de import (`@/registry/default/...`) pelos do workspace, como o `shadcn add` faria. Nunca é editado à mão. O lock `packages/ui/coss.lock.json` registra, por item, a URL `coss.com/ui/r/<item>.json`, o hash do conteúdo publicado e o hash do arquivo gravado. O `check:coss` compara cada arquivo com o lock, e o `check:coss --remote` compara com o registry. O diretório fica fora do Biome. Os patterns só importam `@tc96/ui/<item>` presente no lock.

Situação em 2026-10-01: os 27 itens de `packages/ui/src` são o COSS sem alterações. Antes, 8 deles divergiam (button, input, input-group, group, calendar, combobox, sheet e textarea) e havia cópias em `compat/`. O COSS fixa `@base-ui/react` 1.8.0 e usa `@daypicker/react` no calendar, e o workspace acompanha essas versões. `scripts/build-library.ts` publica `ui/styles.css` com tokens próprios. Os quatro `styles/global.css` dos patterns não são importados.

Sem biblioteca npm, decidido em 2026-10-01. Um pacote compilado não consegue importar o COSS do consumidor sem embutir uma cópia própria ou depender de um caminho que não resolve. Por isso o tc96 é distribuído só como fontes. A atualização passa a ser `tc96-parttens add --diff` com incorporação manual. Reabrir esta decisão só se surgir como requisito um consumidor sem COSS.

Locale do calendar, resolvido no planejamento: o calendar do COSS fala inglês por padrão, como o rótulo dos patterns (`en-US`). Outro idioma entra por `calendarProps.locale`.

Questões abertas:

- Faixa de datas do calendar.
- Regra objetiva de sobrescrita nos patterns. A proposta é permitir só layout e dimensão, sem cor, raio ou sombra.

## Comportamento e dados

A aplicação fornece os dados preparados e executa filtros, ordenação, paginação, agrupamento, persistência e mutações. Os padrões renderizam e emitem eventos. Estado visual transitório pode permanecer local. Permissões, API, vocabulário de produto e regras de domínio pertencem ao consumidor.

Exceção de compatibilidade aceita: preservar o agrupamento interno atual e acrescentar uma entrada para grupos preparados pelo consumidor. Quando esta entrada estiver presente, não executar a projeção interna. Os dois contratos compartilham a renderização. Inventariar outros comportamentos locais da API atual antes de propor mudanças incompatíveis.

## Distribuição e instalação

Há um modo só: instalação editável dos fontes.

### Estrutura do consumidor

Decidido em 2026-10-01. O consumidor monta um design system em camadas, no espírito do atomic design. O `components.json` fica na raiz do monorepo e é a única configuração; o `tc96.json` deixa de existir.

```text
components.json        aliases: ui, utils, elements, patterns
packages/
  ui/                  átomos: componentes COSS (aliases.ui)
  elements/            componentes próprios fora do COSS, como Text (aliases.elements)
  patterns/            organismos: patterns do tc96 (aliases.patterns)
apps/
  web/                 templates e páginas da aplicação
```

- `ui` e `utils` vêm dos aliases que o shadcn já define. O shadcn instala ali os componentes COSS.
- `elements` e `patterns` são aliases acrescentados ao mesmo objeto `aliases`. O shadcn 4.21 valida `aliases` com um `z.object` não estrito, que aceita e ignora chaves desconhecidas; o objeto de topo é estrito, por isso as chaves novas ficam dentro de `aliases`. O CLI do tc96 lê o arquivo bruto para obter esses dois aliases.
- Imports só descem de camada: `patterns` importa `elements`, `ui` e `utils`; `elements` importa `ui` e `utils`; `ui` não importa nenhuma das outras.
- Cada alias precisa de entrada exata e de wildcard nos `paths` do `tsconfig` da raiz, conforme o [contrato de instalação](installation-contract.md).

Situação em 2026-10-01: o CLI lê os quatro aliases do `components.json` e reprova, com a lista das chaves que faltam, quando algum está ausente. O destino de `elements` e `patterns` é o diretório que o wildcard de cada alias resolve no `tsconfig`. O build do registry não segue os imports de `@tc96/ui` e `@tc96/utils`, e o `assertDistributable` reprova qualquer item com arquivo de `ui/` ou `utils/` ou com `:root`, `.dark`, `@theme` ou `@utility`. Enquanto as `registryDependencies` estiverem adiadas, o consumidor instala antes os componentes COSS usados pelos patterns.

### Decisões adiadas até o primeiro consumidor

Estas decisões ficam para quando o primeiro pattern for instalado num consumidor real. Até lá, nenhuma unidade de trabalho depende delas.

- Forma das `registryDependencies` do COSS: URL completa (`https://coss.com/ui/r/<item>.json`) ou namespace `@coss` declarado em `registries` no `components.json`.
- Reaproveitamento de um componente COSS que o consumidor já tem: provar que o shadcn não pergunta se deve sobrescrever, ou fazer o CLI deixar de fora as dependências já instaladas antes de chamar o shadcn.
- Persistência de `aliases.elements` e `aliases.patterns`: verificar se `shadcn init` ou outros comandos regravam o `components.json` e descartam essas chaves. Se descartarem, o CLI precisa avisar e reaplicar.

Contrato proposto do comando:

```sh
npx tc96-parttens add collection-views properties
```

O CLI aceita vários padrões, resolve dependências compartilhadas uma vez e ajusta imports para os pacotes do consumidor. Os imports `@tc96/ui`, `@tc96/utils`, `@tc96/elements` e `@tc96/parttens` são reescritos para `aliases.ui`, `aliases.utils`, `aliases.elements` e `aliases.patterns` do consumidor. Exemplo: `@tc96/ui/button` se torna `@lemind/ui/button`.

Decisão confirmada: utilizar o instalador do shadcn. `tc96-parttens` será uma camada fina de configuração, seleção e verificações; não terá um segundo mecanismo de cópia e resolução de dependências. O registry será compatível com o schema do shadcn. Validar destinos em monorepo e aliases personalizados antes de finalizar esse adaptador. Bun não será exigido para executar o CLI via npm.

Preservar arquivos existentes por padrão; perguntar antes de sobrescrever. A primeira versão oferece comparação e orientação para incorporar correções manualmente, sem atualização ou mesclagem automática.

Proposta de verificação: conferir exports e compatibilidade dos contratos TypeScript, reportando limitações. Essa verificação não garante equivalência visual ou comportamental. Não anunciar compatibilidade completa somente com base no nome ou na existência de um arquivo.

## Validação proposta

- Fronteiras: impedir imports em direção proibida, ciclos e UI duplicada por padrão. `packages/parttens` só importa `@tc96/ui/<item>` presente no lock COSS.
- UI: todo arquivo de `packages/ui/src` é igual ao snapshot COSS fixado. Um job separado procura versão nova no upstream.
- Registry: nenhum item distribui arquivo de UI, nem `:root`, `.dark`, `@theme` ou `@utility`. Todo `@tc96/ui/<item>` usado aparece em `registryDependencies`.
- Consumidor: num projeto COSS com alias e caminho fora do padrão e um botão marcado, instalar `collection-views properties`. O `tsc --noEmit` passa, a renderização contém o marcador e nenhum arquivo é escrito no caminho de UI. Implementado em `apps/example`, um consumidor com aliases `@acme/*` e patterns em `packages/organisms/src`. O `test:consumer:registry` instala os quatro patterns e o `test:consumer:ssr` renderiza `collection-views` e `properties` no servidor; os dois copiam o exemplo para `.test-output`, instalam nele o COSS do lock com um marcador no `button.tsx` e reprovam se o CLI escrever em `packages/ui` ou deixar import `@tc96/*`.
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
| `Text` e outros componentes fora do COSS em `packages/elements`, distribuídos pelo registry com destino configurável | Manter em `packages/ui` | `packages/ui` só contém COSS sem alterações |
| `components.json` na raiz como única configuração, com `aliases.elements` e `aliases.patterns`; `tc96.json` removido | Manter `tc96.json` para os destinos do tc96 | Uma configuração só, numa estrutura em camadas no consumidor |
| `cn` resolvido pelo `aliases.utils` do consumidor | Distribuir `@tc96/utils` | O COSS já instala `cn` no consumidor |
| Grupos preparados com agrupamento antigo preservado | Remover projeção interna | Separar operações novas sem quebrar comportamento atual |
| UI compartilhada e destino configurável | UI duplicada por padrão | Reaproveitar a base e as personalizações do consumidor |
| Correções locais manuais | Mesclagem automática | Escopo definido para a primeira versão |
| Instalador do shadcn com camada fina do produto | Instalador próprio | Reutilizar o mecanismo adotado pelo COSS |
| Sem Filter Builder nem responsividade | Todo o catálogo e mobile | Exclusões explícitas do usuário |

## Pontos ainda em revisão

- Namespace COSS no registry e regra de sobrescrita. Ver [UI base sem opinião](#ui-base-sem-opinião).
- Aprovação da estratégia de validação e do limite da verificação de compatibilidade.
- Configuração e integração do CLI com shadcn, preservando o comando desejado e validando destinos em monorepo.
- Nome npm disponível para o CLI.
- Metas mensuráveis por view e matriz inicial de ambientes SSR/navegadores.
- Execução da migração conforme o [plano em revisão](../plans/2026-09-29-reestruturacao-tc96-parttens.md).
