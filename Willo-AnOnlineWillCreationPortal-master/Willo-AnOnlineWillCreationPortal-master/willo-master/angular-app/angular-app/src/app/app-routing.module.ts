import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component'
import {UseraccountComponent} from './useraccount/useraccount.component'
import {FinancialinfoComponent} from './financialinfo/financialinfo.component'
import {AddadminComponent} from './addadmin/addadmin.component'
import {CustomerfbComponent} from './customerfb/customerfb.component'
import { LoginComponent } from './login/login.component';
import { FpwdComponent } from './fpwd/fpwd.component';
import { EditorComponent } from './editor/editor.component';

const routes: Routes = [{ path:'', redirectTo:'/login', pathMatch:'full'},
						{ path:'login', component: LoginComponent},
						{ path:'dashboard', component: DashboardComponent},
						{ path:'useraccount', component: UseraccountComponent},
						{ path:'financialinfo', component: FinancialinfoComponent},
						{ path:'addadmin', component: AddadminComponent},
						{ path:'customerfb', component: CustomerfbComponent},
						{ path:'fpwd', component: FpwdComponent},
						{ path:'editor', component: EditorComponent}
						];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [LoginComponent, DashboardComponent, UseraccountComponent, FinancialinfoComponent, AddadminComponent, CustomerfbComponent, FpwdComponent]
