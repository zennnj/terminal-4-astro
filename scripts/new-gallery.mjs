import { constants } from 'node:fs';
import { access, copyFile, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import {
  createContentFile,
  projectRoot,
  safeFileName,
  today,
  yamlString,
} from './content-utils.mjs';

const GALLERY_KINDS = ['oc', 'fanart'];
const IMAGE_EXTENSIONS = new Set(['.avif', '.gif', '.jpeg', '.jpg', '.png', '.svg', '.webp']);
const args = process.argv.slice(2);
const options = { kind: 'oc', tags: [], dryRun: false };
let title;

function takeValue(index, option) {
  const value = args[index + 1];
  if (!value || value.startsWith('--')) throw new Error(`${option} requires a value.`);
  return value;
}

function addTags(value) {
  const tags = value.split(/[,，]/).map((tag) => tag.trim()).filter(Boolean);
  options.tags = [...new Set([...options.tags, ...tags])];
}

try {
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--help') {
      console.log('Usage: pnpm new:gallery "Artwork title" --image "path/to/image" [--kind oc|fanart] [--tag "tag"] [--tags "tag1,tag2"] [--alt "image description"] [--description "artwork description"] [--dry-run]');
      process.exit(0);
    } else if (arg === '--dry-run') {
      options.dryRun = true;
    } else if (arg === '--image') {
      options.image = takeValue(index, '--image');
      index += 1;
    } else if (arg.startsWith('--image=')) {
      options.image = arg.slice('--image='.length);
    } else if (arg === '--kind') {
      options.kind = takeValue(index, '--kind');
      index += 1;
    } else if (arg.startsWith('--kind=')) {
      options.kind = arg.slice('--kind='.length);
    } else if (arg === '--tag' || arg === '--tags') {
      addTags(takeValue(index, arg));
      index += 1;
    } else if (arg.startsWith('--tag=')) {
      addTags(arg.slice('--tag='.length));
    } else if (arg.startsWith('--tags=')) {
      addTags(arg.slice('--tags='.length));
    } else if (arg === '--alt') {
      options.alt = takeValue(index, '--alt');
      index += 1;
    } else if (arg.startsWith('--alt=')) {
      options.alt = arg.slice('--alt='.length);
    } else if (arg === '--description') {
      options.description = takeValue(index, '--description');
      index += 1;
    } else if (arg.startsWith('--description=')) {
      options.description = arg.slice('--description='.length);
    } else if (arg.startsWith('--')) {
      throw new Error(`Unknown option: ${arg}`);
    } else if (!title) {
      title = arg;
    } else {
      throw new Error(`Unexpected argument: ${arg}`);
    }
  }

  if (!title || !options.image) {
    throw new Error('Usage: pnpm new:gallery "Artwork title" --image "path/to/image" [--kind oc|fanart] [--tag "tag"] [--tags "tag1,tag2"] [--alt "image description"] [--description "artwork description"] [--dry-run]');
  }
  if (!GALLERY_KINDS.includes(options.kind)) {
    throw new Error(`Invalid gallery kind "${options.kind}". Expected one of: ${GALLERY_KINDS.join(', ')}`);
  }

  const sourceImage = path.resolve(options.image);
  const sourceStat = await stat(sourceImage);
  if (!sourceStat.isFile()) throw new Error(`Image is not a file: ${sourceImage}`);

  const extension = path.extname(sourceImage).toLowerCase();
  if (!IMAGE_EXTENSIONS.has(extension)) {
    throw new Error(`Unsupported image extension "${extension}". Expected one of: ${[...IMAGE_EXTENSIONS].join(', ')}`);
  }

  const fileName = safeFileName(title);
  const imageFileName = `${fileName}${extension}`;
  const description = options.description || options.alt || 'Write the artwork description here.';
  const relativeContentPath = path.join('src', 'content', 'gallery', `${fileName}.md`);
  const targetContent = path.join(projectRoot, relativeContentPath);
  const targetImage = path.join(projectRoot, 'src', 'image', 'gallery', imageFileName);
  const sameImage = path.normalize(sourceImage).toLowerCase() === path.normalize(targetImage).toLowerCase();

  try {
    await access(targetContent);
    throw new Error(`Refusing to overwrite existing file: ${targetContent}`);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }

  if (!sameImage) {
    try {
      await access(targetImage);
      throw new Error(`Refusing to overwrite existing image: ${targetImage}`);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }

  const content = `---
title: ${yamlString(title)}
date: ${today()}
kind: ${options.kind}
tags: [${options.tags.map(yamlString).join(', ')}]
image: ../../image/gallery/${imageFileName}
alt: ${yamlString(options.alt || title)}
draft: false
---

${description}
`;

  if (!options.dryRun && !sameImage) {
    await mkdir(path.dirname(targetImage), { recursive: true });
    await copyFile(sourceImage, targetImage, constants.COPYFILE_EXCL);
  }
  await createContentFile(relativeContentPath, content, { dryRun: options.dryRun });

  console.log(`${options.dryRun ? 'Would create' : 'Created'}: ${targetContent}`);
  console.log(`${options.dryRun ? 'Would copy image to' : sameImage ? 'Using image' : 'Copied image to'}: ${targetImage}`);
  console.log(`Kind: ${options.kind}`);
  console.log(`Tags: ${options.tags.length > 0 ? options.tags.join(', ') : '(none)'}`);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
