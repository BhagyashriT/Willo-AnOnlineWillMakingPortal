const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
var db = require('../../db');

router.use( bodyParser.json() );       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

router.get('/', function (req, res) {
   db.query('SELECT * FROM subscription_model', function (error, results, fields) {
    if (error) throw error;
    console.log(JSON.stringify(results));
    res.send(JSON.stringify(results));
  });
});

router.post('/', function (req, res) {
  var sub_price = req.body.subInput;
  console.log("The sub price is: "+sub_price);
  if(sub_price==undefined||sub_price==""){
  		res.send({
			"code":200,
			"result":false
		});
		throw error;
  }
  else{
  	var sql = "UPDATE subscription_model SET annual_sub_price =(\'"+sub_price+"\')"
  	db.query(sql, function (error, results, fields){
  		if (error) 
	{
		console.log(error);
		res.send({
			"code":200,
			"result":false
		});
		throw error;
	}
	else
	    res.send({            
	    	"code":200,
	        "result":true
		});
  });
  }
});

module.exports = router;
