// lib/ocr.ts
import path from "node:path";
import { createWorker } from "tesseract.js";
import sharp from "sharp";

async function preprocess(bytes: Buffer): Promise<Buffer> {
  try {
    const img = sharp(bytes, { failOn: "none" }); // ✅ 'none' is valid; 'false' is not
    const meta = await img.metadata();

    let p = img.rotate().grayscale().normalize().gamma(1.1);

    const max = 2000;
    const w = meta.width || 0;
    const h = meta.height || 0;
    if (w && h && Math.max(w, h) < max) {
      const scale = Math.min(max / Math.max(w, h), 2.5);
      p = p.resize(Math.round(w * scale), Math.round(h * scale), {
        fit: "inside",
      });
    }

    return await p.png({ compressionLevel: 9 }).toBuffer();
  } catch (e) {
    console.warn("Preprocess failed, using original bytes:", e);
    return bytes;
  }
}

export async function runOCRFromBytes(bytes: Buffer): Promise<string> {
  const pre = await preprocess(bytes);

  // Point directly to the assets in node_modules
  const workerPath = path.join(
    process.cwd(),
    "node_modules/tesseract.js/dist/worker.min.js"
  );
  const corePath = path.join(
    process.cwd(),
    "node_modules/tesseract.js-core/tesseract-core.wasm.js"
  );

  const worker = await createWorker({
    workerPath,
    corePath,
    // Use hosted language data (keeps your bundle small)
    langPath: "https://tessdata.projectnaptha.com/4.0.0",
    logger:
      process.env.NODE_ENV === "development"
        ? (m) => console.log(m)
        : undefined,
  });

  await worker.loadLanguage("eng");
  await worker.initialize("eng");

  const { data } = await worker.recognize(pre, {
    // These are passed to tesseract; ignore TypeScript warnings if any
    tessedit_char_whitelist:
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-+/().,% mgMGµgmcgIU×: \n",
    preserve_interword_spaces: "1",
    tessedit_pageseg_mode: "6",
  } as any);

  await worker.terminate();

  return (data?.text || "")
    .replace(/\r/g, "")
    .replace(/[^\S\r\n]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
