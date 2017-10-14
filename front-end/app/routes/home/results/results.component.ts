import { Component, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "results",
  templateUrl: "./results.html"
})
export class ResultsComponent {
  visible:boolean = false; //results are visible/hiiden
  route:Array<any>; //the search results
  total:any; //total sum of results

  @Output() refresh: EventEmitter<any> = new EventEmitter();

  //Show the results
  show(routing:any) {
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
    this.refresh.emit();
  }

}