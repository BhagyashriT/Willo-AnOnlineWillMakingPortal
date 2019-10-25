const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
var db = require('../../db');

router.use( bodyParser.json() );       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));


router.post('/', function (req, res) {
  console.log("Reached here list witness");
   console.log(req.query.willid);
   db.query('UPDATE user set name=?, email=?, contact=? where user_id=?', [req.body.name, req.body.email, req.body.contact, req.body.user_id], function (error, results, fields) {
	  if (error) throw error;
    res.send({
      "code":400,
      "result":true,
      "msg": "Successfully added"
    });
	});
});


module.exports = router;
