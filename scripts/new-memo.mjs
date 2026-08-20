import path from 'node:path';
import { createContentFile, today, yamlString } from './content-utils.mjs';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const text = args.find((arg) => !arg.startsWith('--'));

if (args.includes('--help') || !text) {
  console.log('Usage: pnpm new:memo "Memo text" [--dry-run]');
  process.exit(args.includes('--help') ? 0 : 1);
}

const content = `---
date: ${today()}
footnote: ""
images: []
draft: false
---

${text}
`;

try {
  let target;
  const dateStem = today();
  for (let index = 1; index < 1000; index += 1) {
    const stem = index === 1 ? dateStem : `${dateStem}-${index}`;
    const relativePath = path.join('src', 'content', 'memos', `${stem}.md`);
    try { target = await createContentFile(relativePath, content, { dryRun }); break; }
    catch (error) { if (!error.message.startsWith('Refusing to overwrite existing file:')) throw error; }
  }
  if (!target) throw new Error('Could not allocate a unique date-based Memo filename.');
  console.log(`${dryRun ? 'Would create' : 'Created'}: ${target}`);
  console.log(`Text: ${yamlString(text)}`);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
