// --- Frases rotativas ---
const frases = [
  'Você é meu sonho realizado 💖',
  'Cada dia com você é especial 🌹',
  'Nosso amor é infinito ✨',
  'Te amo mais a cada segundo ❤️',
  'Você ilumina minha vida 💡',
];

let indiceFrase = 0;
const fraseAmorEl = document.getElementById('frase-amor');

function trocarFrase() {
  fraseAmorEl.textContent = frases[indiceFrase];
  indiceFrase = (indiceFrase + 1) % frases.length;
}

setInterval(trocarFrase, 6000);
window.onload = () => {
  trocarFrase();
  atualizarContador();
  iniciarMemoria();
  montarQuiz();
  iniciarCorações();
  iniciarQuebraCabeca();
};

// --- Contador regressivo desde 06/04/2025 15:30:00 ---
function atualizarContador() {
  const dataInicio = new Date('2025-04-06T15:30:00');
  const agora = new Date();

  let diff = agora - dataInicio; // diferença em ms

  if (diff < 0) {
    document.getElementById('contador').textContent = 'Ainda não começou!';
    return;
  }

  const segundos = Math.floor(diff / 1000) % 60;
  const minutos = Math.floor(diff / (1000 * 60)) % 60;
  const horas = Math.floor(diff / (1000 * 60 * 60)) % 24;
  const dias = Math.floor(diff / (1000 * 60 * 60 * 24));

  document.getElementById('contador').textContent =
    `${dias} dias ${horas}h ${minutos}m ${segundos}s`;
}

setInterval(atualizarContador, 1000);

// --- Corações caindo ---
function criarCoracao() {
  const heart = document.createElement('div');
  heart.classList.add('heart');
  heart.style.position = 'fixed';
  heart.style.left = Math.random() * window.innerWidth + 'px';
  heart.style.top = '-30px';
  heart.style.fontSize = (10 + Math.random() * 20) + 'px';
  heart.style.color = '#ff4d6d';
  heart.style.zIndex = '9999';
  heart.style.userSelect = 'none';
  heart.style.pointerEvents = 'none';
  heart.textContent = '❤️';

  document.getElementById('hearts-container').appendChild(heart);

  const velocidade = 1 + Math.random() * 3;
  let posY = -30;

  function animar() {
    if (posY > window.innerHeight) {
      heart.remove();
      return;
    }
    posY += velocidade;
    heart.style.top = posY + 'px';
    requestAnimationFrame(animar);
  }
  animar();
}

function iniciarCorações() {
  setInterval(criarCoracao, 400);
}

// --- Quebra-cabeça ---
const canvas = document.getElementById('quebra-cabeca');
const ctx = canvas.getContext('2d');

// Imagem da pasta do site
const img = new Image();
img.src = 'imagens/KellyDeSally.jpg';

// Configurações do quebra-cabeça
const rows = 4;
const cols = 4;
const pieces = [];

let pieceWidth, pieceHeight;
let selectedPiece = null;
let isDragging = false;
let offsetX, offsetY;

img.onload = () => {
  // Redimensionar proporcionalmente para no máximo 600px de largura
  const maxWidth = 600;
  const scale = img.width > maxWidth ? maxWidth / img.width : 1;

  const resizedWidth = img.width * scale;
  const resizedHeight = img.height * scale;

  canvas.width = resizedWidth;
  canvas.height = resizedHeight;

  pieceWidth = canvas.width / cols;
  pieceHeight = canvas.height / rows;

  iniciarPecas();
  desenharPecas();
};

function iniciarPecas() {
  pieces.length = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      pieces.push({
        sx: c * pieceWidth / (canvas.width / img.width),
        sy: r * pieceHeight / (canvas.height / img.height),
        x: c * pieceWidth,
        y: r * pieceHeight,
        correctX: c * pieceWidth,
        correctY: r * pieceHeight,
      });
    }
  }
}

function desenharPecas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  pieces.forEach((p) => {
    ctx.drawImage(
      img,
      p.sx, p.sy,
      img.width / cols, img.height / rows,
      p.x, p.y,
      pieceWidth, pieceHeight
    );
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.strokeRect(p.x, p.y, pieceWidth, pieceHeight);
  });
}

function embaralharPecas() {
  for (let i = pieces.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pieces[i].x, pieces[j].x] = [pieces[j].x, pieces[i].x];
    [pieces[i].y, pieces[j].y] = [pieces[j].y, pieces[i].y];
  }
  desenharPecas();
}

