# Cenários de desempenho

O primeiro cenário reproduz a projeção de uma collection com 10.000 itens e 20 grupos. O benchmark mede cinco execuções de `projectCollection`, verifica que nenhum item foi perdido e grava os tempos em `.test-output/bench-views.json`.

DataGrid já usa `@tanstack/react-virtual` para linhas. O benchmark não substitui uma medição em navegador: scroll, seleção, resize e arraste precisam de um consumidor visual. Metas numéricas ainda não foram fixadas; os tempos coletados servem como baseline para uma decisão posterior.
