import { Component } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { HttpService } from "@/services/http.service";
import * as js from "libraryjs";
import { Routing } from "./Routing";

@Component({
  templateUrl: "./home.html"
})
export class HomePageComponent {
  radio:string;
  selectFrom:any;
  selectTo:any;

  visible:boolean = false;
  route:Array<any>;
  total:any;

  routing:Routing = new Routing();

  constructor(
    public title:Title,
    public http:HttpService
  ) {
    this.title.setTitle("Tour Manager");

    this.ini();

    this.http.get({
      url: "/db",
      callback: (res) => {
        if (js.not(res)) return;
        if (js.not(res.currency)) return;
        this.routing.load(res);
      }
    });
  }

  ini() {
    this.selectFrom = null;
    this.selectTo = null;
    this.radio = "radio-fast";
  }

  search() {
    if (js.not(this.selectFrom) || js.not(this.selectTo)) {
      alert ("Specify path");
      return;
    }
    if (this.selectFrom === this.selectTo) {
      alert ("Arrival and Departure should be different");
      return;
    }

    this.routing.refresh();
    var routing;
    if (this.radio === "radio-fast") {
      routing = this.routing.fastStart(this.selectFrom, this.selectTo);
    }
    else {
      routing = this.routing.cheapStart(this.selectFrom, this.selectTo);
    }
    if (routing.error) {
      alert("путь проложить невозможно, увы");
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
    route = route.reverse();
    this.route = route;

    this.visible = true;
  }

  reset() {
    this.visible = false;
    this.ini();
  }

}