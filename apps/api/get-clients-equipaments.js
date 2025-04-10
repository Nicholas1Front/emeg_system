import { google } from 'googleapis';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive'],
  });

  const drive = google.drive({ version: 'v3', auth });
  const DATA_FOLDER_ID = process.env.DATA_FOLDER_ID;

  try {
    const response = await drive.files.list({
      q: `'${DATA_FOLDER_ID}' in parents and name = 'clients_equipaments.json' and trashed = false`,
      fields: 'files(id, name)',
    });

    if (response.data.files.length === 0) {
      return res.status(404).json({ message: 'Arquivo clients_equipaments.json não encontrado.' });
    }

    const fileId = response.data.files[0].id;

    const fileContent = await drive.files.get({
      fileId,
      alt: 'media',
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Erro ao buscar JSON do Google Drive:', error);
    res.status(500).json({ message: 'Erro ao buscar os dados no Google Drive.' });
  }
}