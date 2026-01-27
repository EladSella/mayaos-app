// To run: ts-node backend/indexing.ts
// Requires: googleapis, @google-cloud/local-auth, pg, openai (or other embedding provider)

import { google } from 'googleapis';
import { Pool } from 'pg';

// Add manual type declarations for Node.js globals to fix TS errors when @types/node is missing
declare const require: any;
declare const module: any;

// Config
const SHARED_DRIVE_ID = process.env.SHARED_DRIVE_ID;
const DB_URL = process.env.DATABASE_URL;

// Database Connection
const pool = new Pool({ connectionString: DB_URL });

// Google Drive Auth (Service Account or OAuth)
const auth = new google.auth.GoogleAuth({
  keyFile: 'service-account-key.json', // Or use process.env.GOOGLE_APPLICATION_CREDENTIALS
  scopes: ['https://www.googleapis.com/auth/drive.readonly'],
});

const drive = google.drive({ version: 'v3', auth });

/**
 * Main Indexing Function
 */
async function indexDrive() {
  console.log('Starting Indexing Job...');
  
  // 1. Fetch modified files since last cursor (omitted for MVP, just fetching recent 50)
  const res = await drive.files.list({
    q: `'${SHARED_DRIVE_ID}' in parents and trashed = false and (mimeType = 'application/vnd.google-apps.document' or mimeType = 'application/vnd.google-apps.spreadsheet' or mimeType = 'application/pdf')`,
    pageSize: 50,
    fields: 'nextPageToken, files(id, name, mimeType, webViewLink, iconLink, modifiedTime, createdTime, owners)',
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
    driveId: SHARED_DRIVE_ID,
    corpora: 'drive',
  });

  const files = res.data.files || [];
  console.log(`Found ${files.length} files.`);

  for (const file of files) {
    if(!file.id || !file.name) continue;

    console.log(`Processing: ${file.name}`);
    
    // 2. Extract Text
    const textContent = await extractText(file.id, file.mimeType || '');
    
    if (!textContent) continue;

    // 3. Generate Embedding
    const embedding = await generateEmbedding(textContent);

    // 4. Upsert into Postgres
    await pool.query(
      `INSERT INTO documents (google_id, title, mime_type, web_view_link, icon_link, modified_time, raw_text, embedding)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (google_id) DO UPDATE 
       SET title = EXCLUDED.title,
           modified_time = EXCLUDED.modified_time,
           raw_text = EXCLUDED.raw_text,
           embedding = EXCLUDED.embedding,
           indexed_at = NOW();`,
      [
        file.id,
        file.name,
        file.mimeType,
        file.webViewLink,
        file.iconLink,
        file.modifiedTime,
        textContent,
        JSON.stringify(embedding) // pgvector expects string representation or array
      ]
    );
  }

  console.log('Indexing Complete.');
}

/**
 * Text Extraction Stub
 */
async function extractText(fileId: string, mimeType: string): Promise<string> {
  try {
    if (mimeType === 'application/vnd.google-apps.document') {
      const exportRes = await drive.files.export({
        fileId,
        mimeType: 'text/plain',
      }, { responseType: 'text' });
      return exportRes.data as string; // Check type casting in real impl
    }
    // Add logic for PDF/Slides here
    return `[Content of ${mimeType}]`; 
  } catch (e) {
    console.error(`Error extracting ${fileId}:`, e);
    return '';
  }
}

/**
 * Embedding Stub (OpenAI or Local)
 */
async function generateEmbedding(text: string): Promise<number[]> {
  // Placeholder for OpenAI API call
  // const resp = await openai.createEmbedding({ model: "text-embedding-ada-002", input: text });
  // return resp.data.data[0].embedding;
  
  // Return dummy 1536-dim vector
  return new Array(1536).fill(0).map(() => Math.random());
}

// Run if called directly
if (require.main === module) {
  indexDrive().catch(console.error);
}