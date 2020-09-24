import { Component } from '@angular/core';
import { Data } from './data';

@Component({
  selector: 'app-destinatin-present-simple',
  templateUrl: './present-simple.component.html',
  styleUrls: ['./present-simple.component.scss']
})
export class PresentSimpleComponent {

  public data = Data;

}
