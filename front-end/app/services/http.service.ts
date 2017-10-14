import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import "rxjs/add/operator/map";
import * as js from "libraryjs";

@Injectable()
export class HttpService {

  constructor (
    private http:Http
  ) {}

  post(param) {
    var f = this;

    f.http.post(param.url, param.json)
      .map(res => res.json())
      .subscribe((res) => {
        param.callback(res);
      })
    ;
  }

  get(param) {
    var f = this;

    f.http.get(param.url)
      .map(res => res.json())
      .subscribe((res) => {
        param.callback(res);
      })
    ;
  }
  
}