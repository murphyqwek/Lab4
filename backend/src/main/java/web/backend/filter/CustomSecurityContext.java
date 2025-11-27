package web.backend.filter;

import jakarta.ws.rs.core.SecurityContext;

import java.security.Principal;

public class CustomSecurityContext implements SecurityContext {
    private final String username;
    private final boolean isSecure;

    public CustomSecurityContext(String username, boolean isSecure) {
        this.username = username;
        this.isSecure = isSecure;
    }

    @Override
    public Principal getUserPrincipal() {
        return new Principal() {
            @Override
            public String getName() {
                return username;
            }
        };
    }

    @Override
    public boolean isUserInRole(String s) {
        return false;
    }

    @Override
    public boolean isSecure() {
        return isSecure;
    }

    @Override
    public String getAuthenticationScheme() {
        return "Bearer";
    }
}
