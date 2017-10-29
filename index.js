require('dotenv').config();

const Sequelize = require('sequelize');

const sequelize = new Sequelize('mysql://root@localhost/atf-import');
const SessionModel = sequelize.import('./models/sessions');

const token = '7bc7f6c5-a411-4115-985d-01a3ee0de7c0';

SessionModel.findOne({ where: { token, state: 'new' } })
  .then((identity) => {
    if (identity) {
      const Importer = require(`./importers/${identity.file_type}`);
      identity.update({ state: 'working' });
      const importer = new Importer(identity);
      importer.import()
        .then(() => {
          console.log("Closing");
          sequelize.close();
          process.exit();
        });
    } else {
      sequelize.close();
      process.exit();
    }
  });
