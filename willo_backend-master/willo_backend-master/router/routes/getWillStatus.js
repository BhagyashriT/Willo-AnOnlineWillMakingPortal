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
   console.log(req.query.willid);
   db.query('select will_id, will_status from will where will_id=?', [req.query.willid], function (error, results, fields) {
	  if (error) throw error;
	  res.end(JSON.stringify(results));
	});
});


module.exports = router;
