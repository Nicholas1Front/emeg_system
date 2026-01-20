# Backend – Sistema de Gestão da Oficina

## Visão Geral
Backend responsável por toda a regra de negócio do sistema:
- Autenticação
- Clientes
- Equipamentos
- Orçamentos
- Ordens de Serviço
- Anotações
- Integração futura com IA


## Stack
- Node.js
- Express
- PostgreSQL
- Knex ORM
- JWT para autenticação
- Zod para validação


## Estrutura e regras importantes
- `src/modules` → módulos de negócio
- `src/services` → regras e validações
- `src/controllers` → entrada das requisições
- `src/repository` → manipulação do banco de dados
- `src/schema` → validação dos campos via zod
- `src/routes` → rotas/endpoints
___

- Controllers não acessam o banco diretamente
- Quando aplicável, toda escrita deve ser feita pelo repository. Caso contrário pelo service
- IA nunca escreve diretamente no banco
- /Modules servem para agrupar dominios tais como /users, /auth, /budgets e etc...


## Execução (dev)
```bash
npm install
npm run dev
```

## Testes
- Teste serão executados manualmente via Postman

## Observações
- Backend tem que ser desenvolvido para sempre ser escalável. Este projeto terá updates no futuro

## Alguns comandos úteis

### Para criar uma migration

```
npx knex migrate:latest_addition
```