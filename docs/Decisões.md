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


## 03/03/2026 – Somente admin pode excluir clientes

### Decisão:
- Somente user com role de admin poderá excluir clients
- todos os users poderão editar, criar e consultar clients

### Motivo:
- Evitar exclusão por acidente por parte de user normal, sempre passa para o admin fazer o delete do client
- Cadastrar e editar dados de um cliente são atividades corriqueiras portanto é necessário que seja de acesso de todos os users

### Consequência:
- Admin terá mais responsabilidades porém mais controle nas ações de exclusão e update
- Assim como notes o modulo clients será um modulo comum a todos os users

## 04/03/2026 – Soft delete / delete_at para algumas entidades

### Decisão:
- Fazer soft delete (delete_at some date) para algumas entidades
- Refatorar modulos que já foram desenvolvidos para incluir o deleted_at

### Motivo:
- Manter rastreabilidade e histórico relacionado a entidades importantes como clients, equipaments, users
- Refatorar a partir dessa data para que no futuro não venha a custar muito

### Consequência:
- Mudança nas funções de delete e get em alguns modulos
- Criação de novas migrations para incluir deleted_at nas tables necessárias
- Analisar racionalmente a necessidade do uso do soft delete ou do hard delete para entidades temporárias ou de importância menor

## 12/03/2026 – Items aceita preço igual a zero para peças

### Decisão:
- Fazer com que a lógica de items (principalmente no service) aceite peças com valor igual a zero

### Motivo:
- Items poderá ser usado como tabela de preço porém também como inventário sem necessariamente colocar preço base a não ser que seja de vontade de user

### Consequência:
- Pequena mudança na validação do preço base
- User terá uma responsabilidade maior ao verificar se colocou preço base ou não

## 24/03/2026 – Montar um modulo próprio para geração de PDF

### Decisão:
- Fazer um modulo dedicado a cuidar da geração de PDF (template, estilização e armazenamento no storage)
- Montar layouts especializados para os documentos necessários (orçamentos, ordens de serviços e etc) respeitando estruturação do backend
- Desenvolver este modulo e suas rotas especificas somente após finalizar a estruturação do backend
- Utilizar puppeter juntamente com HTML + CSS

### Motivo:
- Pensando na perfomance, escalabilidade e custo de manutenção um modulo dedicado se torna a melhor opção
- Persistência dos dados do backend será mantida através dos layouts pensados para documento
- Visando não travar o desenvolvimento dos outros modulos este modulo será gerado somente após finalização do backend
- Puppeter, por hora, é a melhor stack e possibilitará uma estrutura mais limpa, estavel e escalavel 

### Consequência:
- A estrutura de cada documento será definida pela sua estrutura no backend, então cada modulo e cada doc terá que ser analisado corretamente
- Como causa direta deste modulo, o backend irá demorar um pouco mais de tempo para ser finalizado

## 25/03/2026 – Deactivate de work orders somente para admin

### Decisão:
- Somente usuários com role : admin podem desativar e ativar work_orders

### Motivo:
- Diferente de um budget, work_order além de um checklist é um registro de trabalho então tem uma importância maior

### Consequência:
- A responsabilidade e função do admin aumenta com mais essa feature
- Evita erros por parte de usuários comuns ou mal-intencionados

## 06/04/2026 – Relatórios e laudos em um único lugar

### Decisão:
- Usar somente uma table para armazenar relatórios técnicos (reports) e laudos técnicos (assessments)
- O nome da table será technical_docs e usará type para definir entre um e outro
- Modulo exportará o conteúdo do documento em docx 

### Motivo:
- Para não causar complicações devido a complexidade que dois modulos para ambos iria exigir
- Manter o mesmo padrão e simplicidade dos outros modulos (como work_orders e notes)
- "technical_docs" pode ser escalado no futuro para outros documentos técnicos como planos de manutenção e entre outros
- Um arquivo docx permite a edição, adição e correção de informações e posteriormente pode ser exportado para PDF 

### Consequência:
- Menos carga e complexidade no desenvolvimento do modulo
- Mais liberdade e flexibilidade na criação dos documentos tanto na parte da API quanto para o usuário final (documento criado no banco -> export em docx -> edição -> export em pdf)

## 10/04/2026 - status de relatórios e laudos via assinatura

### Decisão :
- O status referente ao relatório e/ou ao laudo técnico serão somente alterados via assinatura

### Motivo :
- Evitar que users insiram status que não venham a condizer com a real situação do doc

### Consequência :
- A signature se tornará uma propriedade fundamental para alterar status do doc
- Maior responsabilidade e atenção para alteração dessa propriedade