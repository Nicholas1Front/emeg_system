# Documento Guia para tomada de decisões do projeto

## Objetivo

* Registrar decisões arquiteturais importantes, não detalhes de código.

## Quando escrever uma decisão

* Escreva no DECISIONS.md somente quando:

* Escolher uma tecnologia (ORM, cloud, auth)

* Definir uma regra estrutural (ex: IA não escreve no banco)

* Tomar uma decisão difícil de reverter

## Quando NÃO escrever

* Bugfix

* Refatoração pequena

* Ajuste de UI

## Formato padrão (sempre igual)

```
## AAAA-MM-DD – Título curto da decisão

Decisão:
O que foi decidido, em 1–2 linhas.

Motivo:
Por que essa decisão foi tomada.

Consequência:
O que isso impacta no projeto.
```

# Decisões tomadas durante o projeto

## 08/01/2025 – Stack, documentação e estratégia inicial do projeto

### Decisão:
- Utilizar documentação leve e objetiva como guia do projeto.
- Backend em Node.js com Express e PostgreSQL.
- Frontend em React com Vite.
- Utilizar VPS para hospedar banco de dados e webservice.
- Usar ChatGPT como apoio de desenvolvimento e OpenAI API para funcionalidades de IA em produção.
- Desenvolver inicialmente apenas o core definido no Planejamento Geral.

### Motivo:
- Projeto será desenvolvido de forma gradual, com tempo diário limitado.
- Stack escolhida oferece equilíbrio entre simplicidade, maturidade e escalabilidade.
- VPS garante previsibilidade de custo e controle da infraestrutura.
- Documentação leve evita burocracia sem perder rastreabilidade das decisões.

### Consequência:
- O desenvolvimento do core está estimado em aproximadamente 2 meses.
- O sistema atual passa a ser tratado como legado e será gradualmente descontinuado.
- O projeto exigirá maior rigor com segurança, organização e tratamento de dados.
- A arquitetura adotada facilita expansão futura (IA, financeiro, RH).

## 09/01/2025 – Estrutura modular das rotas (routes) e padronização de nomenclatura

### Decisão:
- Utilizar pasta "/routes" para modular todas rotas e indexar em "/routes/index.js"
- Padronizar nomenclatura de arquivos (camel case pra frontend e underline case para backend)

### Motivo:
- Evitar futuro retrabalho e confusão quanto as diversas rotas que serão geradas
- Evitar erros de caminho de arquivos tanto para o backend quanto para o frontend

### Consequência:
- Exigir um pouco de atenção ao nomear arquivos importantes
- Atenção para sempre indexar as novas rotas em "routes/index.js"

## 09/01/2026 – Separação entre módulos de negócio e infraestrutura

### Decisão:
- Utilizar `/modules` apenas para domínios de negócio.
- Manter `routes`, `middlewares`, `config`, `database` e `utils` fora de `/modules`.

### Motivo:
- Clareza de responsabilidades.
- Facilitar manutenção e crescimento do projeto.
- Evitar acoplamento entre infraestrutura e regras de negócio.

### Consequência:
- Estrutura mais organizada desde o início.
- Menos retrabalho conforme o projeto cresce.

## 12/01/2026 – Mudança na estrutura de users

### Decisão:
- Criar endpoints e lógica para criação, edição e exclusão de usuários

### Motivo:
- Facilitar o acesso e manipulação do sistema
- Promover organização ao titular qualquer ação no sistema :
    * Exemplo : Usuário com ID @ criou este orçamentou ou fez esta anotação

### Consequência:
- Um esforço um pouco maior na construção do service, controller e schema
- Maior organização desde o principio da aplicação visando sempre apontar os users

## 13/01/2026 – Uso do Prisma como ORM

### Decisão:
- Usar Prisma para estruturar o banco de dados fazendo uso dos Models e migrations

### Motivo:
- Promover segurança nos dados do database ao fazer mudanças estruturais
- Para localizar mais facilmente o histórico de migrations no banco

### Consequência:
- Sempre ao fazer migrations nomear corretamente
- Estruturar corretamente schema.prisma

## 14/01/2026 – Mudança da ORM de Prisma para Knex

### Decisão:
- Migrar do Prisma para Knex
- Terminar localmente auth e users e subir para VPS

### Motivo:
- Prisma estava dando uma série de erros (na versão do Node, Typescript para commonJs e etc)
- Knex mais didático, simples e tem menos abstração de dados
- Subir logo após auth e users para se habituar logo ao ambiente de produção e a cenários reais

### Consequência:
- Continuar a estruturar e a fazer migrations ou qualquer outra alteração no banco de modo correto e organizado
- Ficar atento ao uso de repository.js (serão necessários a partir de hoje)
- Achar a melhor VPS tanto para desenvolvimento quanto para produção (que seja estável, escalavel, didáticae simples)

## 21/01/2026 – Neon como database e Render como webservice

### Decisão:
- Subir projeto para as VPS's especifícas
- Neon como storage/database
- Render como webservice/server
- **Serão usadas no desenvolvimento e em produção**

### Motivo:
- Neon para database e Render para server funcionam muito bem no free tier (ótimo para desenvolvimento)
- Gastos de usage em ambos são fixos e/ou bem calculados (não ultrapassam muito no per usage)
- Separar responsabilidades irá facilitar na manutenção , upgrade e upscaling 
- Dados sensíveis e secretos são processados com maior segurança pelos servidores dos detentores das VPS's

### Consequência:
- Enfrentar cenários reais de tempo de resposta, spin down, limits per usage e etc
- Melhor dimensão de uso dos dados (armazenamento e tempo de resposta)
- Atenção com dados sensíveis (.env por exemplo)

## 26/01/2026 – Criar modulo de anexos de forma genérica

### Decisão:
- Criar modulo de anexos após modulo de anotações
- Cloudflare para armazenar arquivos , database só aponta
- Modulo de anexos é independente em suas funções porém anexo sempre é ligado a uma feature especifica

### Motivo:
- Com anexos sendo um modulo, poderão e serão reutilizados em todo o projeto e em todas features
- Para poupar o banco de dados pesados (evitando backup e carregamento lento)
- Evitar desorganização com "anexos soltos"
- Organizar anexos sempre por feature (este grupo de anexos X pertence a feature Y)

### Consequência:
- Evitar refatoração e duplicação de código (um modulo só comanda todos os anexos)
- Considerar fortemente Cloudflare como um novo custo
- Assumir nova responsabilidade para implementar Cloudflare (storage) e database
- Vigiar e observar sempre as regras de negócios para uma feature receber anexos (nunca aceitar anexos soltos)

## 30/01/2026 – Somente admin exclui notas / All users podem ver notas

### Decisão:
- Somente user com role de admin poderá excluir e editar todas as notas
- user owner pode editar própria nota 
- todos os users podem consultar todas as notas do sistema

### Motivo:
- Evitar exclusão por acidente por parte de user normal, sempre passa para o admin fazer a limpeza de notas (delete)
- Anotações é algo utilizado por toda empresa então todos os users poderão consultar

### Consequência:
- Admin terá mais responsabilidades porém mais controle nas ações de exclusão e update
- Anotações será um modulo comum a todos os usuários e reflitirá em todos os outros modulos