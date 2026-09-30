# tc96-parttens

UI e padrões React sem regra de negócio, baseados em COSS/Base UI, distribuídos como biblioteca e como fontes instaláveis.

```tsx
import { CollectionViewOutlet, TextProperty } from 'tc96/parttens'
import { Button } from 'tc96/ui'
import { cn } from 'tc96/utils'
```

Para possuir e adaptar os fontes no monorepo consumidor:

```sh
npx tc96-parttens add collection-views properties
```

O instalador usa o registry do shadcn. Os destinos e aliases podem ser definidos em `tc96.json`; arquivos existentes são preservados por padrão. A biblioteca versionada recebe correções por atualização de versão. Os fontes locais recebem comparação e orientação para aplicação manual.

O pacote atende React 19, TypeScript, Tailwind CSS 4 e Base UI. Os renderers e displays de properties não conhecem entidades, persistência, permissões ou APIs de produto. A aplicação fornece dados preparados e recebe eventos. Filter Builder e responsividade ficam fora da primeira versão.

Os patterns são organizados conforme a responsabilidade de cada parte: Collection Views usa `views/` para seus renderers; Properties usa `display/` para seus padrões de apresentação. `store/`, `shared/`, `types/` e `composition/` entram onde o pattern precisa deles. Consulte [a arquitetura interna](docs/architecture/tc96-parttens.md#estrutura-interna-dos-patterns) para ver os detalhes.

O nome `tc96` é o identificador de distribuição pretendido e precisa ser confirmado antes da publicação pública.
