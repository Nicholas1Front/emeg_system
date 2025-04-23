const express = require('express');
const axios = require('axios');
const app = express();
const { Dropbox } = require('dropbox');
const PORT = process.env.PORT || 3000;
const cors = require('cors');
app.use(cors());
app.use(express.json());
require('dotenv').config();

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

const getValidDropboxInstance = async () => {
  try {
    const result = await axios.post('https://api.dropboxapi.com/oauth2/token', new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: process.env.DROPBOX_REFRESH_TOKEN,
      client_id: process.env.DROPBOX_CLIENT_ID,
      client_secret: process.env.DROPBOX_CLIENT_SECRET,
    }).toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    return new Dropbox({ accessToken: result.data.access_token });
  } catch (err) {
    console.error('❌ Erro ao renovar token Dropbox:', err.message);
    throw new Error('Erro ao renovar token Dropbox.');
  }
};

// Healthcheck geral do servidor
app.get('/', async (req, res) => {
  const status = {
    server: true,
    env: !!process.env.DROPBOX_REFRESH_TOKEN,
    dropboxAccess: false,
    archives: {},
    mensagem: '',
  };

  try {
    const dropbox = await getValidDropboxInstance();
    const account = await dropbox.usersGetCurrentAccount();
    status.dropboxAccess = !!account;

    const paths = [PATH_CLIENTS, PATH_SERVICES, PATH_INVENTORY, PATH_BUDGET_NUM];
    for (const path of paths) {
      try {
        await dropbox.filesGetMetadata({ path });
        status.archives[path] = true;
      } catch {
        status.archives[path] = false;
      }
    }

    res.json(status);
  } catch (err) {
    status.mensagem = `🔴 Erro ao acessar Dropbox: ${err.message}`;
    res.status(500).json(status);
  }
});

app.get('/get-clients-equipaments', async (req, res) => {
  try {
    const dropbox = await getValidDropboxInstance();
    const response = await dropbox.filesDownload({ path: PATH_CLIENTS });
    const buffer = response.result.fileBinary;
    const json = JSON.parse(buffer.toString());
    res.status(200).json(json);
  } catch (err) {
    console.error('Erro ao buscar JSON:', err.message);
    res.status(500).json({ message: 'Erro ao buscar clients_equipaments.json.' });
  }
});

app.post('/update-clients-equipaments', async (req, res) => {
  try {
    const dropbox = await getValidDropboxInstance();
    const { clients_equipaments_array } = req.body;
    const buffer = Buffer.from(JSON.stringify(clients_equipaments_array, null, 2));
    await dropbox.filesUpload({
      path: PATH_CLIENTS,
      mode: { '.tag': 'overwrite' },
      contents: buffer,
    });
    res.status(200).json({ message: 'Arquivo clients_equipaments.json atualizado com sucesso.' });
  } catch (err) {
    console.error('Erro ao atualizar JSON:', err.message);
    res.status(500).json({ message: 'Erro ao atualizar clients_equipaments.json.' });
  }
});

app.get('/get-services', async (req, res) => {
  try {
    const dropbox = await getValidDropboxInstance();
    const response = await dropbox.filesDownload({ path: PATH_SERVICES });
    const buffer = response.result.fileBinary;
    const json = JSON.parse(buffer.toString());
    res.status(200).json(json);
  } catch (err) {
    console.error('Erro ao buscar services.json:', err.message);
    res.status(500).json({ message: 'Erro ao buscar services.json.' });
  }
});

app.post('/update-services', async (req, res) => {
  try {
    const dropbox = await getValidDropboxInstance();
    const { services } = req.body;
    const buffer = Buffer.from(JSON.stringify(services, null, 2));
    await dropbox.filesUpload({
      path: PATH_SERVICES,
      mode: { '.tag': 'overwrite' },
      contents: buffer,
    });
    res.status(200).json({ message: 'Arquivo services.json atualizado com sucesso.' });
  } catch (err) {
    console.error('Erro ao atualizar services.json:', err.message);
    res.status(500).json({ message: 'Erro ao atualizar services.json.' });
  }
});

app.get('/get-inventory', async (req, res) => {
  try {
    const dropbox = await getValidDropboxInstance();
    const response = await dropbox.filesDownload({ path: PATH_INVENTORY });
    const buffer = response.result.fileBinary;
    const json = JSON.parse(buffer.toString());
    res.status(200).json(json);
  } catch (err) {
    console.error('Erro ao buscar inventory.json:', err.message);
    res.status(500).json({ message: 'Erro ao buscar inventory.json.' });
  }
});

app.post('/update-inventory', async (req, res) => {
  try {
    const dropbox = await getValidDropboxInstance();
    const { inventory } = req.body;
    const buffer = Buffer.from(JSON.stringify(inventory, null, 2));
    await dropbox.filesUpload({
      path: PATH_INVENTORY,
      mode: { '.tag': 'overwrite' },
      contents: buffer,
    });
    res.status(200).json({ message: 'Arquivo inventory.json atualizado com sucesso.' });
  } catch (err) {
    console.error('Erro ao atualizar inventory.json:', err.message);
    res.status(500).json({ message: 'Erro ao atualizar inventory.json.' });
  }
});

app.get('/get-latest-budget-number', async (req, res) => {
  try {
    const dropbox = await getValidDropboxInstance();
    const response = await dropbox.filesDownload({ path: PATH_BUDGET_NUM });
    const buffer = response.result.fileBinary;
    const json = JSON.parse(buffer.toString());
    res.status(200).json(json);
  } catch (err) {
    console.error('Erro ao buscar latest_budget_number.json:', err.message);
    res.status(500).json({ message: 'Erro ao buscar latest_budget_number.json.' });
  }
});

app.post('/update-latest-budget-number', async (req, res) => {
  try {
    const dropbox = await getValidDropboxInstance();
    const { latest_budget_number } = req.body;
    const buffer = Buffer.from(JSON.stringify({ latest_budget_number }, null, 2));
    await dropbox.filesUpload({
      path: PATH_BUDGET_NUM,
      mode: { '.tag': 'overwrite' },
      contents: buffer,
    });
    res.status(200).json({ message: 'Arquivo latest_budget_number.json atualizado com sucesso.' });
  } catch (err) {
    console.error('Erro ao atualizar latest_budget_number.json:', err.message);
    res.status(500).json({ message: 'Erro ao atualizar latest_budget_number.json.' });
  }
});

// Roda o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
