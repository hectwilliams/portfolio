const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const port = 3001;
const host = process.env.SERVER_HOSTNAME || 'localhost';
const db = require('../database/index.js');

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
const appsRouter = express();  // app --> apps email 
const linksRouter = express();

app.use('/about.html', aboutRouter);
app.use('/links.html', linksRouter);
app.use('/email.html', emailRouter);

// aboutme basepath = http://localhost:3001/about.html

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
            values(tableLength, req.body.user, req.body.date, req.body.image, req.body.msg).
            execute();
        })
    })
    .then(() => {
      res.status(200).send();
    })
    .catch(err => {
      console.log(err)
      res.status(404).send();
    })
});

/**
 * read id 1
 *  MySQL  localhost:33060+ ssl  marveldb  JS > db.getTable('email').select().where('id like :param').bind('param', '1').execute()
+----+-------------+------------+-------+---------------------------------------+
| ID | USERNAME    | DATE       | IMAGE | MESSAGE                               |
+----+-------------+------------+-------+---------------------------------------+
|  1 | whatsmyname | 2021-01-21 | NULL  | Nice page I really think it's smaller |
+----+-------------+------------+-------+---------------------------------------+
1 row in set (0.0005 sec)
 *
 * delete row 1
 *  MySQL  localhost:33060+ ssl  marveldb  JS > db.getTable('email').delete().where('id like :param').bind('param', '1').execute();
Query OK, 1 item affected (0.0893 sec)
 */