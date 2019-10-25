
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

router.get('/', function (req, res) {
  console.log("Reached witness mail API");
  var SENDGRID_APY_KEY ='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';
  sgMail.setApiKey(SENDGRID_APY_KEY);

  function randomString(length, chars) {
  var result = '';
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;}
      db.query('SELECT user_id, email, name FROM user WHERE user_id in(select user_id from parties where will_id=? and party_type like "%witness")',[req.query.willid], function (error, results, fields) {
         //if (err) throw error;

          for (var i = 0; i < results.length; i++) {
            console.log("Reached here 1", results[i].user_id);
            var name = results[i].name;
            var token_id = randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
            link="http://"+"3.16.179.159" +"/witnessverify?id="+token_id;
            db.query('UPDATE user set token_id=? where user_id=?',[token_id, results[i].user_id], function (error, results1, fields) {
            });
            var mailOptions = {
              from: 'Willo <thewilloteam@gmail.com>', // sender address
              to: results[i].email, // list of receivers
              subject: "Please verify "+ name +"'s will by clicking the link below", // Subject line
              html: link   // plain text body
            };
            //sgMail.send(mailOptions, function (err, info) {
            mailTransporter.sendMail(mailOptions, function(error, info){
               if(err)
                 console.log(err)
               else
               res.send({
                 "code":400,
                 "results":true,
                 "msg":"will verification mail sent"
               });
            });
          }
        });
      });
















module.exports = router;
