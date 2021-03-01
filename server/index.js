const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const port = 3001;
const host = process.env.SERVER_HOSTNAME || 'localhost';
const db = require('../database/index.js');
const fs = require('fs');
// const https = require('https');
// const http = require('http');

app.locals.title = 'Portfolio';
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, '..', 'public')));
app.listen(port, host, () => {
  /* connected */
  console.log('express server running on port 3001');
});

// console.log(app.locals.title);
var data = [];
var metadata = [];

const aboutRouter = express();  // app  -->   about-me  -->   router 
const emailRouter = express();  // app --> email email 
const projectRouter = express();  // app --> project git
const linksRouter = express();  // app --> link
const homeRouter = express(); // app --> home

app.use('/about.html', aboutRouter);
app.use('/links.html', linksRouter);
app.use('/email.html', emailRouter);
app.use('/projects.html', projectRouter);
app.use('/home.html', homeRouter);

aboutRouter.get('/data', (req, res) => {
  data.length = metadata.length = 0;

  db.sessionsql
    .then((schema) => {
      return schema.getTable('aboutme').select('year', 'data') // select table
        .execute();   // execute selection statement
    })
    .then((retTableSelectData) => {
      res.send(retTableSelectData.fetchAll());
    })
    // requested database error 
    .catch(err => {
      res.status(404);
    })
})

// links basepath = http://localhost:3001/links.html

linksRouter.get('/data', (req, res) => {
  db.sessionsql
    .then((schema) => {
      return schema.getTable('favoritelinks').select('name', 'url', 'descr')
        .execute();
    })
    .then((retTableSelectData) => {
      res.send(retTableSelectData.fetchAll());
    })
    .catch(err => {
      res.status(404);
    })
});

// links basepath = http://localhost:3001/email.html

emailRouter.get('/userMessages', (req, res) => {
  db.sessionsql
    .then((schema) => {
      return schema.getTable('email').select('username', 'date', 'image', 'message')
        .execute();
    })
    .then((retTableSelectData) => {
      res.send(retTableSelectData.fetchAll());
    })
    .catch(err => {
      res.status(404);
    })
});

emailRouter.get('/spiritAnimals', (req, res) => {
  db.sessionsql
    .then((schema) => {
      return schema.getTable('spirit_animal').select('name', 'url')
        .execute();
    })
    .then((retTableSelectData) => {
      res.send(retTableSelectData.fetchAll());
    })
    .catch(err => {
      res.status(404);
    })
});

emailRouter.put('/addRecord', (req, res) => {

  let attrs = ['id', 'username', 'date', 'image', 'message'];

  // select table
  db.sessionsql
    .then(schema => {
      return schema.getTable('email');
    })
    .then(spirit_animal_table => {
      return spirit_animal_table.count()
        .then(tableLength => {
          return spirit_animal_table.insert(attrs).
            values(tableLength, req.body.user, req.body.date, req.body.image, req.body.msg, req.body.id).
            execute();
        })
    })
    .then(() => {
      res.status(200).send();
    })
    .catch(err => {
      res.status(404).send();
    })
});

emailRouter.get('/sortUser', (req, res) => {
  db.sessionsql
    .then((schema) => {
      return schema.getTable('email')
        .select('username', 'date', 'image', 'message')
        .orderBy('username ASC')
        .execute();
    })
    .then(retTableSelectData => {
      res.send(retTableSelectData.fetchAll());
    })
    .catch(err => {
      res.status(404).send();
    })
})


emailRouter.get('/sortDate', (req, res) => {
  db.sessionsql
    .then((schema) => {
      return schema.getTable('email')
        .select('username', 'date', 'image', 'message')
        .orderBy('date ASC')
        .execute();
    })
    .then(retTableSelectData => {
      res.send(retTableSelectData.fetchAll());
    })
    .catch(err => {
      res.status(404).send();
    })
})

// links basepath = http://localhost:3001/projects.html

projectRouter.get('/selectTable', (req, res) => {
  let tables = ['code', 'embedded', 'full_stack', 'special_projects'];

  db.sessionsql
    .then((schema) => {
      return new Promise((resolve) => {
        let promises = [];

        tables.forEach((tableName, i) => {
          let obj = { directoryName: "", fileCount: 0, files: [] };
          let table = schema.getTable(tableName);

          table
            .select('name', 'descr')
            .execute()
            .then(retTable => {
              obj.files = retTable.fetchAll()
              obj.fileCount = obj.files.length;
              obj.directoryName = tableName;


              obj.files = obj.files.map(arr => {
                return { 'name': arr[0], 'description': arr[1] };
              });

              promises.push(obj);

              if (promises.length == 4) {
                resolve(promises)
              }
            })
        })
      })
    })

    // send data to client 
    .then(data => {
      let obj = {};
      data.forEach(ele => {
        obj[ele.directoryName] = {
          'fileCount': ele.fileCount,
          'files': ele.files
        };
      });
      res.send(obj)
    })
    .catch(err => {
      // console.log(err);
    })

})

projectRouter.get(/fieldEquals_?/, (req, res) => {
  let regex = req.url.match(/[^\/fieldEquals_].+/);

  if (regex) {
    regex = decodeURI(regex[0].split('-')).split(',');
  }

  if (regex[0].length == 0) {
    return res.status(404).send();
  }

  db.sessionsql
    .then((schema) => {
      let table = schema.getTable(regex[1] + '_records')
      return table
        .select('name', 'type', 'position', 'data')
        .where('name like :param')
        .bind('param', regex[0])
        .execute()
        .then(retTable => {
          res.send(JSON.stringify(retTable.fetchAll().map(ele => { return [ele[1] /*type*/, ele[3] /*data*/] })));
        })
        .catch(err => {
          res.status(404).send();
        })
    })

});

// home basepath = http://localhost:3001/home.html

homeRouter.get('/readVideos', (req, res) => {
  const jsonfile = path.resolve(__dirname, "..", "public", "assets", "videos", "meta.json");
  const dir = jsonfile.substr(0, jsonfile.lastIndexOf('\\'));
  const obj = [];

  fs.readdir(dir, "utf8", (err, fileList) => {
    if (err) {
      res.status(404).send();
    }
    else {

      new Promise((resolve, reject) => {
        let files = fileList.filter((f) => { return f.match(/vid.*/) != null });

        Promise.resolve(files)
          .then((files) => {


            files.forEach((file) => {
              let currFile = path.resolve(dir, file);
              fs.stat(currFile, "utf8", (err, stats) => {
                if (err) {
                  reject();
                }
                else {
                  obj.push({ fileName: file, date: stats.birthtime.toISOString().substr(0, stats.birthtime.toISOString().lastIndexOf("T")) });
                  if (obj.length == files.length) {
                    resolve(obj);
                  }
                }
              })
            });
          })
      })
        .then((data) => {
          res.send(data);
        })
        .catch(() => {
          res.status(404).send();
        });

    }
  })
});

