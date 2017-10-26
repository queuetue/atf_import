const CSVBaseImportEntity = require('./csv_base');

const trimRe = /^\s+|\s+$/g;

module.exports = class BCFImportEntity extends CSVBaseImportEntity {
  getName(record) {
    const [name] = record;

    if (name === 'Flavor') {
      this.entity.error = 'This appears to be a header.';
      return null;
    }

    if (name === null || name === undefined || name.length <= 0) {
      this.entity.error = 'Name is blank.';
      return null;
    }
    return name;
  }

  getQuantity() {
    return 1;
  }

  getVolume(record, quantity) {
    const [, , , , volumeString] = record;
    let volume = parseFloat(volumeString.replace(trimRe, '')) * quantity;
    if (Number.isNaN(volume)) {
      volume = 0;
    }
    return volume;
  }

  getPrice(record) {
    const [, , , priceString] = record;
    let price = parseFloat(priceString);
    if (Number.isNaN(price)) {
      price = 0;
    }
    return price;
  }

  getNotes(record) {
    const [, , , , , notes] = record;
    return notes;
  }
};
