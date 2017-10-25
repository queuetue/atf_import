module.exports = class BCFImportEntity {
  constructor(sessionId) {
    this.entity = { sessionId, state: 'incomplete' }; // Class?
  }

  process(record) {
    let name;
    let volume;
    let price;

    const [nameAndVolume, , quantity, , totalPrice] = record;

    if (nameAndVolume === 'Cart Items') {
      this.entity.error = 'This appears to be a header.';
      return;
    }

    const nameRe = /^[^(]+/;
    const mlRe = /([0-9.]+) *(?:ml|mills)/;
    const ozRe = /([0-9.]+) *(?:oz|ounces)/;
    const priceRe = /[0-9.]+/;

    const trimRe = /^\s+|\s+$/g;

    let match = nameRe.exec(nameAndVolume);

    if (match) {
      name = match[0].trim();
    }

    if (name === null || name === undefined || name.length <= 0) {
      this.entity.error = 'Name is blank.';
      return;
    }

    this.entity.name = name;

    const reMatch = mlRe.exec(nameAndVolume);

    const ozMatch = ozRe.exec(nameAndVolume);

    if ((reMatch && ozMatch) || (!reMatch && !ozMatch)) {
      this.entity.error = 'Cannot determine volume.';
      return;
    }

    if (reMatch) {
      volume = parseFloat(reMatch[0].replace(trimRe, '')) * parseFloat(quantity);
    }

    if (ozMatch) {
      volume = parseFloat(ozMatch[0].replace(trimRe, '')) * 29.5 * parseFloat(quantity);
    }

    if (Number.isNaN(volume) || volume <= 0) {
      this.entity.error = 'Volume must be a number above 0.';
      return;
    }
    this.entity.volume = volume;

    match = priceRe.exec(totalPrice);
    if (match) {
      price = parseFloat(match[0]);
      this.entity.price = price;
    }

    const pricePerMl = price / volume;
    this.entity.pricePerMl = pricePerMl;
    this.entity.state = 'new';
  }
};
