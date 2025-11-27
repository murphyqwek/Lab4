package web.backend.dto;

public class PointDTO extends PointRequestDTO {
    private boolean isHit;
    private String startTime;
    private long executionTime;

    public PointDTO(double x, double y, double r, boolean isHit, String startTime, long executionTime) {
        super(x, y, r);
        this.isHit = isHit;
        this.startTime = startTime;
        this.executionTime = executionTime;
    }

    public boolean getIsHit() {
        return isHit;
    }

    public void setIsHit(boolean isHit) {
        this.isHit = isHit;
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
}
