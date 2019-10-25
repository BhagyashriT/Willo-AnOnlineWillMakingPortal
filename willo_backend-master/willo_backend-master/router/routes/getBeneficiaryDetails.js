const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
var db = require('../../db');

router.use( bodyParser.json() );       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

router.get('/', function (req, res) {
  console.log("Reached here beneficiary details;")
   console.log(req.query.beneficiaryName);
   db.query('select user_id, name, relationship, contact, email, dob from user where name =?', [req.query.beneficiaryName], function (error, results, fields) {
	  if (error) throw error;
	  res.end(JSON.stringify(results));
	});
});

module.exports = router;
