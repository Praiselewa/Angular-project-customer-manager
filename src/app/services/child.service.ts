import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChildService {
  name = new Subject<string>();
  name$ = this.name.asObservable();
  setName(data: string) {
    this.name.next(data)
  }
}
