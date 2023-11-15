import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Tour } from '../../tour-authoring/model/tour.model';
import { Keypoint } from '../../tour-authoring/model/keypoint.model';
import { MarketplaceService } from '../marketplace.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { OrderItem } from '../model/order-item.model';
import { TourExecutionService } from '../../tour-execution/tour-execution.service';
import { TourProgress } from '../../tour-execution/model/tour-progress.model';
import { MatDialog } from '@angular/material/dialog';
import { CartSuccessComponent } from '../dialogs/cart-success/cart-success.component';
import { CartWarningComponent } from '../dialogs/cart-warning/cart-warning.component';

@Component({
  selector: 'xp-tour-card',
  templateUrl: './tour-card.component.html',
  styleUrls: ['./tour-card.component.css']
})
export class TourCardComponent implements OnInit, OnChanges {

  @Output() orderUpdated = new EventEmitter<null>();
  @Input() tour: Tour;
  public firstKp: Keypoint;
  private lastOrderId: number;

  constructor(private dialog: MatDialog, private marketplaceService: MarketplaceService, private tourExecutionService: TourExecutionService, private authService: AuthService) {
    this.lastOrderId = 0; 
  }

  ngOnChanges(): void {
  }

  ngOnInit(): void {
    this.tour.keypoints = this.tour.keypoints?.sort((kp1, kp2) => {
      return (kp1.position || 0) - (kp2.position || 0);
    });
    if (this.tour.keypoints) {
      this.firstKp = this.tour.keypoints[0];
    }
  }

  addToCart(): void {
    this.lastOrderId = Date.now();
    this.marketplaceService.getAllOrders().subscribe((orders) => {
      if (orders.results && orders.results.length > 0) {
        const lastOrder = orders.results[orders.results.length - 1];
        this.lastOrderId = lastOrder.id + 1;
      } else {
        
        this.lastOrderId = 1;
      }

      
      const orderItem: OrderItem = {
        id: this.lastOrderId,
        tourId: this.tour.id,
        userId: this.authService.user$.value.id,
        tourName: this.tour.name,
        tourDescription: this.tour.description,
        tourPrice: this.tour.price
      };

      
      this.marketplaceService.addOrderItem(orderItem).subscribe({
        next: (_) => {
          this.dialog.open(CartSuccessComponent, {panelClass: 'success-dialog-container'});
          this.orderUpdated.emit();
        },
        error:(error)=>{
          if(error.status===409){
            this.dialog.open(CartWarningComponent, {panelClass: 'warning-dialog-container'});
          }
        }
      });
    });
  }

  startTour(tourId?: number): void {
    this.tourExecutionService.startTour(tourId || 0).subscribe({
      next: (result: TourProgress) => {
        alert("Tour started, check it out in active tour section!");
      },
      error: (error) => {
        alert(error.error.detail); // show better
      }
    })
  }
}