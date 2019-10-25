const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
var db = require('../../db');
var nodemailer = require('nodemailer');

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
  console.log("Reached mark will complete");
   db.query('UPDATE will set will_status="COMPLETE" where will_id=?',[req.query.will_id],function (error, results, fields)
  {
    if (error) throw error;
    console.log(JSON.stringify(results));
    db.query('SELECT email, name from user where user_id in (SELECT user_id from parties where will_id=? and party_type="owner")',[req.query.will_id],function (error, results1, fields){
    var email= results1[0].email;
    var name= results1[0].name;
    const mailOptions = {
      to: email,
      from: 'Willo <thewilloteam@gmail.com>',
      subject: 'The filing of your will is completed',
      html: 'Hello '+name+' , your will is now available.',
    };
    mailTransporter.sendMail(mailOptions, function(error, info){
       if(err)
         console.log(err)
    });
  });
    res.send(JSON.stringify(results));
  });
});

module.exports = router;
