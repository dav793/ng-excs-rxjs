import { Component } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private router: Router) {}

  navigateToRxjsTest() {
    this.router.navigate(['rxjs']);
  }

  navigateToDefault() {
    this.router.navigate(['default']);
  }

}
