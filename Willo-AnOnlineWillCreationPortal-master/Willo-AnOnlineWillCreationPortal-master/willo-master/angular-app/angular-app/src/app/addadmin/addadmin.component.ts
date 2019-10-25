import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-addadmin',
  templateUrl: './addadmin.component.html',
  styleUrls: ['./addadmin.component.css']
})
export class AddadminComponent implements OnInit {

  private rowSelection;
  private gridApi;
  private gridColumnApi;
  public rowDataDisc;
  displayPass:boolean = false;
  displayFail1:boolean = false;
  displayFail2:boolean = false;
  public clickConditionFlag:boolean = false;
  public conditionFlag:boolean = false;
  private gridApiDisc;
  private gridColumnApiDisc;
  public displayFail:boolean = false;
  public displayPassDisc:boolean = false;
  public displayFailDisc:boolean = false;
  public displayFailPrimDisc:boolean = false;
  public updateFlagPass:boolean = false;
  public updateFlagFail:boolean = false;
  public updateSuper:boolean = false;
  public selectedPromo:string;
  public selectedAdmin:string;
  public activitySelected:string="Active";
  public adminName:string;
  public adminPassword:string;
  public typed;
  columnDefsDisc =[
    {headerName: 'EmailID', field: 'username', sortable: true, filter:true},
    {headerName: 'Status', field: 'status', sortable: true, filter:true},
];
constructor(private Auth:AuthService, private router: Router) {}

ngOnInit() {
  this.rowSelection = "single";
  if(!this.Auth.getLoggedInStatus())
  {
    this.router.navigate(['/login'])
  }

  this.Auth.getAdminDetails().subscribe(data=>{
    var self = this;
    //console.log(data);
    this.rowDataDisc = data;

});


}

onGridReadyDisc(params) {
  this.gridApiDisc = params.api;
  this.gridColumnApiDisc = params.columnApi;

  params.api.sizeColumnsToFit();

  params.api.sizeColumnsToFit();
  window.addEventListener("resize", function() {
    setTimeout(function() {
      params.api.sizeColumnsToFit();
    });
  });
}
onClickingSubmit(){
  this.typed="Insert"

  this.Auth.setAdminDetails(this.adminName,this.adminPassword,this.typed).subscribe(data=>{

    if(data['result']){
        this.displayPassDisc = true;
        this.displayFailPrimDisc=false;
        this.displayFailDisc = false;
        this.conditionFlag=false;
        this.Auth.getAdminDetails().subscribe(data=>{
        var self = this;
        //console.log(data);
        this.rowDataDisc = data;

  });
      }
      else{
        if(data['code']===210){
          this.displayFailDisc = true;
          this.displayPassDisc = false;
          this.displayFailPrimDisc = false;
        }
        else{
          this.displayFailPrimDisc=true;
          this.displayFailDisc = false;
          this.displayPassDisc = false;
        }

        }
        this.adminName=undefined;
        this.adminPassword=undefined;
      
  });

}

onSelectionChanged(){
  this.clickConditionFlag=true;
  console.log("Reached onSelectionChanged");
  var selectedRows = this.gridApiDisc.getSelectedRows();
  var selectedRowsString = "";
  selectedRows.forEach(function(selectedRow, index) {
    console.log("Reached the forEach function");
    if (index !== 0) {
      console.log("Reached the if condition inside forEach"); 
      selectedRowsString += ", ";
    }
    selectedRowsString += selectedRow.username;
  });

  console.log("The value: "+selectedRowsString);
  this.clickConditionFlag=true;
  this.conditionFlag=false;
  this.displayFailPrimDisc=false;
  this.displayFailDisc=false;
  this.displayPassDisc=false;
  this.displayPass=false;
  this.displayFail=false;
  this.updateFlagPass=false;
  this.updateFlagFail=false;
  this.updateSuper = false;
  this.selectedAdmin = selectedRowsString;

}
onClickingAddAdmin(){
  this.conditionFlag=true;
  this.clickConditionFlag=false;
  this.displayPass=false;
  this.displayFail=false;
  this.displayPassDisc=false;
  this.displayFailDisc=false;
  this.displayFailPrimDisc=false;
  this.updateFlagPass=false;
  this.updateFlagFail=false;
}
onClickingReset(){
  this.adminName="";
  this.adminPassword="";
}
onClickingConfirm(){
  this.clickConditionFlag=false;
  this.typed="Update"
  this.Auth.updateAdminDetails(this.selectedAdmin,this.activitySelected,this.typed).subscribe(data=>{
    if(data['result']){
        this.updateFlagPass=true;
        this.updateFlagFail=false;
        this.Auth.getAdminDetails().subscribe(data=>{
        var self = this;
        this.rowDataDisc = data;

  });
      }
      else{
        if(data['code'] === 300)
        {
          this.updateFlagPass = false;
          this.updateFlagFail = false;
          this.updateSuper = true;
        }
        else
        {
          this.updateFlagPass=false;
          this.updateFlagFail=true;
          this.updateSuper = false;          
        }
        }

  });

}

onClickingCancel(){

  this.clickConditionFlag=false;

}
onGridReady(params) {
  this.gridApi = params.api;
  this.gridColumnApi = params.columnApi;
  
}
  addAdmin(textInput:string, passwordInput:string)
  {
    console.log("The text input is: "+ textInput+"The password input is: "+passwordInput);
    this.Auth.addAdminApi(textInput, passwordInput).subscribe(data=>{
        if(data['result']){
          this.displayPass = true;
          this.displayFail1 = false;
          this.displayFail2 = false;
        }
        else{
          if(data['code'] === 200 )
          {
            this.displayFail1 = true;
            this.displayPass = false;
            this.displayFail2 = false;            
          }
          else if(data['code'] === 300)
          {
            this.displayFail2 = true;
            this.displayPass = false;
            this.displayFail1 = false;            
          }
          }

    });
  }

}
