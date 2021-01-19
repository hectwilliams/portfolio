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

app.use('/about.html', aboutRouter);

// aboutme route  --= http://localhost:3001/about.html

aboutRouter.get('/data', (req, res) => {
  data.length = metadata.length = 0;

  db.sessionsql
    .then((schema) => {
      return schema.getTable('aboutme').select('year', 'data') // select table
        .execute()   // execute selection statement
    })
    .then((retTableSelectData) => {
      res.send(retTableSelectData.fetchAll());
      console.log("request data from server");
    })
    // requested database error 
    .catch(err => {
      res.status(404);
      console.log("error");
    })
})
