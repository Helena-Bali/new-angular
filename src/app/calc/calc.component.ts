import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {PekService} from '../pek.service';
import {map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {SdekService} from '../sdek.service';
import {FormBuilder, FormGroup, FormArray} from '@angular/forms';
import {ProductService} from '../product.service';

@Component({
  selector: 'app-calc',
  templateUrl: './calc.component.html',
  styleUrls: ['./calc.component.scss']
})
export class CalcComponent implements OnInit {
  PEK = false;
  SDEK = false;
  pecCitiesTo = [];
  pecCities = [];
  sdekCities = [];
  pecCitiesFrom = [];
  sdekCitiesTo = [];
  sdekCitiesFrom = [];
  allCitiesTo = [];
  allCitiesFrom = [];
  citiesFrom: Observable<string[]>;
  citiesTo: Observable<string[]>;
  citiesFromControl = new FormControl();
  citiesToControl = new FormControl();
  productsControl = new FormControl();
  pecFrom: string;
  pecTo: string;
  sdekFrom: string;
  sdekTo: string;
  items: FormArray;
  delivery = false; // Доставка по адресу
  boxing = true; // Упаковка
  insurance = false; // Страховка
  statedValue = 0.0;

  customItems: FormArray;
  panelOpenState = false;

  labelFromNot = ' не осуществляет доставку из этого города!';
  labelToNot = ' не осуществляет доставку в этот город!';

  products: string[];


  pekAutoCost: string;
  dlAutoCost: string;
  pekTime: string;
  dlTime: string;
  pekResponse: object;
  dlResponse: object;
  errors = [];
  pekSpin = false;
  dlSpin = false;
  private pecErrors: [];


  constructor(public pekSrv: PekService, public sdekSrv: SdekService,
              private formBuilder: FormBuilder, public ProductSrv: ProductService) {
    this.getPekCities();
    this.getSdekCities();
  }

  ngOnInit() {
    this.citiesFromControl.setValue('Челябинск');
    this.pecTo = this.sdekTo = this.labelToNot;

    const timerId = setInterval(() => {
      if (this.pecCitiesFrom.length && this.sdekCitiesFrom.length) {
        // console.log(this.sdekCitiesFrom);
        // console.log(this.pecCitiesFrom);
        this.allCitiesFrom = this.sdekCitiesFrom.concat(this.pecCitiesFrom).filter(this.onlyUnique);
        // console.log(this.allCitiesFrom);
        this.allCitiesTo = this.sdekCitiesTo.concat(this.pecCitiesTo).filter(this.onlyUnique);
        this.initCities();
        this.pecFrom = this.findInPekCities('Челябинск');
        this.sdekFrom = this.findInSdekCities('Челябинск');
        clearInterval(timerId);
      }
    }, 500);

    // this.products = ['Гаечный ключ', 'Баечный ключ2', 'Раечный ключ3', 'Фаечный ключ4', 'Гаечный ключ5'];
    this.getProducts();
  }


  onFromChange(city) {
    this.pecFrom = this.findInPekCities(city) ? this.findInPekCities(city) : undefined;
    this.sdekFrom = this.findInSdekCities(city) ? this.findInSdekCities(city) : undefined;
  }

  onToChange(city) {
    this.pecTo = this.findInPekCities(city) ? this.findInPekCities(city) : undefined;
    this.sdekTo = this.findInSdekCities(city) ? this.findInSdekCities(city) : undefined;

  }

  findInPekCities(city) {
    return this._filter(city.split(' ')[0], this.pecCitiesFrom)[0];
  }

  findInSdekCities(city) {
    return this._filter(city.split(' ')[0], this.sdekCitiesFrom)[0];
  }

  private _filter(value: string, cities: Array<string>): string[] {
    const filterValue = value.toLowerCase();
    return cities.filter(option => option.toLowerCase().indexOf(filterValue) === 0).slice(0, 10);
  }

  getPekCities() {
    this.pekSrv.getCities()
      .subscribe((data) => {
        const cities = data[`cities`];
        cities.map((x) => {
          this.pecCities[x[0]] = x[1];
        });
        this.pecCitiesFrom = cities.map((x) => {
          return x[0];
        });
        this.pecCitiesTo = cities.map((x) => {
          return x[0];
        });
      });
  }

  getSdekCities() {
    this.sdekSrv.getCities()
      .subscribe((data) => {
        const cities = data[`cities`];
        cities.map((x) => {
          this.sdekCities[x[0]] = x[1];
        });
        this.sdekCitiesFrom = cities.map((x) => {
          return x[0];
        });
        this.sdekCitiesTo = cities.map((x) => {
          return x[0];
        });
        // console.log(this.sdekCities)
      });
  }

  getProducts(q?) {
    this.ProductSrv.getProducts(q)
      .subscribe((data) => {
        this.products = data.products;
      });
  }

  initCities() {
    this.citiesFrom = this.citiesFromControl.valueChanges
      .pipe(
        startWith('А'),
        map(value => this._filter(value, this.allCitiesFrom.sort()))
      );
    this.citiesTo = this.citiesToControl.valueChanges
      .pipe(
        startWith('А'),
        map(value => this._filter(value, this.allCitiesTo.sort()))
      );

    this.citiesFromControl.setValidators(Validators.required, );
    this.citiesToControl.setValidators(Validators.required, );
  }

  validate() {
    let validate = true;
    if (!this.citiesToControl.valid) {
      this.citiesToControl.markAsTouched({onlySelf: true});
      validate = false;
    }
    if (!this.citiesFromControl.valid) {
      this.citiesFromControl.markAsTouched({onlySelf: true});
      validate = false;
    }
    return validate;
  }

  calculate() {
    if (!this.validate()) {
      return false;
    }

    this.pekCalculate();
    this.dlCalculate();
    this.generateErrors();
  }

  pekCalculate() {
    // console.log(this.pecCities[this.pecFrom]);
    // console.log(this.pecCities[this.pecTo]);

    const take_town = this.pecCities[this.pecFrom];
    const deliver_town = this.pecCities[this.pecTo];

    // console.log(this.orderForm.get('items'));
    // console.log(this.items);
    if (!take_town || !deliver_town) { return false; }
    const places = this.getPlaces();
    const custom = this.getCustom();
    // if (!places.length) return false;
    this.pekSpin = true;
    const data = {
      take_town: take_town,
      deliver_town: deliver_town,
      places: places,
      custom: custom,
      delivery: this.delivery,
      boxing: this.boxing,
      insurance: this.insurance,
      statedValue: this.statedValue
    };
    // tslint:disable-next-line:no-shadowed-variable
    this.pekSrv.calculate(data).subscribe((data) => {
      // console.log(data);
      this.pekResponse = data;
      if (data[`error`]) {
        // this.errors = this.errors.concat(data['error']
       //   .map(e => {return 'ПЭК: ' + e['title'] + ' - ' [e['message']]}));
        this.errors.push('ПЭК: ' + data[`error`].title + ' - ' + data[`error`].message);
        this.pekAutoCost = '0';
        this.pekTime = '0';
      }
      if (data[`transfers`]) {
        this.pekAutoCost = data[`transfers`][0].costTotal;
        this.pekTime = data[`commonTerms`][0].transporting[0];
      }
      this.pekSpin = false;
    });
  }

  dlCalculate() {
    const take_town = this.sdekCities[this.sdekFrom];
    const deliver_town = this.sdekCities[this.sdekTo];
    if (!take_town || !deliver_town) { return false; }
    const places = this.getPlaces();
    const custom = this.getCustom();
    // if (!places.length) return false;
    this.dlSpin = true;
    const data = {
      take_town: take_town,
      deliver_town: deliver_town,
      places: places,
      custom: custom,
      delivery: this.delivery,
      boxing: this.boxing,
      insurance: this.insurance,
      statedValue: this.statedValue
    };
    this.sdekSrv.calculate(data).subscribe((data) => {
      console.log(data);
      this.dlResponse = data;
      if (data[`errors`]) {
        this.errors = this.errors.concat(Object.values(data[`errors`]).map(e => 'Деловые Линии: ' + e));
        this.dlAutoCost = '0';
        this.dlTime = '0';
      }
      if (data[`price`]) {
        this.dlAutoCost = data[`price`];
        this.dlTime = data[`time`].value;
      }
      this.dlSpin = false;
    });
  }

  getCustom() {
    const custom = [];
    if (this.customItems) {
      for (let i = 0; i < this.customItems.length; i++) {
        const element = this.customItems.value[i];
        custom.push(element);
      }
    }
    return custom;
  }

  getPlaces() {
    const places = [];
    if (this.items) {
      for (let i = 0; i < this.items.length; i++) {
        const element = this.items.value[i];
        if (element.product) {
          places.push(element);
        }
      }
    }
    return places;
  }

  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  private generateErrors() {
    const pek = 'ПЭК';
    const dl = 'Деловые Линии';
    this.errors = [];
    if (!this.pecFrom) {
      this.errors.push(pek + this.labelFromNot);
    }
    if (!this.pecTo) {
      this.errors.push(pek + this.labelToNot);
    }
    if (!this.sdekFrom) {
      this.errors.push(dl + this.labelFromNot);
    }
    if (!this.sdekTo) {
      this.errors.push(dl + this.labelToNot);
    }
    console.log(this.errors);
  }


  setItems(items: FormArray) {
    console.log(items);
    this.items = items;
  }

  setCustomItems(customItems: any) {
    console.log(customItems);
    this.customItems = customItems;
  }
}
