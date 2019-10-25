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
   db.query('SELECT will_id, children_name FROM children WHERE will_id=? group by will_id, children_name',
   	[req.query.will_id], function (error, results, fields) {
    if (error) throw error;
    if(results === null)
    {
    	console.log("Got nothing in the query");
    }
    console.log(JSON.stringify(results));
    res.send(JSON.stringify(results));
	});
});

module.exports = router;
