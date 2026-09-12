import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";
import { put, list } from "@vercel/blob";
import type { SiteData } from "./types";

/**
 * Data layer for the site's content (hero copy, menu, footer/contact info).
 *
 * - In production on Vercel, content is persisted in Vercel Blob as a single
 *   JSON object, because the deployed filesystem is read-only at runtime.
 * - Locally (or anywhere `BLOB_READ_WRITE_TOKEN` isn't set), content is read
 *   from and written straight back to `data/menu.json`, so `npm run dev`
 *   works with zero setup.
 *
 * Either way, callers only ever see `getSiteData()` / `saveSiteData()`.
 */

const SEED_PATH = path.join(process.cwd(), "data", "menu.json");
const BLOB_DATA_PATHNAME = "site/menu-data.json";

function hasBlobStore() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

// A blob's public URL is stable for a given pathname (addRandomSuffix is
// disabled below), but we still need one `list()` call to discover it the
// first time this server instance runs. Cache it in module scope afterwards.
let cachedBlobUrl: string | null = null;

async function findDataBlobUrl(): Promise<string | null> {
  if (cachedBlobUrl) return cachedBlobUrl;
  const { blobs } = await list({ prefix: BLOB_DATA_PATHNAME });
  const match = blobs.find((b) => b.pathname === BLOB_DATA_PATHNAME);
  cachedBlobUrl = match?.url ?? null;
  return cachedBlobUrl;
}

async function readSeedFile(): Promise<SiteData> {
  const raw = await fs.readFile(SEED_PATH, "utf-8");
  return JSON.parse(raw) as SiteData;
}

export async function getSiteData(): Promise<SiteData> {
  if (hasBlobStore()) {
    try {
      const url = await findDataBlobUrl();
      if (url) {
        // Vercel Blob's CDN can briefly serve a stale copy of an
        // overwritten object at the same URL. A cache-busting query param
        // forces a fresh fetch instead of a stale edge-cached response,
        // which matters here because every save does a read-modify-write.
        const res = await fetch(`${url}?t=${Date.now()}`, {
          cache: "no-store",
        });
        if (res.ok) {
          return (await res.json()) as SiteData;
        }
      }
    } catch (error) {
      console.error(
        "[data] Failed to read site data from Vercel Blob, falling back to seed file:",
        error
      );
    }
  }

  return readSeedFile();
}

export async function saveSiteData(data: SiteData): Promise<void> {
  if (hasBlobStore()) {
    const blob = await put(BLOB_DATA_PATHNAME, JSON.stringify(data, null, 2), {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    cachedBlobUrl = blob.url;
    return;
  }

  // Dev fallback: persist straight to the checked-in JSON file.
  await fs.writeFile(SEED_PATH, JSON.stringify(data, null, 2) + "\n", "utf-8");
}

/**
 * Stores an uploaded image (e.g. a replacement hero photo) and returns the
 * URL it should be referenced by. Uses Vercel Blob when configured, and
 * falls back to `public/uploads` for local development.
 */
export async function saveUploadedImage(file: File): Promise<string> {
  const extension = getExtension(file.name, file.type);

  if (hasBlobStore()) {
    const blob = await put(`site/hero-${Date.now()}${extension}`, file, {
      access: "public",
      contentType: file.type || undefined,
    });
    return blob.url;
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });
  const filename = `hero-${Date.now()}${extension}`;
  await fs.writeFile(path.join(uploadsDir, filename), buffer);
  return `/uploads/${filename}`;
}

function getExtension(filename: string, mimeType: string): string {
  const fromName = path.extname(filename);
  if (fromName) return fromName;
  const fromMime = mimeType.split("/")[1];
  return fromMime ? `.${fromMime}` : ".jpg";
}

export function isBlobConfigured(): boolean {
  return hasBlobStore();
}
