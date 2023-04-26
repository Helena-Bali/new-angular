import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-custom-items',
  templateUrl: './custom-items.component.html',
  styleUrls: ['./custom-items.component.scss']
})
export class CustomItemsComponent implements OnInit {
  orderCustomForm: FormGroup;
  customItems: FormArray;
  @Output() setCustomItems = new EventEmitter();

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.orderCustomForm = this.formBuilder.group({
      customItems: this.formBuilder.array([this.createCustomItem()])
    });
    this.addCustomItem();
    this.deleteCustomItem(1);
  }

  createCustomItem(): FormGroup {
    return this.formBuilder.group({
      width: 0,
      height: 0,
      length: 0,
      weight: 0,
      quantity: 1
    });
  }

  addCustomItem(): void {
    this.customItems = this.orderCustomForm.get('customItems') as FormArray;
    this.customItems.push(this.createCustomItem());
  }

  deleteCustomItem(i: number) {
    this.customItems.removeAt(i);
  }

  setParentCustomItems() {
    this.customItems = this.orderCustomForm.get('customItems') as FormArray;
    this.setCustomItems.emit(this.customItems);
  }
}
