var http = require("http");
var express = require('express');
var path= require('path');
var app = express();
var cors = require('cors');
var mysql      = require('mysql');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
//const app = express();
app.use(cors());

const login=require('./router/routes/login');
const signup=require('./router/routes/signup');
const verify=require('./router/routes/verify');
const home = require('./router/routes/home');
const details=require('./router/routes/details');
const additionaldetails=require('./router/routes/additionaldetails');
const moredetails=require('./router/routes/moredetails');
const addBeneficiary=require('./router/routes/addBeneficiary');
const deleteBeneficiary=require('./router/routes/deleteBeneficiary');
const addItem=require('./router/routes/addItem');
const editItem=require('./router/routes/editItem');
const deleteItem=require('./router/routes/deleteItem');
const addWitness=require('./router/routes/addWitness');
const updateBen=require('./router/routes/updateBen');
const getBeneficiaryList=require('./router/routes/getBeneficiaryList');
const items=require('./router/routes/items');
const getBeneficiaryDetails=require('./router/routes/getBeneficiaryDetails');
const getBeneficiaryAssetMapping=require('./router/routes/getBeneficiaryAssetMapping');
const addExecutors=require('./router/routes/addExecutors');
const getWitness=require('./router/routes/getWitness');
const getExecutors=require('./router/routes/getExecutors');
const mapBeneficiarytoItem=require('./router/routes/mapBeneficiarytoItem');
const editBeneficiarytoItem=require('./router/routes/editBeneficiarytoItem');
const editWitness=require('./router/routes/editWitness');
const deleteWitness=require('./router/routes/deleteWitness');
const addGuardian=require('./router/routes/addGuardian');
const editGuardian=require('./router/routes/editGuardian');
const getGuardian=require('./router/routes/getGuardian');
const deleteGuardian=require('./router/routes/deleteGuardian');
const getBeneficiaryAsset=require('./router/routes/getBeneficiaryAsset');
const addcustomerfeedback=require('./router/routes/addcustomerfeedback');
const getcustomerfeedback=require('./router/routes/getcustomerfeedback');
const editExecutors=require('./router/routes/editExecutors');
const mailWitness=require('./router/routes/mailWitness');
const willverification=require('./router/routes/willverification');
const getlastpaymentdt=require('./router/routes/getlastpaymentdt');
const updatepayment=require('./router/routes/updatepayment');
const pricing=require('./router/routes/pricing');
const assetbenlist=require('./router/routes/assetbenlist');
const getBelongingsDetails=require('./router/routes/getBelongingsDetails');
const getWillStatus=require('./router/routes/getWillStatus');
const getamount=require('./router/routes/getamount');


//**************Admin Portal*****************//
//Getting our POSTS routes
//Getting our POSTS routes
const posts=require('./router/routes/posts');
const stats=require('./router/routes/stats');
const useraccounts=require('./router/routes/useraccounts');
const useraccounts1=require('./router/routes/useraccounts1');
const customerfb = require('./router/routes/customerfb');
const fpwd = require('./router/routes/fpwd');
const customermail=require('./router/routes/customermail');
const addadmin = require('./router/routes/addadmin');
const financial = require('./router/routes/financial');
const piedetails = require('./router/routes/piedetails');
const asset = require('./router/routes/asset');
const adminassetlist = require('./router/routes/adminassetlist');
const submodel = require('./router/routes/submodel');
const discount = require('./router/routes/discount');
const benassetlist = require('./router/routes/benassetlist');
const respondedcust = require('./router/routes/respondedcust');
const useridfeedback = require('./router/routes/useridfeedback');
const setwillstatus = require('./router/routes/setwillstatus');
const testmail = require('./router/routes/testmail');
const postblob = require('./router/routes/postblob');
const customerfbmail = require('./router/routes/customerfbmail');
const childreninfo = require('./router/routes/childreninfo');
const getlastpaymentinfo = require('./router/routes/getlastpaymentinfo');

//**********************************************//

