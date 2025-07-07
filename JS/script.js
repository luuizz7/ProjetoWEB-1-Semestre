// espera a página carregar para começar a rodar o código
document.addEventListener('DOMContentLoaded', () => {

    //verificação e login
    // esta parte verifica se o usuário ta logado
    // se não estiver ele manda dnv para a tela de login
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
  
  // pagina de login
  function inicializarLogin() {
    const loginForm = document.getElementById('login-form');
    const cadastroFormBtn = document.getElementById('btn-cadastrar');
  
    // quando o usuário tenta entrar
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;
        
        // pega os usuários salvos no navegador e procura um que seja compatível com o email e senha
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        const usuario = usuarios.find(u => u.email === email && u.senha === senha);
  
        if (usuario) {
            // se encontrar o usuário salva que ele está logado e vai para a página principal
            localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
            window.location.href = 'index.html';
        } else {
            alert('Email ou senha inválidos!');
        }
    });
  
    // função para quando o usuário se cadastra
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
  
        // importante: aqui o novo usuário e sua biblioteca são salvos no navegador (localstorage)
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
  
  
  // tela principal
  // esta função inicia tudo na página principal
  function inicializarApp() {
    listarLivros();
    atualizarCarrossel();
  
    document.getElementById('logout-btn').addEventListener('click', logout);
    document.getElementById('btn-salvar-perfil').addEventListener('click', salvarPerfil);
    document.getElementById('btn-excluir-conta').addEventListener('click', excluirConta);
    document.getElementById('modalPerfil').addEventListener('show.bs.modal', carregarPerfil);
    
    document.getElementById('filtro-nao-lidos').addEventListener('change', () => listarLivros());
    document.getElementById('filtro-lidos').addEventListener('change', () => listarLivros());
  }
  
  // funcao dos livros
  
  // estas duas funcoes pegam e salvam a lista de livros no navegador
  // elas permitem que cada usuário só veja os seus próprios livros (localstorage)
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
  
  // funcao para salvar um livro novo ou editado
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
    const livro = { titulo, autor, ano, genero, imagemUrl, lido: false, anotacao: '' };
  
    if (index === '') {
        // se não tem index é um livro novo
        livros.push(livro);
    } else {
        // se tem um index está editando um livro existente
        livro.lido = livros[index].lido;
        livro.anotacao = livros[index].anotacao;
        livros[index] = livro;
    }
  
    // salva a lista de livros atualizada e redesenha a tela
    setLivrosDoUsuario(livros);
    listarLivros();
    atualizarCarrossel();
    bootstrap.Modal.getInstance(document.getElementById('modalLivro')).hide();
  }
  
  // ela pega a lista de livros e cria o html de cada card para mostrar na tela
  function listarLivros() {
    const container = document.getElementById('listaLivros');
    container.innerHTML = ''; // limpa a lista antes de adicionar os livros de novo
    const livros = getLivrosDoUsuario();
    const filtroLidos = document.getElementById('filtro-lidos').checked;
  
    const livrosFiltrados = livros.filter(livro => filtroLidos ? livro.lido : !livro.lido);
  
    if (livrosFiltrados.length === 0) {
        container.innerHTML = `<p class="text-muted">Nenhum livro encontrado.</p>`;
        return;
    }
  
    //  cada livro na lista cria um card de html e insere na página
    livrosFiltrados.forEach((livro) => {
        const originalIndex = livros.findIndex(l => l === livro);
        const card = document.createElement('div');
        card.className = 'col-sm-6 col-md-4 col-lg-3 mb-4';
        
        const anotacaoHTML = livro.lido && livro.anotacao ? `
            <div class="mt-3 pt-3 border-top">
                <p class="card-text mb-1"><strong>Minha Anotação:</strong></p>
                <p class="card-text fst-italic">"${livro.anotacao}"</p>
            </div>
        ` : '';
  
        const actionButtons = livro.lido ? `
            <button class="btn btn-sm btn-outline-primary" onclick="abrirModalAnotacao(${originalIndex})"><i class="bi bi-pencil-square"></i> Editar Anotação</button>
            <button class="btn btn-sm btn-outline-secondary" onclick="marcarComoNaoLido(${originalIndex})"><i class="bi bi-book"></i> Marcar como Não Lido</button>
            <button class="btn btn-sm btn-outline-danger mt-2" onclick="excluirLivroPermanente(${originalIndex})"><i class="bi bi-trash"></i> Excluir</button>
        ` : `
            <button class="btn btn-sm btn-outline-primary" onclick="editarLivro(${originalIndex})"><i class="bi bi-pencil"></i> Editar</button>
            <button class="btn btn-sm btn-outline-success" onclick="abrirModalAnotacao(${originalIndex})"><i class="bi bi-check-circle"></i> Marcar como Lido</button>
        `;
  
        // html do card do livro
        card.innerHTML = `
            <div class="card h-100">
                ${livro.imagemUrl ? `<img src="${livro.imagemUrl}" class="card-img-top" alt="Capa de ${livro.titulo}" style="height: 200px; object-fit: cover;" onerror="this.src='https://placehold.co/400x200/cccccc/ffffff?text=Sem+Imagem'">` : ''}
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${livro.titulo}</h5>
                    <p class="card-text text-muted">${livro.autor}</p>
                    <ul class="list-unstyled mt-3 mb-4 flex-grow-1">
                        <li><strong>Ano:</strong> ${livro.ano || 'N/A'}</li>
                        <li><strong>Gênero:</strong> ${livro.genero || 'N/A'}</li>
                    </ul>
                    ${anotacaoHTML}
                </div>
                <div class="card-footer text-center">
                    <div class="d-grid gap-2">
                      ${actionButtons}
                    </div>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
  }
  
  //atualiza as imagens que aparecem no carrossel do topo
  function atualizarCarrossel() {
    const carouselInner = document.getElementById('carousel-livros-inner');
    const carouselElement = document.getElementById('carousel-header');
  
    const existingInstance = bootstrap.Carousel.getInstance(carouselElement);
    if (existingInstance) {
      existingInstance.dispose();
    }
    
    carouselInner.innerHTML = '';
    const livrosComImagem = getLivrosDoUsuario().filter(livro => livro.imagemUrl && !livro.lido);
  
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
  
        new bootstrap.Carousel(carouselElement, {
          interval: 5000,
          ride: 'carousel'
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
  
  function abrirModalAnotacao(index) {
      const livros = getLivrosDoUsuario();
      const livro = livros[index];
      document.getElementById('anotacao-livro-index').value = index;
      document.getElementById('anotacao-texto').value = livro.anotacao || '';
      new bootstrap.Modal(document.getElementById('modalAnotacao')).show();
  }
  
  function salvarAnotacao() {
      const index = document.getElementById('anotacao-livro-index').value;
      const anotacao = document.getElementById('anotacao-texto').value;
      let livros = getLivrosDoUsuario();
  
      if (index !== '' && livros[index]) {
          livros[index].lido = true;
          livros[index].anotacao = anotacao;
          setLivrosDoUsuario(livros);
          listarLivros();
          atualizarCarrossel();
          bootstrap.Modal.getInstance(document.getElementById('modalAnotacao')).hide();
      }
  }
  
  function marcarComoNaoLido(index) {
    let livros = getLivrosDoUsuario();
    livros[index].lido = false;
    livros[index].anotacao = '';
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
  
  // função para sair da conta
  function logout() {
    localStorage.removeItem('usuarioLogado');
    window.location.href = 'login.html';
  }