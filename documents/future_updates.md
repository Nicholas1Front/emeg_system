# Atualizações e Melhorias no EMEG System

## Servidor e Armazenamento

Para melhorar o fluxo de informações e dados do sistema, a próxima atualização do **EMEG System** trará mudanças significativas na estrutura e no armazenamento dos dados.

A principal alteração será a migração do armazenamento dos arquivos **JSON** e outros documentos gerados pelo sistema (como orçamentos e capturas de tela dos clientes) para o **Google Drive**. A API do Google Drive será utilizada para armazenar e gerenciar esses arquivos de forma mais eficiente.

Com essa mudança, os **endpoints do backend** precisarão ser reformulados para suportar essa nova estrutura de armazenamento.

## Controle de Clientes

A estrutura dos objetos de clientes será modificada para o seguinte formato:

```javascript
const client = {
    name: "EXAMPLE",
    equipaments: [/* ... */],
    cnpj: 99999999999999,
    contato: "example@gmail.com"
};
```

Com essa alteração, as funções de **adição e edição de clientes** precisarão ser adaptadas. Além disso, será implementada uma nova funcionalidade para capturar uma **screenshot da página** e salvá-la em formato **PDF**.

Outra melhoria importante será a criação automática de uma **pasta no Google Drive** com o nome do cliente sempre que um novo cliente for adicionado.

## Criação de Orçamentos

O fluxo de criação e armazenamento de orçamentos será ajustado da seguinte forma:

1. O salvamento local do orçamento continuará funcionando normalmente.
2. Após a atualização do número do orçamento, ele será salvo.
3. Em seguida, uma **aba será aberta no Google Drive**, permitindo o salvamento do arquivo diretamente na pasta do cliente correspondente. O cliente será identificado pelo nome inserido no orçamento.

## Considerações Finais

Além das atualizações nos **scripts** e no **servidor**, o **HTML** e os **estilos visuais** do sistema também serão ajustados para garantir compatibilidade com essas novas mudanças, melhorando a organização e usabilidade da aplicação.

