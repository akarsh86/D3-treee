import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggingService {

  constructor() {
  }

  public log(message: string | Object): void {
    console.log(message);
  }
}
