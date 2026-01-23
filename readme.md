# 🚀 API REST - Gerenciamento de Usuários e Alunos

## 📋 Descrição

Esta é uma API REST desenvolvida em **Node.js** utilizando **Express.js** para gerenciar usuários e alunos. A aplicação utiliza **Sequelize** como ORM para interagir com um banco de dados **MariaDB**. Inclui funcionalidades de autenticação com hash de senhas usando **bcryptjs**, e suporte para uploads de arquivos. 🛡️🔐

### ✨ Funcionalidades

- **👥 Usuários**: CRUD completo (Criar, Ler, Atualizar, Deletar) para usuários, incluindo nome, email e senha.
- **🎓 Alunos**: CRUD para alunos, com campos como nome, sobrenome, email, idade, peso e altura.
- **🔒 Autenticação**: Senhas são hasheadas para segurança.
- **📁 Uploads**: Pasta `uploads` para armazenamento de arquivos enviados.

### 🛠️ Tecnologias Utilizadas

- **🟢 Node.js**: Ambiente de execução.
- **⚡ Express.js**: Framework para construção da API.
- **🗄️ Sequelize**: ORM para banco de dados.
- **🐬 MariaDB**: Banco de dados relacional.
- **🔑 bcryptjs**: Para hash de senhas.
- **🌍 dotenv**: Para variáveis de ambiente.
- **📜 Sucrase**: Para suporte a sintaxe ES6+.
- **🔄 Nodemon**: Para desenvolvimento com recarregamento automático.

## 🏃‍♂️ Como Rodar

### 📋 Pré-requisitos

- 🟢 Node.js instalado (versão 14 ou superior).
- 🐬 MariaDB instalado e rodando.
- 📦 npm ou yarn para gerenciamento de pacotes.

### 📥 Instalação

1. 📥 Clone o repositório ou baixe os arquivos.

2. 📦 Instale as dependências:
   ```
   npm install
   ```

3. ⚙️ Configure o banco de dados:
   - 🗃️ Crie um banco de dados MariaDB.
   - 📄 Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
     ```
     DATABASE_HOST=localhost ou ip
     DATABASE_PORT=3306
     DATABASE_USERNAME=seu_usuario
     DATABASE_PASSWORD=sua_senha
     DATABASE_NAME=nome_do_banco
     ```

4. 🏗️ Execute as migrações para criar as tabelas:
   ```
   npx sequelize-cli db:migrate
   ```

### ▶️ Executando a Aplicação

Para rodar em modo de desenvolvimento (com nodemon):
```
npm run dev
```

A aplicação estará rodando em `🌐 http://localhost:3001`.

### 🔗 Endpoints da API

#### 👥 Usuários (`/users`)
- `POST /users`: Criar um novo usuário. ➕
- `GET /users`: Listar todos os usuários. 📋
- `GET /users/:id`: Obter um usuário específico. 🔍
- `PUT /users/:id`: Atualizar um usuário. ✏️
- `DELETE /users/:id`: Deletar um usuário. 🗑️

#### 🏠 Home (`/`)
- `GET /`: Página inicial (definida em `homeRoutes`). 🏠

Para alunos, os endpoints seguem uma estrutura similar, mas não estão explicitamente definidos nas rotas fornecidas. Verifique os controladores para mais detalhes. 🔍

### 📂 Estrutura do Projeto

```
📁 app.js: Configuração principal da aplicação.
📁 server.js: Inicialização do servidor.
📁 src/
  ├── 📁 config/database.js: Configuração do banco de dados.
  ├── 📁 controllers/: Controladores para lógica de negócio.
  ├── 📁 models/: Modelos Sequelize para Usuários e Alunos.
  ├── 📁 routes/: Definição das rotas.
  ├── 📁 database/: Conexão e migrações.
  ├── 📁 middlewares/: Middlewares personalizados.
📁 uploads/: Pasta para uploads de arquivos.
📁 package.json: Dependências e scripts.
📁 nodemon.json: Configuração do nodemon.
```

### 🤝 Contribuição

Esse projeto se trata exclusivamente de um sistem voltado para fins didáticos, onde meu unico intuito é demonstrar meus conhecimentos em restAPI. 📚🎓

### Licença

Este projeto está sob a licença ISC.
