package web.backend.controller;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import web.backend.model.Point;
import web.backend.service.PointService;

import java.awt.*;

@Path("/test")
public class TestController {
    @Inject
    private PointService pointService;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllPoints() {
        var points = pointService.getAllPoints();

        return Response.ok(points).build();
    }

    @POST
    public Response addPoint() {
        pointService.addPoint(new Point(0, 0, 0, true, "test", 10));
        return Response.ok().build();
    }

    @DELETE
    public Response deletePoint() {
        pointService.deleteAllPoints();

        return Response.ok().build();
    }
}