canvas.addEventListener('mousedown', (e) => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  selectedPiece = null;
  for (let i = pieces.length - 1; i >= 0; i--) {
    const p = pieces[i];
    if (
      mx > p.x && mx < p.x + pieceWidth &&
      my > p.y && my < p.y + pieceHeight
    ) {
      selectedPiece = p;
      offsetX = mx - p.x;
      offsetY = my - p.y;
      isDragging = true;
      break;
    }
  }
});

canvas.addEventListener('mousemove', (e) => {
  if (!isDragging || !selectedPiece) return;
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  selectedPiece.x = mx - offsetX;
  selectedPiece.y = my - offsetY;
  desenharPecas();
});

canvas.addEventListener('mouseup', () => {
  if (!isDragging || !selectedPiece) return;
  isDragging = false;
  selectedPiece = null;
});

document.getElementById('btn-embaralhar').addEventListener('click', embaralharPecas);


 

canvas.addEventListener('mouseup', () => {
  if (!isDragging || !selectedPiece) return;

  // Snap to nearest grid position
  selectedPiece.x = Math.round(selectedPiece.x / pieceWidth) * pieceWidth;
  selectedPiece.y = Math.round(selectedPiece.y / pieceHeight) * pieceHeight;
  desenharPecas();
  isDragging = false;
  selectedPiece = null;
});

document.getElementById('btn-embaralhar').addEventListener('click', () => {
  embaralharPecas();
});

// --- Quiz ---
const perguntas = [
  {
    pergunta: 'Qual é minha série favorita?',
    correta: 'Dexter',
  },
  {
    pergunta: 'Qual personagem do filme "Carros" eu mais gosto?',
    correta: 'McQueen',
  },
  {
    pergunta: 'Qual personagem de Star Wars eu prefiro?',
    correta: 'Anakin',
  },
  {
    pergunta: 'Quem é o personagem favorito de Outer Banks?',
    correta: 'JJ Maybank',
  },
  {
    pergunta: 'Qual sua cor favorita?', // Pergunta para Riquele, não conta para nota
    correta: 'Vermelho',
    naoConta: true,
  },
  {
    pergunta: 'Qual seu prato preferido?', // Pergunta para Riquele, não conta para nota
    correta: 'Lasanha',
    naoConta: true,
  },
];

// Função para criar alternativas com 3 erradas + correta embaralhadas
function criarAlternativas(correta) {
  const opcoesErradas = [
    'Batman',
    'Homem-Aranha',
    'Vingadores',
    'Pikachu',
    'Mario',
    'Rosa',
    'Azul',
    'Verde',
    'Pizza',
    'Sushi',
    'Hambúrguer',
    'Spaghetti',
  ];

  // Filtra para não repetir a correta
  const alternativas = [];
  while (alternativas.length < 3) {
    const aleatorio =
      opcoesErradas[Math.floor(Math.random() * opcoesErradas.length)];
    if (
      aleatorio.toLowerCase() !== correta.toLowerCase() &&
      !alternativas.includes(aleatorio)
    ) {
      alternativas.push(aleatorio);
    }
  }
  alternativas.push(correta);

  // Embaralha
  return alternativas.sort(() => Math.random() - 0.5);
}

function montarQuiz() {
  const quizDiv = document.getElementById('quiz');
  quizDiv.innerHTML = '';

  perguntas.forEach((p, idx) => {
    const divPergunta = document.createElement('div');
    divPergunta.classList.add('pergunta');

    const pTexto = document.createElement('p');
    pTexto.textContent = `${idx + 1}. ${p.pergunta}`;
    divPergunta.appendChild(pTexto);

    const alternativas = criarAlternativas(p.correta);
    alternativas.forEach((alt) => {
      const label = document.createElement('label');
      label.style.display = 'block';

      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = 'q' + idx;
      radio.value = alt;

      label.appendChild(radio);
      label.appendChild(document.createTextNode(alt));
      divPergunta.appendChild(label);
    });

    quizDiv.appendChild(divPergunta);
  });
}

document.getElementById('btn-verificar').addEventListener('click', () => {
  let acertos = 0;
  let total = 0;

  perguntas.forEach((p, idx) => {
    if (p.naoConta) return; // Ignorar perguntas para Riquele no resultado

    total++;
    const radios = document.getElementsByName('q' + idx);
    let respostaUsuario = null;

    for (const r of radios) {
      if (r.checked) {
        respostaUsuario = r.value;
        break;
      }
    }

    if (respostaUsuario === p.correta) acertos++;
  });

  const resultadoEl = document.getElementById('resultado-quiz');
  resultadoEl.textContent = `Você acertou ${acertos} de ${total} perguntas válidas!`;
});

