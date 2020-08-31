import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Question } from '../questionModels';



@Component({
    selector: 'app-dialog-overview-example-dialog',
    templateUrl: './add-question-dialog.html'
  })
  export class DialogAddQuestionComponent {
    constructor(
      public dialogRef: MatDialogRef<DialogAddQuestionComponent>,
      @Inject(MAT_DIALOG_DATA) public data: Question
    ) {
     }
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  }