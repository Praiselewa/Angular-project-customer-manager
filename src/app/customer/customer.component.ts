import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { ChildService } from '../services/child.service';
import { CustomerService } from '../services/customer.service';
import { ICustomer } from '../interfaces/customer';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerComponent implements OnInit {
  searchTerm: string = '';
  displayedColumns: string[] = ['no', 'name', 'email', 'phone', 'address', 'gender', 'actions'];
  dataSource: ICustomer[] = [];
  filteredItems: ICustomer[] = [];

  constructor(
    private router: Router,
    private customerService: CustomerService,
    private changeDetectorRef: ChangeDetectorRef // Manually triggering change detection
  ) { }

  ngOnInit(): void {
    this.getCustomers();
    this.appendCustomers();
  }

  goTo(): void {
    this.router.navigateByUrl('/new-customer');
  }

  goToView(element: ICustomer): void {
    this.customerService.selectedCustomer = element
    this.router.navigateByUrl(`/view-customer`);
  }

  goToEdit(element: ICustomer, id: number): void {
    this.customerService.selectedCustomer = element
    this.router.navigateByUrl(`/edit-customer/${id}`);
  }


  initDelete(rowIndex: number): void {
    const customerId = this.filteredItems[rowIndex].id;
    if (customerId) {
      this.customerService.deleteCustomers(customerId).subscribe((data) => {
        alert(JSON.stringify(data));
        this.filteredItems = this.filteredItems.filter((item) => item.id !== customerId);
        this.dataSource = this.filteredItems;
        this.changeDetectorRef.detectChanges();  // Force change detection immediately
      });
    }
  }


  getCustomers(): void {
    this.customerService.getCustomers().subscribe((data) => {
      this.dataSource = data;
      this.filteredItems = [...data];
    });
  }

  async appendCustomers(): Promise<void> {
    this.customerService.getData()?.subscribe((newCustomer) => {
      if (newCustomer) {
        this.dataSource = newCustomer;
        this.filteredItems = newCustomer;
        this.changeDetectorRef.markForCheck();
      }
    });
  }

  onSearch(): void {
    const lowerSearchTerm = this.searchTerm.toLowerCase();
    this.filteredItems = this.dataSource.filter((item: ICustomer) => {
      return (
        item.name.toLowerCase().includes(lowerSearchTerm) ||
        item.email.toLowerCase().includes(lowerSearchTerm) ||
        item.phone.toString().includes(lowerSearchTerm) ||
        item.address.street.toLowerCase().includes(lowerSearchTerm) ||
        item.gender?.toLowerCase().includes(lowerSearchTerm)
      );
    });
    this.changeDetectorRef.detectChanges();
  }
}
