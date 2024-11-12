const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());

// Habilitar CORS
const cors = require('cors');
app.use(cors());

// Variáveis de ambiente para GitHub
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = 'Nicholas1Front';
const REPO_NAME = 'emeg_system';
const CLIENTS_EQUIPAMENTS_FILE_PATH = 'apps/backend/data/clients_equipaments.json';
const SERVICES_FILE_PATH = 'apps/backend/data/services.json';
const LATEST_BUDGET_FILE_PATH = `apps/backend/latest_budget_number.json`;
const BRANCH = 'main';

// Função auxiliar para verificar atualização do GitHub Pages
const checkGitHubPagesUpdate = async (filePath, expectedContent) => {
    let isUpdated = false;
    const maxAttempts = 10;
    let attempts = 0;

    while (!isUpdated && attempts < maxAttempts) {
        await new Promise(r => setTimeout(r, 5000)); // Espera 5 segundos antes de verificar novamente
        const githubPagesResponse = await axios.get(`https://nicholas1front.github.io/emeg_system/${filePath}`);
        const currentContent = await githubPagesResponse.data;

        if (JSON.stringify(currentContent) === JSON.stringify(expectedContent)) {
            isUpdated = true;
        }
        attempts++;
    }

    return isUpdated;
};

// Endpoint para atualizar o arquivo JSON no GitHub (clients_equipaments)
app.post('/update-clients-equipaments', async (req, res) => {
    try {
        const { clients_equipaments_array } = req.body;

        if (!clients_equipaments_array) {
            return res.status(400).send('A variável clients_equipaments_array é obrigatória.');
        }

        // 1. Busca o arquivo atual do GitHub
        const response = await axios.get(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${CLIENTS_EQUIPAMENTS_FILE_PATH}?ref=${BRANCH}`, {
            headers: {
                Authorization: `Bearer ${GITHUB_TOKEN}`,
                Accept: 'application/vnd.github.v3+json',
            },
        });

        const fileSha = response.data.sha;

        // 2. Atualiza o conteúdo com os novos dados
        const updatedContent = Buffer.from(JSON.stringify(clients_equipaments_array, null, 2)).toString('base64');

        // 3. Atualiza o arquivo no GitHub
        await axios.put(
            `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${CLIENTS_EQUIPAMENTS_FILE_PATH}`,
            {
                message: 'Update clients data',
                content: updatedContent,
                sha: fileSha,
                branch: BRANCH,
            },
            {
                headers: {
                    Authorization: `Bearer ${GITHUB_TOKEN}`,
                    Accept: 'application/vnd.github.v3+json',
                },
            }
        );

        // 4. Verifica se o arquivo foi atualizado no GitHub Pages
        const isUpdated = await checkGitHubPagesUpdate(CLIENTS_EQUIPAMENTS_FILE_PATH, clients_equipaments_array);

        if (!isUpdated) {
            return res.status(500).send('Commit realizado, mas o GitHub Pages não foi atualizado a tempo.');
        }

        res.send('Dados atualizados com sucesso no GitHub Pages!');
    } catch (error) {
        console.error(`[Erro /update-clients-equipaments]: ${error.response ? error.response.data : error.message}`);
        res.status(500).send('Erro ao atualizar os dados.');
    }
});

// Endpoint para atualizar o arquivo JSON no GitHub (services)
app.post('/update-services', async (req, res) => {
    try {
        const { services_array } = req.body;

        if (!services_array) {
            return res.status(400).send('A variável services_array é obrigatória.');
        }

        // 1. Busca o arquivo atual do GitHub
        const response = await axios.get(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${SERVICES_FILE_PATH}?ref=${BRANCH}`, {
            headers: {
                Authorization: `Bearer ${GITHUB_TOKEN}`,
                Accept: 'application/vnd.github.v3+json',
            },
        });

        const fileSha = response.data.sha;

        // 2. Atualiza o conteúdo com os novos dados
        const updatedContent = Buffer.from(JSON.stringify(services_array, null, 2)).toString('base64');

        // 3. Atualiza o arquivo no GitHub
        await axios.put(
            `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${SERVICES_FILE_PATH}`,
            {
                message: 'Update services data',
                content: updatedContent,
                sha: fileSha,
                branch: BRANCH,
            },
            {
                headers: {
                    Authorization: `Bearer ${GITHUB_TOKEN}`,
                    Accept: 'application/vnd.github.v3+json',
                },
            }
        );

        // 4. Verifica se o arquivo foi atualizado no GitHub Pages
        const isUpdated = await checkGitHubPagesUpdate(SERVICES_FILE_PATH, services_array);

        if (!isUpdated) {
            return res.status(500).send('Commit realizado, mas o GitHub Pages não foi atualizado a tempo.');
        }

        res.send('Dados de serviços atualizados com sucesso no GitHub Pages!');
    } catch (error) {
        console.error(`[Erro /update-services]: ${error.response ? error.response.data : error.message}`);
        res.status(500).send('Erro ao atualizar os dados de serviços.');
    }
});

// Endpoint para atualizar o arquivo JSON no GitHub (latest_budget_number)
app.post('/update-latest-budget-number', async (req, res) => {
    try {
        const { latest_budget_number } = req.body;

        if (latest_budget_number === undefined) {
            return res.status(400).send('A variável latest_budget_number é obrigatória.');
        }

        // 1. Busca o arquivo atual do GitHub
        const response = await axios.get(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${LATEST_BUDGET_FILE_PATH}?ref=${BRANCH}`, {
            headers: {
                Authorization: `Bearer ${GITHUB_TOKEN}`,
                Accept: 'application/vnd.github.v3+json',
            },
        });

        const fileSha = response.data.sha;

        // 2. Atualiza o conteúdo com os novos dados
        const updatedContent = Buffer.from(JSON.stringify({ latest_budget_number }, null, 2)).toString('base64');

        // 3. Atualiza o arquivo no GitHub
        await axios.put(
            `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${LATEST_BUDGET_FILE_PATH}`,
            {
                message: 'Update latest budget number',
                content: updatedContent,
                sha: fileSha,
                branch: BRANCH,
            },
            {
                headers: {
                    Authorization: `Bearer ${GITHUB_TOKEN}`,
                    Accept: 'application/vnd.github.v3+json',
                },
            }
        );

        // 4. Verifica se o arquivo foi atualizado no GitHub Pages
        const isUpdated = await checkGitHubPagesUpdate(LATEST_BUDGET_FILE_PATH, { latest_budget_number });

        if (!isUpdated) {
            return res.status(500).send('Commit realizado, mas o GitHub Pages não foi atualizado a tempo.');
        }

        res.send('Número do último orçamento atualizado com sucesso no GitHub Pages!');
    } catch (error) {
        console.error(`[Erro /update-latest-budget-number]: ${error.response ? error.response.data : error.message}`);
        res.status(500).send('Erro ao atualizar o número do último orçamento.');
    }
});

// Roda o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
