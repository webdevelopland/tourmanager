import { Component, ViewChild  } from "@angular/core";
import { Title } from "@angular/platform-browser";

import { ResultsComponent } from "./results/results.component";
import { SearchComponent } from "./search/search.component";

@Component({
  templateUrl: "./home.html"
})
export class HomePageComponent {

  @ViewChild(ResultsComponent)
  results:ResultsComponent;

  @ViewChild(SearchComponent)
  search:SearchComponent;

  constructor(
    public title:Title
  ) {
    this.title.setTitle("Tour Manager");
  }
  
}