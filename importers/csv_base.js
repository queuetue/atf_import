require('dotenv').config();
const parse = require('csv-parse');
const fs = require('fs');
const Entity = require('../entities/csv_base');

const mongoCollectionName = process.env.MONGO_COLLECTION;

module.exports = class CSVBaseImporter {
  constructor(filename, session, db) {
    this.filename = filename;
    this.session = session;
    this.db = db;
    this.Entity = Entity;
    this.delimiter = ',';
  }

  save(e) {
    this.db.collection(mongoCollectionName).insertOne(e.entity, (err) => {
      if (err) throw err;
    });
  }


  import() {
    const parser = parse({ delimiter: this.delimiter });
    let record;

    parser.on('readable', () => {
      record = parser.read();
      while (record) {
        const e = new this.Entity(this.session);
        e.process(record);
        this.save(e);
        record = parser.read();
      }
    });

    parser.on('error', (err) => {
      if (err) throw err;
    });

    parser.on('finish', () => {
      this.db.close();
    });

    fs.readFile(this.filename, (err, data) => {
      if (err) throw err;
      parser.write(data);
      parser.end();
    });
  }
};
