import { parentPort, workerData } from 'node:worker_threads';
import sharp from 'sharp';
import path from 'node:path';

(async () => {
  const { filePath, outputDir } = workerData as { filePath: string; outputDir: string };
  try {
    const filename = path.basename(filePath);
    const thumbPath = path.join(outputDir, `thumb-${filename}`);

    await sharp(filePath).resize(150).toFile(thumbPath);

    parentPort?.postMessage({ ok: true });
  } catch (e) {
    parentPort?.postMessage({ ok: false });
  }
})();