// --- Jogo da memória ---
const palavrasMemoria = [
  'Amor', 'Beijo', 'Carinho', 'Abraço',
  'Paixão', 'Sonho', 'Vida', 'Felicidade',
];

let memoriaCartas = [];
let cartasViradas = [];
let bloqueado = false;

function iniciarMemoria() {
  const memoriaGrid = document.getElementById('memoria-jogo');
  memoriaGrid.innerHTML = '';

  memoriaCartas = [];

  // Criar pares e embaralhar
  const pares = [...palavrasMemoria, ...palavrasMemoria];
  pares.sort(() => Math.random() - 0.5);

  pares.forEach((palavra, i) => {
    const carta = document.createElement('div');
    carta.classList.add('carta-memoria');
    carta.style.width = '80px';
    carta.style.height = '80px';
    carta.style.backgroundColor = '#222';
    carta.style.color = '#ff4d6d';
    carta.style.display = 'flex';
    carta.style.justifyContent = 'center';
    carta.style.alignItems = 'center';
    carta.style.fontWeight = '700';
    carta.style.fontSize = '1rem';
    carta.style.borderRadius = '10px';
    carta.style.cursor = 'pointer';
    carta.textContent = '';
    carta.dataset.valor = palavra;
    carta.dataset.index = i;

    carta.addEventListener('click', virarCarta);

    memoriaGrid.appendChild(carta);
    memoriaCartas.push(carta);
  });
}

function virarCarta(e) {
  if (bloqueado) return;
  const carta = e.currentTarget;
  if (cartasViradas.includes(carta)) return;

  carta.textContent = carta.dataset.valor;
  cartasViradas.push(carta);

  if (cartasViradas.length === 2) {
    bloquearJogadas(true);
    setTimeout(() => {
      checarPar();
      bloquearJogadas(false);
    }, 1000);
  }
}

function bloquearJogadas(valor) {
  bloqueado = valor;
}

function checarPar() {
  const [carta1, carta2] = cartasViradas;
  if (carta1.dataset.valor === carta2.dataset.valor) {
    carta1.style.backgroundColor = '#ff4d6d';
    carta2.style.backgroundColor = '#ff4d6d';
    carta1.style.cursor = 'default';
    carta2.style.cursor = 'default';
    carta1.removeEventListener('click', virarCarta);
    carta2.removeEventListener('click', virarCarta);
  } else {
    carta1.textContent = '';
    carta2.textContent = '';
  }
  cartasViradas = [];

  // Verificar se terminou
  if (memoriaCartas.every(c => c.textContent !== '')) {
    alert('Parabéns! Você completou o jogo da memória ❤️');
    iniciarMemoria();
  }
}

// --- Mural de recados ---
const usuarios = {
  nattan: '0604',
  kelly: '0604',
};

const loginForm = document.getElementById('login-form');
const mural = document.getElementById('mural');
const msgLogin = document.getElementById('msg-login');
const btnLogin = document.getElementById('btn-login');
const btnPostar = document.getElementById('btn-postar');
const historicoRecados = document.getElementById('historico-recados');
const recadoInput = document.getElementById('recado');

let usuarioLogado = null;

btnLogin.addEventListener('click', () => {
  const user = document.getElementById('usuario').value.toLowerCase();
  const senha = document.getElementById('senha').value;

  if (usuarios[user] && usuarios[user] === senha) {
    usuarioLogado = user;
    msgLogin.textContent = `Bem-vindo(a), ${user}!`;
    loginForm.style.display = 'none';
    mural.style.display = 'block';
    carregarRecados();
  } else {
    msgLogin.textContent = 'Usuário ou senha incorretos.';
  }
});

btnPostar.addEventListener('click', () => {
  if (!usuarioLogado) return;

  const texto = recadoInput.value.trim();
  if (!texto) return alert('Digite um recado antes de postar.');

  let recados = JSON.parse(localStorage.getItem('recados') || '[]');
  recados.push({
    usuario: usuarioLogado,
    texto,
    data: new Date().toLocaleString('pt-BR'),
  });
  localStorage.setItem('recados', JSON.stringify(recados));
  recadoInput.value = '';
  carregarRecados();
});

function carregarRecados() {
  const recados = JSON.parse(localStorage.getItem('recados') || '[]');
  historicoRecados.innerHTML = '';
  recados.forEach(r => {
    const div = document.createElement('div');
    div.style.borderBottom = '1px solid #ff4d6d';
    div.style.marginBottom = '6px';
    div.style.paddingBottom = '6px';
    div.innerHTML = `<strong>${r.usuario}:</strong> ${r.texto} <br/><small>${r.data}</small>`;
    historicoRecados.appendChild(div);
  });
}