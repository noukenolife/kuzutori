module.exports = function addEventListener(target, type, listener, options = {}) {
  target.addEventListener(type, listener, options);
  return {
    restore: () => target.addEventListener(type, listener, options),
    remove: (options = {}) => target.removeEventListener(type, listener, options),
  };
}
