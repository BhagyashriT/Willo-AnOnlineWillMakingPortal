const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
var db = require('../../db');

router.use( bodyParser.json() );       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));


router.get('/', function (req, res) {
  console.log("Reached here get last payment dt;");
   console.log(req.query.willid);
   db.query('SELECT last_payment_dt, amount, due_date from finance where will_id=? order by last_payment_dt desc limit 1', [req.query.willid], function (error, results, fields) {
	  if (error) throw error;
    if(results.length===0){
      res.send({
        "code":400,
        "result":false,
        "msg": "No payment made yet"
      });
    }
    else{
      res.end(JSON.stringify(results));
    }
	});
});


module.exports = router;
