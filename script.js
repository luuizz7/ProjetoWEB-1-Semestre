// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', () => {

  // --- ROTEAMENTO E AUTENTICAÇÃO ---
  const paginaAtual = document.body.id;

  if (paginaAtual === 'app') {
      if (!localStorage.getItem('usuarioLogado')) {
          window.location.href = 'login.html';
          return;
      }
      inicializarApp();
  } else if (document.getElementById('login-form')) {
      inicializarLogin();
  }

});

// --- LÓGICA DA PÁGINA DE LOGIN ---
function inicializarLogin() {
  const loginForm = document.getElementById('login-form');
  const cadastroFormBtn = document.getElementById('btn-cadastrar');

  loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const senha = document.getElementById('senha').value;
      
      const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
      const usuario = usuarios.find(u => u.email === email && u.senha === senha);

      if (usuario) {
          localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
          window.location.href = 'index.html';
      } else {
          alert('Email ou senha inválidos!');
      }
  });

  cadastroFormBtn.addEventListener('click', () => {
      const nome = document.getElementById('cadastro-nome').value;
      const email = document.getElementById('cadastro-email').value;
      const senha = document.getElementById('cadastro-senha').value;

      if (!nome || !email || !senha) {
          alert('Por favor, preencha todos os campos.');
          return;
      }

      let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
      
      if (usuarios.some(u => u.email === email)) {
          alert('Este email já está registado.');
          return;
      }

      usuarios.push({ nome, email, senha });
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
      
      let bibliotecas = JSON.parse(localStorage.getItem('bibliotecas')) || {};
      bibliotecas[email] = [];
      localStorage.setItem('bibliotecas', JSON.stringify(bibliotecas));

      alert('Utilizador registado com sucesso! Faça o login.');
      const modal = bootstrap.Modal.getInstance(document.getElementById('modalCadastroUsuario'));
      modal.hide();
      loginForm.reset();
      document.getElementById('cadastro-form').reset();
  });
}


// --- LÓGICA DA PÁGINA PRINCIPAL (APP) ---
function inicializarApp() {
  listarLivros();
  atualizarCarrossel();

  document.getElementById('logout-btn').addEventListener('click', logout);
  document.getElementById('btn-salvar-perfil').addEventListener('click', salvarPerfil);
  document.getElementById('btn-excluir-conta').addEventListener('click', excluirConta);
  document.getElementById('modalPerfil').addEventListener('show.bs.modal', carregarPerfil);
  
  document.getElementById('filtro-nao-lidos').addEventListener('change', () => listarLivros());
  document.getElementById('filtro-lidos').addEventListener('change', () => listarLivros());

  const carouselElement = document.getElementById('carousel-header');
  if (carouselElement) {
      // A classe 'carousel-fade' já está no HTML.
      // Apenas inicializamos o carrossel para garantir que o intervalo de 5s funcione.
      new bootstrap.Carousel(carouselElement, {
          interval: 5000,
          ride: 'carousel'
      });
  }
}

// --- Funções de Livros ---

function getLivrosDoUsuario() {
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
  if (!usuarioLogado) return [];
  const bibliotecas = JSON.parse(localStorage.getItem('bibliotecas')) || {};
  return bibliotecas[usuarioLogado.email] || [];
}

function setLivrosDoUsuario(livros) {
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
  if (!usuarioLogado) return;
  let bibliotecas = JSON.parse(localStorage.getItem('bibliotecas')) || {};
  bibliotecas[usuarioLogado.email] = livros;
  localStorage.setItem('bibliotecas', JSON.stringify(bibliotecas));
}

function salvarLivro() {
  const titulo = document.getElementById('titulo').value;
  const autor = document.getElementById('autor').value;
  const ano = document.getElementById('ano').value;
  const genero = document.getElementById('genero').value;
  const imagemUrl = document.getElementById('imagemUrl').value;
  const index = document.getElementById('indexLivro').value;

  if (!titulo || !autor) {
      alert("Título e Autor são obrigatórios!");
      return;
  }

  let livros = getLivrosDoUsuario();
  const livro = { titulo, autor, ano, genero, imagemUrl, lido: false, nota: 0 };

  if (index === '') {
      livros.push(livro);
  } else {
      livro.lido = livros[index].lido;
      livro.nota = livros[index].nota;
      livros[index] = livro;
  }

  setLivrosDoUsuario(livros);
  listarLivros();
  atualizarCarrossel();
  bootstrap.Modal.getInstance(document.getElementById('modalLivro')).hide();
}

