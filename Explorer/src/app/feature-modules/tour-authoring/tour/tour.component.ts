import { Component, OnInit } from '@angular/core';
import { Tour } from '../model/tour.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';


@Component({
  selector: 'xp-tour',
  templateUrl: './tour.component.html',
  styleUrls: ['./tour.component.css']
})
export class TourComponent implements OnInit{

  tours: Tour[] = [];
  public selectedTour: Tour;
  public mode : string = 'add';
  public renderTour: boolean = false;

  constructor(private tourAuthoringService: TourAuthoringService){}

  ngOnInit(): void {
    this.getTours(); 
  }

  deleteTour(id: number): void{
    if(window.confirm('Are you sure that you want to delete this tour?')){
      this.tourAuthoringService.deleteTour(id).subscribe({
        next: () => {
          this.getTours();
        },
        error: () => {
          
        }
      });
    }
  }

  onEditClicked(tour: Tour):void{
    this.selectedTour = tour;
    console.log(this.selectedTour);
    this.mode = 'edit';
    this.renderTour = true;
  }

  onAddClicked(): void{
    this.mode = 'add';
    this.renderTour = true;
  }

  getTours(): void{
    this.tourAuthoringService.getTours().subscribe({
      next: (response: PagedResults<Tour>) => {
        this.tours = response.results;
      },
      error: () => {
        
      }
    });
  }

}