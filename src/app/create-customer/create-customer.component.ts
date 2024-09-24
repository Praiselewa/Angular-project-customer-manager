import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../services/customer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ICustomer } from '../interfaces/customer';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-create-customer',
  templateUrl: './create-customer.component.html',
  styleUrls: ['./create-customer.component.css'],
})
export class CreateCustomerComponent implements OnInit {
  customerFormGroup!: FormGroup;
  pathname!: string;
  id!: number;

  constructor(
    private formBuilder: FormBuilder,
    private customerService: CustomerService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.pathname = this.route.snapshot.url[0]?.path ?? '';
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.createCustomerForm(this.customerService.selectedCustomer!);
  }

  createCustomerForm(data: ICustomer): void {
    this.customerFormGroup = this.formBuilder.group({
      name: [
        this.pathname === 'new-customer' ? '' : data.name,
        [Validators.required],
      ],
      email: [
        this.pathname === 'new-customer' ? '' : data.email,
        [Validators.required, Validators.email],
      ],
      phone: [
        this.pathname === 'new-customer' ? '' : data.phone,
        [Validators.required, Validators.minLength(10)],
      ],
      address: [
        this.pathname === 'new-customer' ? '' : data.address.street,
        [Validators.required],
      ],
      gender: [
        this.pathname === 'new-customer' ? '' : data.gender,
        [Validators.required],
      ],
    });

    if (this.pathname === 'view-customer') {
      this.customerFormGroup.disable(); // Disable form for viewing customers
    }
  }

  goToCustomers(): void {
    this.router.navigateByUrl('/customers');
  }

  onCreate(): void {
    if (this.customerFormGroup.valid) {
      this.customerFormGroup.value.address = {
        street: this.customerFormGroup.value.address,
      };
      this.customerService
        .createCustomers(this.customerFormGroup.value)
        .subscribe((data) => {
          this.openDialog(data);
        });
    }
  }

  onEdit(): void {
    this.customerFormGroup.value.id = this.id;
    if (this.customerFormGroup.valid) {
      if (typeof this.customerFormGroup.value.address === 'string')
        this.customerFormGroup.value.address = {
          street: this.customerFormGroup.value.address,
        };
      this.customerService
        .editCustomers(this.customerFormGroup.value)
        .subscribe((data) => {
          this.openDialog(data);
        });
    }
  }

  openDialog(data: ICustomer): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '300px',
      data: data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.goToCustomers();
    });
  }
}
