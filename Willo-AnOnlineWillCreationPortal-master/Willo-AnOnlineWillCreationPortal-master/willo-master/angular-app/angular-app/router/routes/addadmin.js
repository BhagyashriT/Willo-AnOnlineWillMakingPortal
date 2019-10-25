const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
var db = require('../../db');

router.use( bodyParser.json() );       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

router.get('/', function (req, res) {
	db.query('SELECT * FROM admin', function (error, results, fields) {
	 if (error) throw error;
	 //console.log(JSON.stringify(results));
	 res.send(JSON.stringify(results));
 });
});

router.post('/', function (req, res) {
  var typed = req.body.typed;
  var flagStat = false;
	if(typed==="Insert"){
    var adminName = req.body.adminName;
    var adminPassword = req.body.adminPassword;
   
    if(adminName==undefined||adminPassword==undefined){
    		res.send({
  			"code":210,
  			"result":false
  		});
  		throw error;
    }
    else{
			
    	var sql = "INSERT INTO admin (username, password) VALUES (\'"+adminName+"\',\'"+adminPassword+"\')"
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
    console.log("Arrived at the update");
    var selectedAdmin = req.body.selectedAdmin;
    var activitySelected = req.body.activitySelected;
    db.query('SELECT * FROM admin WHERE username=\"'+selectedAdmin+'\"',  function (error, results, fields){
      if(results[0].super_admin === 'T')
      {
        console.log("Cannot make the super admin inactive");
        res.send({
          "code":300,
          "result":false
        });
        flagStat = true;
      }
    });
    var sql = "UPDATE admin SET status =(\'"+activitySelected+"\') WHERE username=(\'"+selectedAdmin+"\') and super_admin!='T'"
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
  else{
    if(flagStat === false)
    {
      console.log("Sending a positive response");
        res.send({            
          "code":200,
          "result":true
      });
    }

  }
  });
}

});



module.exports = router;
