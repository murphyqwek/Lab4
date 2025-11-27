package web.backend.filter;

import jakarta.inject.Inject;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.Provider;
import web.backend.util.Secured;
import web.backend.util.TokenUtil;

import java.io.IOException;

@Provider
@Secured
public class AuthenticationFilter implements ContainerRequestFilter {
    @Inject
    private TokenUtil tokenUtil;

    private static final String AUTHENTICATION_SCHEME = "Bearer";

    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {
        String authorizationHeader = requestContext.getHeaderString(HttpHeaders.AUTHORIZATION);

        if (authorizationHeader == null || !authorizationHeader.startsWith(AUTHENTICATION_SCHEME + " ")) {
            abortWithUnauthorized(requestContext, "Нет схемы авторизации");
            return;
        }

        String token = authorizationHeader.substring(AUTHENTICATION_SCHEME.length()).trim();

        try {
            if (!tokenUtil.validateToken(token)) {
                abortWithUnauthorized(requestContext, "Невалидный токен, или он истёк");
                return;
            }

            String username = tokenUtil.getUsernameFromToken(token);
            requestContext.setProperty("username", username);
        } catch (Exception e) {
            abortWithUnauthorized(requestContext, "Токен истёк");
        }
    }

    private void abortWithUnauthorized(ContainerRequestContext requestContext, String message) {
        requestContext.abortWith(
                Response.status(Response.Status.UNAUTHORIZED)
                        .entity(message)
                        .build());
    }
}
