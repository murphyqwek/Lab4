package web.backend.util;

import jakarta.enterprise.context.ApplicationScoped;
import web.backend.dto.PointRequestDTO;

@ApplicationScoped
public class PointHitChecker {
    public boolean checkHit(PointRequestDTO point) {
        return  checkHitRectangle(point) ||
                checkHitTriangle(point) ||
                checkHitQuarterCircle(point);
    }

    private boolean checkHitRectangle(PointRequestDTO point) {
        var x = point.getX();
        var y = point.getY();
        var r = point.getR();

        return (y >= 0 && y <=  r / 2) &&  (x >= -r && x <=  0);
    }

    private boolean checkHitTriangle(PointRequestDTO point) {
        var x = point.getX();
        var y = point.getY();
        var r = point.getR();

        if(x >= 0 && y <= 0) {
            return y >= x - r;
        }

        return false;
    }

    private boolean checkHitQuarterCircle(PointRequestDTO point) {
        var x = point.getX();
        var y = point.getY();
        var r = point.getR();

        return x*x + y*y <= r*r && x >= 0 && y >= 0;
    }

}
