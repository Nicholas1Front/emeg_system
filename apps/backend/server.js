const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const app = express();
const { Dropbox } = require('dropbox');
const PORT = process.env.PORT || 3000;
const cors = require('cors');
app.use(cors());
app.use(express.json());
require('dotenv').config();

const dropbox = new Dropbox({ accessToken: process.env.DROPBOX_ACCESS_TOKEN });

// Variáveis de ambiente para GitHub
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = 'Nicholas1Front';
const REPO_NAME = 'emeg_system';
const SERVICES_FILE_PATH = 'apps/backend/data/services.json';
const LATEST_BUDGET_FILE_PATH = `apps/backend/data/latest_budget_number.json`;
const BRANCH = 'main';

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

// Health check
app.get('/', async (req, res) => {
  const results = {
    server: true,
    env: !!process.env.DROPBOX_ACCESS_TOKEN,
    dropboxAccess: false,
    jsonFileFound: false
  };

  try {
    const list = await dropbox.filesListFolder({ path: '/emeg-system-data' });
    const files = list.result.entries.map(f => f.name);

    if (files.includes('clients_equipaments.json')) {
      results.jsonFileFound = true;
    }

    results.dropboxAccess = true;
  } catch (e) {
    console.error('[Health Check] Erro:', e.message);
  }

  res.json(results);
});

// GET - Buscar arquivo JSON no Dropbox
app.get('/get-clients-equipaments', async (req, res) => {
  try {
    const response = await dropbox.filesDownload({ path: '/emeg-system-data/clients_equipaments.json' });
    const buffer = response.result.fileBinary;
    const json = JSON.parse(buffer.toString());
    res.json(json);
  } catch (err) {
    console.error('Erro ao buscar JSON:', err.message);
    res.status(500).json({ message: 'Erro ao buscar dados do Dropbox.' });
  }
});

// POST - Atualizar arquivo JSON no Dropbox
app.post('/update-clients-equipaments', async (req, res) => {
  try {
    const { clients_equipaments_array } = req.body;
    if (!clients_equipaments_array || !Array.isArray(clients_equipaments_array)) {
      return res.status(400).json({ message: 'clients_equipaments_array é obrigatório e deve ser um array.' });
    }

    // Upload do JSON
    await dropbox.filesUpload({
      path: '/emeg-system-data/clients_equipaments.json',
      mode: { '.tag': 'overwrite' },
      contents: Buffer.from(JSON.stringify(clients_equipaments_array, null, 2))
    });

    // Criar pastas se não existirem
    for (const client of clients_equipaments_array) {
      if (!client.name) continue;

      try {
        await dropbox.filesCreateFolderV2({ path: `/clientes/${client.name}` });
      } catch (e) {
        if (!e.message.includes('folder_conflict')) {
          console.warn(`Erro ao criar pasta de ${client.name}:`, e.message);
        }
      }
    }

    res.status(200).json({ message: 'Atualizado com sucesso no Dropbox.' });
  } catch (err) {
    console.error('Erro ao atualizar JSON:', err.message);
    res.status(500).json({ message: 'Erro ao atualizar dados no Dropbox.' });
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

// Endpoint para atualizar o arquivo JSON no GitHub (inventory)
app.post('/update-inventory', async (req, res) => {
    try {
        const { itens_array } = req.body;

        if (!itens_array) {
            return res.status(400).send('A variável itens_array é obrigatória.');
        }

        // 1. Busca o arquivo atual do GitHub
        const INVENTORY_FILE_PATH = 'apps/backend/data/inventory.json';
        const response = await axios.get(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${INVENTORY_FILE_PATH}?ref=${BRANCH}`, {
            headers: {
                Authorization: `Bearer ${GITHUB_TOKEN}`,
                Accept: 'application/vnd.github.v3+json',
            },
        });

        const fileSha = response.data.sha;

        // 2. Atualiza o conteúdo com os novos dados
        const updatedContent = Buffer.from(JSON.stringify(itens_array, null, 2)).toString('base64');

        // 3. Atualiza o arquivo no GitHub
        await axios.put(
            `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${INVENTORY_FILE_PATH}`,
            {
                message: 'Update inventory data',
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
        const isUpdated = await checkGitHubPagesUpdate(INVENTORY_FILE_PATH, itens_array);

        if (!isUpdated) {
            return res.status(500).send('Commit realizado, mas o GitHub Pages não foi atualizado a tempo.');
        }

        res.send('Itens do inventário atualizados com sucesso no GitHub Pages!');
    } catch (error) {
        console.error(`[Erro /update-inventory]: ${error.response ? error.response.data : error.message}`);
        res.status(500).send('Erro ao atualizar os itens do inventário.');
    }
});

// Roda o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
