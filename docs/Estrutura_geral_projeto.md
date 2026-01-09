# Estrutura Geral do Projeto

Este documento define a **estrutura base do repositório**, bem como as **tecnologias, serviços e bibliotecas** adotadas inicialmente. Ele serve como referência constante durante o desenvolvimento.

---

## 📁 Estrutura de Pastas (Visão Geral)

```
backend/
    src/
        config/
        controllers/
        database/
        middlewares/
        modules/
            auth/
            budgets/
            clients/
            equipaments/
            worker_orders
        routes/
            index.js
        services/
        utils/
        app.js
        server.js
    backend_README.md
    package-lock.json
    package.json
frontend/
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
    frontend_README.md
docs/
    Estrutura_geral_projeto.md
    Planejamento_geral_projeto.md
    Decisões.md


```


---

## 🧠 Princípios da Estrutura

* Backend e frontend são **independentes**, mas vivem no mesmo repositório
* `docs` é a **fonte da verdade** do projeto
* Cada módulo do backend deve ser **autônomo**
* Services são obrigatórios (controller nunca fala direto com banco)
* Nomenclatura de arquivos e pastas
    - Para o backend será o underline case : auth_routes.js
    - Para o frontend será o camel case : headerComponent.jsx

---

## ☁️ Infraestrutura / Cloud (Decisão Inicial)

### Recomendação principal: **VPS tradicional**

**Provedores indicados:**

* Hetzner (melhor custo-benefício)
* DigitalOcean (mais simples)
* Vultr (alternativa sólida)

### Stack na VPS

* Ubuntu LTS
* Node.js (LTS)
* PostgreSQL
* Nginx (reverse proxy)

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
* ORM: **Prisma** (decisão recomendada)

### Autenticação

* jsonwebtoken
* bcrypt

### Validação

* zod

### Utilidades

* dotenv
* cors
* morgan (logs)

### Uploads / Arquivos (futuro)

* multer

### PDF / Relatórios (futuro)

* pdfkit ou puppeteer

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
