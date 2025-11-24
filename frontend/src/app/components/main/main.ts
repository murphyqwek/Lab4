import { Component, ViewChild, ElementRef, OnInit, Signal, signal } from '@angular/core';
import { Chart } from '../../utils/chart';
import { FormsModule } from '@angular/forms';
import { checkX, checkY, checkR} from '../../utils/chartValidation';

@Component({
  selector: 'app-main',
  imports: [FormsModule],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main implements OnInit {
  @ViewChild('chart', {static: true}) canvas!: ElementRef<HTMLCanvasElement>; 
  private chart!: HTMLCanvasElement;
  private context!: CanvasRenderingContext2D;
  private chartDrawUtil!: Chart;

  rawRValue : string = "4";

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

    this.chartDrawUtil = new Chart(this.context);
    this.chartDrawUtil.setWidthHeight(300, 300);
    this.chartDrawUtil.redrawChart(4);
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

    this.chartDrawUtil.redrawChart(rValidated.parsedValue);
  }
}
