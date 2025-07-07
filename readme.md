x# Biblioteca Pessoal Virtual 📚

Bem-vindo à **Biblioteca Pessoal Virtual**! Esta é uma aplicação web elegante e funcional, construída com HTML, CSS e JavaScript, que permite criar e gerenciar sua própria coleção de livros. Com ela, você pode salvar os livros que já leu, com anotações, e também os que deseja ler.

### 👨‍🏫 Professores responsáveis
Ariadne Arrais Cruz, Sostenes Pereira Gomes

---

### ✨ Funcionalidades Principais

* **Autenticação Local com `localStorage`**: Crie sua conta ou faça login de forma rápida. Seus dados de usuário e sua biblioteca ficam salvos diretamente no seu navegador.
* **Adicione e Edite Livros Facilmente**: Com um clique no botão `+ Adicionar Livro`, um formulário intuitivo (modal) permite que você cadastre novos livros, adicionando informações como título, autor, ano, gênero e a URL da capa.
* **Galeria de Livros Personalizada**: Seus livros são exibidos em cards na tela inicial. É possível filtrar a visualização entre "Lidos" e "Não Lidos".
* **Destaque Visual com Carrossel**: Os livros da sua lista "Não Lidos" que possuem uma imagem de capa são exibidos em um carrossel rotativo no topo da página.
* **Gerenciamento de Leitura e Anotações**: Marque livros como lidos e adicione anotações pessoais sobre o que achou da leitura. Você pode editar ou remover essas anotações a qualquer momento.
* **Gerenciamento de Perfil**: Altere seu nome de usuário e senha ou, se desejar, exclua sua conta e todos os dados associados permanentemente.
* **Design Moderno e Responsivo**: O app utiliza Bootstrap para garantir uma experiência de uso agradável e adaptável a diferentes tamanhos de tela, de desktops a celulares.

---

### 🚀 Como o Projeto Funciona?

A aplicação funciona como uma *Single Page Application (SPA)*, onde o JavaScript manipula o DOM dinamicamente para exibir as informações e lidar com as interações do usuário sem a necessidade de recarregar a página. Todos os dados são armazenados localmente no navegador através da `Web Storage API (localStorage)`.

#### Estrutura dos Arquivos

* `index.html`: A página principal da aplicação, onde a lista de livros do usuário é exibida. Contém a estrutura para a barra de navegação, carrossel, a grade de livros e todos os modais (adicionar/editar livro, anotações e perfil).
* `login.html`: A porta de entrada do projeto. Apresenta o formulário de login e o botão que aciona o modal de cadastro para novos usuários.
* `script.js`: O principal da aplicação. Este arquivo contém toda a lógica, incluindo:
    * Roteamento simples para verificar se o usuário está logado.
    * Funções de autenticação (login e cadastro).
    * CRUD (Criar, Ler, Atualizar, Deletar) completo para os livros.
    * Gerenciamento de perfil (atualização e exclusão de conta).
    * Renderização dinâmica do conteúdo na tela.
* `style.css`: Arquivo de estilos customizados que complementam o Bootstrap, adicionando efeitos visuais, como animações nos cards, e personalizando a aparência do carrossel e da página de login.

---

### 🛠️ Tecnologias Utilizadas

* **HTML**: Para a estruturação semântica do conteúdo.
* **CSS**: Para estilização personalizada e melhorias visuais.
* **JavaScript**: Para toda a interatividade, manipulação de dados e lógica da aplicação.
* **Bootstrap**: Framework CSS utilizado para criar um design responsivo e para componentes de UI, como modais, cards e a barra de navegação.
* **LocalStorage**: API do navegador usada como banco de dados do lado do cliente para persistir os dados dos usuários e suas bibliotecas.

---

### ⚠️ Limitações Conhecidas

* O aplicativo não possui um backend; todos os dados são salvos localmente no `localStorage` do navegador. Isso significa que **limpar os dados do navegador resultará na perda de todas as contas e livros salvos**.
* Os dados não são sincronizados entre diferentes dispositivos ou navegadores.
* As informações dos livros, como imagem da capa e descrição, devem ser inseridas manualmente pelo usuário.


---

### 💻 Desenvolvedores

Luiz Henrique da Silva Pereira, Luis Gustavo Novaes dos Santos, Davi Lemes Porto e Miguel Melo
