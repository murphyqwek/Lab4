import { Component, ViewChild, ElementRef, OnInit, Signal, signal, OnDestroy, WritableSignal } from '@angular/core';
import { Chart } from '../../utils/chart';
import { FormsModule } from '@angular/forms';
import { checkX, checkY, checkR} from '../../utils/chartValidation';
import { PointService } from '../../services/point.service';
import { PointData } from '../../interfaces/point.data';
import { ValidationData } from '../../interfaces/validate.data';

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

  rawXValue : string = "-3";
  rawYValue : string = "";

  data: WritableSignal<PointData[]> = signal([])

  isYError = signal(false);
  isXError = signal(false);
  isRError = signal(false);

  yErrorText = signal("");
  xErrorText = signal("");
  rErrorText = signal("");

  constructor(private pointService: PointService) {}

  ngOnInit() {
    this.chart = this.canvas.nativeElement;
    this.context = this.chart.getContext('2d') as CanvasRenderingContext2D;

    this.setupResizeObserver();

    let canvasRect = this.chart.getBoundingClientRect();

    console.log(canvasRect);

    this.chartDrawUtil = new Chart(this.context);
    this.chartDrawUtil.setWidthHeight(canvasRect.width, canvasRect.height);
    this.chartDrawUtil.redrawChart(this.rValue);
    
    this.pointService.getAllPoints().subscribe({
      next: (points: PointData[]) => {
        console.log(points);
        this.data.set(points);
      }
    });
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
    let rValidated = checkR(this.rawRValue);

    this.validateField(rValidated, this.isRError, this.rErrorText);

    if(!rValidated.isValid) {
      return;
    }

    this.rValue = rValidated.parsedValue;
    this.chartDrawUtil.redrawChart(this.rValue);
  }

  private validateField(fieldValidationData: ValidationData, fieldErrorSignal: WritableSignal<boolean>, fieldErrorText: WritableSignal<string>) {
    fieldErrorSignal.set(!fieldValidationData.isValid);
    
    if(!fieldValidationData.isValid) {
      fieldErrorText.set(fieldValidationData.message);
    }

  }

  onSubmit() {
    let xValidated = checkX(this.rawXValue);
    let yValidated = checkY(this.rawYValue);
    let rValidated = checkR(this.rawRValue);

    this.validateField(xValidated, this.isXError, this.xErrorText);
    this.validateField(yValidated, this.isYError, this.yErrorText);
    this.validateField(rValidated, this.isRError, this.rErrorText);

    if(xValidated.isValid && yValidated.isValid && rValidated.isValid) {
      this.sendPoint(xValidated.parsedValue, yValidated.parsedValue, rValidated.parsedValue);
    }
  }

  sendPoint(x: number, y: number, r: number) {
    this.pointService.sendPoint({
      x: x,
      y: y,
      r: r
    }).subscribe({
      next: (point: PointData) => {
        console.log(point);
        this.data.update(points => points.concat(point))
      }
    });
  }
}
