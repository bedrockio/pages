// Note that mongoose global plugins must be applied before
// the model is created using mongoose.model. This means that
// this file must not require a file that will cause models to
// be loaded as the plugin will not be applied leading to documents
// not being cleaned and cause random test failures.
const mongoose = require('mongoose');

let stored;

function autoclean(schema) {
  schema.post('save', function () {
    if (this.destroy) {
      stored.add(this);
    }
  });
}

beforeEach(async () => {
  stored = new Set();
});

afterEach(async () => {
  if (stored) {
    await Promise.all(
      Array.from(stored).map((doc) => {
        return doc.destroy();
      })
    );
  }
});

mongoose.plugin(autoclean);
