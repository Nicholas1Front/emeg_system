## Correção de estilos
Necessário corrigir alguns estilos na parte exibição dos resultados dos clientes e equipamentos, além disso é necessário também implementar um melhor estilo nesta mesma parte.


## Nova feature
Colocar uma nova feature onde insira o CNPJ dado pela empresa e pesquise os dados necessários :
    - Endereço
    - CEP
    - Nome/Razão social

A principio usar uma API chamada : (Consultar CNPJ (InApplet) (consultarcnpj.inapplet.com)) que não tem limites de consultas.

Além disso com a implementação dessa nova feature é necessário mudar a estrutura dos objetos dos clientes onde os mesmos passarão a ser criados e tratados da seguinte forma :
```
const new client = {
    name : "EXAMPLE",
    equipaments : [//..],
    cnpj : 99999999999999,
    contato : "example@gmail.com"
}

```

Será necessário uma mudança nos inputs para adicionar as novas propriedades nos objetos que fazem referência aos clientes, será necessário verificar a melhor maneira de adicionar e implementar os novos estilos.

Além disso e necessário incluir a ferramenta de sugestões de nomes e equipamentos