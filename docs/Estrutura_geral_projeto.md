# Estrutura Geral do Projeto

Este documento define a **estrutura base do repositório**, bem como as **tecnologias, serviços e bibliotecas** adotadas inicialmente. Ele serve como referência constante durante o desenvolvimento.

---

## 📁 Estrutura de Pastas (Visão Geral)

```
backend/
    docs/
        backend_README.md
    src/
        database/
            migrations/
                ...
            scripts/
            knex.js
        middlewares/
            auth_middleware.js ✅
            admin_middleware.js ✅
        modules/
            auth/✅
            users/✅
            notes/✅
            attachments/✅
            clients/✅
            equipaments/✅
            dev/✅
            
        routes/
            index.js ✅
            auth_routes.js ✅
            users_routes.js ✅
            attachments_routes.js ✅
            notes_routes.js ✅
        app.js ...
        server.js ...
    .env
    .gitignore
    knexfile.js ✅
    package-lock.json ✅
    package.json ✅
frontend/
    docs/    
        frontend_README.md
    src/
        api/
        components/
        pages/
        layouts/
        hooks/
        services/
        utils/
        App.jsx
    package.json
docs/
    Estrutura_geral_projeto.md
    Planejamento_geral_projeto.md
    Decisões.md


```

- 


---

## 🧠 Princípios da Estrutura

* Backend e frontend são **independentes**, mas vivem no mesmo repositório
* `docs` é a **fonte da verdade** do projeto
* Cada módulo do backend deve ser **autônomo**
* Services são obrigatórios (controller nunca fala direto com banco)
* Nomenclatura de arquivos e pastas
    - Para o backend será o underline case : auth_routes.js
    - Para o frontend será o camel case : headerComponent.jsx
* Nunca editar diretamente no banco sempre fazer pelo Knex
---

## ☁️ Infraestrutura / Cloud (Decisão Inicial)

### Recomendação principal: **VPS tradicional**

**Provedores escolhidos:**

* Render (webservice)
* Neon (database)
* Cloudflare (storage)

### Motivos da escolha

* Previsibilidade de custo
* Controle total do ambiente
* Ideal para SaaS próprio
* Escala vertical simples no início

---

## 📦 Backend – Tecnologias e Bibliotecas

### Base

* Node.js
* Express

### Banco de Dados

* PostgreSQL
* ORM: **Knex**

### Autenticação

* jsonwebtoken
* bcrypt

### Validação

* zod

### Utilidades

* dotenv
* cors
* morgan (logs)

### Uploads / Arquivos

* Cloudflare

### PDF / Relatórios

* puppeteer

---

## ⚛️ Frontend – Tecnologias e Bibliotecas

### Base

* React
* Vite

### Estado e Dados

* Axios
* React Query (TanStack)

### Formulários

* React Hook Form
* Zod

### UI

* CSS puro ou Tailwind (decisão futura)

---

## 🤖 IA (Planejado)

* OpenAI API
* Módulo isolado no backend
* Prompts versionados
* IA apenas consulta e sugere

---

## 🧪 Ambiente de Testes

* Postman (manual)
* Testes automatizados podem ser adicionados futuramente

---

## 📌 Observações Finais

* Estrutura pensada para crescer sem retrabalho
* Documentação mínima, mas essencial
* Decisões importantes sempre registradas em `DECISIONS.md`

Este documento pode (e deve) evoluir conforme o projeto avança.
