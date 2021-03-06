require('dotenv').config();
const csv = require('csv-stream');
const Entity = require('../entities/csv_base');
const request = require('request');
const Sequelize = require('sequelize');

const sequelize = new Sequelize('mysql://root@localhost/atf-import');
const SessionItemModel = sequelize.import('../models/session_items');

let promises = [];

module.exports = class CSVBaseImporter {
  constructor(session) {
    this.session = session;
    this.Entity = Entity;
    this.default_delimiter = ',';
    this.columns = ['Flavor', 'Density', 'Score', 'Cost', 'Volume', 'CostPerMl', 'Stock Level', 'Notes'];
  }

  save(e) {
    return SessionItemModel.create({
      session_id: this.session.id,
      complete: false,
      state: e.entity.state,
      name: e.entity.name,
      volume: e.entity.volume,
      density: e.entity.density,
      price: e.entity.price,
      stock: e.entity.stock,
      pricePerMl: e.entity.pricePerMl,
      score: e.entity.score,
      notes: e.entity.notes,
    });
  }


  import() {
    const options = { columns: this.columns };
    const csvStream = csv.createStream(options);
    const url = `https://storage.googleapis.com/dev-images.alltheflavors.com/imports/${this.session.filename}`;
    return new Promise((resolve, reject) => {
      request(url).pipe(csvStream)
        .on('error', (err) => {
          if (err) throw err;
        })
        .on('data', (data) => {
          const e = new this.Entity(this.session);
          e.process(data);
          promises.push(this.save(e));
        })
        .on('close', () => {
          return Promise.all(promises)
            .then(() => {
              this.session.changed('updated_at', true);
              this.session.save().then(() => {
                resolve();
              });
            });
        });
    });
  }
};
