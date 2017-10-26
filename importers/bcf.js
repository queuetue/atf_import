require('dotenv').config();
const CSVBaseImporter = require('./csv_base');
const Entity = require('../entities/bcf');

module.exports = class Importer extends CSVBaseImporter {
  constructor(filename, session, db) {
    super(filename, session, db);
    this.Entity = Entity;
    this.delimiter = ',';
  }
};
