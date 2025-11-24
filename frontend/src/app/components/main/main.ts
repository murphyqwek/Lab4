import { Component, ViewChild, ElementRef, OnInit, Signal, signal } from '@angular/core';

@Component({
  selector: 'app-main',
  imports: [],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main implements OnInit {
  @ViewChild('chart', {static: true}) canvas!: ElementRef<HTMLCanvasElement>; 
  private chart!: HTMLCanvasElement;
  private context!: CanvasRenderingContext2D;

  data = signal([])
  
  ngOnInit() {
    this.chart = this.canvas.nativeElement;
    this.context = this.chart.getContext('2d') as CanvasRenderingContext2D;

  }

  drawChart() {
  }
}
