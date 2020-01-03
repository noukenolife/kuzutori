const Kuzutori = require('./kuzutori');
const KuzutoriUI = require('./kuzutori_ui');

(async () => {
  const model = new Kuzutori();
  const ui = new KuzutoriUI({
    model,
  });

  ui.create();
  // ui.destroy();
})();
