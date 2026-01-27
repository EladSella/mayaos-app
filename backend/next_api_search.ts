// This logic belongs in pages/api/search.ts or app/api/search/route.ts

/*
import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { query, filter } = await req.json();

  if (!query) return NextResponse.json([]);

  // Generate embedding for query
  const queryEmbedding = await generateEmbedding(query); // Same func as indexing

  // Hybrid Search SQL
  // Combines vector similarity (cosine distance) with full-text search rank
  const sql = `
    SELECT 
      id, 
      title, 
      mime_type as type, 
      web_view_link as url, 
      ts_headline('english', raw_text, plainto_tsquery('english', $1)) as snippet,
      modified_time,
      1 - (embedding <=> $2::vector) as similarity
    FROM documents
    WHERE 
      (plainto_tsquery('english', $1) @@ fts_content OR (embedding <=> $2::vector) < 0.2)
      ${filter !== 'all' ? 'AND mime_type LIKE $3' : ''}
    ORDER BY similarity DESC, modified_time DESC
    LIMIT 10;
  `;

  const params = [query, JSON.stringify(queryEmbedding)];
  if (filter !== 'all') {
      // Map filter to mimeType partial
      const mimeMap: any = { 'docs': '%document', 'sheets': '%spreadsheet' };
      params.push(mimeMap[filter] || '%');
  }

  const result = await pool.query(sql, params);
  
  return NextResponse.json(result.rows);
}
*/