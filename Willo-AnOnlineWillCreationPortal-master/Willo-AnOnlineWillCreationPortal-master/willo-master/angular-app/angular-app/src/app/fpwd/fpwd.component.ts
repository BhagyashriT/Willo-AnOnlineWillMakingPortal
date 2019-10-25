import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fpwd',
  templateUrl: './fpwd.component.html',
  styleUrls: ['./fpwd.component.css']
})
export class FpwdComponent implements OnInit {

  constructor(private Auth:AuthService, private router: Router) { }

  ngOnInit() {
  }

  public displayResultTrue:boolean = false;
  public displayResultFalse:boolean = false;

  sendPassword(emailID:string)
  {
  	console.log(emailID);
    this.Auth.getPassword(emailID).subscribe(data=>{
        if(data['result']){
          this.displayResultFalse= false;
          this.displayResultTrue =true;        
        }
        else{
          this.displayResultTrue = false;
          this.displayResultFalse = true;
        }
      });
  }

}
