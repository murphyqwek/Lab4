package web.backend.repository;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import web.backend.dto.UserCredentialsDTO;
import web.backend.model.UserCredentials;

@ApplicationScoped
public class UserCredentialsRepository {
    @PersistenceContext
    private EntityManager em;

    @Transactional
    public UserCredentials addUserCredentials(UserCredentials userCredentials) {
        return em.merge(userCredentials);
    }

    @Transactional
    public UserCredentials getUserByUsername(String username) {
        return em.find(UserCredentials.class, username);
    }
}
