import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.css']
})
export class ErrorPageComponent implements OnInit {

  constructor(private router: Router, private logger: NGXLogger) { }

  ngOnInit(): void {
  }

  /**
   * Going back to the todos
   */
  goHome() {
    this.logger.debug('Rerouting from error-page to todos')
    this.router.navigate(['/todos'])
  }

}
