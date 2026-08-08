import { cp, mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { basename, extname, join } from 'node:path';

const sourcePosts = 'D:/blog/source/_posts';
const targetPosts = 'F:/astro-blog/src/content/blog';
const sourceImages = 'D:/blog/source/images';
const targetImages = 'F:/astro-blog/public/images';
const excluded = new Set(['blog-image.md']);

await mkdir(targetPosts, { recursive: true });
await mkdir(targetImages, { recursive: true });
await cp(sourceImages, targetImages, { recursive: true, force: true });

const files = (await readdir(sourcePosts)).filter(
  (file) => extname(file).toLowerCase() === '.md' && !excluded.has(file),
);

for (const file of files) {
  const sourcePath = join(sourcePosts, file);
  const source = (await readFile(sourcePath, 'utf8')).replace(/^\uFEFF/, '');
  const fileStats = await stat(sourcePath);
  const inferredTitle = basename(file, '.md');
  const inferredDate = fileStats.mtime.toISOString().slice(0, 19);

  let frontmatter = '';
  let body = source;
  const match = source.match(/^\s*---\r?\n([\s\S]*?)\r?\n---\r?\n?/);

  if (match) {
    frontmatter = match[1];
    body = source.slice(match[0].length);
  }

  const hasField = (name) => new RegExp(`^${name}\\s*:`, 'm').test(frontmatter);
  const prepend = [];

  if (!hasField('title')) prepend.push(`title: ${JSON.stringify(inferredTitle)}`);
  if (!hasField('date')) prepend.push(`date: ${inferredDate}`);

  if (!hasField('category')) {
    const legacyCategory = frontmatter.match(/^categor(?:ies|ties)\s*:\s*(.*)$/m);
    if (legacyCategory?.[1]?.trim()) {
      prepend.push(`category: ${legacyCategory[1].trim()}`);
    }
  }

  if (/^hidden\s*:\s*true\s*$/mi.test(frontmatter) || /^password\s*:/mi.test(frontmatter) || body.trim() === '') {
    prepend.push('draft: true');
  }

  body = body
    .replace(/\]\(\.\.\/images\//g, '](/images/')
    .replace(/\]\(\.\.\\images\\/g, '](/images/')
    .replace(/\{%\s*asset_img\s+\.\.\/images\/([^\s]+)\s+([^%]+?)\s*%\}/g, '![$2](/images/$1)')
    .replace(/<!--\s*more\s*-->/gi, '')
    .replace(/\{%\s*fold\s+([^%]+?)\s*%\}/g, '\n> **折叠内容：$1**\n')
    .replace(/\{%\s*endfold\s*%\}/g, '')
    .replace(/\{%\s*markmap[^%]*%\}/g, '')
    .replace(/\{%\s*endmarkmap\s*%\}/g, '')
    .replace(/\{%\s*blockquote\s+([^%]+?)\s*%\}/g, '\n> — $1\n>')
    .replace(/\{%\s*endblockquote\s*%\}/g, '')
    .replace(/^```C#\s*$/gim, '```csharp')
    .replace(/^```JAVA\s*$/gm, '```java')
    .replace(/^```\s*(?:mysql|SQL)\s*$/gm, '```sql')
    .replace(/^```Linux\s*$/gm, '```bash')
    .replace(/^```(?:Redis|url)\s*$/gm, '```text');

  const normalizedFrontmatter = [...prepend, frontmatter.trim()]
    .filter(Boolean)
    .join('\n');

  await writeFile(
    join(targetPosts, file),
    `---\n${normalizedFrontmatter}\n---\n\n${body.trimStart()}`,
    'utf8',
  );
}

console.log(`Migrated ${files.length} posts and copied the image library.`);
