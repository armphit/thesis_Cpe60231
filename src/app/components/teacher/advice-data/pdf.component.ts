import { Component, OnInit } from '@angular/core';
import * as jspdf from 'jspdf';

@Component({
  selector: 'app-advice-data',
  templateUrl: './advice-data.component.html',
  styleUrls: ['./advice-data.component.scss'],
})
export class pdfComponent implements OnInit {
  ngOnInit(): void {}

  public test() {
    console.log('aa');
  }
}
