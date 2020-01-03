module.exports = class BreadcrumbScraper {
  constructor(options) {
    this.$el = options.$el;
  }

  scrape() {
    const attrs = Array.from(this.$el.attributes);

    // Checks if one of the parent attributes has the keyword "bread"
    const hasBreadcrumbKeyword = attrs.map(a => a.value.toLowerCase()).some(a => a.includes('bread'));

    // Gets the parent element position
    const pos = this.$el.getBoundingClientRect();
    const x = pos.left;
    const y = pos.top;

    // Gets a tree structure of element
    const createTreeFrom = ($el) => {
      const children = Array.from($el.children);

      const $clonedEl = $el.cloneNode(true);
      Array.from($clonedEl.children).forEach(c => $clonedEl.removeChild(c));

      return { 
        tag: $el.tagName,
        text: $clonedEl.innerText.trim(),
        children: children.map($c => createTreeFrom($c)),
        ...Array.from($el.attributes).reduce((acc, a) => ({ ...acc, [`attr_${a.name}`]: a.value }), {}),
      };
    };

    // Pruning
    const pruneTree = (node) => {
      return { 
        ...node,
        children: node.children.filter(c => c.children.length > 0 || c.text !== '').map(c => pruneTree(c)),
      };
    };

    const domTree = pruneTree(createTreeFrom(this.$el));

    return {
      hasBreadcrumbKeyword,
      originalHtml: this.$el.outerHTML,
      domTree,
      x,
      y,
    };
  }
}