app.use('/api/login', login);
app.use('/api/signup', signup);
app.use('/verify?:id', verify);
app.use('/api/home', home);
app.use('/api/details?:willid', details);
app.use('/api/additionaldetails?:willid', additionaldetails);
app.use('/api/moredetails?:willid', moredetails);
app.use('/api/addBeneficiary?:willid', addBeneficiary);
app.use('/api/updateBen?:willid', updateBen);
app.use('/api/addItem?:willid', addItem);
app.use('/api/editItem?:willid', editItem);
app.use('/api/addWitness?:willid', addWitness);
app.use('/api/deleteBeneficiary?:benid?:willid', deleteBeneficiary);
app.use('/api/getBeneficiaryList?:willid', getBeneficiaryList);
app.use('/api/getBeneficiaryDetails?:id', getBeneficiaryDetails);
app.use('/api/Items?:willid', items);
app.use('/api/deleteItem?:belongings_id?:willid', deleteItem);
app.use('/api/getBeneficiaryAssetMapping?:willid', getBeneficiaryAssetMapping);
app.use('/api/addExecutors?:willid', addExecutors);
app.use('/api/getWitness?:willid', getWitness);
app.use('/api/getExecutors?:willid', getExecutors);
app.use('/api/mapBeneficiarytoItem?:willid', mapBeneficiarytoItem);
app.use('/api/editBeneficiarytoItem?:willid', editBeneficiarytoItem);
app.use('/api/editWitness?:willid', editWitness);
app.use('/api/deleteWitness?:willid', deleteWitness);
app.use('/api/addGuardian?:willid', addGuardian);
app.use('/api/editGuardian?:willid', editGuardian);
app.use('/api/getGuardian?:willid', getGuardian);
app.use('/api/deleteGuardian?:willid', deleteGuardian);
app.use('/api/getBeneficiaryAsset?:benid?:willid', getBeneficiaryAsset);
app.use('/api/addcustomerfeedback?:willid', addcustomerfeedback);
app.use('/api/getcustomerfeedback?:willid', getcustomerfeedback);
app.use('/api/editExecutors?:willid', editExecutors);
app.use('/api/mailWitness?:willid', mailWitness);
app.use('/willverification?:id', willverification);
app.use('/api/getlastpaymentdt?:willid', getlastpaymentdt);
app.use('/api/updatepayment?:willid', updatepayment);
app.use('/api/pricing', pricing);
app.use('/api/assetbenlist?:willid', assetbenlist);
app.use('/api/getBelongingsDetails?:belongings_id?:willid', getBelongingsDetails);
app.use('/api/getWillStatus?:willid', getWillStatus);
app.use('/api/testmail', testmail);
app.use('/api/getamount?:willid', getamount);


//*************Admin Portal***********************//
app.use('/api/auth', posts);
app.use('/api/stats', stats);
app.use('/api/useraccount', useraccounts);
app.use('/api/useraccount1', useraccounts1);
app.use('/api/customerfb', customerfb);
app.use('/api/fpwd', fpwd);
app.use('/api/customermail', customermail);
app.use('/api/addadmin', addadmin);
app.use('/api/financial', financial);
app.use('/api/piedetails', piedetails);
app.use('/api/submodel', submodel);
app.use('/api/asset?:will_id', asset);
app.use('/api/adminassetlist?:will_id', adminassetlist);
app.use('/api/discount', discount);
app.use('/api/benassetlist?:will_id', benassetlist);
app.use('/api/respondedcust?:email_id', respondedcust);
app.use('/api/useridfeedback?:user_id', useridfeedback);
app.use('/api/setwillstatus?:will_id', setwillstatus);
app.use('/api/postblob', postblob);
app.use('/api/customerfbmail', customerfbmail);
app.use('/api/childreninfo', childreninfo);
app.use('/api/getlastpaymentinfo?:will_id', getlastpaymentinfo);




//**********************************************//

//start mysql connection
// var connection = mysql.createConnection({
//   host     : 'localhost', //mysql database host name
//   user     : 'root', //mysql database user name
//   password : 'youmayenter', //mysql database password
//   database : 'willodb', //mysql database name
//   multipleStatements : true
// });



// connection.connect(function(err) {
//   if (err) throw err
//   console.log('You are now connected...')
// })
//end mysql connection

//start body-parser configuration
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
//end body-parser configuration

//create app server
const port = process.env.PORT || 3000;
app.listen(port, (req, res)=>{
  console.log(`RUNNING on port ${port}`);
});
