import path from 'node:path';
import { createContentFile, safeFileName, today, yamlString } from './content-utils.mjs';

const REVIEW_TYPES = ['game', 'anime', 'movie', 'video', 'book'];
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const typeArgument = args.find((arg) => arg.startsWith('--type='));
const typeIndex = args.indexOf('--type');
const type = typeArgument?.slice('--type='.length) || (typeIndex >= 0 ? args[typeIndex + 1] : 'game');
const consumedTypeValue = typeIndex >= 0 ? args[typeIndex + 1] : undefined;
const name = args.find((arg) => !arg.startsWith('--') && arg !== consumedTypeValue);

if (args.includes('--help')) {
  console.log('Usage: pnpm new:review "Work title" [--type game|anime|movie|video|book] [--dry-run]');
  process.exit(0);
}

if (!name) {
  console.error('Usage: pnpm new:review "Work title" [--type game|anime|movie|video|book] [--dry-run]');
  process.exit(1);
}

if (!REVIEW_TYPES.includes(type)) {
  console.error(`Invalid review type "${type}". Expected one of: ${REVIEW_TYPES.join(', ')}`);
  process.exit(1);
}

const fileName = safeFileName(name);
const relativePath = path.join('src', 'content', 'reviews', `${fileName}.md`);
const content = `---
name: ${yamlString(name)}
originalName: ""
date: ${today()}
type: ${type}
status: completed
creator: ""
summary: ""
verdict: ""
notes: []
tags: []
draft: true
---

Write the final review here.
`;

try {
  const target = await createContentFile(relativePath, content, { dryRun });
  console.log(`${dryRun ? 'Would create' : 'Created'}: ${target}`);
  console.log(`Type: ${type}`);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
