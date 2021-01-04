import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(private router: Router, private logger: NGXLogger) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.logger.info('Rerouting from logout to login')
      this.router.navigate(['/login']);
    }, 4000);
  }
}
