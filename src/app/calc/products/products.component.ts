import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  orderForm: FormGroup;
  items: FormArray;

  @Input() products;
  @Output() getProducts = new EventEmitter();
  @Output() setItems = new EventEmitter();

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {

    this.orderForm = this.formBuilder.group({
      items: this.formBuilder.array([this.createItem()])
    });

     this.addItem();
     this.deleteItem(1);
  }

  createItem(): FormGroup {
    return this.formBuilder.group({
      product: '',
      quantity: 1
    });
  }

  addItem(): void {
    this.items = this.orderForm.get('items') as FormArray;
    this.items.push(this.createItem());
  }

  deleteItem(i: number) {
    this.items.removeAt(i);
  }

  setParentItems() {
     this.setItems.emit(this.items);
  }
}
