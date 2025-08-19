import { visit } from 'unist-util-visit';

export default function remarkBreaksSafeMath() {
  return (tree) => {
    visit(tree, 'text', (node, index, parent) => {
      let insideMath = false;
      let p = parent;
      while (p) {
        if (p.type === 'math' || p.type === 'inlineMath') {
          insideMath = true;
          break;
        }
        p = p.parent;
      }
      if (!insideMath && typeof node.value === 'string') {
        node.value = node.value.replace(/\n/g, '  \n');
      }
    });
  };
}
