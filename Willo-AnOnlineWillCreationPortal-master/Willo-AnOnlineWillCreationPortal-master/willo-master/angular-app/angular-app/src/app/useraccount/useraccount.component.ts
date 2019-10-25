import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import * as jsPDF from 'jspdf';


@Component({
  selector: 'app-useraccount',
  templateUrl: './useraccount.component.html',
  styleUrls: ['./useraccount.component.css']
})

export class UseraccountComponent implements OnInit {

  constructor(private Auth:AuthService, private router:Router) { }

  public colDisplay = ["Email ID", "Name"]
  public columns = ["email","name"];
  public characters = [];
  public beneficiaryData = [];
  public witnessData = [];
  public executorData = [];
  public assetData = [];
  public benAssetData = [];
  public guardianData1 = [];
  public guardianData2 = [];
  public paymentDetails;
  public displayData;
  public ownerData;
  public conditionFlag:boolean = false;
  public conditionFlagAsset:boolean = false;
  public conditionFlagPayment:boolean = false;
  public displayEditor:boolean = false;
  public conditionFlagBenAsset:boolean = false;
  public displayWillSuccess:boolean = false;
  public displayWillFailure:boolean = false;
  public index;
  editorForm : FormGroup; 
  formText : String;
  formTextAppend : String;
  public rowData;
  public emailID;
  public user_id
  private gridApi;
  private gridColumnApi;
  private rowSelection;

  private message:string;

  parentMessage = "message from parent"

    columnDefs = [
      {headerName: 'Name', field: 'name', sortable: true, filter:true, resizable:true },
      {headerName: 'Email', field: 'email', sortable: true, filter:true, resizable:true},
      {headerName: 'Will Status', field:'will_status', sortable: true, filter:true, resizable:true}
  ];


  ngOnInit()
  {
    this.rowSelection = "single";
    if(!this.Auth.getLoggedInStatus())
    {
      console.log("Reached this part in getLoggedInStatus")
      this.router.navigate(['/login'])
    }
    this.editorForm = new FormGroup({
      'editor': new FormControl(null)
    })
    this.plotOnRecord();
  }

  public search(emailId, characters){
    for (var i=0; i < Object.keys(characters).length; i++) {
        if (characters[i].email === emailId) {
            console.log(characters[i])
            return characters[i].user_id;
        }
      }
  }

  public plotOnRecord()
  {
    this.Auth.getUserAccountDetails().subscribe(data=>{
    var self = this;
    console.log(data);
    data.forEach(function(value){
      console.log("The value pushed is:"+JSON.stringify(value));
      self.characters.push(value);
    });
    self.rowData = data;
    });
  }

