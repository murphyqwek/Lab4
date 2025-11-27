package web.backend.util;

public class Result {
    private final String message;
    private final boolean success;

    public Result(boolean success, String message){
        this.success = success;
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public boolean isSuccess() {
        return success;
    }
}
