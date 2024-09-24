import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ICustomers, ICustomer } from '../interfaces/customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private customers: ICustomer[] = [];
  selectedCustomer!: ICustomer

  constructor(private httpClient: HttpClient) { }

  getCustomers(): Observable<ICustomers> {
    return this.httpClient.get<ICustomers>('https://jsonplaceholder.typicode.com/users')
      .pipe(
        tap(customers => this.customers = customers),
        catchError(error => throwError(() => new Error(error)))
      );
  }

  createCustomers(data: ICustomer): Observable<ICustomer> {
    return this.httpClient.post<ICustomer>('https://jsonplaceholder.typicode.com/users', data)
      .pipe(
        tap(customer => this.customers.push(customer)),
        catchError(error => throwError(() => new Error(error)))
      );
  }

  editCustomers(data: ICustomer): Observable<ICustomer> {
    return this.httpClient.put<ICustomer>(`https://jsonplaceholder.typicode.com/users/${data.id}`, data)
      .pipe(
        tap(customer => {
          const index = this.customers.findIndex(c => c.id === customer.id);
          if (index !== -1) {
            this.customers[index] = customer;
          }
        }),
        catchError(error => throwError(() => new Error(error)))
      );
  }

  deleteCustomers(id: number): Observable<void> {
    return this.httpClient.delete<void>(`https://jsonplaceholder.typicode.com/users/${id}`)
      .pipe(
        tap(() => {
          const index = this.customers.findIndex(c => c.id === id);
          if (index !== -1) {
            this.customers.splice(index, 1);
          }
        }),
        catchError(error => throwError(() => new Error(error)))
      );
  }

  getData(): Observable<ICustomer[]> {
    return of(this.customers);
  }
}
