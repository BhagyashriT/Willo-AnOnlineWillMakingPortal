const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
var db = require('../../db');
var nodemailer = require('nodemailer');

router.use( bodyParser.json() );       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

router.get('/', function (req, res) {
  //var postData  = req.body;
console.log("checking the will id", req.query.willid);
db.query('SELECT user_id FROM parties WHERE will_id = ? and party_type="owner"', [req.query.willid], function (error, results, fields) {
if (error) throw error;
  db.query('SELECT feedback from user_feedback where user_id=? order by feedback_ts',[results[0].user_id], function (error, results, fields) {
    res.send(JSON.stringify(results));
  });
});
});

module.exports = router;
