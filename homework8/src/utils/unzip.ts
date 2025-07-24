import AdmZip from 'adm-zip';
import { promises as fs } from 'node:fs';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';

export async function unzipToTmp(zipPath: string): Promise<{ tmpDir: string; files: string[]; requestId: string }> {
  const requestId = randomUUID();
  const tmpDir = `/tmp/mini-zipper-${requestId}`;
  await fs.mkdir(tmpDir, { recursive: true });

  const zip = new AdmZip(zipPath);
  zip.extractAllTo(tmpDir, true);

  const entries = await fs.readdir(tmpDir);
  const files = entries.map((f) => join(tmpDir, f));
  return { tmpDir, files, requestId };
}