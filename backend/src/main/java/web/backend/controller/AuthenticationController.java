package web.backend.controller;

import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import web.backend.dto.UserCredentialsDTO;
import web.backend.service.UserService;
import web.backend.util.TokenUtil;

@Path("/auth")
public class AuthenticationController {
    @Inject
    private UserService userService;

    @Inject
    private TokenUtil tokenUtil;

    @POST
    @Path("/register")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response register(UserCredentialsDTO userCredentials) {
        try {
            var Result = userService.register(userCredentials);

            if (Result.isSuccess()) {
                String token = tokenUtil.generateToken(userCredentials.getUsername());
                return Response
                        .status(Response.Status.CREATED)
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                        .build();
            }

            return Response.status(Response.Status.CONFLICT).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
        }
    }

    @POST
    @Path("/register")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response login(UserCredentialsDTO userCredentials) {
        try {
            var Result = userService.login(userCredentials);

            if (Result.isSuccess()) {
                String token = tokenUtil.generateToken(userCredentials.getUsername());
                return Response
                        .ok()
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                        .build();
            }

            return Response.status(Response.Status.BAD_REQUEST).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
        }
    }
}
