import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Tour } from '../../tour-authoring/model/tour.model';
import { Keypoint } from '../../tour-authoring/model/keypoint.model';
import { OrderItem } from '../model/order-item.model';
import { MarketplaceService } from '../marketplace.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { ShoppingCartOverviewComponent } from '../shopping-cart-overview/shopping-cart-overview.component';
import { ShoppingCart } from '../model/shopping-cart.model';

@Component({
  selector: 'xp-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {

  @Input() order: OrderItem;
  shoppingCart: ShoppingCartOverviewComponent;
  shoppingCartForUser: ShoppingCart;

  constructor(private marketplaceService: MarketplaceService, private authService: AuthService, private changeDetectorRef: ChangeDetectorRef){
  }

  ngOnInit(): void {
    this.getShoppingCart();
  }
  Delete(orderItem: OrderItem): void {
    this.marketplaceService.deleteOrderItem(Number(orderItem.id)).subscribe({
      next: (_) => {
        window.alert('Item deleted successfully');
      },
      error: (err: any) => {
        console.log(err);
        alert('An error occurred while deleting the order item. Please try again later.');
      }
    })
  } 

  getShoppingCart(): void{
    this.marketplaceService.getShoppingCartForUser().subscribe({
      next: (result:ShoppingCart) => {
        this.shoppingCartForUser = result;
         
      },
      error:(err: any) => {
        console.log(err); 
      }
    })
  }
}