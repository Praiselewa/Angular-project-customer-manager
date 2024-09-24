import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class AddGenderInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url === 'https://jsonplaceholder.typicode.com/users' && request.method === 'GET') {
      return next.handle(request).pipe(
        tap(event => {
          if (event instanceof HttpResponse) {
            const customers = event.body;
            customers.forEach((customer: any) => {
              customer.gender = this.getRandomGender();
            });
          }
        })
      );
    } else {
      return next.handle(request);
    }
  }

  private getRandomGender(): string {
    const genders = ['Male', 'Female',];
    return genders[Math.floor(Math.random() * genders.length)];
  }
}

