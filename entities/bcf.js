const CSVBaseImportEntity = require('./csv_base');

const trimRe = /^\s+|\s+$/g;

module.exports = class BCFImportEntity extends CSVBaseImportEntity {
  getName(record) {
    const nameAndVolume = record.Flavor;
    let name;

    if (nameAndVolume === 'Cart Items') {
      this.entity.error = 'This appears to be a header.';
      return null;
    }

    const nameRe = /^[^(]+/;
    const match = nameRe.exec(nameAndVolume);

    if (match) {
      name = match[0].trim();
    }

    if (name === null || name === undefined || name.length <= 0) {
      this.entity.error = 'Name is blank.';
      return null;
    }
    return name;
  }

  getQuantity(record) {
    const quantity = record.Quantity;

    if (quantity === null || quantity === undefined || quantity.length <= 0) {
      this.entity.error = 'Quantity is blank.';
      return null;
    }
    return quantity;
  }

  getVolume(record, quantity) {
    let volume;
    const nameAndVolume = record.Flavor;
    const mlRe = /([0-9.]+) *(?:ml|mills)/;
    const ozRe = /([0-9.]+) *(?:oz|ounces)/;

    const reMatch = mlRe.exec(nameAndVolume);
    const ozMatch = ozRe.exec(nameAndVolume);

    if ((reMatch && ozMatch) || (!reMatch && !ozMatch)) {
      this.entity.error = 'Cannot determine volume.';
      return null;
    }

    if (reMatch) {
      volume = parseFloat(reMatch[0].replace(trimRe, '')) * parseFloat(quantity);
    }

    if (ozMatch) {
      volume = parseFloat(ozMatch[0].replace(trimRe, '')) * 29.5 * parseFloat(quantity);
    }

    if (Number.isNaN(volume) || volume <= 0) {
      this.entity.error = 'Volume must be a number above 0.';
      return null;
    }
    return volume;
  }

  getPrice(record) {
    let price;
    const totalPrice = record.Price;
    const priceRe = /[0-9.]+/;
    const match = priceRe.exec(totalPrice);
    if (match) {
      price = parseFloat(match[0]);
      this.entity.price = price;
    }
    return price;
  }
};
