package web.backend.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import web.backend.model.Point;
import web.backend.repository.PointRepository;

import java.util.List;

@ApplicationScoped
public class PointService {
    @Inject
    private PointRepository pointRepository;

    public Point addPoint(Point point) {
        return pointRepository.savePoint(point);
    }

    public List<Point> getAllPoints(){
        return pointRepository.getAllPoints();
    }

    public void deleteAllPoints() {
        pointRepository.deletePoints();
    }
}
