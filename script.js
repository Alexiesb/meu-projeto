/**
 * script.js — Gatinhos Aleatórios
 *
 * Funcionalidades:
 *  - Busca uma imagem aleatória de gato na The Cat API
 *  - Exibe loading, erro e imagem carregada
 *  - Conta quantas imagens o usuário visitou
 *  - Permite "salvar" a imagem (abre em nova aba)
 */

// ── Seletores ──────────────────────────────────────────────
const fetchBtn      = document.getElementById('fetchBtn');
const downloadBtn   = document.getElementById('downloadBtn');
const catImage      = document.getElementById('catImage');
const placeholder   = document.getElementById('placeholder');
const loading       = document.getElementById('loading');
const errorMessage  = document.getElementById('errorMessage');
const countNumber   = document.getElementById('countNumber');

// ── Estado ─────────────────────────────────────────────────
let count = 0;
let currentImageUrl = '';

// ── URL da API ─────────────────────────────────────────────
const CAT_API_URL = 'https://api.thecatapi.com/v1/images/search';

// ── Funções de UI ──────────────────────────────────────────

/** Mostra o estado de carregamento */
function mostrarLoading() {
  placeholder.classList.add('hidden');
  catImage.classList.add('hidden');
  errorMessage.classList.add('hidden');
  downloadBtn.classList.add('hidden');
  loading.classList.remove('hidden');
  fetchBtn.disabled = true;
}

/** Mostra a imagem carregada */
function mostrarImagem(url) {
  loading.classList.add('hidden');
  errorMessage.classList.add('hidden');
  catImage.src = url;
  catImage.classList.remove('hidden');
  downloadBtn.classList.remove('hidden');
  fetchBtn.disabled = false;
  currentImageUrl = url;
}

/** Mostra mensagem de erro */
function mostrarErro() {
  loading.classList.add('hidden');
  catImage.classList.add('hidden');
  downloadBtn.classList.add('hidden');
  placeholder.classList.remove('hidden');
  errorMessage.classList.remove('hidden');
  fetchBtn.disabled = false;
}

/** Incrementa o contador de gatinhos visitados */
function incrementarContador() {
  count += 1;
  countNumber.textContent = count;
}

// ── Função principal: buscar gatinho ──────────────────────

async function buscarGatinho() {
  mostrarLoading();

  try {
    const resposta = await fetch(CAT_API_URL);

    if (!resposta.ok) {
      throw new Error(`Erro HTTP: ${resposta.status}`);
    }

    const dados = await resposta.json();

    // A API retorna um array; pegamos o primeiro item
    const url = dados[0]?.url;

    if (!url) {
      throw new Error('URL da imagem não encontrada na resposta.');
    }

    // Pré-carrega a imagem antes de exibir
    const img = new Image();
    img.onload = () => {
      mostrarImagem(url);
      incrementarContador();
    };
    img.onerror = () => {
      mostrarErro();
    };
    img.src = url;

  } catch (erro) {
    console.error('Falha ao buscar gatinho:', erro);
    mostrarErro();
  }
}

// ── Salvar imagem ──────────────────────────────────────────

function salvarImagem() {
  if (!currentImageUrl) return;
  // Abre a imagem em uma nova aba (download direto pode ser bloqueado por CORS)
  window.open(currentImageUrl, '_blank', 'noopener,noreferrer');
}

// ── Eventos ────────────────────────────────────────────────

fetchBtn.addEventListener('click', buscarGatinho);
downloadBtn.addEventListener('click', salvarImagem);

// Atalho de teclado: pressionar Enter/Espaço no botão principal
fetchBtn.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    buscarGatinho();
  }
});
