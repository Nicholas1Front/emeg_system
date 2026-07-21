const bcrypt = require('bcrypt');

exports.seed = async function (knex) {

    const USER_ID = 1;

    // Remove dados anteriores
    await knex('financial_transactions').del();
    await knex('financial_categories').del();

    /*
    |--------------------------------------------------------------------------
    | Categorias
    |--------------------------------------------------------------------------
    */

    const categories = [
        // Receitas
        {
            title: 'Salário',
            description: 'Salário mensal',
            type: 'income'
        },
        {
            title: 'Freelance',
            description: 'Serviços extras',
            type: 'income'
        },
        {
            title: 'Investimentos',
            description: 'Rendimentos financeiros',
            type: 'income'
        },
        {
            title: 'Dividendos',
            description: 'Dividendos recebidos',
            type: 'income'
        },
        {
            title: 'Bonificação',
            description: 'Bonificações',
            type: 'income'
        },

        // Despesas
        {
            title: 'Mercado',
            description: 'Compras em supermercado',
            type: 'expense'
        },
        {
            title: 'Aluguel',
            description: 'Pagamento do aluguel',
            type: 'expense'
        },
        {
            title: 'Energia',
            description: 'Conta de energia',
            type: 'expense'
        },
        {
            title: 'Água',
            description: 'Conta de água',
            type: 'expense'
        },
        {
            title: 'Internet',
            description: 'Internet residencial',
            type: 'expense'
        },
        {
            title: 'Combustível',
            description: 'Posto de gasolina',
            type: 'expense'
        },
        {
            title: 'Restaurante',
            description: 'Alimentação fora',
            type: 'expense'
        },
        {
            title: 'Academia',
            description: 'Mensalidade',
            type: 'expense'
        },
        {
            title: 'Streaming',
            description: 'Serviços digitais',
            type: 'expense'
        },
        {
            title: 'Lazer',
            description: 'Passeios',
            type: 'expense'
        }
    ];

    /*
    |--------------------------------------------------------------------------
    | Inserindo categorias
    |--------------------------------------------------------------------------
    */

    const categoryMap = {};

    for (const category of categories) {

        const [created] = await knex('financial_categories')
            .insert({
                user_id: USER_ID,
                ...category
            })
            .returning(['id', 'title']);

        categoryMap[created.title] = created.id;
    }

    /*
    |--------------------------------------------------------------------------
    | Simulando Soft Delete
    |--------------------------------------------------------------------------
    */

    await knex('financial_categories')
        .where({
            id: categoryMap['Streaming']
        })
        .update({
            deleted_at: knex.fn.now()
        });

    /*
    |--------------------------------------------------------------------------
    | Helper para criar transações
    |--------------------------------------------------------------------------
    */

    const transactions = [];

    function addTransaction({
        category,
        description,
        amount,
        type,
        date
    }) {

        transactions.push({
            user_id: USER_ID,
            category_id: categoryMap[category],
            description,
            amount,
            type,
            date_reference: date
        });

    }

        /*
    |--------------------------------------------------------------------------
    | TRANSAÇÕES 2025
    |--------------------------------------------------------------------------
    */

    // ==========================
    // JANEIRO
    // ==========================

    addTransaction({
        category: 'Salário',
        description: 'Salário Janeiro',
        amount: 4500,
        type: 'income',
        date: '2025-01-05'
    });

    addTransaction({
        category: 'Freelance',
        description: 'Landing Page',
        amount: 850,
        type: 'income',
        date: '2025-01-18'
    });

    addTransaction({
        category: 'Mercado',
        description: 'Compras do mês',
        amount: 640,
        type: 'expense',
        date: '2025-01-08'
    });

    addTransaction({
        category: 'Aluguel',
        description: 'Aluguel Janeiro',
        amount: 1400,
        type: 'expense',
        date: '2025-01-10'
    });

    addTransaction({
        category: 'Energia',
        description: 'Conta de energia',
        amount: 182,
        type: 'expense',
        date: '2025-01-15'
    });

    addTransaction({
        category: 'Internet',
        description: 'Fibra',
        amount: 120,
        type: 'expense',
        date: '2025-01-17'
    });

    addTransaction({
        category: 'Combustível',
        description: 'Gasolina',
        amount: 410,
        type: 'expense',
        date: '2025-01-21'
    });

    addTransaction({
        category: 'Academia',
        description: 'Mensalidade',
        amount: 109,
        type: 'expense',
        date: '2025-01-22'
    });

    addTransaction({
        category: 'Streaming',
        description: 'Netflix',
        amount: 55,
        type: 'expense',
        date: '2025-01-25'
    });

    addTransaction({
        category: 'Restaurante',
        description: 'Jantar',
        amount: 165,
        type: 'expense',
        date: '2025-01-27'
    });

    // ==========================
    // FEVEREIRO
    // ==========================

    addTransaction({
        category: 'Salário',
        description: 'Salário Fevereiro',
        amount: 4500,
        type: 'income',
        date: '2025-02-05'
    });

    addTransaction({
        category: 'Mercado',
        description: 'Compras do mês',
        amount: 705,
        type: 'expense',
        date: '2025-02-09'
    });

    addTransaction({
        category: 'Aluguel',
        description: 'Aluguel',
        amount: 1400,
        type: 'expense',
        date: '2025-02-10'
    });

    addTransaction({
        category: 'Energia',
        description: 'Conta de energia',
        amount: 205,
        type: 'expense',
        date: '2025-02-14'
    });

    addTransaction({
        category: 'Internet',
        description: 'Internet',
        amount: 120,
        type: 'expense',
        date: '2025-02-15'
    });

    addTransaction({
        category: 'Restaurante',
        description: 'Fim de semana',
        amount: 220,
        type: 'expense',
        date: '2025-02-20'
    });

    addTransaction({
        category: 'Lazer',
        description: 'Cinema',
        amount: 180,
        type: 'expense',
        date: '2025-02-22'
    });

    addTransaction({
        category: 'Combustível',
        description: 'Gasolina',
        amount: 430,
        type: 'expense',
        date: '2025-02-25'
    });

    // ==========================
    // MARÇO
    // ==========================

    addTransaction({
        category: 'Salário',
        description: 'Salário Março',
        amount: 4600,
        type: 'income',
        date: '2025-03-05'
    });

    addTransaction({
        category: 'Freelance',
        description: 'Sistema Comercial',
        amount: 1500,
        type: 'income',
        date: '2025-03-19'
    });

    addTransaction({
        category: 'Mercado',
        description: 'Compras',
        amount: 690,
        type: 'expense',
        date: '2025-03-08'
    });

    addTransaction({
        category: 'Aluguel',
        description: 'Aluguel',
        amount: 1400,
        type: 'expense',
        date: '2025-03-10'
    });

    addTransaction({
        category: 'Energia',
        description: 'Energia',
        amount: 195,
        type: 'expense',
        date: '2025-03-15'
    });

    addTransaction({
        category: 'Combustível',
        description: 'Gasolina',
        amount: 480,
        type: 'expense',
        date: '2025-03-21'
    });

    addTransaction({
        category: 'Academia',
        description: 'Academia',
        amount: 109,
        type: 'expense',
        date: '2025-03-22'
    });

    addTransaction({
        category: 'Restaurante',
        description: 'Almoço',
        amount: 145,
        type: 'expense',
        date: '2025-03-28'
    });

    function createMonth({
    year,
    month,
    salary,
    freelance = 0,
    investment = 0,
    market,
    rent,
    energy,
    water,
    internet,
    fuel,
    restaurant,
    gym,
    leisure = 0,
    streaming = 55
}) {

    const m = String(month).padStart(2, '0');

    addTransaction({
        category: 'Salário',
        description: `Salário ${m}/${year}`,
        amount: salary,
        type: 'income',
        date: `${year}-${m}-05`
    });

    if (freelance > 0) {
        addTransaction({
            category: 'Freelance',
            description: `Freelance ${m}/${year}`,
            amount: freelance,
            type: 'income',
            date: `${year}-${m}-18`
        });
    }

    if (investment > 0) {
        addTransaction({
            category: 'Investimentos',
            description: `Investimentos ${m}/${year}`,
            amount: investment,
            type: 'income',
            date: `${year}-${m}-26`
        });
    }

    addTransaction({
        category: 'Mercado',
        description: 'Compras do mês',
        amount: market,
        type: 'expense',
        date: `${year}-${m}-08`
    });

    addTransaction({
        category: 'Aluguel',
        description: 'Aluguel',
        amount: rent,
        type: 'expense',
        date: `${year}-${m}-10`
    });

    addTransaction({
        category: 'Energia',
        description: 'Conta de energia',
        amount: energy,
        type: 'expense',
        date: `${year}-${m}-12`
    });

    addTransaction({
        category: 'Água',
        description: 'Conta de água',
        amount: water,
        type: 'expense',
        date: `${year}-${m}-14`
    });

    addTransaction({
        category: 'Internet',
        description: 'Internet',
        amount: internet,
        type: 'expense',
        date: `${year}-${m}-15`
    });

    addTransaction({
        category: 'Combustível',
        description: 'Gasolina',
        amount: fuel,
        type: 'expense',
        date: `${year}-${m}-20`
    });

    addTransaction({
        category: 'Academia',
        description: 'Academia',
        amount: gym,
        type: 'expense',
        date: `${year}-${m}-22`
    });

    addTransaction({
        category: 'Streaming',
        description: 'Streaming',
        amount: streaming,
        type: 'expense',
        date: `${year}-${m}-24`
    });

    addTransaction({
        category: 'Restaurante',
        description: 'Restaurante',
        amount: restaurant,
        type: 'expense',
        date: `${year}-${m}-27`
    });

    if (leisure > 0) {
        addTransaction({
            category: 'Lazer',
            description: 'Passeio',
            amount: leisure,
            type: 'expense',
            date: `${year}-${m}-29`
        });
    }
}}