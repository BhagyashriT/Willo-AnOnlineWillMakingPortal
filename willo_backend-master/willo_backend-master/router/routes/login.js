const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
var db = require('../../db');
var nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');



router.use( bodyParser.json() );       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));


var mailTransporter = nodemailer.createTransport({
 service: 'gmail',
 auth: {
   user: 'thewilloteam@gmail.com',
   pass: 'lhbmywczpcquwdpx'
    }
});


router.post('/', function (req, res) {
  var SENDGRID_APY_KEY ='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';
  sgMail.setApiKey(SENDGRID_APY_KEY);
  console.log("Entered here");
  var email= req.body.email;
  var password = req.body.password;
  db.query('SELECT * FROM user WHERE email = ?',[email], function (error, results, fields) {
  if (error) {
    // console.log("error ocurred",error);
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
        if(results[0].email_verified == 'F'){
          var link="http://"+"3.16.179.159" +"/verify?id="+results[0].token_id;
          var mailOptions = {
            from: 'Willo <thewilloteam@gmail.com>', // sender address
            to: email, // list of receivers
            subject: 'Please confirm your email by clicking the link below', // Subject line
            html: "Thanks for signing up with Willo! Please confirm your email address here "+ link   // plain text body
          };
          //sgMail.send(mailOptions, function (err, info) {
          mailTransporter.sendMail(mailOptions, function(error, info){
             if(err)
               console.log(err)
             else
               console.log(info);
          });
          res.send({
            "code":205,
            "msg":"Email not verified. Check inbox to verify.",
            "result": false
              });
        }
        else
        {
          var user_id = results[0].user_id;
          db.query('select distinct(will_id) as will_id from parties where user_id = ?',[user_id] ,function (error, results1, fields) {
           if (error) throw error;
           res.send({
          "code":200,
          "msg":"login sucessfull",
          "result" : true,
          "will_id": results1[0].will_id,
          "user_id": user_id,
          "children":results[0].children
            });
            });
          }
      }
      else{
        res.send({
          "code":204,
          "msg":"Email and password does not match",
          "result": false
            });
      }
    }
    else{
      res.send({
        "code":204,
        "msg":"Email does not exists",
        "result":false
          });
    }
  }
});
});



//Verification mailOptions
// router.get('/verify',function(req,res){
//   var host = req.get('host');
// console.log(req.protocol+":/"+req.get('host'));
// if((req.protocol+"://"+req.get('host'))==("http://"+host))
// {
//     var rand_id = req.query.id;
//     console.log("Domain is matched. Information is from Authentic email");
//     db.query('SELECT * FROM user WHERE token_id = ?',[rand_id], function (error, results, fields) {
//     if (error) {
//       // console.log("error ocurred",error);
//       res.send({
//         "code":400,
//         "failed":"error ocurred"
//       })
//     }
//     else {
//       // console.log('The solution is: ', results);
//       if(results.length >0){
//         console.log("Password fetched",results[0].password);
//         if(results[0].token_id === rand_id){
//           console.log("email is verified");
//           var status= 'T';
//           res.end("<h1>Email  is been Successfully verified");
//
//           db.query('UPDATE `user` SET `email_verified`=? where `token_id`=?', [status, rand_id], function (error, results, fields) {
//           if (error) {
//             // console.log("error ocurred",error);
//             res.send({
//               "code":400,
//               "failed":"error ocurred"
//             })
//           }
//         });
//         }
//     else
//     {
//         console.log("email is not verified");
//         res.end("<h1>Bad Request</h1>");
//     }
// }
// }
// });
// }
// else
// {
//     res.end("<h1>Request is from unknown source");
// }
// });






// var query = 'UPDATE user SET contact=?, dob = ?, street_address = ?, county = ? , city = ?, state = ?, marital_status = ?, children = ?  WHERE  email = ?';
// router.put('/profile', function (req, res) {
//   var contact = req.body.contact;
//   var dob = req.body.dob;
//   var street_address = req.body.street_address;
//   var county = req.body.county;
//   var city = req.body.city;
//   var state = req.body.state;
//   var marital_status = req.body.marital_status;
//   var children = req.body.children;
//   var email  = req.body.email;
//    db.query(query, [contact, dob, street_address, county, city, state, marital_status, children, email], function (error, results, fields) {
// 	  if (error) throw error;
// 	  res.end(JSON.stringify(results));
// 	});
// });
//
// router.get('/user/:id', function (req, res) {
//    console.log(req);
//    db.query('select * from user where user_id=?', [req.params.id], function (error, results, fields) {
// 	  if (error) throw error;
// 	  res.end(JSON.stringify(results));
// 	});
// });

module.exports = router;
