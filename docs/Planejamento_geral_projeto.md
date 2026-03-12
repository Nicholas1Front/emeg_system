# Planejamento Geral – Sistema de Gestão da Oficina

Este documento serve como **guia mestre do projeto**, desde o core inicial até módulos futuros. Ele será usado para planejamento, execução e validação das etapas.

Tecnologias base (definidas até agora):

* **Backend:** Node.js + JavaScript
* **Frontend:** React
* **Banco de dados:** PostgreSQL
* **Arquitetura:** MVC / Services
* **Autenticação:** JWT
* **Infra:** 
    - Neon para database
    - Render para web service
    - Na fase de desenvolvimento serão essas duas VPS o que pode vir a mudar quando subir para produção !

---

## Preparação do Projeto (Fundação) [✅]

⏱️ Estimativa: 3 a 5 dias

### Checklist

* [✅] Definir escopo do **core (MVP)**
* [✅] Definir stack final (libs, ORM, padrões)
* [✅] Criar repositório (Git)
* [✅] Definir convenções de código
* [✅] Estruturar pastas do backend
* [✅] Estruturar pastas do frontend
* [✅] Definir fluxo básico de ambientes (dev / prod)

### Decisões técnicas

* ORM (ex: Sequelize / Prisma)
* Lib de validação (ex: Zod / Joi)
* Estrutura de services (camada obrigatória)

---

## Autenticação e Users [✅]

⏱️ Estimativa: 3 a 4 dias

### Funcionalidades

* Login, Adição, exclusão e edição de users
* Geração de JWT
* Proteção de rotas
* Controle simples de roles

### Checklist

* [✅] Install prisma e config do model para users
* [✅] Model de usuários
* [✅] Hash de senha
* [✅] Login, register, delete, update(to admin e user data), find
* [✅] Middleware JWT
* [Não executado] Refresh token (opcional)
* [✅] Testes básicos
---

## VPS/Cloud - Database e Web service [✅]

⏱️ Estimativa: 1 a 2 dias

### Objetivo

Colocar o projeto para rodar na nuvem (tanto database , quanto webservice)

### Funcionalidades

* Persistir dados na Cloud
* Ambiente p/ desenvolvimento e p/ produção

### Checklist

* [✅] Criar database no Neon
* [✅] Criar webservice no Render
* [✅] Conectar database no webservice
* [✅] Testar conexão de ambos via endpoint

---

## Anotações / Agenda Diária [✅]

⏱️ Estimativa: 4 a 6 dias

### Objetivo

Substituir agenda física por sistema digital diário.

### Funcionalidades

* Anotações por dia
* Texto livre

### Checklist

* [✅] Model de notas
* [✅] CRUD completo
* [✅] Filtro por data
* [✅] Filtro por relação
* [✅] Integração com autenticação

---

## Anexos / attachments [✅]

⏱️ Estimativa: 4 a 7 dias

### Objetivo

Criar modulo para armazenar anexos de maneira genérica (para todos os modulos), e também implementar um storage para esses mesmo anexos

### Funcionalidades

* Anexar arquivos (imagens, docs e etc...) que apontarão para features especifícas :
    * Ordem de serviço
    * Laudo técnico
    * Relatório e outros
* Filtrar informações (tamanho, tipo de arquivo, nome do arquivo e etc) e filtrar para onde aponta / a quem pertence (se pertence a uma ordem de serviço, laudo e etc...)

### Checklist

* [✅] Configurar conta e ambiente Cloudflare
* [✅] Model de anexos
* [✅] CRUD completo
* [✅] Filtros de infos e apontamentos
* [✅] Integração com storage
* [✅] Teste unitários

---

## Clientes [✅]

⏱️ Estimativa: 4 a 6 dias

### Funcionalidades

* Cadastro de clientes PF/PJ
* Múltiplos contatos
* Múltiplos endereços
* Consulta via API de CNPJ

### Checklist

* [✅] Model clients
* [✅] Model client_contacts
* [✅] CRUD completo
* [...] Integração com API CNPJ (Talvez/Posterior para frontend)

---

## Equipamentos [✅]

⏱️ Estimativa: 3 a 5 dias

### Funcionalidades

* Cadastro de equipamentos
* Vínculo com cliente
* Identificação simples

### Checklist

* [✅] Model equipments
* [✅] CRUD completo
* [✅] Relacionamento com clientes
* [✅] Testes unitários
---

## Tabela de Itens / Preços [...]

⏱️ Estimativa: 3 a 4 dias

### Objetivo

Base de referência para peças e serviços.

### Funcionalidades

* Cadastro de itens
* Preço padrão
* Categorias
* Busca via texto/nome (além da busca por preço e etc...)

### Checklist

* [ ] Model items
* [ ] CRUD completo
* [ ] Busca textual
* [ ] Testes unitários
---

## Orçamentos / Ordens de serviço [ ]

⏱️ Estimativa: 6 a 8 dias

### Funcionalidades

* Criar orçamento
* Itens livres ou sugeridos
* Criação de OS a partir de ORÇ ou de maneira livre
* Geração de PDF para ORÇ e OS
* Status para ORÇ e para OS

### Checklist

* [ ] Model budgets
* [ ] Model budget_items
* [ ] Model work_order
* [ ] Model work_order_items
* [ ] Fluxo de status para ambas as entidades
* [ ] Geração de PDF
* [ ] Testes unitários

---

## Módulo de Relatórios e Laudos []

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

## Módulo Financeiro []

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

## Módulo IA (Assistente) []

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

## Módulo RH (Futuro) []

⏱️ Estimativa: a definir

### Funcionalidades

* Funcionários
* Jornada
* Salários
* Faltas
* Bonificações

___

## 📌 Observações finais

* Projeto modular
* Evolução incremental
* Core sólido antes de escalar
* IA como assistente, não autoridade

Este documento será atualizado conforme o projeto evoluir.
