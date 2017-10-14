import { Component } from "@angular/core";
import { Title } from "@angular/platform-browser";

@Component({
  templateUrl: "./error404.html"
})
export class Error404PageComponent {

  constructor(
    public title:Title
  ) {
    var f = this;
    f.title.setTitle("Page doesn't exist");
  }

}