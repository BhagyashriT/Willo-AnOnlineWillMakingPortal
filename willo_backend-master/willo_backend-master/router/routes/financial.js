const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
var db = require('../../db');

router.use( bodyParser.json() );       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

router.get('/', function (req, res) {
  console.log("Reached financial in server");
   db.query('select c.name as name, c.email as email, fin.last_payment_dt as last_payment_dt, fin.due_date as due_date from finance fin inner join parties b on fin.will_id=b.will_id and b.party_type=\'owner\' inner join user c on b.user_id =c.user_id where fin.due_date<=CURRENT_DATE and fin.last_payment_dt<=DATE_SUB(fin.due_date, INTERVAL 1 YEAR)', function (error, results, fields) {
    if (error) throw error;
    console.log(JSON.stringify(results));
    res.send(JSON.stringify(results));
  });
});

module.exports = router;
