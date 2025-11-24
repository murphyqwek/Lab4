import { Component, ViewChild, ElementRef, OnInit, Signal, signal } from '@angular/core';
import { Chart } from '../../utils/chart';

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
  private chartDrawUtil!: Chart;

  data = signal([])
  
  ngOnInit() {
    this.chart = this.canvas.nativeElement;
    this.context = this.chart.getContext('2d') as CanvasRenderingContext2D;

    this.chartDrawUtil = new Chart(this.context);
    this.chartDrawUtil.setWidthHeight(300, 300);
    this.chartDrawUtil.redrawChart(4);
  }

}
