const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
var db = require('../../db');

router.use( bodyParser.json() );       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

router.get('/', function (req, res) {
   db.query('SELECT * FROM subscription_model', function (error, results, fields) {
    if (error) throw error;
    db.query('SELECT * FROM discount where activity_flag="Active"',function (error, results1, fields) {
      results.push({"promo_code":results1[0].promo_code,"discount_value":results1[0].discount_value,"discount_type":results1[0].discount_type});
      res.send(JSON.stringify(results));
    });

  });
});


module.exports = router;
