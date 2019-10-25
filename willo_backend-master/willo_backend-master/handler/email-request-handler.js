var nodemailer = require('nodemailer');
var express = require('express');

// var mailTransporter = nodeMailer.createTransport({
//     host:'smtp.gmail.com',
//     port:'465',    //SSL port
//     secure: true,
//     auth:{
//         user: 'websitemessagenotification@gmail.com',
//         pass: ''
//     }
// });

var mailTransporter = nodemailer.createTransport({
 service: 'gmail',
 auth: {
        user: 'willojb2@gmail.com',
        pass: 'youmayenter'
    }
});
rand=Math.floor((Math.random() * 100) + 54);
host='http://localhost:3000';
link=host+"/verify="+rand;
var mailOptions = {
  from: 'willo@gmail.com', // sender address
  to: 'tkaushik64@gmail.com', // list of receivers
  subject: 'Please confirm your email by clicking the link below', // Subject line
  html: link   // plain text body
};
mailTransporter.sendMail(mailOptions, function (err, info) {
   if(err)
     console.log(err)
   else
     console.log(info);
});

app.get('/verify',function(req,res){
console.log(req.protocol+":/"+req.get('host'));
if((req.protocol+"://"+req.get('host'))==("http://"+host))
{
    console.log("Domain is matched. Information is from Authentic email");
    if(req.query.id==rand)
    {
        console.log("email is verified");
        res.end("<h1>Email "+mailOptions.to+" is been Successfully verified");
    }
    else
    {
        console.log("email is not verified");
        res.end("<h1>Bad Request</h1>");
    }
}
else
{
    res.end("<h1>Request is from unknown source");
}
});



//module.exports = emailHandler;
