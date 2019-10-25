const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
var db = require('../../db');

router.use( bodyParser.json() );       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));


router.get('/', function (req, res) {
  console.log("Reached here list will status;");
   console.log(req.query.will_id);
   db.query('select will_id, last_payment_dt, amount, due_date from finance where will_id=? ORDER by last_payment_dt DESC LIMIT 1', [req.query.will_id], function (error, results, fields) {
	  if (error) throw error;
	  res.end(JSON.stringify(results));
	});
});


module.exports = router;
