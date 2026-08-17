import path from 'node:path';
import { createContentFile, safeFileName, today, yamlString } from './content-utils.mjs';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const text = args.find((arg) => !arg.startsWith('--'));

if (args.includes('--help') || !text) {
  console.log('Usage: pnpm new:memo "Memo text" [--dry-run]');
  process.exit(args.includes('--help') ? 0 : 1);
}

const stem = `${today()}-${safeFileName(text).slice(0, 32) || 'memo'}`;
const relativePath = path.join('src', 'content', 'memos', `${stem}.md`);
const content = `---
date: ${today()}
footnote: ""
images: []
draft: false
---

${text}
`;

try {
  const target = await createContentFile(relativePath, content, { dryRun });
  console.log(`${dryRun ? 'Would create' : 'Created'}: ${target}`);
  console.log(`Text: ${yamlString(text)}`);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
