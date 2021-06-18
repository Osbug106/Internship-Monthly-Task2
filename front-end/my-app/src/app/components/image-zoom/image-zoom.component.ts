import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-image-zoom',
  templateUrl: './image-zoom.component.html',
  styleUrls: ['./image-zoom.component.scss']
})
export class ImageZoomComponent implements OnInit {

  @Input('src') src: string;
  @Input('xPos') xPos: number;
  @Input('yPos') yPos: number;

  constructor() {
    this.xPos = 50;
    this.yPos = 50;
  }

  ngOnInit(): void {
  }

}
