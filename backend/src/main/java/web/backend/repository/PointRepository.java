package web.backend.repository;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;
import web.backend.model.Point;

import java.util.List;

@ApplicationScoped
public class PointRepository {

    @PersistenceContext
    private EntityManager em;

    @Transactional
    public Point savePoint(Point point) {
        return em.merge(point);
    }

    @Transactional
    public Point updatePoint(Point point) {
        return em.merge(point);
    }

    @Transactional
    public void deletePoints() {
        em.createQuery("delete from Point").executeUpdate();
        em.clear();
    }

    @Transactional
    public List<Point> getAllPoints() {
        TypedQuery<Point> points = em.createQuery("SELECT p FROM Point p", Point.class);

        return points.getResultList();
    }
}
