// lib/blob.ts
export async function fetchBlobBytes(blobUrl: string): Promise<Buffer> {
  // If your blob is public, no token needed
  const res = await fetch(blobUrl);
  if (!res.ok)
    throw new Error(`Blob fetch failed: ${res.status} ${res.statusText}`);
  const arrBuf = await res.arrayBuffer();
  return Buffer.from(arrBuf);
}
