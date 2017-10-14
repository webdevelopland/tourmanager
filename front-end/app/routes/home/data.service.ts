import { Injectable } from "@angular/core";
import { HttpService } from "@/services/http.service";
import { not } from "libraryjs";

@Injectable()
export class DataService {
  constructor(
    public http:HttpService
  ) {}

  load(callback) {
    this.http.get({ //get data from database
      url: "/db", //address
      callback: (res) => {
        if (not(res) || not(res.currency) || not(res.currency) ) {
          alert("Damaged data from DB");
          throw new Error();
        }
        callback(res);
      }
    });
  }
}