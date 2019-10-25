var mysql      = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost', //mysql database host name
  user     : 'root', //mysql database user name
  password : 'youmayenter', //mysql database password
  database : 'willodb', //mysql database name
  multipleStatements : true
});

connection.connect(function(err) {
    if (err) throw err;
    console.log('You are now connected from db.js...')
});

module.exports = connection;
