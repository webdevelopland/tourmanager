import { Component, OnInit, AfterContentInit } from "@angular/core";

@Component({
  selector: "angular",
  templateUrl: "./angular.html"
})
export class AngularComponent implements OnInit, AfterContentInit {

  constructor() {}

  ngOnInit() {
    var f = this;
  }

  ngAfterContentInit() {
    var f = this;
  }
  
}