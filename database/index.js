const mysqlx = require('@mysql/xdevapi');

const config = {
  password: 'testing123',
  user: 'newuser',
  host: 'localhost',
  port: '33060',
  schema: 'marveldb'
};

const session = mysqlx.getSession(config)
  .then(session => {
    return session.getSchema('marveldb');
  }) // schema returned

exports.sessionsql = session;
