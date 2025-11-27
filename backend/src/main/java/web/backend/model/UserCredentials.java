package web.backend.model;

import jakarta.persistence.*;

@Entity
public class UserCredentials {
    @Id
    @Column(unique = true, nullable = false, length = 20)
    private String username;
    @Column(nullable = false, length = 20)
    private String password;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
