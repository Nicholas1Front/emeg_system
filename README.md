# Emeg System

Este repositório contém um conjunto de sistemas desenvolvidos como ferramentas para a empresa **EMEG Guindaste**. Ao todo, planeja-se desenvolver 5 projetos dentro deste repositório, voltados para diferentes necessidades operacionais da empresa.

## Projetos Desenvolvidos

### 1. **Hub Principal de Apps** (já desenvolvido)
Um sistema simples que funciona como um **hub** para concentrar todos os sistemas e ferramentas deste repositório.

- [Hub principal de apps](https://nicholas1front.github.io/emeg_system/apps/main_hub/main_hub.html)

### 2. **Criação de Orçamentos** (já desenvolvido)
Ferramenta destinada à criação de orçamentos, utilizando informações dos clientes cadastrados. Ela oferece funcionalidades como controle de itens, geração de orçamentos em formato HTML ou PDF. Esta ferramenta também conta com um sistema de enumeração para o orçamentos de forma automática fazendo a alteração do arquivo `latest_budget_number.json` através do servidor **Render**.

- [Ajuda com Criação de orçamentos](https://nicholas1front.github.io/emeg_system/apps/budget_plataform/help_budget_plataform.html)

### 3. **Controle de Clientes** (já desenvolvido)
Sistema para gerenciar as informações dos clientes. As funcionalidades incluem a **adição, edição e exclusão de dados de clientes**. Através de um servidor web integrado ao **Render**, o sistema faz commit e push dos dados no arquivo `clients_equipaments.json` usando a API do GitHub.

- [Ajuda com Controle de clientes](https://nicholas1front.github.io/emeg_system/apps/customer_base_plataform/help_customer_base_plataform.html)

### 4. **Tabela de Preços** (já desenvolvido)
Sistema para manter e consultar uma tabela de preços dos serviços e equipamentos oferecidos. As funcionalidades incluem : pesquisa de serviços especifícos, consulta de todos os serviços existentes, **adição, exclusão e edição de dados de serviços**. Através de um servidor web integrado ao **Render**, o sistema faz commit e push dos dados no arquivo `services.json` usando a API do GitHub.

- [Ajuda com Tabela de preços](https://nicholas1front.github.io/emeg_system/apps/price_list/help_price_list.html)

### 5. **Controle de Estoque** (já desenvolvido)
Sistema para manter e gerenciar o estoque de itens, entre eles : peças, ferramentas e materiais. As funcionalidades incluem : pesquisa de itens especifícos, consulta de itens em falta, consulta de itens existentes, **adição, exclusão e edição de dados de serviços**. Através de um servidor web integrado ao **Render**, o sistema faz commit e push dos dados no arquivo `inventory.json` usando a API do GitHub.

- [Ajuda com Controle de estoque](https://nicholas1front.github.io/emeg_system/apps/inventory_control_plataform/help_inventory_control.html)

### 6. **Controle de Funcionários** (em breve)
Sistema para gerenciar o cadastro e informações dos funcionários da empresa.

## Como Instalar e Usar

Esses sistemas foram projetados para serem utilizados por meio de download das páginas em HTML, ou diretamente pelos links hospedados no GitHub Pages:

- [Hub principal de apps](https://nicholas1front.github.io/emeg_system/apps/main_hub/main_hub.html)
- [Criação de orçamentos](https://nicholas1front.github.io/emeg_system/apps/budget_plataform/budget_plataform.html)
- [Controle de clientes](https://nicholas1front.github.io/emeg_system/apps/customer_base_plataform/customer_base_plataform.html)
- [Tabela de preços](https://nicholas1front.github.io/emeg_system/apps/price_list/price_list.html)
- [Controle de estoque](https://nicholas1front.github.io/emeg_system/apps/inventory_control_plataform/inventory_control.html)

### Requisitos
Para usar o sistema, você só precisa de um navegador moderno.

## Como foi Desenvolvido?

Este conjunto de sistemas foi desenvolvido para atender às necessidades específicas da **EMEG Guindaste**. As ferramentas foram criadas com o uso de tecnologias simples e acessíveis, facilitando a manutenção e a compreensão do código.

### Tecnologias Utilizadas:
- **Frontend**:
  - HTML, CSS, JavaScript
  - Axios (para requisições HTTP)
  - GitHub Pages (para hospedagem das páginas)
- **Backend**:
  - GitHub API (para manipulação dos dados do sistema de clientes)
  - Render (para hospedar o backend do sistema de controle de clientes)
- **Outras ferramentas**:
  - Font Awesome (ícones)
  - Google Fonts (tipografia)
  - Photoshop (edição de imagens)

## Como Contribuir

Se você deseja contribuir com o desenvolvimento deste projeto, siga os passos abaixo:

1. Faça o **fork** deste repositório.
2. Crie um **branch** para suas alterações:  
   `git checkout -b feature/nova-funcionalidade`
3. Envie suas mudanças:  
   `git push origin feature/nova-funcionalidade`
4. Abra um **pull request** para análise e integração.

## Licença

Este projeto está sob a licença [GNU GENERAL PUBLIC LICENSE](LICENSE), permitindo que você use, modifique e distribua o código livremente.

