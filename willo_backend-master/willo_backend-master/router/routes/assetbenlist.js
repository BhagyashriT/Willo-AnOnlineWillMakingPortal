const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
var db = require('../../db');

router.use( bodyParser.json() );       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

router.get('/', function (req, res) {
   console.log("The will id is:"+req.query.will_id);
   db.query('SELECT c.belongings_id as belongings_id, c.belongings_name as belongings_name, GROUP_CONCAT(DISTINCT b.name order by b.name) as name from beneficiary_belongings a inner join user b on a.user_id = b.user_id inner join belongings c on a.belongings_id = c.belongings_id where a.will_id=? GROUP BY belongings_id, belongings_name',[req.query.willid], function (error, results, fields) {
    if (error) throw error;
    console.log(JSON.stringify(results));
    res.send(JSON.stringify(results));
	});
});

module.exports = router;
