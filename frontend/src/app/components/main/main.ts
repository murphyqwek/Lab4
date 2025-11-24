import { Component, ViewChild, ElementRef, OnInit, Signal, signal, OnDestroy } from '@angular/core';
import { Chart } from '../../utils/chart';
import { FormsModule } from '@angular/forms';
import { checkX, checkY, checkR} from '../../utils/chartValidation';

@Component({
  selector: 'app-main',
  imports: [FormsModule],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main implements OnInit, OnDestroy {
  @ViewChild('chart', {static: true}) canvas!: ElementRef<HTMLCanvasElement>; 
  private chart!: HTMLCanvasElement;
  private context!: CanvasRenderingContext2D;
  private chartDrawUtil!: Chart;
  private resizeObserver!: ResizeObserver;

  rawRValue : string = "4";
  rValue = 4;

  data = signal([])

  isYError = signal(false);
  isXError = signal(false);
  isRError = signal(false);

  yErrorText = signal("");
  xErrorText = signal("");
  rErrorText = signal("");
  
  ngOnInit() {
    this.chart = this.canvas.nativeElement;
    this.context = this.chart.getContext('2d') as CanvasRenderingContext2D;

    this.setupResizeObserver();

    let canvasRect = this.chart.getBoundingClientRect();

    console.log(canvasRect);

    this.chartDrawUtil = new Chart(this.context);
    this.chartDrawUtil.setWidthHeight(canvasRect.width, canvasRect.height);
    this.chartDrawUtil.redrawChart(this.rValue);
  }

  private setupResizeObserver() {
    this.resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        this.chart.width = entry.contentRect.width;
        this.chart.height = entry.contentRect.height;
        this.chartDrawUtil.setWidthHeight(this.chart.width, this.chart.height);
        this.chartDrawUtil.redrawChart(this.rValue);
        console.log('Canvas resized to:', this.chart.width, this.chart.height);
      }
    });

    this.resizeObserver.observe(this.chart);
  }


  ngOnDestroy(): void {
    this.resizeObserver.disconnect();
  }

  yFieldClick() {
    this.isYError.set(false);
  }

  xFieldClick() {
    this.isXError.set(false);
  }

  rSelected() {
    this.isRError.set(false);
    let rValidated = checkR(this.rawRValue);

    if(!rValidated.isValid) {
      this.rErrorText.set(rValidated.message);
      this.isRError.set(true);
      return;
    }

    this.rValue = rValidated.parsedValue;
    this.chartDrawUtil.redrawChart(this.rValue);
  }
}
