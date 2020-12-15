import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router'
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(private router: Router, private toastr: ToastrService, private zone: NgZone) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 0.1);
  }
}