  onSelectionChanged() {
    console.log("Reached onSelectionChanged");
    var selectedRows = this.gridApi.getSelectedRows();
    var selectedRowsString = "";
    selectedRows.forEach(function(selectedRow, index) {
      console.log("Reached the forEach function");
      if (index !== 0) {
        console.log("Reached the if condition inside forEach"); 
        selectedRowsString += ", ";
      }
      selectedRowsString += selectedRow.email;
    });
    console.log(selectedRowsString);

    this.beneficiaryData = [];
    this.witnessData = [];
    this.executorData = []; 
    this.user_id = this.search(selectedRowsString, this.characters);
    console.log("The user id is:"+this.user_id)
    
    localStorage.setItem('userid', this.user_id);

    this.Auth.getUserAccountDetails1(this.user_id).subscribe(data =>{
    this.displayData = data;
    console.log("The DATA is:"+JSON.stringify(this.displayData));
    this.conditionFlag=true;
    for (var i=0; i < Object.keys(this.displayData).length; i++) {
        if (this.displayData[i].party_type === "owner") {
          this.ownerData = this.displayData[i];    
        }
        else if(this.displayData[i].party_type === "beneficiary")
        {
          this.beneficiaryData.push(this.displayData[i]);
        }
        else if(this.displayData[i].party_type.includes("witness"))
        {
          this.witnessData.push(this.displayData[i]);
        }
        else if(this.displayData[i].party_type.includes("executor"))
        {
          this.executorData.push(this.displayData[i]);
        }
        else if(this.displayData[i].party_type.includes("primary guardian"))
        {
          this.guardianData1.push(this.displayData[i]);
        }
        else if(this.displayData[i].party_type.includes("secondary guardian"))
        {
          this.guardianData2.push(this.displayData[i]);
        }
      }

      this.formText = "I, {{name}}, a resident in the city of {{city}}, County of {{county}}, State of {{state}},\
                  \ndeclare that this is my will.\
                  \n\n1. Revocation. I revoke all wills that I have previously made.\n"


      if(this.ownerData.marital_status ==="Y" || this.ownerData.marital_status ==="y")
      {
        this.formText = this.formText.concat("2. I am married to {{spouse}}\n");
      }
      else
      {
        this.formText = this.formText.concat("2. I am not married\n");
      }

      this.Auth.getAssetData(this.displayData[0].will_id).subscribe(data1=>{
          this.conditionFlagAsset = true;
          this.assetData = data1;
          console.log("This is what is there in the assetData list"+JSON.stringify(this.assetData));
      });

      this.Auth.getPaymentDetails(this.displayData[0].will_id).subscribe(data4=>{
          this.conditionFlagPayment = true;
          this.paymentDetails = data4;
          console.log("This is what is there in the paymentDetails list"+JSON.stringify(this.paymentDetails));
          console.log("The payment details are"+ this.paymentDetails[0].last_payment_dt);
      });

      this.Auth.getChildrenInformation(this.ownerData.will_id).subscribe(data2=>{
          var i=0;
          for(i=0; i<Object.keys(data2).length; i++)
          {
            if(i===0)
            {
              this.formText = this.formText.concat("\n3. Children. I have the following child(ren):\
                        \n\nName\n");
            }
            this.formText = this.formText.concat(data2[i].children_name);
            this.formText = this.formText.concat("\n");

            if(i===Object.keys(data2).length-1)
            {
                this.formText = this.formText.concat("\nIf I do not leave property to one or more of the children or grandchildren whom I have identified above,\
                                          \n my failure to do so is intentional.\
                                          \n4. Personal Guardian. If at my death any of my children are minors and a personal guardian is needed,\
                                          \nI name {{guardian}} as the personal guardian, to serve without bond. \
                                          \nIf this person is unable or unwilling to serve as personal guardian, I name {{guardian2name}} \
                                          \nas personal guardian, also to serve without bond.\
                                          \n5. Property Guardian. If at my death any of my children are minors and a property guardian is needed, \
                                          \nI name {{guardian1name}} as the property guardian, to serve without bond. If this person is unable\
                                          \n or unwilling to serve as property guardian, I name {{guardian2name}} as property guardian,\
                                          \n also to serve without bond.");
            }
          }
          this.formText = this.formText.concat("\n\
                            \n6. Disposition of Property. I make the following specific gifts of property:\
                            \n");

            this.Auth.getBenAssetData(this.displayData[0].will_id).subscribe(data3=>{

                console.log("Reached the getBenAssetData point");
                this.conditionFlagBenAsset = true;
                this.benAssetData = data3;
            if(this.benAssetData === undefined || this.benAssetData === null)
            {
              console.log("Got an undefined");
            }
            else
            {
              console.log("This is what is in the benasset list"+JSON.stringify(this.benAssetData));
              for(i=0; i<Object.keys(data3).length; i++)
              {
                this.formText = this.formText.concat("To "+data3[i].name+",I leave\n");
                this.formText = this.formText.concat(data3[i].belongings_name.replace(" ","\n"));
                this.formText = this.formText.concat("\n");
              }
            }
            this.formText = this.formText.concat("\nor, if such beneficiary(ies) do(es) not survive me, to {{altben}}.\
                                        \nAny specific gift made in this will to two or more beneficiaries shall be shared equally among them,\
                                        \nunless unequal shares are specifically indicated. All shared gifts must be sold, and the net proceeds\
                                        \ndistributed as the will directs, unless all beneficiaries for a particular gift agree in writing,\
                                        \nafter my death, that the gift need not be sold.\
                                        \nIf I name two or more primary beneficiaries to receive a specific gift of property and any of them\
                                        \ndo not survive me,all surviving primary beneficiaries to that gift shall equally divide the deceased\
                                        \nprimary beneficiary's share, unless I have specifically provided otherwise.\
                                        \nIf I name two or more alternate beneficiaries to receive a specific gift of property and any of \
                                        \nthem do not survive me,all surviving alternate beneficiaries to that gift shall equally divide the\
                                        \ndeceased alternate beneficiary\'s share.\
                                        \n7. Residuary Estate. I leave my residuary estate, that is, the rest of my property not otherwise\
                                        \nspecifically and validly disposed of by this will or in any other manner, including lapsed or failed\
                                        \ngifts, to {{resben}} , or, \
                                        \nif such residuary beneficiary(ies) do(es) not survive me, to {{altresben}}.\
                                        \nAny residuary gift made in this will to two or more beneficiaries shall be shared equally among them,\
                                        \nunless unequal shares are specifically indicated. All shared residuary gifts must be sold, and the net\
                                        \nproceeds distributed as the will directs, unless all beneficiaries for a particular gift agree in writing,\
                                        \nafter my death, that the gift need not be sold.\
                                        \nIf I name two or more alternate residuary beneficiaries to receive property and any of \
                                        \nthem do not survive me,all surviving alternate residuary beneficiaries shall equally divide the \
                                        \ndeceased alternate residuary beneficiary's share.\
                                        \nAs used in any section of this will, the word \"survive\" means to outlive me by at least 45 days.\
                                        \n\n8. Executor. I appoint {{executorname}} as executor, to serve without bond. If that executor does not\
                                        \nqualify,or ceases to serve, I name {{altexecutorname}} as executor, also to serve without bond.\
                                        \nI direct that my executor take all actions legally permissible to probate this will, including filing a\
                                        \npetition inthe appropriate court for the independent administration of my estate.\
                                        \nI grant to my executor the following powers, to be exercised as the executor deems to be in the\
                                        \nbest interests of my estate:\
                                        \n(1) To retain property, without liability for loss or depreciation resulting from such retention.\
                                        \n(2) To sell, lease, or exchange property, and to receive or administer the proceeds as a part of my estate.\
                                        \n(3) To vote stock; convert bonds, notes, stocks, or other securities belonging to my estate into other securities,\
                                        \nand exercise all other rights and privileges of a person owning similar property.\
                                        \n(4) To deal with and settle claims in favor of or against my estate.\
                                        \n(5) To continue, maintain, operate, or participate in any business that is a part of my estate,\
                                        \nand to incorporate,dissolve, or otherwise change the form of organization of the business.\
                                        \n(6) To pay all debts and taxes that may be assessed against my estate, as provided under state law.\
                                        \n(7) To do all other acts which in the executor\'s judgment may be necessary or appropriate for the \
                                        \nproper and advantageous management, investment, and distribution of my estate.\
                                        \nThese powers, authority, and discretion are in addition to the powers, authority, and discretion vested\
                                        \nin an executor by operation of law, and may be exercised as often as deemed necessary, without approval\
                                        \nby any court in any jurisdiction.\
                                        \n\n\n\nI subscribe my name to this will this {{day}} day of {{month}}, {{year}}, at {{county}}, State of {{state}},\
                                        \nand declare it is my will,that I sign it willingly, that I execute it as my free and voluntary act for the\
                                        \npurposes expressed, and that I am of the age of majority or otherwise legally empowered to make a will and\
                                        \nunder no constraint or undue influence.\
                                        \n\nSignature: {{name}}\
                                        \nWitnesses\
                                        \nOn this {{day}} day of month {{month}}, year {{year}}, the testator, {{name}}, declared to us, the undersigned,\
                                        \nthat this instrument was his or her will and requested us to act as witnesses to it. The testator signed\
                                        \nthis will in our presence, all of us being present at the same time. We now, at the testator’s request,\
                                        \nin the testator’s presence and in the presence of each other,subscribe our names as witnesses and each \
                                        \ndeclare that we are of sound mind and of proper age to witness a will.\
                                        \nWe further declare that we understand this to be the testator’s will, and that to the best of our knowledge\
                                        \nthe testator is of the age of majority, or is otherwise legally empowered to make a will,\
                                        \nand appears to be of sound mind and under no constraint or undue influence.\
                                        \n\nWe declare under penalty of perjury that the foregoing is true and correct, this {{day}} day of {{month}}, {{year}},\
                                        \nat {{county}}, State of {{state}}.\
                                        \n\n\nWitness’s Signature:{{winname1}}\
                                        \nTyped or Printed Name:{{winname1}}\
                                        \nStreet Address, City:{{winstreet1}} {{wincity1}}\
                                        \nCounty, State: {{wincounty1}} {{winstate1}}\
                                        \n\n\nWitness’s Signature:{{winname2}}\
                                        \nTyped or Printed Name:{{winname2}}\
                                        \nStreet Address, City:{{winstreet2}} {{wincity2}}\
                                        \nCounty, State: {{wincounty2}} {{winstate2}}\
                                      ");
                                      console.log("================QUILL TEXT=================\n"+this.formText);
                                  });
                                });
                    });
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.sizeColumnsToFit();
  }

