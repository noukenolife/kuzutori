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
      const el_innerText = $el.innerText.replace(/\n/g, '').trim();

      const childrenWithTexts = children.length === 0 && el_innerText ? 
        [ { tag: 'TEXT', value: el_innerText, children: [] } ] : children.reverse().reduce((t, c, i) => {
          const c_innerText = c.innerText.replace(/\n/g, '').trim();
          const [rest, text] = c_innerText !== '' ? t[0].split(c_innerText) : [t[0]];

          const textNode = text ? [ { tag: 'TEXT', value: text, children: [] } ] : [];

          // Last child node
          let lastTextNode = [];
          if (i === children.length - 1) {
            lastTextNode = rest ? [ { tag: 'TEXT', value: rest, children: [] } ] : [];
          }

          return [ rest, [ ...lastTextNode, c, ...textNode, ...t[1], ] ];
        }, [ el_innerText, [] ])[1];

      return { 
        tag: $el.tagName,
        children: childrenWithTexts.map(c => c instanceof Element ? createTreeFrom(c) : c),
        ...Array.from($el.attributes).reduce((acc, a) => ({ ...acc, [`attr_${a.name}`]: a.value }), {}),
      };
    };

    const domTree = createTreeFrom(this.$el);

    return {
      hasBreadcrumbKeyword,
      // originalHtml: this.$el.outerHTML,
      domTree,
      x,
      y,
    };
  }
}
