const CSVBaseImportEntity = require('./csv_base');

const trimRe = /^\s+|\s+$/g;

module.exports = class extends CSVBaseImportEntity {
  getName(record) {
    const name = record.Flavor;

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
    const volumeString = record.Volume;
    let volume = parseFloat(volumeString.replace(trimRe, '')) * parseFloat(quantity);
    if (Number.isNaN(volume)) {
      volume = 0;
    }
    return volume;
  }

  getPrice(record) {
    const priceString = record.Price;
    const price = parseFloat(priceString);
    return price;
  }

  getNotes(record) {
    const notes = record.Notes;
    return notes;
  }

  getScore(record) {
    const scoreString = record.Score;
    let score = parseFloat(scoreString.replace(trimRe, ''));
    if (Number.isNaN(score)) {
      score = null;
    }
    return score;
  }

  getDensity(record) {
    const densityString = record.Density;
    let density = parseFloat(densityString.replace(trimRe, ''));
    if (Number.isNaN(density)) {
      density = 0;
    }
    return density;
  }

  getStock(record) {
    const stockString = record.Stock;
    let stock = parseFloat(stockString.replace(trimRe, ''));
    if (Number.isNaN(stock)) {
      stock = 0;
    }
    return stock;
  }
};