function listarLivros() {
  const container = document.getElementById('listaLivros');
  container.innerHTML = '';
  const livros = getLivrosDoUsuario();
  const filtroLidos = document.getElementById('filtro-lidos').checked;

  const livrosFiltrados = livros.filter(livro => filtroLidos ? livro.lido : !livro.lido);

  if (livrosFiltrados.length === 0) {
      container.innerHTML = `<p class="text-muted">Nenhum livro encontrado.</p>`;
      return;
  }

  livrosFiltrados.forEach((livro) => {
      const originalIndex = livros.findIndex(l => l === livro);
      const card = document.createElement('div');
      card.className = 'col-sm-6 col-md-4 col-lg-3 mb-4';
      
      const ratingHTML = livro.lido ? `
          <div class="rating-stars text-center mb-2">
              ${renderEstrelas(livro.nota, originalIndex)}
          </div>
      ` : '';

      const actionButtons = livro.lido ? `
          <button class="btn btn-sm btn-outline-secondary" onclick="marcarComoNaoLido(${originalIndex})"><i class="bi bi-book"></i> Marcar como Não Lido</button>
          <button class="btn btn-sm btn-outline-danger" onclick="excluirLivroPermanente(${originalIndex})"><i class="bi bi-trash"></i> Excluir</button>
      ` : `
          <button class="btn btn-sm btn-outline-primary" onclick="editarLivro(${originalIndex})"><i class="bi bi-pencil"></i> Editar</button>
          <button class="btn btn-sm btn-outline-success" onclick="marcarComoLido(${originalIndex})"><i class="bi bi-check-circle"></i> Marcar como Lido</button>
      `;

      card.innerHTML = `
          <div class="card h-100">
              ${livro.imagemUrl ? `<img src="${livro.imagemUrl}" class="card-img-top" alt="Capa de ${livro.titulo}" style="height: 200px; object-fit: cover;" onerror="this.style.display='none'">` : ''}
              <div class="card-body d-flex flex-column">
                  <h5 class="card-title">${livro.titulo}</h5>
                  <p class="card-text text-muted">${livro.autor}</p>
                  <ul class="list-unstyled mt-3 mb-4 flex-grow-1">
                      <li><strong>Ano:</strong> ${livro.ano || 'N/A'}</li>
                      <li><strong>Gênero:</strong> ${livro.genero || 'N/A'}</li>
                  </ul>
                  ${ratingHTML}
              </div>
              <div class="card-footer text-center">
                  ${actionButtons}
              </div>
          </div>
      `;
      container.appendChild(card);
  });
}

function renderEstrelas(nota, index) {
  let estrelasHTML = '';
  for (let i = 1; i <= 5; i++) {
      const classeEstrela = i <= nota ? 'bi-star-fill text-warning' : 'bi-star';
      estrelasHTML += `<i class="bi ${classeEstrela}" style="cursor: pointer;" onclick="darNota(${index}, ${i})"></i> `;
  }
  return estrelasHTML;
}

function darNota(index, nota) {
  let livros = getLivrosDoUsuario();
  livros[index].nota = nota;
  setLivrosDoUsuario(livros);
  listarLivros();
}

function atualizarCarrossel() {
  const carouselInner = document.getElementById('carousel-livros-inner');
  carouselInner.innerHTML = '';
  const livrosComImagem = getLivrosDoUsuario().filter(livro => livro.imagemUrl && livro.lido === false);

  if (livrosComImagem.length > 0) {
      livrosComImagem.forEach((livro, index) => {
          const item = document.createElement('div');
          item.className = `carousel-item ${index === 0 ? 'active' : ''}`;
          item.innerHTML = `
              <img src="${livro.imagemUrl}" class="d-block w-100" alt="Capa de ${livro.titulo}" onerror="this.src='https://placehold.co/1200x500/343a40/ffffff?text=Imagem+inválida'">
              <div class="carousel-caption d-none d-md-block">
                  <h5>${livro.titulo}</h5>
                  <p>${livro.autor}</p>
              </div>
          `;
          carouselInner.appendChild(item);
      });
  } else {
      carouselInner.innerHTML = `
          <div class="carousel-item active">
              <img src="https://placehold.co/1200x500/343a40/ffffff?text=Sua+Biblioteca+Virtual" class="d-block w-100" alt="Banner da biblioteca">
              <div class="carousel-caption d-none d-md-block">
                  <h5>Bem-vindo à sua Biblioteca</h5>
                  <p>Adicione livros com imagens para os ver aqui!</p>
              </div>
          </div>
      `;
  }
}

