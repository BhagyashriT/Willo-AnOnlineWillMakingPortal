const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
var db = require('../../db');

router.use( bodyParser.json() );       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

router.get('/', function (req, res) {
  console.log("Reached stats in server");
   db.query('select EXTRACT(YEAR_MONTH from last_payment_dt) as year_mm, SUM(amount) as amount from finance group by year_mm order by year_mm asc;', function (error, results, fields) {
    if (error) throw error;
    console.log(JSON.stringify(results));
    res.send(JSON.stringify(results));
  });
});


module.exports = router;
