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
    console.log('📂 DATA_FOLDER_ID:', DATA_FOLDER_ID);

    const response = await drive.files.list({
      q: `'${DATA_FOLDER_ID}' in parents and trashed = false`,
      fields: 'files(id, name)',
    });

    const arquivos = response.data.files;
    console.log('📁 Arquivos encontrados na pasta:', arquivos.map(f => f.name));

    const file = arquivos.find(f => f.name === 'clients_equipaments.json');

    if (!file) {
      console.warn('❌ Arquivo clients_equipaments.json não encontrado.');
      return res.status(404).json({ message: 'Arquivo não encontrado no Google Drive.' });
    }

    const fileContent = await drive.files.get({
      fileId: file.id,
      alt: 'media',
    });

    console.log('✅ JSON carregado com sucesso');
    res.status(200).json(fileContent.data);
  } catch (error) {
    console.error('🔥 Erro completo:', error.response?.data || error.message || error);
    res.status(500).json({ message: 'Erro ao buscar os dados no Google Drive.' });
  }
}
