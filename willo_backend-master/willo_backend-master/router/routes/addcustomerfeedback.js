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
  //var postData  = req.body;
console.log("checking the will id", req.query.willid);
db.query('SELECT user_id FROM parties WHERE will_id = ? and party_type="owner"', [req.query.willid], function (error, results, fields) {
if (error) throw error;
  db.query('INSERT INTO user_feedback (user_id, feedback) VALUES (?,?)',[results[0].user_id, req.body.feedback], function (error, results, fields) {
    res.send({
      "code":400,
      "result":true
    });
  });
});

});

module.exports = router;
