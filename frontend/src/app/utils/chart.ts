import { PointData } from "../interfaces/point.data";
import { checkR, checkX, checkY } from "./chartValidation";

export class Chart {
    private context: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;

    private lineWidth = 2;
    private scaleOffset = 15;

    private width: number = 300;
    private height: number = 300;

    private centerX = this.width / 2;
    private centerY = this.height / 2;

    private graphOffset = 20; //Отсуп системы координата от полонта

    private graphWidth = this.width / 2 - this.graphOffset; //Длина оси X
    private graphHeight = this.height / 2 - this.graphOffset; //Длина оси Y

    private measureWidth = (this.graphWidth - this.scaleOffset) / 5; //Длина единицы графика для оси X
    private measureHeight = (this.graphHeight - this.scaleOffset) / 5; //Длина единицы графика для оси Y


    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    }

    setWidthHeight(width: number, height: number) {
        this.width = width;
        this.height = height;

        this.centerX = this.width / 2;
        this.centerY = this.height / 2;
        this.graphOffset = 20;
        this.graphWidth = this.width / 2 - this.graphOffset;
        this.graphHeight = this.height / 2 - this.graphOffset;
        this.measureWidth = (this.graphWidth - this.scaleOffset) / 5;
        this.measureHeight = (this.graphHeight - this.scaleOffset) / 5;

        this.context.strokeStyle = '#ccc';
        this.context.lineWidth = this.lineWidth;
        this.context.fillStyle = '#000';
        this.context.font = '12px Arial';
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
    }

    redrawChart(r : number) {
        this.clearChart();

        this.drawFiguers(r);

        this.drawAxes();
        this.drawNumberLine();
    }

    private clearChart() {
        this.context.clearRect(0, 0, this.width, this.height);
    }

    private drawFiguers(r : number) {
        this.context.fillStyle = 'rgba(0, 100, 255, 0.5)';
        this.drawRectangle(r);
        this.drawQuartercircle(r);
        this.drawTriangle(r);
        this.context.fillStyle = '#000'
    }

    private drawRectangle(r : number) {
        console.log(r);
        this.context.beginPath();
        this.context.rect(this.centerX - r * this.measureWidth, this.centerY - (r / 2) * this.measureHeight, r * this.measureWidth, (r / 2) * this.measureHeight)
        this.context.fill();
    }

    private drawQuartercircle(r : number) {
        this.context.beginPath();
        this.context.arc(this.centerX, this.centerY, r * this.measureHeight, -Math.PI / 2, 0, false);
        this.context.lineTo(this.centerX, this.centerY);
        this.context.fill();
    }

    private drawTriangle(r : number) {
        this.context.beginPath();
        this.context.moveTo(this.centerX, this.centerY);
        this.context.lineTo(this.centerX, this.centerY + r * this.measureHeight);
        this.context.lineTo(this.centerX + r * this.measureWidth , this.centerY);
        this.context.fill();
    }

    private drawAxes() {
        this.context.strokeStyle = '#000';
        this.context.lineWidth = this.lineWidth;

        this.context.beginPath();
        this.context.moveTo(this.graphOffset, this.centerY);
        this.context.lineTo(this.width - this.graphOffset, this.centerY);
        this.context.stroke();

        this.context.beginPath();
        this.context.moveTo(this.centerX, this.height - this.graphOffset);
        this.context.lineTo(this.centerX, this.graphOffset);
        this.context.stroke();

        this.context.beginPath();
        this.context.moveTo(this.width - 10 - this.graphOffset, this.centerY - 5);
        this.context.lineTo(this.width - this.graphOffset, this.centerY);
        this.context.lineTo(this.width - 10 - this.graphOffset, this.centerY + 5);
        this.context.stroke();

        this.context.beginPath();
        this.context.moveTo(this.centerX - 5, 10 + this.graphOffset);
        this.context.lineTo(this.centerX, this.graphOffset);
        this.context.lineTo(this.centerX + 5, 10 + this.graphOffset);
        this.context.stroke();

        this.context.fillText('X', this.width - this.graphOffset - 5, this.centerY - 15);
        this.context.fillText('Y', this.centerX - 15, 5 + this.graphOffset);
    }

    private drawNumberLine() {
        for(let num = 1; num <= 5; num++) {
            this.drawNumberScale(this.centerX + num * this.measureWidth, this.centerY, false);
            this.drawNumberScale(this.centerX - num * this.measureWidth, this.centerY, false);

            this.drawNumberScale(this.centerX, this.centerY - num * this.measureHeight, true);
            this.drawNumberScale(this.centerX, this.centerY + num * this.measureHeight, true);
            

            this.context.fillText(num.toString(), this.centerX + num * this.measureWidth, this.centerY + 5 * 3);
            this.context.fillText('-' + num.toString(), this.centerX - num * this.measureWidth, this.centerY + 5 * 3);

            this.context.fillText(num.toString(), this.centerX + 5 * 3, this.centerY - num * this.measureHeight);
            this.context.fillText('-' + num.toString(), this.centerX + 5 * 3, this.centerY + num * this.measureHeight);
        }
    }

    
    private drawNumberScale(x: number, y: number, isArrowDirectionUp: boolean) {
        this.context.beginPath();
        if (isArrowDirectionUp) {
            this.context.moveTo(x + 5, y);
            this.context.lineTo(x - 5, y);
        }
        else {
            this.context.moveTo(x, y + 5);
            this.context.lineTo(x, y - 5);
        }
        this.context.stroke();
    }

    drawDots(points: PointData[]) {
        console.log("Update points");
        console.log(points);
        points.forEach(point => {
            let x = point.x;
            let y = point.y;

            let graphX = x * this.measureWidth + this.centerX;
            let graphY = -y * this.measureHeight + this.centerY;

            console.log(graphX, graphY);

            this.context.beginPath();
            this.context.arc(graphX, graphY, 4, 0, Math.PI * 2);
            this.context.fillStyle = point.isHit ? 'green' : 'red';
            this.context.fill();
            this.context.stroke();
        });
    }

    onGraphClick(event: MouseEvent, r: number, sendPoint: (x: number, y: number, r: number) => void, setError: (message: string) => void) {
        const canvasRect = this.canvas.getBoundingClientRect();
        const xClick = event.clientX - canvasRect.left;
        const yClick = event.clientY - canvasRect.top;


        let xPlot = (xClick - this.centerX ) / this.measureWidth;
        let yPlot = -(yClick - this.centerY) / this.measureHeight;

        console.log(xPlot, yPlot);

        let x = xPlot.toFixed(3);
        let y = yPlot.toFixed(3);

        let rValidated = checkR(r.toString());
        let xValidated = checkX(x);
        let yValidated = checkY(y);

        if(rValidated.isValid && xValidated.isValid && yValidated.isValid) {
            sendPoint(xValidated.parsedValue, 
                        yValidated.parsedValue,
                        rValidated.parsedValue
            );
            return;
        }

        if(!rValidated.isValid) {
            setError(rValidated.message);
            return;
        }

        if(!xValidated.isValid) {
            setError(xValidated.message);
            return;
        }

        if(!yValidated.isValid) {
            setError(yValidated.message);
            return;
        }
    }
}