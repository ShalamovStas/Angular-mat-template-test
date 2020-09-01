import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Question, TestResultModel } from '../questionModels';



@Component({
    selector: 'app-dialog-overview-example-dialog',
    templateUrl: './edit-test-result-model-dialog.html'
  })
  export class DialogEditTestResultModelComponent {
    constructor(
      public dialogRef: MatDialogRef<DialogEditTestResultModelComponent>,
      @Inject(MAT_DIALOG_DATA) public data: TestResultModel
    ) {
     }
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  }