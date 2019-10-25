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
router.get('/',function(req,res){
  var host = req.get('host');
console.log(req.protocol+":/"+req.get('host'));
if((req.protocol+"://"+req.get('host'))==("http://"+host))
{
    var rand_id = req.query.id;
    var initital_status='F';
    console.log("Domain is matched. Information is from Authentic email");
    db.query('SELECT * FROM user WHERE token_id = ? and email_verified=?',[rand_id, initital_status], function (error, results, fields) {
    if (error) {
       console.log("error ocurred",error);
    }
    else if(results.length==0){
      res.send({
        "code":400,
        "result":false,
        "msg":"User not signed up/Already Verified"
      })
    }
    else {

      // console.log('The solution is: ', results);
      if(results.length >0){
        var user_id = results[0].user_id;
        console.log("The user id", user_id);
        console.log("Password fetched",results[0].password);
        if(results[0].token_id === rand_id){
          console.log("email is verified");
          var status= 'T';
          db.query('UPDATE `user` SET `email_verified`=? where `token_id`=?', [status, rand_id], function (error, results1, fields) {
          if (error) {
            // console.log("error ocurred",error);
            res.send({
              "code":400,
              "failed":"error ocurred"
            })
          }
          db.query('SELECT * FROM will WHERE user_id = ? ', [user_id], function (error, results1, fields) {
            if(results.length>0){
              var template_id =1;
              var will_status ='INCOMPLETE';
              var children ='N';
              db.query('INSERT INTO will (template_id,will_status,children, user_id) VALUES(?,?,?,?)', [template_id, will_status, children, user_id], function (error, results1, fields) {
              });

              console.log("Inserting done");
              db.query('select will_id from will where user_id=?',[user_id], function (error, results2, fields) {

                console.log("The will id", results2[0].will_id);
                var user_type='owner';
                var will_id = results2[0].will_id;
                var user_status ='A';
                db.query('INSERT INTO log (will_id, log_details) VALUES (?,"Signed up for willo")',[will_id], function (error, res, fields) {
                });
                db.query('INSERT INTO parties (party_type, will_id, user_id, user_status) VALUES(?,?,?,?)', [user_type, will_id, user_id, user_status], function (error, results1, fields) {
                  res.send({
                    "code":400,
                    "result":true,
                    "msg":"Verified Successfully"
                  })
                });
              });
            }
          });
        });
        }
    else
    {
        console.log("email is not verified");
        res.end("<h1>Bad Request</h1>");
    }
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
