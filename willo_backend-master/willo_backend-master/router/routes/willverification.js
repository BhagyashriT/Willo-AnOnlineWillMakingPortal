const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
var db = require('../../db');
var nodemailer = require('nodemailer');

router.use( bodyParser.json() );       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

// var mailTransporter = nodemailer.createTransport({
//  service: 'gmail',
//  auth: {
//         user: 'willojb2@gmail.com',
//         pass: 'tcawfdwqdwodavrh'
//     }
// });


//Verification mailOptions
router.post('/',function(req,res){
  console.log("Reached witness verify");
  var host = req.get('host');
console.log(req.protocol+":/"+req.get('host'));
if((req.protocol+"://"+req.get('host'))==("http://"+host))
{
    var rand_id = req.query.id;
    //var initital_status='F';
    console.log("Domain is matched. Information is from Authentic email");
    db.query('SELECT will_id, user_id from parties where party_type LIKE "%witness" and user_id in (SELECT user_id FROM user WHERE token_id = ?) and signed_dt IS NULL',[rand_id], function (error, results, fields) {
    if (error) {
       console.log("error ocurred",error);
    }
    else if(results.length===0){
      res.send({
        "code":400,
        "result":false,
        "msg":"User not signed up/Already Verified"
      })
    }
    else {
       console.log('The solution is: ', results);

        var user_id = results[0].user_id;
        console.log("The user id", user_id);

          console.log("Reached here for updating parties signed_dt");
          if(req.body.response==="yes"){
            db.query('UPDATE parties SET signed_dt=CURRENT_DATE where will_id=? and user_id=?',[results[0].will_id,results[0].user_id], function (error, results9, fields) {
              if (error) {
                 console.log("error ocurred",error);
              }
              db.query('SELECT count(*) as witness_count from parties where will_id=? and party_type like "%witness" and signed_dt IS NOT NULL', [results[0].will_id], function (error, results5, fields) {
                if(results[0].witness_count===2){
                  db.query('UPDATE will SET will_status="PENDING FILING" where will_id=?', [results[0].will_id], function (error, results, fields) {
                  });
                }
              });
                res.send({
                  "code":400,
                  "result":true,
                  "msg":"Witness has verified"
                })
            });
          }
          else{
            res.send({
              "code":400,
              "result":true,
              "msg":"Witness did not verify"
            })
          }

}
});
}
else
{
    res.end("<h1>Request is from unknown source");
}
});

module.exports = router;
