import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChildService } from '../services/child.service';

@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
  styleUrl: './child.component.css'
})
export class ChildComponent {
  name!: string;
  subscription: Subscription;
  constructor(private childService: ChildService) {
    this.subscription = childService.name$.subscribe((response) => {
      this.name = response;
    })
  }
  @Input() childInput: string | undefined;
  @Output() nameEmitter = new EventEmitter<string>();

  displayName() {
    this.nameEmitter.emit('Ini Vincent')
  }
}
