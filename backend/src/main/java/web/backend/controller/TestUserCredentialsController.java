package web.backend.controller;

import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import web.backend.dto.UserCredentialsDTO;
import web.backend.model.UserCredentials;

@Path("auth")
public class TestUserCredentialsController {
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createUserCredentials(UserCredentialsDTO userCredentials) {
        System.out.println("createUserCredentials: " +  userCredentials);
        return Response.ok().build();
    }
}
