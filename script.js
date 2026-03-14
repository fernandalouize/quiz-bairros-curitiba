const mapa = L.map('map').setView([-25.44, -49.27], 12);

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
}).addTo(mapa);

const estiloPadrao = {
  color: '#555',
  weight: 1,
  fillColor: '#ccc',
  fillOpacity: 0.4
};

const estiloCerto = {
  color: '#27ae60',
  weight: 2,
  fillColor: '#2ecc71',
  fillOpacity: 0.5
};

let bairros = [];
let perguntaAtual = 0;
let camadaMapa;
let dadosBrutos;
let tentativasTotal = 0;
let comecouEm;

function embaralhar(lista) {
  for (let i = lista.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [lista[i], lista[j]] = [lista[j], lista[i]];
  }
}

function atualizarPergunta() {
  const texto = document.getElementById('prompt');
  if (perguntaAtual >= bairros.length) {
    texto.textContent = 'Parabens! Voce completou o mapa!';
    mostrarResultados();
  } else {
    texto.textContent = 'Clique em: ' + bairros[perguntaAtual];
  }
}

function formatarTempo(ms) {
  const totalSeg = Math.floor(ms / 1000);
  const min = Math.floor(totalSeg / 60);
  const seg = totalSeg % 60;
  if (min === 0) return seg + 's';
  return min + 'min ' + seg + 's';
}

function mostrarResultados() {
  const tempoTotal = Date.now() - comecouEm;
  const media = (tentativasTotal / bairros.length).toFixed(2);
  document.getElementById('stat-avg').textContent = media;
  document.getElementById('stat-time').textContent = formatarTempo(tempoTotal);
  document.getElementById('overlay').classList.add('visible');
}

function comecarQuiz() {
  document.getElementById('overlay').classList.remove('visible');

  if (camadaMapa) {
    mapa.removeLayer(camadaMapa);
  }

  bairros = dadosBrutos.features.map(f => f.properties.name);
  embaralhar(bairros);
  perguntaAtual = 0;
  tentativasTotal = 0;
  comecouEm = Date.now();

  const jaAcertou = new Set();

  camadaMapa = L.geoJSON(dadosBrutos, {
    style: () => estiloPadrao,
    onEachFeature: (pedaco, camada) => {
      camada.on('click', () => {
        if (perguntaAtual >= bairros.length) return;

        const clicou = pedaco.properties.name;

        if (jaAcertou.has(clicou)) return;

        tentativasTotal++;

        if (clicou === bairros[perguntaAtual]) {
          camada.setStyle(estiloCerto);
          jaAcertou.add(clicou);

          camada.off();
          const elemento = camada.getElement();
          elemento.classList.add('completed');
          elemento.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
          }, true);

          camada.bindTooltip(clicou, {
            sticky: true,
            className: 'neighborhood-tooltip'
          });

          perguntaAtual++;
          atualizarPergunta();
        } else {
          camada.setStyle({ fillColor: '#e74c3c', fillOpacity: 0.6, color: '#c0392b', weight: 2 });
          setTimeout(() => {
            if (!jaAcertou.has(clicou)) {
              camada.setStyle(estiloPadrao);
            }
          }, 400);
        }
      });
    }
  }).addTo(mapa);

  mapa.fitBounds(camadaMapa.getBounds());
  atualizarPergunta();
}

document.getElementById('restart-btn').addEventListener('click', comecarQuiz);

fetch('neighborhoods.geojson')
  .then(res => res.json())
  .then(dados => {
    dadosBrutos = dados;
    comecarQuiz();
  });
