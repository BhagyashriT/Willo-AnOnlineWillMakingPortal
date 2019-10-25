const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
var db = require('../../db');

router.use( bodyParser.json() );       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

router.post('/', function (req, res) {
  console.log('Reached here for posts');
  var username= req.body.username;
  var password = req.body.password;
  db.query('SELECT * FROM admin WHERE username = ? and status="Active"',[username], function (error, results, fields) {
    console.log("Querying done");
  if (error) {
     console.log("error ocurred",error);
    res.send({
      "code":400,
      "failed":"error ocurred"
    })
  }
  else{
    // console.log('The solution is: ', results);
    if(results.length >0){
      console.log("Password fetched",results[0].password);

      if(results[0].password == password){
        res.send({
          "code":200,
          "result": true,
          "success":"login sucessfull"
            });
      }
      else{
        res.send({
          "code":204,
          "result": false,
          "success":"Email and password does not match"
            });
      }
    }
    else{
      res.send({
        "code":204,
        "result": false,
        "success":"Email does not exits"
          });
    }
  }
});
});

module.exports = router;
