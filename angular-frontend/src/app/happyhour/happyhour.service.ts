import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { HappyHourModel } from "../models/HappyHourModel";
import { getTodaysSpecials } from "../utils/happyHourUtils";

const APIURL = environment.apiUrl;
@Injectable({
  providedIn: "root"
})
export class HappyhourService {
  updateHappyHour(id: string, data: HappyHourModel): Observable<any> {
    return this.http.put(APIURL + "happyhour/" + id, data).pipe(
      map(response => {
        return response;
      })
    );
  }

  constructor(private http: HttpClient) {}

  //made async work (it needs to have an observable and it has to be an iterable like an array)
  getHappyHours(): Observable<HappyHourModel[]> {
    return this.http.get(APIURL + "happyhour").pipe(
      map((response: any) => {
        const currentDay = getTodaysSpecials();
        //do some error checking here eventually
        let jsonArray: HappyHourModel[] = response ? response.data : [];
        //use the js map to dynamically modify todaysSpecials for each happy hour only show 4 on
        //the landing page
        jsonArray.map((single: HappyHourModel) => {
          single.todaysSpecials = single[currentDay];
        });
        return jsonArray;
      })
    );
  }

  getHappyHour(id: string): Observable<HappyHourModel[]> {
    return this.http.get(APIURL + "happyhour/" + id).pipe(
      map(response => {
        const resp: any = response;
        //data should fit to the model
        return resp.data;
      })
    );
  }

  postNewHappyHour(data): Observable<any> {
    return this.http.post(APIURL + "happyhour", data).pipe(
      map(response => {
        return response;
      })
    );
  }

  deleteHappyHour(id: string): Observable<any> {
    return this.http.delete(APIURL + "happyhour/" + id).pipe(
      map(response => {
        return response;
      })
    );
  }
}
