const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const port = 3001;
const host = process.env.SERVER_HOSTNAME || 'localhost';
const db = require('../database/index.js');
const { readFile } = require('fs');
const https = require('https');
const http = require('http');

app.locals.title = 'Portfolio';
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
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
const projectRouter = express();  // app --> project 
const linksRouter = express();  // app --> link

app.use('/about.html', aboutRouter);
app.use('/links.html', linksRouter);
app.use('/email.html', emailRouter);
app.use('/projects.html', projectRouter);

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

projectRouter.get('/pickSize', (req, res) => {
  let files = ['code', 'embedded', 'fullstack', 'project'];
  let runner;
  let obj = {};

  let callback = (index) => {
    let currFile = files[index];
    let path;
    clearInterval(runner);

    if (index >= files.length) {
      res.send(obj)
    }

    if (index < files.length) {
      path = `http://localhost:3001/assets/images/${currFile}/meta.json`;
      http.get(path, (httpResponse) => {
        const { statusCode } = httpResponse;

        if (statusCode != 200) {
          res.status(404).send();
          return;
        }

        httpResponse.addListener("data", (rawDataChunk) => {
          obj[currFile] = JSON.parse(rawDataChunk.toString());
        });

        httpResponse.addListener("end", () => {
          runner = setTimeout(callback, 0, index + 1);
        })

      });

    }
  };
  runner = setTimeout(callback, 0, 0);
})
