# API REST — Usuários, Alunos e Uploads

Documentação completa da API Node.js/Express usada para gerenciar usuários, alunos e upload de fotos.

**Stack principal**: Node.js, Express, Sequelize, MariaDB, Multer, JWT, bcryptjs.

## Sumário
- Visão geral
- Requisitos e instalação
- Variáveis de ambiente
- Scripts úteis
- Banco de dados e migrações
- Modelos (User, Aluno, Fotos)
- Rotas / Endpoints (com payloads e autenticação)
- Upload de arquivos
- Como testar (exemplos curl)
- Observações

---

## Visão geral

API que fornece:

- CRUD de `Users` (com senha hasheada)
- CRUD de `Alunos` (com geração automática de email) e associação a `Fotos`
- Autenticação via JWT (rota `/tokens`) para obter token
- Upload de arquivos de imagem (`/upload`) que associa fotos a alunos

O código principal fica em `src/` e as rotas são montadas em `src/routes`.

---

## Requisitos

- Node.js (>=14)
- MariaDB
- npm

---

## Instalação

1. Instale dependências:

```bash
npm install
```

2. Crie o arquivo `.env` na raiz com as variáveis (exemplo abaixo).

3. Crie o banco no MariaDB e rode migrações:

```bash
npx sequelize-cli db:migrate
```

4. Rodar em modo desenvolvimento:

```bash
npm run dev
```

O servidor carrega `APP_PORT` do `.env` (se não definido, defina-o). A aplicação serve arquivos estáticos da pasta `uploads/images`.

---

## Variáveis de ambiente (exemplo)

```
APP_URL=http://localhost:3001
APP_PORT=3001
TOKEN_SECRET=uma_chave_secreta
TOKEN_EXPIRATION=86400
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USERNAME=root
DATABASE_PASSWORD=senha
DATABASE_NAME=nome_do_banco
```

---

## Scripts úteis (package.json)

- `npm run dev` — inicia `nodemon server.js` (modo desenvolvimento)
- `npm run build` — transpila com `sucrase` para `dist/`
- `npm start` — executa `node dist/server.js`

---

## Banco de dados e migrações

Migrações disponíveis em `src/database/migrations`:

- `20260121145040-alunos.js` — tabela `alunos` (id, nome, sobrenome, email, idade, peso, altura)
- `20260121180344-users.js` — tabela `users` (id, nome, email, password_hash)
- `20260123000426-criar-tabela-de-foto-do-aluno.js` — tabela `fotos` (nome_original, nome_file, aluno_id)

Conexão/configuração: `src/config/database.js` — usa variáveis de ambiente e timezone `-03:00`.

---

## Modelos (resumo)

- `User` (`src/models/User.js`)
   - campos: `nome`, `email` (único), `password_hash`, `password` (virtual)
   - validações: nome (3-255), email (formato), senha (6-50)
   - hook `beforeSave` para gerar `password_hash` com `bcryptjs`
   - método `passwordIsValid(password)` para comparação

- `Aluno` (`src/models/Aluno.js`)
   - campos: `nome`, `sobrenome`, `email` (único), `idade` (int), `peso` (float), `altura` (float)
   - validações de tamanho e tipos
   - associação: `hasMany(Fotos)`

- `Fotos` (`src/models/Fotos.js`)
   - campos: `nome_original`, `nome_file`, `file_url` (virtual que monta URL usando `APP_URL`)
   - associação: `belongsTo(Aluno)`

---

## Rotas e Endpoints

Observação: muitas rotas requerem autenticação (middleware `loginRequired`) que espera `req.userId` a partir do token JWT.

