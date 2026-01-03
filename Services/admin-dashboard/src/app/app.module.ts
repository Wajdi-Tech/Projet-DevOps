import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Required for Toastr
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { provideHttpClient, withFetch } from '@angular/common/http'; // Updated import
import { AppComponent } from './app.component';
import { LayoutComponent } from './layout/layout.component';
import { ProductsComponent } from './products/products.component';
import { OrdersComponent } from './orders/orders.component';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CustomersComponent } from './customers/customers.component';
@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    ProductsComponent,
    OrdersComponent,
    LoginComponent,
    DashboardComponent,
    CustomersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
      FormsModule,
    BrowserAnimationsModule, // Required for Toastr
    ToastrModule.forRoot() 
  ],
  providers: [
    provideHttpClient(withFetch()) // Add this line
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }