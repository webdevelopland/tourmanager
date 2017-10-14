import { Component } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { not } from "libraryjs";
import { Routing } from "./Routing";
import { DataService } from "./data.service";

@Component({
  templateUrl: "./home.html",
  providers: [ DataService ] //load data from server
})
export class HomePageComponent {
  radio:string; //radio html
  selectFrom:any; //Arrival in html select
  selectTo:any; //Departure in html select

  visible:boolean = false; //search results visible/hiiden
  route:Array<any>; //the search results
  total:any; //total sum of results

  routing:Routing = new Routing(); //<-- base code here

  constructor(
    public title:Title,
    private data:DataService
  ) {
    this.title.setTitle("Tour Manager");

    this.ini(); //initialize start variable

    this.data.load((res) => {
      this.routing.load(res); //<-- launch here
    });
  }

  //initialize start variable
  ini() {
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

    var convertTime = (min) => {
      var h:number = Math.floor(min/60);
      var m:number = min - h*60;
      var zeroplus = (d) => {
        return (d>=10)?""+d:"0"+d;
      };
      return `${zeroplus(h)}:${zeroplus(m)}`;
    };

    //Data for html
    this.total = {
      duration: convertTime(routing.min),
      cost: routing.price+"€"
    };

    var route = [];
    for(let path of routing.route) {   
      route.push({
        from: path.from,
        to: path.to,
        cost: path.price+"€",
        about: `${path.transport} ${path.code} for ${convertTime(path.min)}`,
      });
    }
    this.route = route.reverse();

    this.visible = true;
  }

  //When html button "reset" is pushed
  reset() {
    this.visible = false;
    this.ini();
  }

}