function abrirModalLivro() {
  document.getElementById('modalLivroTitulo').innerText = 'Adicionar Livro';
  document.getElementById('indexLivro').value = '';
  document.getElementById('titulo').value = '';
  document.getElementById('autor').value = '';
  document.getElementById('ano').value = '';
  document.getElementById('genero').value = '';
  document.getElementById('imagemUrl').value = '';
  new bootstrap.Modal(document.getElementById('modalLivro')).show();
}

function editarLivro(index) {
  const livros = getLivrosDoUsuario();
  const livro = livros[index];
  document.getElementById('modalLivroTitulo').innerText = 'Editar Livro';
  document.getElementById('indexLivro').value = index;
  document.getElementById('titulo').value = livro.titulo;
  document.getElementById('autor').value = livro.autor;
  document.getElementById('ano').value = livro.ano;
  document.getElementById('genero').value = livro.genero;
  document.getElementById('imagemUrl').value = livro.imagemUrl || '';
  new bootstrap.Modal(document.getElementById('modalLivro')).show();
}

function marcarComoLido(index) {
  let livros = getLivrosDoUsuario();
  livros[index].lido = true;
  setLivrosDoUsuario(livros);
  listarLivros();
  atualizarCarrossel();
}

function marcarComoNaoLido(index) {
  let livros = getLivrosDoUsuario();
  livros[index].lido = false;
  livros[index].nota = 0; // Reseta a nota
  setLivrosDoUsuario(livros);
  listarLivros();
  atualizarCarrossel();
}

function excluirLivroPermanente(index) {
  if (confirm('Atenção! Esta ação é irreversível. Deseja excluir permanentemente este livro?')) {
      let livros = getLivrosDoUsuario();
      livros.splice(index, 1);
      setLivrosDoUsuario(livros);
      listarLivros();
      atualizarCarrossel();
  }
}

// --- Funções de Utilizador e Autenticação ---

function carregarPerfil() {
  const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
  document.getElementById('perfil-nome').value = usuario.nome;
  document.getElementById('perfil-email').value = usuario.email;
  document.getElementById('perfil-senha').value = '';
}

function salvarPerfil() {
  const nome = document.getElementById('perfil-nome').value;
  const novaSenha = document.getElementById('perfil-senha').value;
  
  let usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
  let usuarios = JSON.parse(localStorage.getItem('usuarios'));
  const indexUsuario = usuarios.findIndex(u => u.email === usuarioLogado.email);

  if (indexUsuario > -1) {
      usuarios[indexUsuario].nome = nome;
      if (novaSenha) {
          usuarios[indexUsuario].senha = novaSenha;
      }
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
      localStorage.setItem('usuarioLogado', JSON.stringify(usuarios[indexUsuario]));
      alert('Perfil atualizado com sucesso!');
      bootstrap.Modal.getInstance(document.getElementById('modalPerfil')).hide();
  }
}

function excluirConta() {
  if (confirm('Tem a certeza que deseja excluir a sua conta? Todos os seus dados, incluindo a lista de livros, serão perdidos permanentemente.')) {
      let usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
      let usuarios = JSON.parse(localStorage.getItem('usuarios'));
      const usuariosAtualizados = usuarios.filter(u => u.email !== usuarioLogado.email);
      localStorage.setItem('usuarios', JSON.stringify(usuariosAtualizados));
      let bibliotecas = JSON.parse(localStorage.getItem('bibliotecas'));
      delete bibliotecas[usuarioLogado.email];
      localStorage.setItem('bibliotecas', JSON.stringify(bibliotecas));
      logout();
  }
}

function logout() {
  localStorage.removeItem('usuarioLogado');
  window.location.href = 'login.html';
}