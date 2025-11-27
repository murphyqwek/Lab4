package web.backend.model;

import jakarta.persistence.*;
import org.h2.engine.User;

@Entity
public class Point {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private int x;
    private float y;
    private int r;
    private boolean hit;
    private String startTime;
    private long executionTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private UserCredentials owner;

    public Point() {}

    public Point(int x, float y, int r, boolean hit, String startTime, long executionTime,  UserCredentials owner) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.hit = hit;
        this.startTime = startTime;
        this.executionTime = executionTime;
        this.owner = owner;
    }

    public long getId() {
        return id;
    }
    public void setId(long id) {
        this.id = id;
    }

    public int getX() {
        return x;
    }
    public void setX(int x) {
        this.x = x;
    }

    public float getY() {
        return y;
    }
    public void setY(float y) {
        this.y = y;
    }

    public int getR() {
        return r;
    }
    public void setR(int r) {
        this.r = r;
    }

    public boolean isHit() {
        return hit;
    }
    public void setHit(boolean hit) {
        this.hit = hit;
    }

    public String getStartTime() {
        return startTime;
    }
    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public long getExecutionTime() {
        return executionTime;
    }
    public void setExecutionTime(long executionTime) {
        this.executionTime = executionTime;
    }

    public UserCredentials getOwner() {
        return owner;
    }

    public void setOwner(UserCredentials owner) {
        this.owner = owner;
    }
}
