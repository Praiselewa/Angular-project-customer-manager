import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerComponent } from './customer/customer.component';
import { CreateCustomerComponent } from './create-customer/create-customer.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/customers',
    pathMatch: 'full'
  },
  {
    path: 'customers',
    component: CustomerComponent,
  },
  {
    path: 'new-customer',
    component: CreateCustomerComponent,
  },
  {
    path: 'edit-customer/:id',
    component: CreateCustomerComponent,
  },
  {
    path: 'view-customer',
    component: CreateCustomerComponent,
  },];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
