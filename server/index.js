const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const port = 3001;
const host = process.env.SERVER_HOSTNAME || 'localhost';

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.resolve(__dirname, '..', 'public')));
app.listen(port, host, () => {
  /* connected */
  console.log('express server running on port 3001');
});
