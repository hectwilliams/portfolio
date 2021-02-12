const mysqlx = require('@mysql/xdevapi');
const fs = require('fs');
const path = require('path');
const metaFile = 'hidefile-meta.json';
const json = JSON.parse(fs.readFileSync(path.resolve(__dirname, metaFile)));

const config = {
  password: 'testing123',
  user: 'newuser',
  host: 'localhost',
  port: '33060',
  schema: 'marveldb'
};

const session = mysqlx.getSession(config)
  .then(session => {
    return initdb(session)
      .then(() => {
        return session.getSchema(config.schema);
      })
      .catch((err) => {
        // console.log(err);
        return null;
      });
  })

exports.sessionsql = session;

/*
  initialize database with static data. 
*/
const initdb = function (session) {

  return Promise.all(json.sqlCmds.map((createEntry) => {
    /*load tables*/
    return session.sql(createEntry).execute()
      .catch(err => { /* */ })
  }))

    .then(() => {
      let table;
      let tableLengthInit = 4;
      let db = session.getSchema('marveldb');
      let store = Array(tableLengthInit).fill(true);

      /*load init records*/
      table = db.getTable('email');

      store[0] = table.count()
        .then((len) => {  //  1-valid  0-invalid
          return new Promise((resolve) => {
            if (len) {
              resolve(1);
            }
            if (len == 0) {
              table
                .insert(JSON.parse(json.tables[0].fields))
                .values(json.tables[0].records[0])
                .execute()
                .then(() => { resolve(0) })
            }
          })
        })

      table = db.getTable('favoritelinks');
      store[1] = table.count()
        .then(len => {
          return new Promise((resolve) => {
            if (len) {
              resolve(1);
            }
            if (len == 0) {
              table
                .insert(JSON.parse(json.tables[1].fields))
                .values(json.tables[1].records[0])
                .values(json.tables[1].records[1])
                .values(json.tables[1].records[2])
                .values(json.tables[1].records[3])
                .execute()
                .then(() => { resolve(0) })
            }
          })
        })

      table = db.getTable('aboutme');
      store[2] = table.count()
        .then(len => {
          return new Promise((resolve) => {
            if (len) {
              resolve(1);
            }
            if (len == 0) {
              table
                .insert(JSON.parse(json.tables[2].fields))
                .values(json.tables[2].records[0])
                .values(json.tables[2].records[1])
                .values(json.tables[2].records[2])
                .values(json.tables[2].records[3])
                .values(json.tables[2].records[4])
                .values(json.tables[2].records[5])
                .values(json.tables[2].records[6])
                .values(json.tables[2].records[7])
                .execute()
                .then(() => { resolve(0) })

            }
          })
        })

      table = db.getTable('spirit_animal');
      store[3] = table.count()
        .then(len => {
          return new Promise((resolve) => {
            if (len) {
              resolve(1);
            }
            if (len == 0) {
              table
                .insert(JSON.parse(json.tables[3].fields))
                .values(json.tables[3].records[0])
                .values(json.tables[3].records[1])
                .values(json.tables[3].records[2])
                .values(json.tables[3].records[3])
                .values(json.tables[3].records[4])
                .values(json.tables[3].records[5])
                .execute()
                .then(() => { resolve(0) })
            }
          })
        })

      return Promise.all(store);
    })

    .then(initData => {
      if (initData.indexOf(0) != -1) {
        console.log("database table(s) initialized")
      }
    })

}
