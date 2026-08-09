import path from 'node:path';
import { createContentFile, safeFileName, today, yamlString } from './content-utils.mjs';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const title = args.find((arg) => !arg.startsWith('--'));

if (args.includes('--help')) {
  console.log('Usage: pnpm new:post "Article title" [--dry-run]');
  process.exit(0);
}

if (!title) {
  console.error('Usage: pnpm new:post "Article title" [--dry-run]');
  process.exit(1);
}

const fileName = safeFileName(title);
const relativePath = path.join('src', 'content', 'blog', `${fileName}.md`);
const imageDirectory = `../../image/blog/${fileName}/`;
const content = `---
title: ${yamlString(title)}
description: ""
date: ${today()}
tags: []
sticky: 0
draft: true
toc: true
mathjax: false
mermaid: false
donate: true
comment: true
---

<!-- Typora image directory: ${imageDirectory} -->

Write the article here.
`;

try {
  const target = await createContentFile(relativePath, content, { dryRun });
  console.log(`${dryRun ? 'Would create' : 'Created'}: ${target}`);
  console.log(`Typora image directory: src/image/blog/${fileName}/`);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
