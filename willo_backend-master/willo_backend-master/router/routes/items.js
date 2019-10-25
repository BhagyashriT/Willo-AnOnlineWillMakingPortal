const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
var db = require('../../db');

router.use( bodyParser.json() );       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));



router.get('/', function (req, res) {
  console.log("Reached here item;");
   console.log(req.query.willid);
   db.query('SELECT a.belongings_id as belongings_id, a.belongings_category as belongings_category, a.belongings_name as belongings_name, b.belongings_desc as belongings_desc from belongings a inner join beneficiary_belongings b on a.belongings_id=b.belongings_id and b.will_id=? group by belongings_id, belongings_category, belongings_name, belongings_desc', [req.query.willid], function (error, results, fields) {
  	  if (error) throw error;
  	  res.end(JSON.stringify(results));
   });
});

module.exports = router;
