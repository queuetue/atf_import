require('dotenv').config();
const CSVBaseImporter = require('./csv_base');
const Entity = require('../entities/elr');

module.exports = class Importer extends CSVBaseImporter {
  constructor(filename, session, db) {
    super(filename, session, db);
    this.Entity = Entity;
    this.default_delimiter = ';';
    this.columns = ['Flavor', 'Single_Percentage', 'Score', 'Price', 'Volume', 'Notes'];
  }
};
