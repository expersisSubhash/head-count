import {Component} from '@angular/core';

@Component({
  template: `
    <div class="container">
      <div class="row">
        <div class="error-template">
          <h1>Oops!</h1>
          <h2>404 Not Found</h2>
          <div class="error-details">
            Sorry, an error has occurred, Requested page not found!<br>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ['.error-template {padding: 40px 15px;text-align: center;}.error-actions {margin-top:15px;margin-bottom:15px;}']
})
export class PageNotFoundComponent {
}
