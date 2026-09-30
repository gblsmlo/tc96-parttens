# Arquitetura do tc96-parttens

Status: arquitetura aplicada no workspace; decisões externas de publicação continuam pendentes.

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

`collection-views`, `properties` e `editable` usam as mesmas cinco camadas. O nome `views/` representa os padrões de interface oferecidos ao consumidor; não significa uma página ou rota de aplicação. Uma camada só recebe código quando há responsabilidade para ela; pastas de documentação registram as camadas ainda sem implementação.

```text
<pattern>/
  store/         estado compartilhado e ações
  shared/        componentes e helpers usados por mais de uma view
  types/         contratos compartilhados pelo pattern
  views/         padrões de UI que podem ser usados isoladamente
  composition/   composição de views e componentes compartilhados
```

- `collection-views/views/` contém Calendar, Data Grid, Kanban e List. `store/` mantém o `CollectionProvider` e as preferências compartilhadas; `composition/` contém `CollectionViewOutlet`, que seleciona o renderer ativo; toolbar e paginação ficam em `shared/`.
- `properties/views/` contém os controles de propriedade, como Text, Date e Select. `composition/` contém `PropertyCollection`; `shared/` reúne catálogo e superfície visual. O diretório `store/` fica reservado, mas não há store global de properties: rascunhos de interação continuam locais a cada controle.
- `editable/composition/` contém o composto Editable e seus controles. `store/` abriga o contexto e o estado compartilhado entre as partes; helpers comuns ficam em `shared/`. `views/` está reservado para uma view independente futura. A implementação atual usa React Context e hooks; a camada não obriga Zustand.
- `types/` nas três áreas expõe contratos organizados por pattern. Tipos específicos de uma view podem permanecer junto dela.

Os barrels de cada área preservam a API agregada `tc96/parttens` e os aliases de compatibilidade. O layout interno pode evoluir sem exigir que o consumidor importe caminhos privados.

No Storybook, `Patterns/Collection Views/Overview` apresenta a mesma coleção em List, Kanban e Data Grid. As stories sob `Patterns/Collection Views/Views` documentam cada renderer isoladamente; `Shared Components` documenta toolbar e paginação. Properties e Editable também aparecem sob `Patterns`, mantendo a navegação alinhada à arquitetura do pacote.

`parttens` depende de `ui` e `utils`; `ui` depende de `utils`. Os três não dependem do registry. Dependências entre padrões são explícitas e não podem criar ciclos. Os fontes de UI têm uma implementação canônica, sem cópias mantidas por padrão.

Nomes internos propostos: `@tc96/ui`, `@tc96/parttens`, `@tc96/utils` e `@tc96/registry`. São pacotes do workspace; a publicação do produto reúne seus fontes numa única distribuição de biblioteca.

## API e compatibilidade

```tsx
import { CollectionViewOutlet, TextProperty } from 'tc96/parttens'
import { Button } from 'tc96/ui'
import { cn } from 'tc96/utils'
```

A entrada agregada `tc96/parttens` é a experiência escolhida. Preservar nomes, props e imports atuais, inclusive `tc96/components` e `tc96/blocks`, com a exceção explícita do Filter Builder. Entradas antigas do registry devem mapear para os padrões correspondentes quando ainda estiverem no escopo.

`collection-views` identifica o conjunto. Preservar nomes como `KanbanView`, `ListView`, `CalendarView` e `DataGrid`. Não renomear componentes apenas por uniformidade.

O identificador npm `tc96` é o contrato desejado, mas não está confirmado como publicável. O README da base relata recusa anterior do nome pelo registry. Resolver o nome de publicação antes de divulgar comandos como funcionais.

## Comportamento e dados

A aplicação fornece os dados preparados e executa filtros, ordenação, paginação, agrupamento, persistência e mutações. Os padrões renderizam e emitem eventos. Estado visual transitório pode permanecer local. Permissões, API, vocabulário de produto e regras de domínio pertencem ao consumidor.

