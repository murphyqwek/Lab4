import { Component, ViewChild, ElementRef, OnInit, Signal, signal, OnDestroy, WritableSignal, effect } from '@angular/core';
import { Chart } from '../../utils/chart';
import { FormsModule } from '@angular/forms';
import { checkX, checkY, checkR} from '../../utils/chartValidation';
import { PointService } from '../../services/point.service';
import { PointData } from '../../interfaces/point.data';
import { ValidationData } from '../../interfaces/validate.data';
import { Header } from "../header/header";
import { Mainheader } from "../mainheader/mainheader";
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-main',
  imports: [FormsModule, Mainheader],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main implements OnInit, OnDestroy {
  @ViewChild('chart', {static: true}) canvas!: ElementRef<HTMLCanvasElement>; 
  private chart!: HTMLCanvasElement;
  private chartDrawUtil!: Chart;
  private resizeObserver!: ResizeObserver;

  rawRValue : string = "4";
  rValue = 4;

  rawXValue : string = "-3";
  rawYValue : string = "";

  points: WritableSignal<PointData[]> = signal([])

  isYError = signal(false);
  isXError = signal(false);
  isRError = signal(false);

  graphError = signal("");

  yErrorText = signal("");
  xErrorText = signal("");
  rErrorText = signal("");
  username = signal("")

  pointsUpdated = effect(() =>{
    this.chartDrawUtil.drawDots(this.points());
  });

  constructor(private pointService: PointService, private authService: AuthService) {}

  ngOnInit() {
    this.chart = this.canvas.nativeElement;
    this.username.set(this.authService.getUsername());

    this.setupResizeObserver();

    let canvasRect = this.chart.getBoundingClientRect();

    console.log(canvasRect);

    this.chartDrawUtil = new Chart(this.chart);
    this.chartDrawUtil.setWidthHeight(canvasRect.width, canvasRect.height);
    this.chartDrawUtil.redrawChart(this.rValue);
    
    this.pointService.getAllPoints().subscribe({
      next: (points: PointData[]) => {
        console.log(points);
        this.points.set(points);
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
        this.chartDrawUtil.drawDots(this.points());
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
    this.chartDrawUtil.drawDots(this.points());
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
        this.points.update(points => points.concat(point))
      }
    });
  }

  onGraphClick(event: MouseEvent): void {
    this.graphError.set("");
    this.chartDrawUtil.onGraphClick(event, this.rValue, 
      (x: number, y: number, r: number) => this.sendPoint(x, y, r), (message: string) => this.graphError.set(message));
  }

}
