require('dotenv').config();
const CSVBaseImporter = require('./csv_base');
const Entity = require('../entities/atf');

module.exports = class extends CSVBaseImporter {
  constructor(filename, session, db) {
    super(filename, session, db);
    this.Entity = Entity;
    this.delimiter = ',';
  }
};
