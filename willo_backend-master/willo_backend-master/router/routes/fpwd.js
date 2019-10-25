const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
var db = require('../../db');
var nodemailer =require ('nodemailer');
const sgMail = require('@sendgrid/mail');
var mailTransporter = nodemailer.createTransport({
          service: 'gmail',
           auth: {
             user: 'thewilloteam@gmail.com',
             pass: 'lhbmywczpcquwdpx'
              }
          });

router.use( bodyParser.json() );       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));


router.post('/', function (req, res) {
  console.log('Reached fpwd');
  var SENDGRID_APY_KEY ='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';
  sgMail.setApiKey(SENDGRID_APY_KEY);
  var emailid= req.body.emailID;
  results = null;
  if(emailid==="")
  {
    console.log("Sent a false")
     res.send({
          "code":200,
          "result":false
        });
  }
  db.query('SELECT * FROM admin WHERE username = ?',[emailid], function (error, results, fields) {
    console.log("Querying done");
    console.log("Results are:" +results)
  if (error) {
     console.log("error ocurred",error);
   }
   else{
    if(results[0]){
      console.log("Reached in the results length>0 case")
      var pwd = results[0].password;

      var mailOptions = {
        from: 'Willo <thewilloteam@gmail.com>', // sender address
        to: emailid, // list of receivers
        subject: 'Below is your admin password', // Subject line
        html: pwd   // plain text body
      };
      //sgMail.send(mailOptions, function (err, info) {
      mailTransporter.sendMail(mailOptions, function(error, info){
         if(err)
           console.log(err)
         else
         {
           console.log(info);
           res.send({
            "code":200,
            "result":true
          });
         }
  });
  }
  else{
    console.log("Sent a false")
     res.send({
          "code":200,
          "result":false
        })
  }
  }

     });
});



module.exports = router;
