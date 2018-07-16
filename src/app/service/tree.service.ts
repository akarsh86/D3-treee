import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {TreeData} from '../model/tree-data';

@Injectable({
  providedIn: 'root'
})
export class TreeService {

  private baseUrl = '/api/tree/';

  constructor(private http: HttpClient) {
  }

  public getTree(): Observable<TreeData> {
    return this.http.get<TreeData>(this.baseUrl);
  }
}
