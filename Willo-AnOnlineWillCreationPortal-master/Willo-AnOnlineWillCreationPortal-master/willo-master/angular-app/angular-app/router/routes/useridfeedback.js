const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
var db = require('../../db');

router.use( bodyParser.json() );       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

router.get('/', function (req, res) {
  console.log("Reached useridfeedback in server");
   db.query('SELECT a.name as name ,a.email as email, b.feedback_ts as feedback_ts, b.feedback as feedback FROM user a INNER JOIN user_feedback b ON a.user_id=b.user_id\
             where (a.user_id, email, feedback_ts) in\
            (select a.user_id as user_id, email, MAX(b.feedback_ts) as feedback_ts FROM user a INNER JOIN user_feedback b ON a.user_id=b.user_id WHERE b.user_id=? group by email);',
   	[req.query.user_id], function (error, results, fields) 
  {
    if (error) throw error;
    console.log(JSON.stringify(results));
    res.send(JSON.stringify(results));
  });
});

module.exports = router;
