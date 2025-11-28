import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { PointPayload } from "../interfaces/point.payload";
import { Observable } from "rxjs";
import { PointData } from "../interfaces/point.data";


@Injectable({
    providedIn: 'root'
})
export class PointService {
    private readonly API_BASE_URL = "/api/points"

    constructor(private httpClient: HttpClient ) {}

    sendPoint(pointPayload: PointPayload) : Observable<PointData> {
        return this.httpClient.post<PointData>(this.API_BASE_URL, {
            x: pointPayload.x,
            y: pointPayload.y,
            r: pointPayload.r,
        });
    }

    getAllPoints() : Observable<PointData[]> {
        return this.httpClient.get<PointData[]>(this.API_BASE_URL);
    }
}