module.exports = class Kuzutori {
  contractor(options) {
    this.isActive = options.isActive || false;
  }

  toggleActivation() {
    this.isActive = !this.isActive;
  }
}
