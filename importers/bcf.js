require('dotenv').config();
const CSVBaseImporter = require('./csv_base');
const Entity = require('../entities/bcf');

module.exports = class Importer extends CSVBaseImporter {
  constructor(filename, session, db) {
    super(filename, session, db);
    this.Entity = Entity;
    this.default_delimiter = ',';
    this.columns = ['Flavor', 'SKU', 'Quantity', 'Item_Price', 'Price'];
  }
};
