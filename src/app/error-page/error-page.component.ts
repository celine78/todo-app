import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.css']
})
export class ErrorPageComponent implements OnInit {

  constructor(private toastr: ToastrService, private router: Router) { }

  ngOnInit(): void {
  }

  goHome() {
    this.router.navigate(['/todos'])
  }

}
