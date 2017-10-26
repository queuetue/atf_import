const CSVBaseImportEntity = require('./csv_base');

const trimRe = /^\s+|\s+$/g;

module.exports = class Entity extends CSVBaseImportEntity {
  getName(record) {
    let name;
    const [nameAndVolume] = record;

    if (nameAndVolume === 'Item') {
      this.entity.error = 'This appears to be a header.';
      return null;
    }

    const nameRe = /^(.*) [0-9]+(?:ml|oz)/;
    const match = nameRe.exec(nameAndVolume);

    if (match) {
      [, name] = match;
      name = name.replace(' by ', ' ');
      name = name.replace('Size', '');
      name = name.replace('Capella Flavor Drops', 'Capella');
      name = name.replace('Flavor Express', 'Flavors Express');
      name = name.replace('Tobacco Express', 'Flavors Express');
      name = name.replace('Lotus Flavors', 'Medicine Flower');
      name = name.replace('Signature (TFA)', '(TFA)');
      name = name.trim();
    }

    if (name === null || name === undefined || name.length <= 0) {
      this.entity.error = 'Name is blank.';
      return null;
    }

    return name;
  }

  getQuantity(record) {
    const [, , quantity] = record;

    if (quantity === null || quantity === undefined || quantity.length <= 0) {
      this.entity.error = 'Name is blank.';
      return null;
    }
    return quantity;
  }

  getVolume(record, quantity) {
    let volume;
    const [nameAndVolume] = record;
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
    const [, , , totalPrice] = record;
    const priceRe = /[0-9.]+/;
    const match = priceRe.exec(totalPrice);
    if (match) {
      price = parseFloat(match[0]);
      this.entity.price = price;
    }
    return price;
  }
};
