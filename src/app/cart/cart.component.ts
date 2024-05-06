import {Component, OnInit} from '@angular/core';
import {ExportingBillTransactionModel} from "../../bm-api/dtos/exporting-bill-transaction.model";
import {SharedService} from "../../bm-api/Services/Data/ShareService";
import {Router} from "@angular/router";
import {ExportingBillModel} from "../../bm-api/dtos/exporting-bill.model";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItem: ExportingBillTransactionModel[] = [];
  isCheckHasItem: boolean = false;

  constructor(private sharedService: SharedService, private router: Router) {
  }

  ngOnInit(): void {
    //Load card item đã được lưu trữ localstore
    const getCardItemSaving = localStorage.getItem('card');
    if (getCardItemSaving) {
      this.cartItem = [];
      this.cartItem = JSON.parse(getCardItemSaving);
    }
  }

  totalCart(): number {
    let sumPriceCardDisplay: number = 0;
    //Display status card
    this.cartItem.forEach(element => {
      if (element.amount != null) {
        sumPriceCardDisplay += element.amount;
      }
    });

    //check status
    if (sumPriceCardDisplay != 0) {
      this.isCheckHasItem = false;
    } else {
      this.isCheckHasItem = true;
    }
    return sumPriceCardDisplay;

  }

  public createExportingbill(): ExportingBillModel {

    //Tinh tong cong so tien chon san pham
    let exFull: ExportingBillTransactionModel = new ExportingBillTransactionModel();
    exFull.bill = new ExportingBillModel();
    exFull.bill.agency = null;
    exFull.bill.customer = null;

    let sum = 0;
    this.cartItem.forEach(value => {
      if (value.amount != null) {
        sum += value.amount;
      }
    });
    //tinh tong tien cac item trong gio hang
    exFull.bill.total = sum;

    this.cartItem.forEach(value => {
      value.bill = exFull.bill;
    });

    return exFull.bill;
  }

  public setDataExportingbillTransaction() {
    this.sharedService.setDataExportingbillTransaction(this.cartItem);
    this.sharedService.setDataExportingbill(this.createExportingbill());

    this.router.navigate(['./customer-info']);
  }

  public decQty(item: ExportingBillTransactionModel) {
    if (item.quantity > 0) {
      item.quantity--;
    }
    if (item.quantity != null && item.product?.price != null) {
      item.amount = item.quantity * item.product.price;
    }

    for (let i = 0; i < this.cartItem.length; i++) {
      if (this.cartItem[i].quantity == 0) {
        this.cartItem.splice(i, 1);
      }
    }

    //Set amount of card
    this.totalCart();
    //update localStore save card
    localStorage.setItem('card', JSON.stringify(this.cartItem));
    location.reload();
  }

}
