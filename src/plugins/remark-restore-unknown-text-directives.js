import {visit} from 'unist-util-visit';

/**
 * Restore inline text that remark-directive parsed as an unsupported directive.
 *
 * A normal sentence such as `Q:question` can be parsed as a textDirective when
 * the text after the colon is a valid directive name. Unhandled directives emit
 * no content, so use the node's original source range to preserve the author's
 * Markdown exactly. Supported directives have already been transformed before
 * this plugin runs and therefore no longer have the `textDirective` type.
 */
export function remarkRestoreUnknownTextDirectives() {
  return function (tree, file) {
    const source = String(file.value ?? '');

    visit(tree, 'textDirective', (node, index, parent) => {
      const start = node.position?.start.offset;
      const end = node.position?.end.offset;

      if (!parent || index === undefined || start === undefined || end === undefined) {
        return;
      }

      parent.children[index] = {
        type: 'text',
        value: source.slice(start, end),
      };
    });
  };
}
