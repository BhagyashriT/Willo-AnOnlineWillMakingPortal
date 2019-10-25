const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
var db = require('../../db');

router.use( bodyParser.json() );       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

router.post('/', function (req, res) {
  console.log("Reached postblob in server and user_id is:"+req.body.user_id);
   db.query('UPDATE user SET will_pdf = LOAD_FILE(?) WHERE user_id=?',[req.body.blobStore,req.body.user_id] ,function (error, results, fields) {
    if (error)
    {
    	console.log("Reached this point");
    	res.send({
    		"code":400,
    		"result":false,
    	})
    }
    else
    {
      res.send({
      "code":200,
      "result": true,
     });    	
    }
  });
});

module.exports = router;
