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
    | Helper para gerar um mês
    |--------------------------------------------------------------------------
    */

    function createMonth({
        year,
        month,
        salary,
        freelance = 0,
        investment = 0,
        dividends = 0,
        bonus = 0,
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
                date: `${year}-${m}-11`
            });
        }

        if (investment > 0) {
            addTransaction({
                category: 'Investimentos',
                description: `Investimento ${m}/${year}`,
                amount: investment,
                type: 'income',
                date: `${year}-${m}-16`
            });
        }

        if (dividends > 0) {
            addTransaction({
                category: 'Dividendos',
                description: `Dividendos ${m}/${year}`,
                amount: dividends,
                type: 'income',
                date: `${year}-${m}-18`
            });
        }

        if (bonus > 0) {
            addTransaction({
                category: 'Bonificação',
                description: `Bonificação ${m}/${year}`,
                amount: bonus,
                type: 'income',
                date: `${year}-${m}-20`
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
            description: 'Combustível',
            amount: fuel,
            type: 'expense',
            date: `${year}-${m}-21`
        });

        addTransaction({
            category: 'Academia',
            description: 'Academia',
            amount: gym,
            type: 'expense',
            date: `${year}-${m}-23`
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
            date: `${year}-${m}-26`
        });

        if (leisure > 0) {
            addTransaction({
                category: 'Lazer',
                description: 'Lazer',
                amount: leisure,
                type: 'expense',
                date: `${year}-${m}-28`
            });
        }

    }

        /*
    |--------------------------------------------------------------------------
    | Dados de 2025 e 2026
    |--------------------------------------------------------------------------
    */

    const months = [
        // ======== 2025 ========
        {
            year: 2025,
            month: 1,
            salary: 4500,
            freelance: 800,
            market: 620,
            rent: 1400,
            energy: 180,
            water: 95,
            internet: 120,
            fuel: 420,
            restaurant: 180,
            gym: 109,
            leisure: 150
        },
        {
            year: 2025,
            month: 2,
            salary: 4500,
            market: 680,
            rent: 1400,
            energy: 205,
            water: 100,
            internet: 120,
            fuel: 450,
            restaurant: 220,
            gym: 109,
            leisure: 180
        },
        {
            year: 2025,
            month: 3,
            salary: 4600,
            freelance: 1500,
            market: 690,
            rent: 1400,
            energy: 195,
            water: 95,
            internet: 120,
            fuel: 480,
            restaurant: 145,
            gym: 109
        },
        {
            year: 2025,
            month: 4,
            salary: 4600,
            investment: 300,
            market: 640,
            rent: 1400,
            energy: 170,
            water: 90,
            internet: 120,
            fuel: 410,
            restaurant: 160,
            gym: 109
        },
        {
            year: 2025,
            month: 5,
            salary: 4700,
            freelance: 900,
            market: 710,
            rent: 1400,
            energy: 220,
            water: 95,
            internet: 120,
            fuel: 430,
            restaurant: 240,
            gym: 109,
            leisure: 250
        },
        {
            year: 2025,
            month: 6,
            salary: 4700,
            dividends: 250,
            market: 700,
            rent: 1400,
            energy: 210,
            water: 100,
            internet: 120,
            fuel: 440,
            restaurant: 190,
            gym: 109
        },
        {
            year: 2025,
            month: 7,
            salary: 4800,
            freelance: 1200,
            market: 730,
            rent: 1450,
            energy: 230,
            water: 105,
            internet: 120,
            fuel: 460,
            restaurant: 260,
            gym: 109
        },
        {
            year: 2025,
            month: 8,
            salary: 4800,
            market: 690,
            rent: 1450,
            energy: 210,
            water: 100,
            internet: 120,
            fuel: 420,
            restaurant: 170,
            gym: 109
        },
        {
            year: 2025,
            month: 9,
            salary: 4900,
            investment: 500,
            market: 760,
            rent: 1450,
            energy: 225,
            water: 105,
            internet: 120,
            fuel: 480,
            restaurant: 240,
            gym: 109
        },
        {
            year: 2025,
            month: 10,
            salary: 4900,
            freelance: 1000,
            market: 710,
            rent: 1450,
            energy: 205,
            water: 95,
            internet: 120,
            fuel: 430,
            restaurant: 180,
            gym: 109
        },
        {
            year: 2025,
            month: 11,
            salary: 5000,
            bonus: 600,
            market: 750,
            rent: 1450,
            energy: 240,
            water: 110,
            internet: 120,
            fuel: 500,
            restaurant: 260,
            gym: 109
        },
        {
            year: 2025,
            month: 12,
            salary: 5000,
            bonus: 2000,
            market: 900,
            rent: 1450,
            energy: 260,
            water: 120,
            internet: 120,
            fuel: 550,
            restaurant: 420,
            gym: 109,
            leisure: 600
        },

        // ======== 2026 ========

        {
            year: 2026,
            month: 1,
            salary: 5200,
            freelance: 1500,
            market: 740,
            rent: 1500,
            energy: 210,
            water: 100,
            internet: 130,
            fuel: 470,
            restaurant: 230,
            gym: 119
        },
        {
            year: 2026,
            month: 2,
            salary: 5200,
            market: 700,
            rent: 1500,
            energy: 200,
            water: 100,
            internet: 130,
            fuel: 420,
            restaurant: 180,
            gym: 119
        },
        {
            year: 2026,
            month: 3,
            salary: 5300,
            freelance: 1800,
            investment: 600,
            market: 780,
            rent: 1500,
            energy: 220,
            water: 110,
            internet: 130,
            fuel: 510,
            restaurant: 280,
            gym: 119
        }
    ];

    // Gera as transações
    months.forEach(month => createMonth(month));

    console.log(`Criadas ${transactions.length} transações...`);

    await knex('financial_transactions').insert(transactions);

    console.log('Seed executada com sucesso!');

}