   public onClickPDF()
   {
      console.log("Reached onSubmit")
      var d = new Date();
      console.log("Reached here again");
      const doc = new jsPDF('p', 'mm', 'a4');
      doc.setFontSize(10);
      this.formText = this.formText.replace(/{{name}}/g, this.ownerData["name"]);
      this.formText = this.formText.replace(/{{city}}/g, this.ownerData["city"]);
      this.formText = this.formText.replace(/{{county}}/g, this.ownerData["county"]);
      this.formText = this.formText.replace(/{{state}}/g, this.ownerData["state"]);
      this.formText =this.formText.replace(/{{spouse}}/g, this.ownerData["spouse"]);
      
      if(this.guardianData1 != undefined && this.guardianData1.length != 0)
      {
        this.formText =this.formText.replace(/{{guardian}}/g,this.guardianData1["name"]);
      }
      this.formText =this.formText.replace(/{{altben}}/g,"");
      this.formText =this.formText.replace(/{{resben}}/g,"");
      this.formText =this.formText.replace(/{{altresben}}/g,"");
      this.formText =this.formText.replace(/{{day}}/g,d.getDay().toString());
      this.formText =this.formText.replace(/{{month}}/g,(d.getMonth()+1).toString());
      this.formText =this.formText.replace(/{{year}}/g,d.getFullYear().toString());
      
      if(this.witnessData != undefined && this.witnessData.length != 0)
      {
        this.formText =this.formText.replace(/{{winname1}}/g,this.witnessData[0].name);
        this.formText =this.formText.replace(/{{winstreet1}}/g,this.witnessData[0].street_address); 
        this.formText =this.formText.replace(/{{wincity1}}/g,this.witnessData[0].city);
        this.formText =this.formText.replace(/{{wincounty1}}/g,this.witnessData[0].county);
        this.formText =this.formText.replace(/{{winstate1}}/g,this.witnessData[0].state);
      }
      if(Object.keys(this.witnessData).length >1)
      {
        this.formText =this.formText.replace(/{{winname2}}/g,this.witnessData[1].name);
        this.formText =this.formText.replace(/{{winstreet2}}/g,this.witnessData[1].street_address);
        this.formText =this.formText.replace(/{{wincity2}}/g,this.witnessData[1].city);
        this.formText =this.formText.replace(/{{wincounty2}}/g,this.witnessData[1].county);
        this.formText =this.formText.replace(/{{winstate2}}/g,this.witnessData[1].state);
      }

      if(this.executorData != undefined && this.executorData.length != 0)
      {
        this.formText =this.formText.replace(/{{executorname}}/g,this.executorData[0].name); 
      }
      
      if(this.guardianData1.length === 0)
      {
        console.log("This is the value");
      }

      if(this.guardianData1 != undefined && this.guardianData1.length != 0)
      {
        this.formText =this.formText.replace(/{{guardian1name}}/g,this.guardianData1[0].name); 
      }
      if(this.guardianData2 != undefined && this.guardianData2.length != 0)
      {
        this.formText =this.formText.replace(/{{guardian2name}}/g,this.guardianData2[0].name); 
      }

      if(Object.keys(this.executorData).length >1)
      {
        this.formText =this.formText.replace(/{{altexecutorname}}/g,this.executorData[1].name);
      }

      this.formText = this.formText.replace(/<p>/g,'');
      this.formText = this.formText.replace(/<\/p>/g,'\n');
      this.formText = this.formText.replace(/<br>/g, '\n');

      console.log(num_lines);

      console.log(startIndx);
      var startIndx = 0;
      var endIndx = 0;
      var iteration = 1;
      var lastIteration = 0;
      var num_lines = 0;
      while(lastIteration != 1)
      {
        num_lines = (this.formText.match(new RegExp("\n","g")) || []).length;
        if(num_lines<50)
        {
          lastIteration = 1;
        }

        if(iteration != 1)
        {
          doc.addPage();
        }
        endIndx = this.getPosition(this.formText, "\n", 50);
        //console.log("The value of endIndx is:"+endIndx);
        this.formTextAppend = this.formText.substring(startIndx, endIndx);
        this.formText = this.formText.substring(endIndx);
        //console.log(this.formTextAppend);
        doc.text(this.formTextAppend, 10, 10);
        iteration = iteration + 1;
      }

      doc.save("Will.pdf");
   }

   createCustomWill()
   {
      window.open('#/editor');
   }

   viewFeedbackInfo()
   {
      localStorage.setItem('useridfeedback', this.user_id);
      console.log("Reached this part in getLoggedInStatus")
      this.router.navigate(['/customerfb'])    
   }

   changeWillStatus()
   {
      console.log(this.ownerData.will_id);
      this.Auth.setWillStatus(this.ownerData.will_id).subscribe(data=>{
              this.Auth.getUserAccountDetails().subscribe(data=>{
              var self = this;
              console.log(data);
              data.forEach(function(value){
                console.log("The value pushed is:"+JSON.stringify(value));
                self.characters.push(value);
              });
              self.rowData = data;
              });

          this.displayWillSuccess = true;
      });

   }

  getPosition(string, subString, index) {
     return string.split(subString, index).join(subString).length;
  }


}
