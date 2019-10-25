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
var SENDGRID_APY_KEY ='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';
sgMail.setApiKey(SENDGRID_APY_KEY);

router.post('/', function (req, res) {

  console.log("Reached the post in customer mail");
  var emailid= req.body.emailID;
  var response = req.body.response;
  db.query('SELECT user_id FROM user WHERE email = ?',[emailid], function (error, results, fields) {
  if (error) {
     console.log("error ocurred",error);}
   else{
    if(results[0]){
      var user_id =results[0].user_id;
      db.query('UPDATE user_feedback SET admin_feedback =?, resolved ="Y" where  user_id=?',[response, user_id], function (error, results, fields) {
      if (error) {
     console.log("error ocurred",error);
       }
       var mailOptions = {
        from: 'Willo <thewilloteam@gmail.com>', // sender address
        to: emailid, // list of receivers
        subject: 'Willo:Your online will making app', // Subject line
        html: response   // plain text body
      };
      //sgMail.send(mailOptions, function (err, info) {
      mailTransporter.sendMail(mailOptions, function(error, info){
         if(err){
           console.log("Sent a false");
           res.send({
          "code":200,
          "result":false
        })
         }

         else{
          console.log(info);
           res.send({
            "code":200,
            "result":true
            })
         }

      });
     });
    }
  }
});
});



module.exports = router;
