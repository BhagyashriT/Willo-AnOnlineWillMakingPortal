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

 db.query('DELETE from beneficiary_belongings where belongings_id=? and will_id=?', [req.query.belongings_id,req.query.willid,], function (error, results, fields) {
       if (error) throw error;
       var details = 'Deleted belongings ' + req.body.belongings_name;
       db.query('INSERT INTO log (will_id, log_details) VALUES (?,?)',[req.query.willid, details], function (error, results, fields) {
       });
       res.send({
         "code":400,
         "result":true
       })
     });


});

module.exports = router;
