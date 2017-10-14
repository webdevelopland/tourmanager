import { Component, Output, EventEmitter } from "@angular/core";
import { not } from "libraryjs";

import { Routing } from "../routing/routing";
import { DataService } from "./data.service";

@Component({
  selector: "search",
  templateUrl: "./search.html",
  providers: [ DataService ] //load data from server
})
export class SearchComponent {
  radio:string; //radio html
  selectFrom:any; //Arrival in html select
  selectTo:any; //Departure in html select

  routing:Routing = new Routing();

  @Output() show: EventEmitter<any> = new EventEmitter();

  constructor(
    private data:DataService
  ) {

    this.refresh(); //initialize start variable

    this.data.load((res) => {
      this.routing.load(res); //<-- launch here
    });
  }

  //Refresh start variable
  refresh() {
    this.selectFrom = null;
    this.selectTo = null;
    this.radio = "radio-fast";
  }

  //When html button "Search" is pushed
  search() {
    if (not(this.selectFrom) || not(this.selectTo)) {
      alert ("Specify path, please");
      return;
    }
    if (this.selectFrom === this.selectTo) {
      alert ("Arrival and Departure should be different");
      return;
    }

    this.routing.refresh(); //let's refresh vars after last search
    var routing;
    if (this.radio === "radio-fast") {
      routing = this.routing.fastStart(this.selectFrom, this.selectTo);
    }
    else {
      routing = this.routing.cheapStart(this.selectFrom, this.selectTo);
    }
    if (routing.error) {
      alert("No available flights, sorry");
      return;
    }

    this.show.emit(routing);
  }
}