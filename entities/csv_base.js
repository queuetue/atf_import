
module.exports = class CSVBaseImportEntity {
  constructor(sessionId) {
    this.entity = { sessionId, state: 'incomplete' }; // Class?
  }

  getDensity() {
    return 1.0;
  }

  getPricePerMl() {
    if (this.entity.price && this.entity.volume) {
      return this.entity.price / this.entity.volume;
    }
    return 0;
  }

  getStock() {
    return 0;
  }

  getNotes() {
    return '';
  }

  getScore() {
    return null;
  }

  process(record) {
    this.entity.name = this.getName(record);
    const quantity = this.getQuantity(record);
    this.entity.volume = this.getVolume(record, quantity);
    this.entity.price = this.getPrice(record);
    this.entity.density = this.getDensity(record);
    this.entity.stock = this.getStock(record);
    this.entity.pricePerMl = this.getPricePerMl(record);
    this.entity.score = this.getScore(record);
    this.entity.notes = this.getNotes(record);
    this.entity.state = 'new';
  }
};
