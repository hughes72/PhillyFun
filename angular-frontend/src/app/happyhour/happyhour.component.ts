import { HappyHourCreateModalComponent } from './happy-hour-create-modal/happy-hour-create-modal.component';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatSnackBar, MatDialogRef, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { HappyhourService } from './happyhour.service'
import { HappyHourModel } from '../models/HappyHourModel';
import {ConfirmDialogComponent} from '../shared/confirm-dialog/confirm-dialog.component';
@Component({
  selector: 'app-happyhour',
  templateUrl: './happyhour.component.html',
  styleUrls: ['./happyhour.component.scss']
})
export class HappyhourComponent implements OnInit {

  //our variable of our module to handle the dialog itself
  newHappyHourDialog: MatDialogRef<HappyHourCreateModalComponent>;
  //used for async pipe in html
  happyHours: Observable<HappyHourModel[]>;
  //store them in a format this class can use 
  happyHoursArr : HappyHourModel[];
  constructor( private snackbar: MatSnackBar,
    private dialog: MatDialog, router: Router, private happyhourServ: HappyhourService) {
    //closes dialog when navigating away from this page
    router.events.subscribe(() => {
      dialog.closeAll();
    });
  }

  ngOnInit() {
    this.refreshComponent();

  }

  refreshComponent () {
    //service returns the observable for the async pipe
    //async pipe makes the http request return twice? weird occurrence
    this.happyHours = this.happyhourServ.getHappyHours();
    //save the array to use when edit is clicked, TODO this makes 2 calls to api :/ since
    //we use async pipe - check article
    this.happyHours.subscribe((dataArray : HappyHourModel[]) => { 
      this.happyHoursArr = dataArray;
    });
  }

  toggleFormDialog() {
    //The dialog uses this model to populate form fields in edit mode so default it for new
    let defaultData: HappyHourModel = new HappyHourModel();
    this.newHappyHourDialog = this.dialog.open(HappyHourCreateModalComponent, {
      hasBackdrop: false,
      closeOnNavigation: true,
      disableClose: false,
      width: '900px',
      data: defaultData
    });
    this.registerModalClose();
  }
  editHappyHour(id: string) {

    //already pulled all of the data so just filter on the id we want to edit
      let happyHour : HappyHourModel = this.happyHoursArr.find((item) => item._id ===id);
      this.newHappyHourDialog = this.dialog.open(HappyHourCreateModalComponent, {
        hasBackdrop: false,
        closeOnNavigation: true,
        disableClose: false,
        data: happyHour,
        width: '900px'
      });
      this.registerModalClose();
    
  }

  deleteHappyHour(name : string,id: string) {

    //already pulled all of the data so just filter on the id we want to edit
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {
        title: name
      }
    });
    dialogRef.afterClosed().subscribe(answer => {
      console.log("the answer " + answer)
       if(answer) {
         this.happyhourServ.deleteHappyHour(id).subscribe(result=> {
          this.snackbar.open(name + " has been deleted!", 'Close',
          { duration: 6000, verticalPosition: 'top' });
         });
         this.refreshComponent();
       }

    });
    
  }

  /**
   * In new or edit mode, refresh the list
   */
  registerModalClose = () => {
    this.newHappyHourDialog.afterClosed().subscribe(result => {
      this.refreshComponent();
    });
  }

}