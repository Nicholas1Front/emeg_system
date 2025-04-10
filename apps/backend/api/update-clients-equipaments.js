import { google } from 'googleapis';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive'],
  });

  const drive = google.drive({ version: 'v3', auth });

  const DATA_FOLDER_ID = process.env.DATA_FOLDER_ID;
  const CLIENTS_FOLDER_ID = process.env.CLIENTS_FOLDER_ID;

  try {
    const { clients_equipaments_array } = req.body;
    if (!clients_equipaments_array || !Array.isArray(clients_equipaments_array)) {
      return res.status(400).json({ message: 'A variável clients_equipaments_array é obrigatória e deve ser um array.' });
    }

    const buffer = Buffer.from(JSON.stringify(clients_equipaments_array, null, 2));

    const existingFiles = await drive.files.list({
      q: `'${DATA_FOLDER_ID}' in parents and name = 'clients_equipaments.json' and trashed = false`,
      fields: 'files(id)',
    });

    if (existingFiles.data.files.length > 0) {
      const fileId = existingFiles.data.files[0].id;
      await drive.files.update({
        fileId,
        media: {
          mimeType: 'application/json',
          body: buffer,
        },
      });
    } else {
      await drive.files.create({
        requestBody: {
          name: 'clients_equipaments.json',
          mimeType: 'application/json',
          parents: [DATA_FOLDER_ID],
        },
        media: {
          mimeType: 'application/json',
          body: buffer,
        },
      });
    }

    for (const client of clients_equipaments_array) {
      const clientName = client.name;
      if (!clientName) continue;

      const folders = await drive.files.list({
        q: `'${CLIENTS_FOLDER_ID}' in parents and name = '${clientName}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
        fields: 'files(id)',
      });

      if (folders.data.files.length === 0) {
        await drive.files.create({
          requestBody: {
            name: clientName,
            mimeType: 'application/vnd.google-apps.folder',
            parents: [CLIENTS_FOLDER_ID],
          },
        });
      }
    }

    res.status(200).json({ message: 'Arquivo e pastas atualizados com sucesso no Google Drive.' });
  } catch (error) {
    console.error('Erro ao atualizar clientes e equipamentos:', error);
    res.status(500).json({ message: 'Erro ao atualizar os dados no Google Drive.' });
  }
}
