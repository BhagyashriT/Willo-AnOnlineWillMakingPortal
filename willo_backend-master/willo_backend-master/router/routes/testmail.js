// var mailTransporter = nodemailer.createTransport({
//  service: 'gmail',
//  auth: {
//         user: 'willojb2@gmail.com',
//         pass: 'tcawfdwqdwodavrh'
//     }
// });
const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
var db = require('../../db');
const sgMail = require('@sendgrid/mail');

router.get('/', function (req, res) {
console.log("Reached here");
var SENDGRID_APY_KEY ='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';
sgMail.setApiKey(SENDGRID_APY_KEY);

const msg = {
  to: 'tkaushik64@gmail.com',
  from: 'hello@willo.com',
  subject: 'Sending with Twilio SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: 'and easy to do anywhere, even with Node',
};
sgMail.send(msg);
res.send({
"code":200,
"result":true
});


});

module.exports = router;