Base: `APP_URL` (ex.: http://localhost:3001)

- Home
   - `GET /` — retorna `index` (teste simples)

- Tokens (autenticação)
   - `POST /tokens` — login
      - Body: `{ "email": "...", "password": "..." }`
      - Sucesso: `{ "token": "<jwt>" }`
      - Observações: usa `TOKEN_SECRET` e `TOKEN_EXPIRATION`

- Users
   - `POST /users` — cria usuário (requer `loginRequired` no arquivo de rotas)
      - Body: `{ "nome": "...", "email": "...", "password": "..." }`
      - Respostas: retorna usuário criado (sem senha)
   - `PUT /users/:id` — atualiza usuário (requer `loginRequired`)
      - Body: campos para atualizar (nome, email, password)
      - Observação: o controller usa `req.userId` para buscar o usuário a ser atualizado
   - `DELETE /users/:id` — deleta um usuário (requer `loginRequired`)

   - Nota: Endpoints `GET /users` e `GET /users/:id` existem no controller, porém nos `userRoutes.js` estão comentados/omitidos intencionalmente.

- Alunos
   - `GET /alunos` — lista todos os alunos com suas `Fotos`
   - `POST /alunos` — cria aluno (requer `loginRequired`)
      - Body: `{ "nome": "...", "sobrenome": "...", "idade": number, "peso": number, "altura": number }`
      - Observação: email é gerado automaticamente a partir do nome/sobrenome; se duplicado, um sufixo numérico é adicionado
   - `GET /alunos/:id` — retorna um aluno específico (com fotos)
   - `PUT /alunos/:id` — atualiza (requer `loginRequired`)
   - `DELETE /alunos/:id` — deleta (requer `loginRequired`)

- Upload
   - `POST /upload` — envia uma imagem e associa a um aluno (requer `loginRequired`)
      - Form data (multipart/form-data):
         - campo de arquivo: `upload_arquive` (aceita `image/png` e `image/jpeg` apenas)
         - campo de formulário: `idaluno` — id do aluno a associar
      - Armazenamento: `uploads/images/` com nome: `<timestamp>_<random><ext>`
      - Salva registro em `fotos` com `nome_original`, `nome_file`, `aluno_id`

---

## Middleware de Autenticação

O projeto contém `src/middlewares/loginRequired.js` (verificar) que valida JWT e populates `req.userId`. Para rotas protegidas, envie o header:

```
Authorization: Bearer <token>
```

---

## Exemplo rápido com curl

1) Obter token:

```bash
curl -X POST http://localhost:3001/tokens -H "Content-Type: application/json" -d '{"email":"user@example.com","password":"senha"}'
```

2) Criar aluno (exemplo com token):

```bash
curl -X POST http://localhost:3001/alunos -H "Authorization: Bearer <token>" -H "Content-Type: application/json" -d '{"nome":"Joao","sobrenome":"Silva","idade":25,"peso":70,"altura":1.75}'
```

3) Upload de foto (multipart):

```bash
curl -X POST http://localhost:3001/upload -H "Authorization: Bearer <token>" -F "upload_arquive=@/caminho/para/foto.jpg" -F "idaluno=1"
```

---

## Observações e pontos de atenção

- `userRoutes.js` atualmente exige `loginRequired` para criar/atualizar/deletar usuários; as rotas públicas de listagem (`GET /users`) estão comentadas.
- Verifique `APP_URL` em `src/config/appConfig.js` para que `Fotos.file_url` funcione corretamente.
- `multerConfig` aceita somente `image/png` e `image/jpeg` e salva em `uploads/images`.
- Validações de modelos retornam mensagens de erro via `e.errors.map(...)` — a API responde com arrays de mensagens em erros de validação.

---

## Onde olhar no código

- Inicialização da app: [src/app.js](src/app.js#L1)
- Inicialização do servidor: [src/server.js](src/server.js#L1)
- Rotas: [src/routes](src/routes)
- Controladores: [src/controllers](src/controllers)
- Models: [src/models](src/models)
- Config DB: [src/config/database.js](src/config/database.js#L1)
- Config Multer: [src/config/multerConfig.js](src/config/multerConfig.js#L1)

---

Se quiser, eu posso:

- Gerar exemplos mais completos de requests para cada endpoint
- Adicionar um arquivo `.env.example`
- Implementar testes básicos ou Postman collection

Diga qual próximo passo você prefere.
