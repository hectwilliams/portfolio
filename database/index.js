const mysqlx = require('@mysql/xdevapi');
const fs = require('fs');
const path = require('path');
const { exit } = require('process');
const metaFile = 'hidefile-meta.json';
const json = JSON.parse(fs.readFileSync(path.resolve(__dirname, metaFile)));
const readline = require('readline');

const config = {
  password: 'testing123',
  user: 'newuser',
  host: 'localhost',
  port: '33060',
  schema: 'marveldb'
};

const session = mysqlx.getSession(config)
  .then(session => {
    let functor = (noop) => { }; // dummy function 
    if (process.argv.length == 3) {
      if (process.argv[2] == 'init') {
        functor = initdb;
      }
    }
    return Promise.resolve(functor(session))
      .then(() => {
        return Promise.resolve(session);
      })
      .catch((err) => {
        console.log(err);
      })
  })
  .then((session) => {
    return session.getSchema(config.schema);
  })
  .catch((err) => {
    console.log(err);
  })

exports.sessionsql = session;  // db schema 

/*
  initialize database with static data. 
*/

const initdb = function (session) {
  let db = session.getSchema('marveldb');

  return Promise.all(json.sqlCmds.map((createEntry) => {
    /*load tables*/
    return session.sql(createEntry).execute()
      .catch(err => {
        // console.log(err.info)
      })
  }))

    .then(() => {
      let table;
      let tableLengthInit = 4;
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

    /* store page data in respective table */

    .then(() => {
      return new Promise((resolve, reject) => {
        let buffer = "";
        let regexBuffer = [];
        let table;
        let promises = [];

        const readStream = fs.createReadStream(path.resolve(__dirname, 'apps.csv'));

        const rl = readline.createInterface({
          input: readStream
        });

        /* parse .csv */

        rl.on('line', (currLine) => {
          if (currLine.indexOf("Name,Mode,Description") != -1) {
            return;
          }

          buffer += currLine;
          regexBuffer = regexBuffer.concat(currLine.match(/\"{3}/g));

          if (regexBuffer.length == 2) {

            buffer = buffer.replace(/\"{2}/g, ""); // remove double quotes
            regexBuffer = buffer.split(/(?<!\".+),/);   // split into 3 segments 
            regexBuffer[2] = regexBuffer[2].replace(/.?\"{1}/g, "");  // remove third element quotes
            regexBuffer[1] = regexBuffer[1].toLowerCase();

            if (  /*list of tables*/['full_stack', 'embedded', 'code', 'special_project'].indexOf(regexBuffer[1]) != -1) {

              table = db.getTable(regexBuffer[1]);

              promises.push(table
                .insert(['NAME', 'DESCR'])
                .values(([regexBuffer[0], regexBuffer[2]]))   //regexBuffer [0]-name  [1]-table type  [2]-description
                .execute()
                .catch((err) => { return err.info })
              )
            }

            regexBuffer = [];
            buffer = "";
          }
        });

        readStream.on('end', () => {
          // console.log("read complete");
        });

        readStream.on('close', () => {
          Promise.all(promises) // database writes completed 
            .then(() => resolve("database init process - PHASE 1 complete "))
        });

      })
    })

    .then((msg) => {
      let buffer = "";
      let regexBuffer = [];
      let table, tableName;
      let validCSVRow = false;
      let promises = [];
      const readStream = fs.createReadStream(path.resolve(__dirname, 'pagedata.csv'));

      console.log(msg);

      return new Promise((resolve) => {
        const rl = readline.createInterface({
          input: readStream
        });

        /* parse .csv */
        rl.on('line', (currLine) => {
          if (currLine.indexOf("Name,Type,Vertical Position,Data") != -1) {
            validCSVRow = true;
            return;
          }

          if (validCSVRow) {
            buffer += currLine;
            buffer = buffer.trim();
            if (buffer.indexOf('"') != 0 && buffer.lastIndexOf('"') == buffer.length - 1) {
              regexBuffer = buffer.split(/(?<!\".+),/);   // split into 3 segments 

              tableName = {
                0: 'full_stack',
                1: 'embedded',
                2: 'code',
                3: 'special_project'
              }[regexBuffer[0]];

              if (!tableName) {
                return;
              }

              tableName += '_records';
              table = db.getTable(tableName);

              promises.push(
                table
                  .insert(['name', 'type', 'position', 'data'])
                  .values(regexBuffer.slice(1))
                  .execute()
                  .catch((err) => { return err.info })
              )
              buffer = "";
            }
          }
        });

        rl.on("end", () => {
          console.log("stream complete");
        });

        rl.on("close", () => {
          Promise.all(promises) // database writes completed 
            .then(() => resolve("database init process - PHASE  2 complete "))
        });
      })

    })

    .then(msg => {
      console.log(msg);

      exit();
    })

}





