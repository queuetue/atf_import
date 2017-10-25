require('dotenv').config();

const mongoUri = process.env.MONGO_URI;
const { MongoClient } = require('mongodb');

const mongoSessionCollectionName = `${process.env.MONGO_COLLECTION}Session`;

// Temporary vars for scaffolding
const fileType = 'bcf';
const filename = './samples/BCF_native_export.csv';

const Importer = require(`./importers/${fileType}`);

MongoClient.connect(mongoUri, (err, database) => {
  if (err) throw err;
  const sessionData = {
    filename,
    fileType,
    start: new Date(),
  };

  database.collection(mongoSessionCollectionName).insert(sessionData, (dbErr, r) => {
    new Importer(filename, r.ops[0]._id, database).import();
  });
});
