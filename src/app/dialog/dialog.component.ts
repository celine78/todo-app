import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from "@angular/material/dialog";
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  appComponent!: AppComponent

  title: string = ""
  body: string = ""
  btnTextLeft: string = ""
  btnTextRight: string = ""

  constructor
  (
    // https://stackblitz.com/edit/mat-dialog-example?file=app%2Falert-dialog%2Falert-dialog.component.ts
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<DialogComponent>
  ) {
      if(data){
      this.title = data.title,
      this.body = data.body,
      this.btnTextLeft = data.btnTextLeft,
      this.btnTextRight = data.btnTextRight
      }
    }

  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close(false);
  }

  delete() {
    this.dialogRef.close(true);
  }
}
