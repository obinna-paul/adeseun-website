import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const port = Number(process.env.PORT ?? 8080);
const secret = process.env.EBOOK_PROCESSOR_SECRET;
if (!secret) throw new Error("EBOOK_PROCESSOR_SECRET is required.");

const scriptDir = dirname(fileURLToPath(import.meta.url));
const processorPath = join(scriptDir, "process-ebook.mjs");
const queue = [];
const queued = new Set();
let running = false;

function runNext() {
  if (running) return;
  const job = queue.shift();
  if (!job) return;

  running = true;
  const id = `${job.bookId}:${job.sourceKey}`;
  const child = spawn(process.execPath, [processorPath, "--book-id", job.bookId, "--source-key", job.sourceKey], {
    env: process.env,
    stdio: "inherit",
  });

  child.on("exit", (code) => {
    console.log(`[ebook-worker] ${job.bookId} finished with code ${code}`);
    queued.delete(id);
    running = false;
    runNext();
  });
}

function readJson(request) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    request.on("data", (chunk) => {
      size += chunk.length;
      if (size > 64 * 1024) {
        reject(new Error("Request body is too large."));
        request.destroy();
        return;
      }
      chunks.push(chunk);
    });
    request.on("end", () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")));
      } catch (error) {
        reject(error);
      }
    });
    request.on("error", reject);
  });
}

createServer(async (request, response) => {
  if (request.method === "GET" && request.url === "/health") {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ ok: true, running, queued: queue.length }));
    return;
  }

  if (request.method !== "POST") {
    response.writeHead(405).end();
    return;
  }

  if (request.headers.authorization !== `Bearer ${secret}`) {
    response.writeHead(401, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ error: "Unauthorized." }));
    return;
  }

  try {
    const body = await readJson(request);
    const bookId = typeof body.bookId === "string" ? body.bookId : "";
    const sourceKey = typeof body.sourceKey === "string" ? body.sourceKey : "";
    if (!bookId || !sourceKey) throw new Error("bookId and sourceKey are required.");

    const id = `${bookId}:${sourceKey}`;
    if (!queued.has(id)) {
      queued.add(id);
      queue.push({ bookId, sourceKey });
      runNext();
    }

    response.writeHead(202, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ ok: true, queued: true }));
  } catch (error) {
    response.writeHead(400, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ error: error instanceof Error ? error.message : "Invalid request." }));
  }
}).listen(port, () => {
  console.log(`[ebook-worker] listening on ${port}`);
});
