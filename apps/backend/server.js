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

const DROPBOX_FOLDER = '/emeg-system-data';
const PATH_CLIENTS = `${DROPBOX_FOLDER}/clients_equipaments.json`;
const PATH_SERVICES = `${DROPBOX_FOLDER}/services.json`;
const PATH_INVENTORY = `${DROPBOX_FOLDER}/inventory.json`;
const PATH_BUDGET_NUM = `${DROPBOX_FOLDER}/latest_budget_number.json`;

// 🔍 Função para verificar se um arquivo existe no Dropbox
async function checkDropboxFile(path) {
  try {
    await dropbox.filesGetMetadata({ path });
    return true;
  } catch (err) {
    return false;
  }
}

// ✅ Health check
app.get('/', async (req, res) => {
  const results = {
    server: true,
    env: !!process.env.DROPBOX_ACCESS_TOKEN,
    dropboxAccess: false,
    arquivos: {}
  };

  try {
    const test = await dropbox.usersGetCurrentAccount();
    results.dropboxAccess = !!test.result;

    const arquivos = [
      { key: 'clients_equipaments.json', path: PATH_CLIENTS },
      { key: 'services.json', path: PATH_SERVICES },
      { key: 'inventory.json', path: PATH_INVENTORY },
      { key: 'latest_budget_number.json', path: PATH_BUDGET_NUM },
    ];

    for (const arquivo of arquivos) {
      results.arquivos[arquivo.key] = await checkDropboxFile(arquivo.path);
    }
  } catch (e) {
    console.error('[Health Check] Erro:', e.message);
  }

  res.json(results);
});

// GET - Buscar arquivo JSON no Dropbox
app.get('/get-clients-equipaments', async (req, res) => {
  try {
    const response = await dropbox.filesDownload({ path: PATH_CLIENTS });
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
      path: PATH_CLIENTS,
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

app.get('/get-services', async (req, res) => {
  try {
    const response = await dropbox.filesDownload({ path: PATH_SERVICES });
    const buffer = response.result.fileBinary;
    const services = JSON.parse(buffer.toString());
    res.status(200).json(services);
  } catch (err) {
    console.error('Erro ao buscar services.json:', err.message);
    res.status(500).json({ message: 'Erro ao buscar services.json no Dropbox.' });
  }
});


// Endpoint para atualizar o arquivo JSON no GitHub (services)
app.post('/update-services', async (req, res) => {
  try {
    const { services_array } = req.body;

    if (!services_array || !Array.isArray(services_array)) {
      return res.status(400).json({
        message: 'services_array é obrigatório e deve ser um array.'
      });
    }

    await dropbox.filesUpload({
      path: PATH_SERVICES,
      mode: { '.tag': 'overwrite' },
      contents: Buffer.from(JSON.stringify(services_array, null, 2))
    });

    res.status(200).json({ message: 'Arquivo services.json atualizado com sucesso no Dropbox.' });
  } catch (err) {
    console.error('Erro ao atualizar services.json:', err.message);
    res.status(500).json({ message: 'Erro ao atualizar o arquivo services.json no Dropbox.' });
  }
});

app.get('/get-latest-budget-number', async (req, res) => {
  try {
    const response = await dropbox.filesDownload({ path: PATH_BUDGET_NUM });
    const buffer = response.result.fileBinary;
    const json = JSON.parse(buffer.toString());
    res.status(200).json(json);
  } catch (err) {
    console.error('Erro ao buscar latest_budget_number.json:', err.message);
    res.status(500).json({ message: 'Erro ao buscar latest_budget_number.json no Dropbox.' });
  }
});

app.post('/update-latest-budget-number', async (req, res) => {
  try {
    const { number } = req.body;

    if (typeof number !== 'number') {
      return res.status(400).json({
        message: 'O campo \"number\" é obrigatório e deve ser um número.'
      });
    }

    await dropbox.filesUpload({
      path: PATH_BUDGET_NUM,
      mode: { '.tag': 'overwrite' },
      contents: Buffer.from(JSON.stringify({ number }, null, 2))
    });

    res.status(200).json({ message: 'latest_budget_number.json atualizado com sucesso.' });
  } catch (err) {
    console.error('Erro ao atualizar latest_budget_number.json:', err.message);
    res.status(500).json({ message: 'Erro ao atualizar latest_budget_number.json no Dropbox.' });
  }
});

app.get('/get-inventory', async (req, res) => {
  try {
    const response = await dropbox.filesDownload({ path: PATH_INVENTORY });
    const buffer = response.result.fileBinary;
    const json = JSON.parse(buffer.toString());
    res.status(200).json(json);
  } catch (err) {
    console.error('Erro ao buscar inventory.json:', err.message);
    res.status(500).json({ message: 'Erro ao buscar inventory.json no Dropbox.' });
  }
});

app.post('/update-inventory', async (req, res) => {
  try {
    const { inventory_array } = req.body;

    if (!inventory_array || !Array.isArray(inventory_array)) {
      return res.status(400).json({
        message: 'inventory_array é obrigatório e deve ser um array.'
      });
    }

    await dropbox.filesUpload({
      path: PATH_INVENTORY,
      mode: { '.tag': 'overwrite' },
      contents: Buffer.from(JSON.stringify(inventory_array, null, 2))
    });

    res.status(200).json({ message: 'inventory.json atualizado com sucesso no Dropbox.' });
  } catch (err) {
    console.error('Erro ao atualizar inventory.json:', err.message);
    res.status(500).json({ message: 'Erro ao atualizar inventory.json no Dropbox.' });
  }
});

// Roda o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
