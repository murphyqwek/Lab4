package web.backend.util;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.Transient;
import web.backend.dto.PointRequestDTO;

@ApplicationScoped
public class PointValidation {

    private boolean checkValue(double value, double min, double max) {
        return !(value < min) && !(value > max);
    }

    public boolean checkPoint(PointRequestDTO point) {
        return  checkValue(point.getX(), -3, 5) &&
                checkValue(point.getY(), -5, 5) &&
                checkValue(point.getR(), 0, 5);
    }

}
