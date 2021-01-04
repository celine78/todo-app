import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { NGXLogger } from 'ngx-logger';

import { AppComponent } from '../app.component';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})

// create dialog window
export class DialogComponent implements OnInit {

  appComponent!: AppComponent

  title: string = ""
  body: string = ""
  btnTextLeft: string = ""
  btnTextRight: string = ""

  constructor
    (
      // source: https://stackblitz.com/edit/mat-dialog-example?file=app%2Falert-dialog%2Falert-dialog.component.ts
      @Inject(MAT_DIALOG_DATA) private data: any,
      private dialogRef: MatDialogRef<DialogComponent>,
      private logger: NGXLogger
    ) {
    if (data) {
      this.title = data.title,
      this.body = data.body,
      this.btnTextLeft = data.btnTextLeft,
      this.btnTextRight = data.btnTextRight
    }
  }

  ngOnInit(): void {
  }

  /**
   * Closing the dialog while not accepting
   */
  close() {
    this.logger.debug('Closing dialog')
    this.dialogRef.close(false);
  }

  /**
   * Closing the dialog while accepting
   */
  accept() {
    this.logger.debug('Accepting dialog')
    this.dialogRef.close(true);
  }
}