Exceção de compatibilidade aceita: preservar o agrupamento interno atual e acrescentar uma entrada para grupos preparados pelo consumidor. Quando esta entrada estiver presente, não executar a projeção interna. Os dois contratos compartilham a renderização. Inventariar outros comportamentos locais da API atual antes de propor mudanças incompatíveis.

## Distribuição e instalação

Dois modos compartilham os mesmos fontes: dependência versionada e instalação editável. A experiência principal instala os fontes em `packages/patterns`, com destino configurável para a UI e os utilitários.

Contrato proposto do comando:

```sh
npx tc96-parttens add collection-views properties
```

O CLI ainda não existe. Ele aceita vários padrões, resolve dependências compartilhadas uma vez e ajusta imports para os pacotes do consumidor. Exemplo: `@tc96/ui` se torna `@lemind/ui` quando esse for o destino configurado.

Decisão confirmada: utilizar o instalador do shadcn. `tc96-parttens` será uma camada fina de configuração, seleção e verificações; não terá um segundo mecanismo de cópia e resolução de dependências. O registry será compatível com o schema do shadcn. Validar destinos em monorepo e aliases personalizados antes de finalizar esse adaptador. Bun não será exigido para executar o CLI via npm.

Preservar arquivos existentes por padrão; perguntar antes de sobrescrever. A primeira versão oferece comparação e orientação para incorporar correções manualmente, sem atualização ou mesclagem automática.

Proposta de verificação: conferir exports e compatibilidade dos contratos TypeScript, reportando limitações. Essa verificação não garante equivalência visual ou comportamental. Não anunciar compatibilidade completa somente com base no nome ou na existência de um arquivo.

## Validação proposta

- Fronteiras: impedir imports em direção proibida, ciclos e UI duplicada por padrão.
- Biblioteca: instalar o tarball em consumidor temporário, verificar imports atuais e novos, declarações e preservação de comportamento.
- Registry/CLI: instalar padrões isolados e em conjunto com aliases personalizados; verificar dependências, conflitos e preservação de arquivos.
- Storybook: cobrir interação, teclado, foco, edição e arraste. Docs e Storybook devem consumir a API pública.
- SSR: validar renderização e hidratação num consumidor real com SSR, preservando fronteiras de componentes cliente. SSR não implica executar interações no servidor.
- Desempenho: medir cenários com milhares de itens por view, incluindo scroll, seleção e arraste; verificar virtualização sem fixar limites numéricos não acordados.

## Registro de decisões

| Decisão | Alternativa | Motivo |
| --- | --- | --- |
| Monorepo com pacotes internos por responsabilidade | Uma pasta pública única ou releases independentes | Apps e fronteiras claras sem multiplicar versões da biblioteca |
| API agregada `tc96/parttens` | Imports públicos obrigatórios por padrão | Preferência do consumidor |
| Fontes locais e biblioteca versionada | Apenas uma modalidade | Personalização livre e atualização por versão para usos distintos |
| Preservar API atual | Redesenhar todos os contratos | Evitar quebra para consumidores existentes |
| Grupos preparados com agrupamento antigo preservado | Remover projeção interna | Separar operações novas sem quebrar comportamento atual |
| UI compartilhada e destino configurável | UI duplicada por padrão | Reaproveitar a base e as personalizações do consumidor |
| Correções locais manuais | Mesclagem automática | Escopo definido para a primeira versão |
| Instalador do shadcn com camada fina do produto | Instalador próprio | Reutilizar o mecanismo adotado pelo COSS |
| Sem Filter Builder nem responsividade | Todo o catálogo e mobile | Exclusões explícitas do usuário |

## Pontos ainda em revisão

- Aprovação da estratégia de validação e do limite da verificação de compatibilidade.
- Configuração e integração do CLI com shadcn, preservando o comando desejado e validando destinos em monorepo.
- Nome npm disponível para a biblioteca e o executável; relação entre esses artefatos.
- Metas mensuráveis por view e matriz inicial de ambientes SSR/navegadores.
- Execução da migração conforme o [plano em revisão](../plans/2026-09-29-reestruturacao-tc96-parttens.md).
