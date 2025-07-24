import express from 'express';
import multer from 'multer';
import { Worker } from 'node:worker_threads';
import { promises as fs } from 'node:fs';
import { performance } from 'node:perf_hooks';
import path from 'node:path';
import { unzipToTmp } from './utils/unzip.js';
import { globalMutex } from './utils/mutex.js';

const upload = multer({ dest: '/tmp' });
const app = express();
const PORT = 3000;

app.post('/zip', upload.single('zip'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  const t0 = performance.now();
  const { tmpDir, files, requestId } = await unzipToTmp(req.file.path);

  // видаляємо сам zip
  await fs.rm(req.file.path);

  // папка для результатів
  const outputDir = path.join(process.cwd(), 'output', requestId);
  await fs.mkdir(outputDir, { recursive: true });

  let processed = 0;
  let skipped = 0;

  const workerPromises = files.map((filePath) => {
    return new Promise<void>((resolve) => {
      const worker = new Worker(new URL('./worker/thumbnail.ts', import.meta.url), {
        workerData: { filePath, outputDir },
      });

      worker.on('message', async (msg: { ok: boolean }) => {
        const release = await globalMutex.acquire();
        try {
          if (msg.ok) processed++;
          else skipped++;
        } finally {
          release();
          resolve();
        }
      });

      worker.on('error', async () => {
        const release = await globalMutex.acquire();
        try {
          skipped++;
        } finally {
          release();
          resolve();
        }
      });
    });
  });

  await Promise.allSettled(workerPromises);

  // прибираємо tmp
  await fs.rm(tmpDir, { recursive: true, force: true });

  const durationMs = performance.now() - t0;
  res.json({ processed, skipped, durationMs });
});

app.listen(PORT, () => {
  console.log(`✅ Server started on http://localhost:${PORT}`);
});