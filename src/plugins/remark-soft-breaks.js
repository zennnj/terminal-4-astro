import { visit } from 'unist-util-visit';

/** Render every Markdown soft line ending (LF, CRLF, or CR) as a visible <br>. */
export function remarkSoftBreaks() {
  return (tree) => {
    visit(tree, 'text', (node, index, parent) => {
      if (typeof index !== 'number' || !parent || !/[\r\n]/.test(node.value)) return;

      const replacement = [];
      node.value.split(/\r\n|\n|\r/).forEach((part, partIndex, parts) => {
        if (part) replacement.push({ type: 'text', value: part });
        if (partIndex < parts.length - 1) replacement.push({ type: 'break' });
      });
      parent.children.splice(index, 1, ...replacement);
      return index + replacement.length;
    });
  };
}
