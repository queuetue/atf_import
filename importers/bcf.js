require('dotenv').config();
const parse = require('csv-parse');
const fs = require('fs');
const Entity = require('../entities/bcf');

const mongoCollectionName = process.env.MONGO_COLLECTION;

module.exports = class BCFImporter {
  constructor(filename, session, db) {
    this.filename = filename;
    this.session = session;
    this.db = db;
  }

  save(e) {
    this.db.collection(mongoCollectionName).insertOne(e.entity, (err) => {
      if (err) throw err;
      if (e.entity.state !== 'new') {
        // console.log(e.entity.error);
      }
    });
  }

  import() {
    const parser = parse({ delimiter: ',' });
    let record;
    const { session } = this;
    const importer = this;

    parser.on('readable', () => {
      record = parser.read();
      while (record) {
        const e = new Entity(session);
        e.process(record);
        importer.save(e);
        record = parser.read();
      }
    });

    parser.on('error', (err) => {
      if (err) throw err;
      // console.log(err.message);
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
