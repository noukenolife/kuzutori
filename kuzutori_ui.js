const addEventListener = require('./util/add_event_listener');
const BreadcrumbScraper = require('./breadcrumb_scraper');

module.exports = class KuzutoriUI {
  contractor(options) {
    // States
    this.model = options.model;
    this.selected = false;

    // DOM
    this.$el = options.$el;
    this.$selected = undefined;
    this.$popup = undefined;

    // Events
    this.mouseover = undefined;
    this.eventListeners = [];
  }

  onSelectDOM(e) {
    // e.preventDefault();
    e.stopPropagation();

    this.selected = true;

    if (this.$popup) {
      this.$popup.remove();
    }

    this.$popup = this.createPopup(e.clientX, e.clientY);

    const scraper = new BreadcrumbScraper({ $el: e.target });
    const result = scraper.scrape();
    const $result = document.createElement('div');
    console.log(JSON.stringify(result));
    this.$popup.appendChild($result);

    document.body.appendChild(this.$popup);
  }

  onMouseOver(e) {
    if (
      this.$popup &&
      (e.target === this.$popup || Array.from(this.$popup.children).includes(e.target))
    ) { return; }

    if (this.$selected) {
      this.$selected.style['border'] = this.$selected.dataset.kuzutoriBorder;
      this.$selected.style['background-color'] = this.$selected.dataset.kuzutoriBackgroundColor;
      this.$selected.style['opacity'] = 1.0;
    }

    if (this.$selected !== e.target) {
      this.$selected = e.target;
      this.$selected.dataset.kuzutoriBorder = this.$selected.style['border'];
      this.$selected.dataset.kuzutoriBackgroundColor = this.$selected.style['background-color'];
      this.$selected.style['background-color'] = 'green';
      this.$selected.style['border'] = '1px solid black';
      this.$selected.style['opacity'] = 0.2;
    }
  }

  createPopup(x, y) {
    const $popup = document.createElement('div');
    $popup.style['position'] = 'absolute';
    $popup.style['top'] = `${y}px`;
    $popup.style['left'] = `${x}px`;
    $popup.style['height'] = '100px';
    $popup.style['backgroundColor'] = 'white';
    $popup.style['border'] = '1px solid black';

    const $close = document.createElement('a');
    $close.setAttribute('href', 'javascript:void(0);');
    $close.innerText = 'X';
    $close.style['position'] = 'absolute';
    $close.style['right'] = '0.5rem';
    $close.style['top'] = '0.25rem';
    const click = addEventListener($close, 'click', (e) => {
      e.stopPropagation();
      $popup.remove();
      click.remove();
    });

    $popup.appendChild($close);

    return $popup;
  }

  create() {
    this.mouseover = addEventListener(document, 'mouseover', (e) => { 
      // this.onMouseOver(e);
    });
    const click = addEventListener(document, 'click', (e) => {
      this.onSelectDOM(e);
    });

    // Registers event listeners
    this.eventListeners = [
      this.mouseover,
      click,
    ];
  }

  destroy() {
    // Removes all event listeners registered in this class
    this.eventListeners.forEach(listener => listener.remove());
  }
}
