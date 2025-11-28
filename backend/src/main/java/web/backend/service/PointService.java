package web.backend.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.SecurityContext;
import web.backend.dto.PointDTO;
import web.backend.dto.PointRequestDTO;
import web.backend.model.Point;
import web.backend.model.UserCredentials;
import web.backend.repository.PointRepository;
import web.backend.util.PointHitChecker;
import web.backend.util.PointValidation;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@ApplicationScoped
public class PointService {
    @Inject
    private PointRepository pointRepository;

    @Inject
    private PointValidation pointValidation;

    @Inject
    private PointHitChecker pointHitChecker;

    @Inject
    private UserService userService;

    public boolean isPointValid(PointRequestDTO point) {
        return pointValidation.checkPoint(point);
    }

    public Point addPoint(PointRequestDTO point, UserCredentials owner, long startTime) {
        Point newPoint = new Point();

        long executionTime = System.currentTimeMillis() - startTime;
        String creationTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss"));
        boolean isHit = pointHitChecker.checkHit(point);

        newPoint.setX(point.getX());
        newPoint.setY(point.getY());
        newPoint.setR(point.getR());
        newPoint.setExecutionTime(executionTime);
        newPoint.setStartTime(creationTime);
        newPoint.setHit(isHit);
        newPoint.setOwner(owner);

        return pointRepository.savePoint(newPoint);
    }

    public List<Point> getAllPoints(String owner){
        return pointRepository.getAllPointsByOwnerUserName(owner);
    }

    public void deleteUserPoints(String username) {
        pointRepository.deleteUserPoints(username);
    }

    public void deleteAllPoints() {
        pointRepository.deleteAllPoints();
    }
}
