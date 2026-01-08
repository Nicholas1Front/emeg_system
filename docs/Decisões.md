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
