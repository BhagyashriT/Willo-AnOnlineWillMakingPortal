const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
var db = require('../../db');

router.use( bodyParser.json() );       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

router.post('/', function (req, res) {
  console.log("Reached useraccounts1 in server and user_id is:"+req.body.user_id);
   db.query('select a.* , b.party_type, b.will_id from user a inner join parties b on a.user_id=b.user_id and b.will_id \
   	in (select will_id from parties where party_type= \'owner\' and user_id=?)',[req.body.user_id], function (error, results, fields) {
    if (error) throw error;
    console.log(JSON.stringify(results));
    res.send(JSON.stringify(results));
  });
});

module.exports = router;
