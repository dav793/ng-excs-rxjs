import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { DefaultComponent } from "./default/default.component";
import { RxjsTestComponent } from "./rxjs-test/rxjs-test.component";

const routes = [
  { path: 'rxjs', component: RxjsTestComponent },
  { path: 'default', component: DefaultComponent },
  { path: '', redirectTo: '/rxjs', pathMatch: 'full' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
