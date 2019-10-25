const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
var db = require('../../db');
var nodemailer = require('nodemailer');

router.use( bodyParser.json() );       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

router.post('/', function (req, res) {
db.query('INSERT INTO belongings (belongings_name, belongings_category) VALUES(?, ?)', [req.body.belongings_name, req.body.belongings_category], function (error, results, fields) {
      if (error) throw error;
      else{
        db.query('SELECT belongings_id from belongings where belongings_name=? and belongings_category=? and belongings_id!=?', [req.body.belongings_name, req.body.belongings_category, req.body.belongings_id], function (error, results, fields) {
         console.log(results[0].belongings_id);
          db.query('UPDATE beneficiary_belongings SET belongings_id=?, belongings_desc=? where will_id=? and belongings_id=?', [results[0].belongings_id, req.body.belongings_desc ,req.query.willid, req.body.belongings_id], function (error, results, fields) {
        });
      });
        var details = 'Edited Item ' + req.body.belongings_name ;
        db.query('INSERT INTO log (will_id, log_details) VALUES (?,?)',[req.query.willid, details], function (error, results, fields) {
          res.send({
            "code":400,
            "result":true
          })
        });

      }

    });
});

module.exports = router;
