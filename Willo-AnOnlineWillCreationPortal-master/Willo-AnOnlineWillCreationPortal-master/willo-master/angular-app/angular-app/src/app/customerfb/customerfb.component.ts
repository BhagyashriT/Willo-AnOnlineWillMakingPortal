import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customerfb',
  templateUrl: './customerfb.component.html',
  styleUrls: ['./customerfb.component.css']
})
export class CustomerfbComponent implements OnInit {

  constructor(private Auth:AuthService, private router: Router) 
  {
  }

  private gridApi;
  private gridColumnApi;
  private gridApiRes;
  private gridColumnApiRes;
  public feedbackArr = [];
  public rowData = [];
  public rowDataResponded = [];
  displayFlag:boolean = false;
  displayText:boolean = false;
  displayRightBar:boolean = false;
  displaySearchRes:boolean = false;
  public emailID:string;
  public feedback:string;
  public username:string;
  public user_id:string;
  public feedback_ts:string;
  public currentFocused;
  private rowSelection;
  private rowDeselection;
  private getRowHeight;
  public admin_feedback:string;


  columnDefs = [
      {headerName: 'Name', field: 'name', filter:true},
      {headerName: 'Email', field: 'email', sortable: true, filter:true},
      {headerName: 'Feedback', field: 'feedback', filter:true, cellStyle: {'white-space': 'normal'}},
      {headerName: 'Date', field: 'feedback_ts', sortable: true, sort:'desc', filter:true},
      {headerName: 'Response', field: 'admin_feedback', sortable: true, filter:true, cellStyle: {'white-space': 'normal'}}      
  ];


  ngOnInit() {
    if(!this.Auth.getLoggedInStatus())
    {
      this.router.navigate(['/login'])
    }

    this.rowSelection = "single"
    this.rowDeselection = true;

    this.getRowHeight = function(params) {
      return 28 * (Math.floor(params.data.feedback.length / 30) + 1);
    };


  	this.Auth.getCustomerFeedbackDetails().subscribe(data=>{
    var self = this;
    console.log(data);
    data.forEach(function(value){
      self.feedbackArr.push(value);
    });
      self.rowData = data;
    });

    this.getFeedbackForUser();
  }

  getFeedbackForUser()
  {
    this.user_id = localStorage.getItem('useridfeedback');
    if(this.user_id != undefined)
    {
      this.Auth.getUserIDFeedback(this.user_id).subscribe(data=>{
      var self = this;
      console.log("The feedback data is:"+data[0].feedback);
      this.feedback = data[0].feedback;
      this.username = data[0].name;
      this.emailID = data[0].email;

      if(this.feedback !== null)
      {
        this.displayRightBar = true;      
      }

      localStorage.removeItem('useridfeedback');

      });

    }
  }

  onGridReady(params) 
  {
    this.displayText = false;
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;  
  }

  onSelectionChanged() {
    this.displayText = false;
    console.log("Reached onSelectionChanged");
    var selectedRows = this.gridApi.getSelectedRows();
    var selectedRowsString = "";
    var selectedRowsContent = "";
    var selectedRowsName = "";
    selectedRows.forEach(function(selectedRow, index) {
      console.log("Reached the forEach function");
      if (index !== 0) {
        console.log("Reached the if condition inside forEach"); 
        selectedRowsString += ", ";
      }
      selectedRowsString += selectedRow.email;
      selectedRowsContent += selectedRow.feedback;
      selectedRowsName += selectedRow.name;
    });
    this.emailID = selectedRowsString;
    this.feedback = selectedRowsContent;
    this.username = selectedRowsName;
    console.log("The email ID is:" +this.emailID);
    console.log("The feedback is:" + this.feedback);
    this.displayRightBar = true;
  }

  onGridReadyRes(params) 
  {
    this.displayText = false;
    this.gridApiRes = params.api;
    this.gridColumnApiRes = params.columnApi;  
  }

  onSelectionChangedRes() {
    this.displayText = false;
    console.log("Reached onSelectionChangedRes");
    var selectedRows = this.gridApiRes.getSelectedRows();
    var selectedRowsString = "";
    var selectedRowsContent = "";
    var selectedRowsName = "";
    var selectedRowsAdminContent = "";
    var selectedRowTimestamp = "";
    selectedRows.forEach(function(selectedRow, index) {
      console.log("Reached the forEach function");
      if (index !== 0) {
        console.log("Reached the if condition inside forEach");
        selectedRowsString += ", ";
      }
      selectedRowsString += selectedRow.email;
      selectedRowsContent += selectedRow.feedback;
      selectedRowsName += selectedRow.name;
      selectedRowsAdminContent += selectedRow.admin_feedback;
      selectedRowTimestamp += selectedRow.feedback_ts;
    });
    this.emailID = selectedRowsString;
    this.feedback = selectedRowsContent;
    this.username = selectedRowsName;
    this.admin_feedback = selectedRowsAdminContent;
    this.feedback_ts = selectedRowTimestamp;
    console.log("The email ID is:" +this.emailID);
    console.log("The feedback is:" + this.feedback);
    this.displayRightBar = true;
    this.displayFlag = true;
  }

  displayReply()
  {
    this.displayFlag = true;
  }

  sendEmailFunction()
  {
    var textAreaValue = (<HTMLInputElement>document.getElementById("textAreaId")).value;
    console.log(textAreaValue+ " to emailID "+ this.emailID);
    this.Auth.sendReplyFb(this.emailID, this.feedback, textAreaValue).subscribe(data=>{
    if(data['result']){
      this.displayFlag = false;
      this.displayText = true;
      this.Auth.getCustomerFeedbackDetails().subscribe(data=>{
      var self = this;
      console.log(data);
      data.forEach(function(value){
        self.feedbackArr.push(value);
      });
        self.rowData = data;
      });
    }
    else{
      window.alert("Oops! something went wrong! Please try again")
    }
    });
  }

  displaySearchResults()
  {
    var searchBoxValue = (<HTMLInputElement>document.getElementById("searchBox")).value;
    console.log(searchBoxValue); 
    this.Auth.getRespondedCustomerDetails(searchBoxValue).subscribe(data=>{
    var self = this;
    console.log(data);
    data.forEach(function(value){
      self.feedbackArr.push(value);
    });
      self.rowDataResponded = data;
    });

    this.displaySearchRes = true;
  }
}
