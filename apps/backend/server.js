const { Readable } = require('stream');
const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors');
app.use(cors());
app.use(express.json());
require('dotenv').config();

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

app.get('/get-clients-equipaments', async (req, res) => {
  try {
    const tokens = await downloadTokenFromDrive();
    if (!tokens) return res.status(401).send('Token não encontrado no Drive. Faça login em /auth.');

    const oauth2Client = createOAuthClient();
    oauth2Client.setCredentials(tokens);

    const drive = google.drive({ version: 'v3', auth: oauth2Client });
    const folderId = process.env.DATA_FOLDER_ID;

    const list = await drive.files.list({
      q: `'${folderId}' in parents and name = 'clients_equipaments.json' and trashed = false`,
      fields: 'files(id, name)',
    });

    if (!list.data.files.length) {
      return res.status(404).send('Arquivo clients_equipaments.json não encontrado.');
    }

    const fileId = list.data.files[0].id;
    const response = await drive.files.get({ fileId, alt: 'media' });

    res.json(response.data);
  } catch (err) {
    console.error('Erro ao buscar JSON do Drive:', err);
    res.status(500).send('Erro ao buscar JSON.');
  }
});

app.post('/update-clients-equipaments', async (req, res) => {
    try {
        const { clients_equipaments_array } = req.body;

        if (!clients_equipaments_array) {
            return res.status(400).send('A variável clients_equipaments_array é obrigatória.');
        }

        // Criar o arquivo JSON temporário
        const filePath = path.join(__dirname, 'clients_equipaments.json');
        fs.writeFileSync(filePath, JSON.stringify(clients_equipaments_array, null, 2));

        const existingFiles = await drive.files.list({
            q: `'${DATA_FOLDER_ID}' in parents and name = 'clients_equipaments.json' and trashed = false`,
            fields: 'files(id, name)',
          });
          
          if (existingFiles.data.files.length > 0) {
            // Se existir, atualiza o conteúdo
            const fileId = existingFiles.data.files[0].id;
            await drive.files.update({
              fileId,
              media: {
                mimeType: 'application/json',
                body: fs.createReadStream(filePath),
              },
            });
            console.log('Arquivo atualizado no Google Drive.');
          } else {
            // Se não existir, cria o arquivo
            await drive.files.create({
              requestBody: {
                name: 'clients_equipaments.json',
                mimeType: 'application/json',
                parents: [DATA_FOLDER_ID],
              },
              media: {
                mimeType: 'application/json',
                body: fs.createReadStream(filePath),
              },
            });
            console.log('Arquivo criado no Google Drive.');
          }

        // Verificar e criar pastas para clientes
        for (const client of clients_equipaments_array) {
            const clientName = client.name; // Supondo que o nome do cliente está na chave 'name'
            if (!clientName) continue;

            const folderId = await getFolderId(clientName, CLIENTS_FOLDER_ID);

            if (!folderId) {
                const newFolderId = await createFolder(clientName, CLIENTS_FOLDER_ID);
                console.log(`Pasta criada para cliente: ${clientName} (ID: ${newFolderId})`);
            }
        }

        res.send('Arquivo atualizado e pastas de clientes verificadas com sucesso no Google Drive!');
    } catch (error) {
        console.error(`[Erro /update-clients-equipaments]: ${error.message}`);
        res.status(500).send('Erro ao atualizar os dados no Google Drive.');
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
