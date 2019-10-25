const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
var db = require('../../db');

router.use( bodyParser.json() );       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));


router.get('/', function (req, res) {
  console.log("Reached here list executors;");
   console.log(req.query.willid);
   db.query('select a.user_id as user_id, a.name as name, a.email as email, a.contact as contact,b.party_type as party_type from user a inner join parties b on a.user_id=b.user_id and will_id=? and party_type in("primary executor","secondary executor")', [req.query.willid], function (error, results, fields) {
	  if (error) throw error;

      res.end(JSON.stringify(results));


	});
});


module.exports = router;
