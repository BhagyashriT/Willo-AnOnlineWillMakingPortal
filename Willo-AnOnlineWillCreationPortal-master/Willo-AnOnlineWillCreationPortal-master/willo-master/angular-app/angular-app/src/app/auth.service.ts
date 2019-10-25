import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';

//const apiURL= "http://localhost:4600/api/";
const apiURL= "http://68.183.112.87:3000/api/";



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedInStatus = JSON.parse(localStorage.getItem('loggedIn') || JSON.stringify(false))
  private username:string;
  private cid:string;

  constructor(private http: HttpClient) { }

  setLoggedInStatus(value:boolean){
    this.loggedInStatus = value
    localStorage.setItem('loggedIn', JSON.stringify(this.loggedInStatus))
  }

  getAdminDetails(){
    var adminDetailsURL = apiURL+"addadmin";
    return this.http.get<any[]>(adminDetailsURL);    
  }

  getRespondedCustomerDetails(email_id:string){
    var respondedCustURL = apiURL+"respondedcust?email_id="+email_id;
    return this.http.get<any[]>(respondedCustURL);
  }

  setAdminDetails(adminName:string,adminPassword:string,typed:string){
    var adminDetailsURL = apiURL+"addadmin";
    return this.http.post(adminDetailsURL,{adminName,adminPassword,typed});
  }

  updateAdminDetails(selectedAdmin:string,activitySelected:string,typed:string){
    var adminDetailsURL = apiURL+"addadmin";
    return this.http.post(adminDetailsURL,{selectedAdmin,activitySelected,typed});
  }
  
  getLoggedInStatus(){
    console.log(this.loggedInStatus)
    return this.loggedInStatus
  }

  setCID(cid:string){
    this.cid=cid;
  }

  getUserDetails(username:string, password:string){
    this.username = username;
    var URL = apiURL+"auth";
    return this.http.post(URL,{
      username,password
    })
  }

  getStatsDetails()
  {
    var statsURL = apiURL+"stats";
    return this.http.get<any[]>(statsURL);
  }

  getUserAccountDetails()
  {
    var useraccountURL = apiURL+"useraccount";
    return this.http.get<any[]>(useraccountURL);
  }

  getUserAccountDetails1(user_id:string)
  {
    var useraccountURL = apiURL+"useraccount1";
    console.log("Reached till this point getUserAccountDetails "+useraccountURL);
    return this.http.post<any[]>(useraccountURL,{user_id});
  }


  getCustomerFeedbackDetails()
  {
    var customerfbURL = apiURL+"customerfb";
    return this.http.get<any[]>(customerfbURL);
  }

  getPassword(emailID:string)
  {
    var fpwdURL = apiURL+"fpwd";
    return this.http.post(fpwdURL, {emailID});
  }

  sendReply(emailID:string, response:string)
  {
    var sendmailURL = apiURL+"customermail";
    return this.http.post(sendmailURL, {emailID, response});
  }

  sendReplyFb(emailID:string, feedback:string, response:string)
  {
    var sendmailURL = apiURL+"customerfbmail";
    return this.http.post(sendmailURL, {emailID, feedback, response});
  }


  addAdminApi(emailID:string, password:string)
  {
    var addadminURL = apiURL+"addadmin";
    return this.http.post(addadminURL, {emailID, password});
  }

  getFinanceDetails()
  {
    var financeDetailsURL = apiURL+"financial";
    return this.http.get<any[]>(financeDetailsURL);
  }

  getPieDetails()
  {
    var pieDetailsURL = apiURL+"piedetails";
    return this.http.get<any[]>(pieDetailsURL);
  }
  
  getSubModelDetails()
  {
    var subModelDetailsURL = apiURL+"submodel";
    return this.http.get<any[]>(subModelDetailsURL);    
  }

  setSubModelDetails(subInput:string)
  {
    var subModelDetailsURL = apiURL+"submodel";
    return this.http.post(subModelDetailsURL,{subInput});    
  }

  getDiscountDetails()
  {
    var discountlDetailsURL = apiURL+"discount";
    return this.http.get<any[]>(discountlDetailsURL);    
  }
  setDiscountDetails(promoCode:string,discountVal:string,discountType:string,activityType:string,typed:string){
    var discountlDetailsURL = apiURL+"discount";
    return this.http.post(discountlDetailsURL,{promoCode,discountVal,discountType,activityType,typed});
  }
  updateDiscountDetails(selectedPromo:string,activitySelected:string,typed:string){
    var discountlDetailsURL = apiURL+"discount";
    return this.http.post(discountlDetailsURL,{selectedPromo,activitySelected,typed});
  }
  

  getAssetData(will_id:string)
  {
    var assetDataURL = apiURL+"asset?will_id="+will_id;
    console.log("Reached getAssetData:"+ assetDataURL);
    return this.http.get<any[]>(assetDataURL);
  }

  getBenAssetData(will_id:string)
  {
    var benassetDataURL = apiURL+"benassetlist?will_id="+will_id;
    console.log("Reached getBenAssetData:"+ benassetDataURL);
    return this.http.get<any[]>(benassetDataURL);
  }

  getUserIDFeedback(user_id:string)
  {
    var userIDFeedbackURL = apiURL+"useridfeedback?user_id="+user_id;
    console.log("Reached getUserIDFeedback" + userIDFeedbackURL);
    return this.http.get<any[]>(userIDFeedbackURL);
  }

  postBlobToDb(blobStore:Blob, user_id:string)
  {
    console.log("Reached postBlobToDb");
    console.log(typeof blobStore);
    var postblobURL = apiURL+"postblob";
    return this.http.post(postblobURL,{blobStore,user_id});
  }

  setWillStatus(will_id:string)
  {
    var willStatusURL = apiURL+"setwillstatus?will_id="+will_id;
    console.log("Reached setWillStatus"+willStatusURL);
    return this.http.get<any>(willStatusURL);
  }

  getChildrenInformation(will_id:string)
  {
    var childreninfoURL = apiURL+"childreninfo?will_id="+will_id;
    console.log("Reached getChildrenInformation"+childreninfoURL);
    return this.http.get<any[]>(childreninfoURL);
  }
  getPaymentDetails(will_id:string)
  {
    var paymentdetailsURL = apiURL+"getlastpaymentdt?willid="+will_id;
    console.log("Reached getPaymentDetails"+paymentdetailsURL);
    return this.http.get<any[]>(paymentdetailsURL);
  }
}
