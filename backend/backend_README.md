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
- Prisma ORM
- JWT para autenticação
- Zod para validação


## Estrutura
- `src/modules` → módulos de negócio
- `src/services` → regras e validações
- `src/controllers` → entrada das requisições


## Regras Importantes
- Controllers não acessam o banco diretamente
- Toda escrita no banco passa por Services
- IA nunca escreve diretamente no banco


## Execução (dev)
```bash
npm install
npm run dev
```

## Testes
- Teste serão executados manualmente via Postman

## Observações
- Backend tem que ser desenvolvido para sempre ser escalável. Este projeto terá updates no futuro