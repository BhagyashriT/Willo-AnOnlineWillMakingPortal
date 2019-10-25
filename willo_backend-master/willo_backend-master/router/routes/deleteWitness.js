const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
var db = require('../../db');

router.use( bodyParser.json() );       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));


router.post('/', function (req, res) {
  console.log("Reached here delete witness;");
   console.log(req.query.willid);
   db.query('DELETE from user where user_id=?', [req.body.user_id], function (error, results, fields) {
	  if (error) throw error;
    db.query('DELETE from parties where will_id=? and user_id=?', [req.query.willid,req.body.user_id], function (error, results, fields) {
    res.send({
      "code":400,
      "result":true,
      "msg": "Successfully deleted"
    });
  });
	});
});


module.exports = router;
