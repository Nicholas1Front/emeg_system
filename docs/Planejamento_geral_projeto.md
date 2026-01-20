# Planejamento Geral – Sistema de Gestão da Oficina

Este documento serve como **guia mestre do projeto**, desde o core inicial até módulos futuros. Ele será usado para planejamento, execução e validação das etapas.

Tecnologias base (definidas até agora):

* **Backend:** Node.js + JavaScript
* **Frontend:** React
* **Banco de dados:** PostgreSQL
* **Arquitetura:** MVC / Services
* **Autenticação:** JWT
* **Infra:** Cloud (VPS)

---

## 1️⃣ Fase 0 – Preparação do Projeto (Fundação)

⏱️ Estimativa: 3 a 5 dias

### Checklist

* [X] Definir escopo do **core (MVP)**
* [X] Definir stack final (libs, ORM, padrões)
* [X] Criar repositório (Git)
* [X] Definir convenções de código
* [X] Estruturar pastas do backend
* [X] Estruturar pastas do frontend
* [X] Definir fluxo básico de ambientes (dev / prod)

### Decisões técnicas

* ORM (ex: Sequelize / Prisma)
* Lib de validação (ex: Zod / Joi)
* Estrutura de services (camada obrigatória)

---

## 2️⃣ Core – Autenticação e Users

⏱️ Estimativa: 3 a 4 dias

### Funcionalidades

* Login, Adição, exclusão e edição de users
* Geração de JWT
* Proteção de rotas
* Controle simples de roles

### Checklist

* [X] Install prisma e config do model para users
* [X] Model de usuários
* [X] Hash de senha
* [...] Login, register, delete, update(to admin e user data), find
* [X] Middleware JWT
* [ ] Refresh token (opcional)
* [ ] Testes básicos

---

## 3️⃣ Core – Anotações / Agenda Diária

⏱️ Estimativa: 4 a 6 dias

### Objetivo

Substituir agenda física por sistema digital diário.

### Funcionalidades

* Anotações por dia
* Texto livre
* Vinculação opcional com cliente, equipamento, orçamento ou OS

### Checklist

* [ ] Model de notas
* [ ] CRUD completo
* [ ] Filtro por data
* [ ] Filtro por relação
* [ ] Integração com autenticação

---

## 4️⃣ Core – Clientes

⏱️ Estimativa: 4 a 6 dias

### Funcionalidades

* Cadastro de clientes PF/PJ
* Múltiplos contatos
* Múltiplos endereços
* Consulta via API de CNPJ

### Checklist

* [ ] Model clients
* [ ] Model client_contacts
* [ ] Model client_addresses
* [ ] CRUD completo
* [ ] Integração com API CNPJ

---

## 5️⃣ Core – Equipamentos

⏱️ Estimativa: 3 a 5 dias

### Funcionalidades

* Cadastro de equipamentos
* Vínculo com cliente
* Identificação simples (placa, frota, serial)

### Checklist

* [ ] Model equipments
* [ ] CRUD completo
* [ ] Relacionamento com clientes

---

## 6️⃣ Core – Tabela de Itens / Preços

⏱️ Estimativa: 3 a 4 dias

### Objetivo

Base de referência para peças e serviços.

### Funcionalidades

* Cadastro de itens
* Preço padrão
* Categorias
* Ativação/desativação

### Checklist

* [ ] Model items
* [ ] CRUD completo
* [ ] Busca textual

---

## 7️⃣ Core – Orçamentos

⏱️ Estimativa: 6 a 8 dias

### Funcionalidades

* Criar orçamento
* Itens livres ou sugeridos
* Status
* Geração de PDF

### Checklist

* [ ] Model budgets
* [ ] Model budget_items
* [ ] Fluxo de status
* [ ] Geração de PDF

---

## 8️⃣ Core – Ordem de Serviço

⏱️ Estimativa: 6 a 8 dias

### Funcionalidades

* Criar OS manual ou via orçamento
* Controle de datas
* Serviços e peças executados
* Anexos

### Checklist

* [ ] Model work_orders
* [ ] Model work_order_items
* [ ] Model work_order_attachments
* [ ] Fluxo de status

---

## 9️⃣ Módulo de Relatórios e Laudos

⏱️ Estimativa: 5 a 7 dias

### Funcionalidades

* Relatórios de serviço
* Laudos técnicos
* Exportação em PDF

### Checklist

* [ ] Templates de relatório
* [ ] Templates de laudo
* [ ] Integração com OS

---

## 🔟 Módulo Financeiro

⏱️ Estimativa: 7 a 10 dias

### Funcionalidades

* Entradas e saídas
* Categorias
* Anexos de comprovantes
* Balanço mensal/anual
* Gráficos

### Checklist

* [ ] Models financeiros
* [ ] CRUD
* [ ] Gráficos
* [ ] Relatórios

---

## 1️⃣1️⃣ Módulo IA (Assistente)

⏱️ Estimativa: 6 a 10 dias

### Função da IA

* Consulta de preços
* Sugestão de itens
* Interpretação de texto
* Interpretação de imagens (futuro)

### Checklist

* [ ] Controller de IA
* [ ] Prompt base
* [ ] Contratos JSON
* [ ] Tela de confirmação

⚠️ Regra: IA **NUNCA grava direto no banco**

---

## 1️⃣2️⃣ Módulo RH (Futuro)

⏱️ Estimativa: a definir

### Funcionalidades

* Funcionários
* Jornada
* Salários
* Faltas
* Bonificações

---

## 1️⃣3️⃣ Infraestrutura e Segurança

⏱️ Contínuo

### Checklist

* [ ] VPS
* [ ] Backup automático
* [ ] Logs
* [ ] HTTPS
* [ ] Controle de acesso

---

## 📌 Observações finais

* Projeto modular
* Evolução incremental
* Core sólido antes de escalar
* IA como assistente, não autoridade

Este documento será atualizado conforme o projeto evoluir.
