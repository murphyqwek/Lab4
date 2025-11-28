package web.backend.controller;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;
import web.backend.dto.PointDTO;
import web.backend.dto.PointRequestDTO;
import web.backend.model.Point;
import web.backend.model.UserCredentials;
import web.backend.service.PointService;
import web.backend.service.UserService;
import web.backend.util.Secured;

import java.util.ArrayList;
import java.util.List;

@Path("points")
public class PointController {
    @Inject
    private PointService pointService;

    @Inject
    private UserService userService;

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Secured
    public Response addPoint(@Context SecurityContext context, PointRequestDTO pointRequest) {
        long startTime = System.currentTimeMillis();
        String username = context.getUserPrincipal().getName();

        UserCredentials user = userService.getUserByUsername(username);

        if (user == null) {
            return Response.status(Response.Status.UNAUTHORIZED).build();
        }

        Point point = pointService.addPoint(pointRequest, user, startTime);

        var pointDTO = new PointDTO(point);

        return Response.status(Response.Status.CREATED).entity(pointDTO).build();
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Secured
    public Response getAllUserPoints(@Context SecurityContext context) {
        String username = context.getUserPrincipal().getName();

        List<Point> points = pointService.getAllPoints(username);

        List<PointDTO> pointDTOList = points.stream().map(PointDTO::new).toList();

        return Response.status(Response.Status.OK).entity(pointDTOList).build();
    }

    @DELETE
    @Secured
    public Response deleteUserPoints(@Context SecurityContext context) {
        String username = context.getUserPrincipal().getName();
        pointService.deleteUserPoints(username);

        return Response.ok().build();
    }
}
