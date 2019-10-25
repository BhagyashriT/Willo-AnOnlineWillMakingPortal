const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
var db = require('../../db');

router.use( bodyParser.json() );       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

router.get('/', function (req, res) {
   db.query('SELECT * FROM discount', function (error, results, fields) {
    if (error) throw error;
    //console.log(JSON.stringify(results));
    res.send(JSON.stringify(results));
  });
});

router.post('/', function (req, res) {
  var typed = req.body.typed;
  if(typed==="Insert"){
    var promoCode = req.body.promoCode;
    var discountVal = req.body.discountVal;
    var discountType = req.body.discountType;
    var activityType = req.body.activityType;
    if(promoCode==undefined||discountVal==undefined||discountType==undefined||activityType==undefined){
    		res.send({
  			"code":210,
  			"result":false
  		});
  		throw error;
    }
    else{
    	var sql = "INSERT INTO discount (promo_code,discount_value,discount_type,activity_flag) VALUES(\'"+promoCode+"\',\'"+discountVal+"\',\'"+discountType+"\',\'"+activityType+"\')"
    	db.query(sql, function (error, results, fields){
    		if (error) 
  	{
  		console.log(error);
  		res.send({
  			"code":205,
  			"result":false
  		});
  		// throw error;
  	}
  	else
  	    res.send({            
  	    	"code":200,
  	        "result":true
  		});
    });
    }
  }
  else if(typed==="Update"){
    var selectedPromo = req.body.selectedPromo;
    var activitySelected = req.body.activitySelected;
    var sql = "UPDATE discount SET activity_flag =(\'"+activitySelected+"\') WHERE promo_code=(\'"+selectedPromo+"\')"
    db.query(sql, function (error, results, fields){
      if (error) 
  {
    console.log(error);
    res.send({
      "code":200,
      "result":false
    });
    //throw error;
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
