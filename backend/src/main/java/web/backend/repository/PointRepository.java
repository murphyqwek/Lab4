package web.backend.repository;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;
import web.backend.model.Point;
import web.backend.model.UserCredentials;

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
    public void deleteAllPoints() {
        em.createQuery("delete from Point").executeUpdate();
        em.clear();
    }

    @Transactional
    public void deleteUserPoints(String owner) {
        Query query = em.createQuery("delete from Point p WHERE p.owner.username = : owner", Point.class);
        query.setParameter("owner", owner);
        query.executeUpdate();
        em.clear();
    }

    @Transactional
    public List<Point> getAllPointsByOwnerUserName(String owner) {
        TypedQuery<Point> query = em.createQuery("SELECT p FROM Point p WHERE p.owner.username = :owner ", Point.class);
        query.setParameter("owner", owner);
        return query.getResultList();
    }
}
