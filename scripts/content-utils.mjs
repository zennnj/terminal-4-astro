import { access, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptsDirectory = path.dirname(fileURLToPath(import.meta.url));
export const projectRoot = path.resolve(scriptsDirectory, '..');

export function today() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function safeFileName(title) {
  const name = title.trim().replace(/[<>:"/\\|?*\u0000-\u001f]/g, '-').replace(/[. ]+$/g, '');
  if (!name) throw new Error('The title does not contain a usable file name.');
  return name;
}

export function yamlString(value) {
  return JSON.stringify(value);
}

export async function createContentFile(relativePath, content, { dryRun = false } = {}) {
  const target = path.join(projectRoot, relativePath);
  try {
    await access(target);
    throw new Error(`Refusing to overwrite existing file: ${target}`);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }

  if (!dryRun) {
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, content, { encoding: 'utf8', flag: 'wx' });
  }

  return target;
}
