# Quiz dos Bairros de Curitiba

Um joguinho de mapa onde você tem que clicar no bairro certo. Simples assim.

A ideia surgiu porque eu queria aprender os bairros de Curitiba e não ficar tão perdida em relação a cidade. Fazia meses que eu pensava sobre isso, mas só ficar olhando para o mapa não estava funcionando. Então pensei: "e se eu fizesse um quiz onde eu *tenho* que clicar no lugar certo?". Aí nasceu isso aqui.

## Como funciona

O app carrega um arquivo GeoJSON com os polígonos de todos os bairros da cidade. Ele embaralha os nomes e vai pedindo um por um: "Clique em: Batel", "Clique em: Cajuru", etc.

- Acertou: o bairro fica verde e passa pro próximo
- Errou: o bairro pisca vermelho e você tenta de novo
- Quando acaba: mostra quanto tempo levou e a média de tentativas por bairro

Os bairros que já foram acertados mostram o nome quando você passa o mouse por cima, pra ir fixando na memória.

## Como rodar

Só abrir o `index.html` no navegador. Não precisa de servidor, npm, terminal, nada. É tudo estático.

Os arquivos são:

```
index.html              → estrutura da página
style.css               → visual (estilos)
script.js               → toda a lógica do quiz
neighborhoods.geojson   → os polígonos dos bairros
```

O único requisito é que o `neighborhoods.geojson` esteja na mesma pasta que o resto. Esse arquivo precisa ter features com uma propriedade `"name"` com o nome de cada bairro.

**Obs:** se você abrir o `index.html` direto do explorador de arquivos (com `file://`), o `fetch` do GeoJSON pode não funcionar por causa de restrições do navegador. Nesse caso, o jeito mais fácil é usar o Live Server do VS Code ou rodar `python -m http.server` na pasta.

## O que foi usado

- **HTML/CSS/JS** puro, sem framework nenhum
- **[Leaflet.js](https://leafletjs.com/)** pra renderizar o mapa e os polígonos (carregado por CDN)
- **CartoDB** como provedor dos tiles do mapa (a versão sem labels, pra não dar cola)

## Coisas que aprendi fazendo isso

- Como o Leaflet funciona: tiles, camadas, GeoJSON, estilos, eventos
- O algoritmo Fisher-Yates pra embaralhar arrays de forma justa
- Que `layer.off()` sozinho não basta pra desativar um polígono no Leaflet — precisa bloquear o evento no DOM também com `stopPropagation`
- Como usar `Set` pra rastrear coisas de forma eficiente (em vez de ficar fazendo `array.includes()`)
- Que existe tile layer sem texto (light_nolabels) — isso salvou o quiz inteiro

## Créditos

Os dados geográficos dos bairros vieram do repositório [kml-brasil](https://github.com/eduardo-veras/kml-brasil) do [eduardo-veras](https://github.com/eduardo-veras), que disponibiliza coordenadas de fronteiras de estados e municípios brasileiros em KML e JSON. Licença MIT.

## Limitações

Isso aqui é um projeto simples, então:

- Não tem placar salvo, não persiste nada
- Não tem responsividade refinada
- Se o GeoJSON tiver bairros com nomes duplicados, vai dar problema
- Zero testes, zero build, zero CI — é um HTML que você abre e joga