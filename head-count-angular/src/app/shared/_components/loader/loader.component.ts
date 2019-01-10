import { Component, OnInit } from '@angular/core';
import {LoaderService} from './loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {

  constructor(private loaderService: LoaderService) { }

  loading: boolean;

  ngOnInit() {
    this.loaderService.loading.subscribe(data => this.loading = data);
  }

}
