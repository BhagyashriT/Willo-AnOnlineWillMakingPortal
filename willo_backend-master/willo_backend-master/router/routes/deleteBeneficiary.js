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
  console.log("Reached here 2");
 db.query('DELETE FROM user WHERE user_id = ?', req.query.benid, function (error, results, fields) {
       if (error) throw error;
     });
db.query('DELETE FROM parties WHERE user_id = ?', req.query.benid, function (error, results, fields) {
      if (error) throw error;
      });
      db.query('select name FROM user WHERE user_id in (select user_id from parties where party_type="beneficia" and will_id)', req.query.willid, function (error, results, fields) {
            if (error) throw error;
            var details = 'Deleted Beneficiary';
            db.query('INSERT INTO log (will_id, log_details) VALUES (?,?)',[req.query.willid, details], function (error, results, fields) {
            });
            res.send(JSON.stringify(results));
            });
});

module.exports = router;
